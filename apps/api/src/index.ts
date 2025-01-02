import express from "express";
import "dotenv/config";
import cors from "cors";
import { router } from "./routes";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
));
app.use(cookieParser());
app.use(express.json());

app.use("api/v1/",router);