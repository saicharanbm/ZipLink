import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";
import cookieParser from "cookie-parser";
import Redis from "ioredis";

const redisUrl = process.env.UPSTASH_REDIS_URL;
if (!redisUrl) {
  throw new Error("UPSTASH_REDIS_URL is not defined");
}
export const redisClient = new Redis(redisUrl);

const app = express();
// Enable proxy trust for correct IP retrieval
app.set("trust proxy", true);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1", router);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
