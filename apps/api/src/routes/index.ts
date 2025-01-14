import { Router } from "express";
import {
  shortLinkSchema,
  userLoginSchema,
  userSignupSchema,
} from "@repo/zod-schemas/types";
import client from "@repo/db/client";
import { compare, hash } from "../Scrypt";
import { TokenType } from "../types";
import { generateToken } from "../utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { verifyUser } from "../middlewares/verifyUserMiddeleware";
import { v4 as uuid } from "uuid";
import { redisClient } from "..";
export const router: Router = Router();

router.post("/login", async (req, res) => {
  const request = userLoginSchema.safeParse(req.body);
  if (!request.success) {
    res.status(400).send("Invalid request body");
    return;
  }
  try {
    //verify  if the user exists
    const user = await client.user.findUniqueOrThrow({
      where: {
        email: request.data.email,
      },
    });
    //check if the password is correct
    const isPasswordCorrect = await compare(
      request.data.password,
      user.password
    );
    if (!isPasswordCorrect) {
      res.status(401).send("Invalid credentials");
      return;
    }
    //verify if the jwt secret is present
    if (!process.env.JWT_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT secret" });
      return;
    }
    //generate jwt access token and refresh token
    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_SECRET
    );
    const refreshToken = generateToken(
      user.id,
      TokenType.REFRESH,
      process.env.JWT_SECRET
    );

    //set the refresh token in the cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    // send access token, user details to user through response
    res.status(200).send({
      accessToken,
      message: "User logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).send({ message: "User doesnot exist." });
      return;
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

router.post("/signup", async (req, res) => {
  const request = userSignupSchema.safeParse(req.body);
  if (!request.success) {
    res.status(400).send("Invalid request body");
    return;
  }

  try {
    //hash the password
    const hashedPassword = await hash(request.data.password);
    //create a new user
    await client.user.create({
      data: {
        email: request.data.email,
        name: request.data.name,
        password: hashedPassword,
      },
    });

    res.json({ message: "User created successfully" });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).send({ message: "User with email already exists." });
      return;
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

// get the access token using the refresh token
router.post("/get-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res
      .status(401)
      .json({ message: "Unauthorized: No refresh token provided" });
    return;
  }
  try {
    if (!process.env.JWT_SECRET) {
      res
        .status(500)
        .json({ message: "Internal Server Error: Missing JWT_SECRET" });
      return;
    }
    //decode the token
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    ) as JwtPayload;
    //verify that the token is of type refresh
    if (!decodedToken.type || decodedToken.type !== TokenType.REFRESH) {
      res.status(401).json({ message: "Unauthorized: Invalid token type" });
      return;
    }
    const userId = decodedToken.userId;
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
    });
    //if user is not present revoke the refresh token and send 401
    if (!user) {
      res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const accessToken = generateToken(
      user.id,
      TokenType.ACCESS,
      process.env.JWT_SECRET
    );
    res.json({
      message: "token generated successfully",
      token: accessToken,
    });
  } catch (error: any) {
    console.log("get-token error: ", error);
    if (error.code === "P2024") {
      res
        .status(500)
        .json({ message: "Internal Server Error: User not found" });
      return;
    }
    res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Unauthorized: Refresh token expired" });
    } else if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Unauthorized: Invalid refresh token" });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// get-user details
router.get("/user", verifyUser, async (req, res) => {
  const userId = req.userId as string;
  try {
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/signout", async (req, res) => {
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logout successful" });
});

// get user created shortLinks

router.get("/shortLinks", verifyUser, async (req, res) => {
  const userId = req.userId as string;
  try {
    const shortLinks = await client.shortenedURL.findMany({
      where: {
        creatorId: userId,
      },
      select: {
        originalUrl: true,
        slug: true,
        createdAt: true,
      },
    });
    res.json(shortLinks);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//generate shortLink for the provided Url
router.post("/shortLink", verifyUser, async (req, res) => {
  const userId = req.userId as string;
  const request = shortLinkSchema.safeParse(req.body);
  if (!request.success) {
    console.log(request.error.errors[0]?.message);
    res.status(400).json({
      message: request.error.errors[0]?.message || "Invalid request body",
    });
    return;
  }
  const slug = request.data.slug ?? uuid();
  try {
    const shortLink = await client.shortenedURL.create({
      data: {
        originalUrl: request.data.url,
        slug,
        creatorId: userId,
      },
    });
    res.json({
      message: "Short link created successfully",
      shortLink: `${process.env.BASE_URL}/${slug}`,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      console.log("shortLink error", error);
      if (error.meta.target.includes("originalUrl")) {
        res
          .status(409)
          .json({ message: "You have already created ziplink for this url." });
        return;
      }
      if (request.data.slug) {
        // If the user provided the slug, we notify them that the slug is already in use
        res.status(409).json({
          message:
            "The provided slug is already in use. Please choose a different slug.",
        });
        return;
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});
//redirect to the original url
router.get("/shortLink/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    // first check if the url is present in redis cache
    let cacheData = await redisClient.get(slug);
    if (!cacheData) {
      const shortLink = await client.shortenedURL.findUnique({
        where: { slug: slug },
      });
      if (!shortLink) {
        res.status(404).json({ message: "Short link not found." });
        return;
      }
      //set the fetched data to redis with expiry of an hour
      redisClient.set(shortLink.slug, shortLink.originalUrl, "EX", 3600);
      cacheData = shortLink.originalUrl;
    }
    //Add visit record to redis stream

    // Redirect the user to the original URL
    res.redirect(cacheData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//verify if the slug is already in use
router.get("/shortLink/:slug/verify", async (req, res) => {
  const { slug } = req.params;

  try {
    const shortLink = await client.shortenedURL.findUnique({
      where: { slug: slug },
    });

    if (shortLink) {
      res.json({ message: "Slug is already in use." });
    } else {
      res.json({ message: "Slug is available." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
