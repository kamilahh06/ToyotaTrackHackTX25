// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// dotenv.config({ path: ".env" }); // if you're running node from backend/

// import express from "express";
// import cors from "cors";
// import recommendRouter from "./route/recommend.js";

// console.log("✅ OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);


// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";

// const __dirname = dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: `${__dirname}/.env` }); // use absolute path to be safe


// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/api/recommend", recommendRouter);
// app.listen(5000, () => console.log("Server running on port 5000"));

// server.js (top portion)
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/.env` });

import express from "express";
import cors from "cors";
import recommendRouter from "./route/recommend.js";


const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // restrict to your dev origin
app.use(express.json());
app.use("/api/recommend", recommendRouter);

const PORT = process.env.PORT || 8080; // use 8080 or 7000 or 5500 — anything not 5000–5050
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));