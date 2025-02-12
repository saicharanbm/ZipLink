import { Router } from "express";
import client from "@repo/db/client";
import { verifyUser } from "../middlewares/verifyUserMiddeleware";
export const zipLinksRouter: Router = Router();

// get user created zipLinks
zipLinksRouter.get("/", verifyUser, async (req, res) => {
  const userId = req.userId as string;
  try {
    const zipLinks = await client.shortenedURL.findMany({
      where: {
        creatorId: userId,
      },
      select: {
        originalUrl: true,
        slug: true,
        createdAt: true,
      },
    });
    res.json(zipLinks);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//search for zipLinks
zipLinksRouter.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  console.log(query);

  try {
    const zipLinks = await client.shortenedURL.findMany({
      where: {
        originalUrl: {
          contains: query,
          mode: "insensitive", // Case-insensitive search
        },
      },
      take: 20, // Limit the results
    });

    res.json(zipLinks);
  } catch (error) {
    // console.error("Error fetching short links:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
