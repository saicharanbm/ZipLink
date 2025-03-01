import { Router } from "express";
import { verifyUser } from "../middlewares/verifyUserMiddeleware";
import { zipLinkSchema } from "@repo/zod-schemas/types";
import { v4 as uuid } from "uuid";
import { redisClient } from "..";
import client from "@repo/db/client";
import { getVisitAnalyticsForSlug } from "../utils";
export const zipLinkRouter: Router = Router();

//generate zipLink for the provided Url
zipLinkRouter.post("/", verifyUser, async (req, res) => {
  const userId = req.userId as string;
  const request = zipLinkSchema.safeParse(req.body);
  if (!request.success) {
    // console.log(request.error.errors[0]?.message);
    res.status(400).json({
      message: request.error.errors[0]?.message || "Invalid request body",
    });
    return;
  }
  const slug = request.data.slug ?? uuid();
  try {
    const zipLink = await client.shortenedURL.create({
      data: {
        originalUrl: request.data.url,
        slug,
        creatorId: userId,
      },
    });
    res.json({
      message: "Short link created successfully",
      zipLink: `${process.env.BASE_URL}/${slug}`,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // console.log("zipLink error", error);
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

zipLinkRouter.get("/analytics/:slug/:timeRange", async (req, res) => {
  const { slug, timeRange } = req.params;

  if (!["lifetime", "last7days", "last24hours"].includes(timeRange)) {
    return res.status(400).json({ message: "Invalid time range" });
  }

  try {
    const { visits, uniqueVisits } = await getVisitAnalyticsForSlug(
      slug,
      timeRange as "lifetime" | "last7days" | "last24hours"
    );

    let visitCounts = {};

    if (timeRange === "last24hours") {
      // Group by hour format for 'last24hours'
      visitCounts = visits.reduce((acc: any, visit) => {
        const date = new Date(visit.timestamp);
        const hour = `${date.toISOString().split("T")[0]} ${date.getUTCHours()}:00`; // Example: "2024-02-12 14:00"
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});
    } else {
      // Group by date format for 'lifetime' and 'last7days'
      visitCounts = visits.reduce((acc: any, visit) => {
        const date = new Date(visit.timestamp).toISOString().split("T")[0]; // Example: "2024-02-12"
        if (date) acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
    }

    // Prepare data for the graph
    const graphData = Object.entries(visitCounts).map(([date, count]) => ({
      date, // Either date  or  date with hour
      count,
    }));

    res.json({
      slug,
      totalVisits: visits.length,
      uniqueVisits,
      graphData,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//redirect to the original url
zipLinkRouter.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const ipAddress =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress === "::1"
      ? "127.0.0.1"
      : req.socket.remoteAddress;
  console.log(ipAddress);

  try {
    // First check if the URL is present in Redis cache
    let cacheData = await redisClient.get(slug);
    if (!cacheData) {
      const zipLink = await client.shortenedURL.findUnique({
        where: { slug: slug },
      });
      if (!zipLink) {
        res.status(404).json({ message: "Short link not found." });
        return;
      }
      // Set the fetched data to Redis with an expiry of an hour
      redisClient.set(slug, zipLink.originalUrl, "EX", 3600);
      cacheData = zipLink.originalUrl;
    }

    const timestamp = new Date().toISOString();
    const visit = JSON.stringify({ timestamp, URLSlug: slug, ipAddress });

    // Add the visit to the Redis stream
    await redisClient.xadd("visit_stream", "*", "data", visit);

    // Redirect the user to the original URL
    res.redirect(cacheData);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete zipLink
zipLinkRouter.delete("/:slug", verifyUser, async (req, res) => {
  try {
    const userId = req.userId;
    const { slug } = req.params;

    if (!userId || !slug) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const deletedUrl = await client.shortenedURL.delete({
      where: {
        slug,
        creatorId: userId,
      },
    });

    if (!deletedUrl) {
      return res
        .status(404)
        .json({ message: "URL not found or not authorized to delete" });
    }

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//verify if the slug is already in use
zipLinkRouter.get("/:slug/verify", async (req, res) => {
  const { slug } = req.params;

  try {
    const zipLink = await client.shortenedURL.findUnique({
      where: { slug: slug },
    });

    if (zipLink) {
      res.json({ message: "Slug is already in use." });
    } else {
      res.json({ message: "Slug is available." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
