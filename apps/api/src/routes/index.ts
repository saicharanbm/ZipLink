import { Router } from "express";
import { userLoginSchema, userSignupSchema } from "@repo/zod-schemas/types";
import  client from "@repo/db/client";
import { compare, hash } from "../Scrypt";
import { TokenType } from "../types";
import { generateToken } from "../utils";
import { verifyUser } from "../middlewares/verifyUserMiddeleware";
export const router:Router = Router();

router.post("/login", async (req, res) => {
    const request = userLoginSchema.safeParse(req.body);
    if(!request.success){
        res.status(400).send("Invalid request body");
        return;
    }
   try {
     //verify  if the user exists
     const user = await client.user.findUniqueOrThrow({
         where:{
             email:request.data.email
         }
     })
     //check if the password is correct
     const isPasswordCorrect = await compare(request.data.password, user.password);
     if(!isPasswordCorrect){
         res.status(401).send("Invalid credentials");
         return;
     }
     //verify if the jwt secret is present
     if(!process.env.JWT_SECRET){
        res.status(500).json({ message: "Internal Server Error: Missing JWT secret" });
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
    if(!request.success){
        res.status(400).send("Invalid request body");
        return;
    }

   try {
    //hash the password
    const hashedPassword = await hash(request.data.password);
    //create a new user
    await client.user.create({
        data:{
            email:request.data.email,
            name:request.data.name,
            password:hashedPassword
        }
    });

    res.json({message:"User created successfully"});

    
   } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).send({ message: "User with email already exists." });
      return;
    } else {
      res.status(500).send({ message: "Internal Server Error" });
    }
    
   }
});

// get-user details 
router.get("/user",verifyUser, async (req, res) => {
    try {
      const user = await client.user.findUnique({
        where: {
          id: req.userId,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  });
