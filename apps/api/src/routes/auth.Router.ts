import { userLoginSchema, userSignupSchema } from "@repo/zod-schemas/types";
import { Router } from "express";
import { compare, hash } from "../Scrypt";
import client from "@repo/db/client";
import { generateToken } from "../utils";
import { TokenType } from "../types";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authRouter: Router = Router();
authRouter.post("/login", async (req, res) => {
  // console.log(req);
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

authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/get-token", async (req, res) => {
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
    // console.log("get-token error: ", error);
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

authRouter.post("/signout", async (req, res) => {
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logout successful" });
});
