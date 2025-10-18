import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // if you're running node from backend/

import express from "express";
import cors from "cors";
import recommendRouter from "./route/recommend.js";

console.log("✅ OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/recommend", recommendRouter);
app.listen(5000, () => console.log("Server running on port 5000"));