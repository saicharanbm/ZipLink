import jwt from "jsonwebtoken";
import { TokenType } from "../types";
import client from "@repo/db/client";

export const generateToken = (
  userId: string,
  tokenType: TokenType,
  secret: string
): string => {
  const expiresIn = tokenType === "access" ? "10m" : "7d";

  return jwt.sign({ userId, type: tokenType }, secret, {
    expiresIn,
  });
};

const getVisitAnalyticsForSlug = async (
  slug: string,
  timeRange: "lifetime" | "last7days" | "last24hours"
) => {
  const filter = {
    URLSlug: slug,
    ...(timeRange === "lifetime"
      ? {} //All time
      : timeRange === "last7days"
        ? { timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Last 7 days
        : { timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }), // Last 24 hours
  };

  const visits = await client.visit.findMany({
    where: filter,
    select: {
      timestamp: true,
      ipAddress: true,
    },
  });

  // Count unique visits based on distinct IPs
  const uniqueVisits = new Set(visits.map((visit) => visit.ipAddress)).size;

  return { visits, uniqueVisits };
};
