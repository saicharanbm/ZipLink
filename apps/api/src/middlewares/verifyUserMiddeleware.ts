import { Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import client from "@repo/db/client";

export const verifyUser = async (req:Request,res:Response,next:Function) => {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if(!accessToken){
        res.status(401).json({message: "Unauthorized: No token provided" });
        return;
    }
    // verify if the jwt secret is present
    if(!process.env.JWT_SECRET){
        res.status(500).json({ message: "Internal Server Error: Missing JWT secret" });
        return;
    }
    try {
        const decoded = jwt.verify(accessToken,process.env.JWT_SECRET) as JwtPayload;
        // verify if the user exists
        const user = await client.user.findUnique({
            where:{
                id:decoded.userId
            }
        });
        if(!user){
            res.status(401).json({message: "Unauthorized: User not found" });
            return;
        }
        // add the user id to the request object 
        req.userId = user.id;
        next();
    } catch (error:any) {
        if (
      error instanceof jwt.JsonWebTokenError &&
      error.name === "TokenExpiredError"
    ) {
      res.status(401).json({ message: "Unauthorized: Token expired" });
      return;
    }
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
}