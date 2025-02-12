import { Router } from "express";

import client from "@repo/db/client";

import { verifyUser } from "../middlewares/verifyUserMiddeleware";

import { zipLinkRouter } from "./zipLinkRouter";

import { authRouter } from "./auth.Router";
import { zipLinksRouter } from "./zipLinksRouter";
export const router: Router = Router();

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

router.use("/auth", authRouter);
router.use("/zipLink", zipLinkRouter);
router.use("/zipLinks", zipLinksRouter);
