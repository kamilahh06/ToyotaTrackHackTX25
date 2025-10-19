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
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// const __dirname = dirname(fileURLToPath(import.meta.url));
// dotenv.config({ path: `${__dirname}/.env` });

// import express from "express";
// import cors from "cors";
// import recommendRouter from "./route/recommend.js";
// import { connectDB } from "./db.js";
// import chatRouter from "./route/chat.js";
// import userRouter from './route/user.js';



// dotenv.config();

// async function startServer() {
//   await connectDB();

//   const app = express();

//   app.use(cors({
//     origin: ["http://localhost:3000", "http://localhost:5173"],
//   }));
//   app.use(express.json());

//   app.use("/api/recommend", recommendRouter);
//   app.use("/api/chat", chatRouter);
//   app.use("/api/users", userRouter);

//   const PORT = process.env.PORT || 8080;
//   app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// }

// startServer();

// server.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import recommendRouter from "./route/recommend.js";
import { connectDB } from "./db.js";
import chatRouter from "./route/chat.js";
import userRouter from "./route/user.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: `${__dirname}/.env` });

async function startServer() {
  await connectDB();

  const app = express();

  // ✅ CORS first; no app.options("*") needed
  app.use(cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173"],
    credentials: true,
  }));

  app.use(express.json());

  app.use("/api/recommend", recommendRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/users", userRouter);

  // Quick health check
  app.get("/", (req, res) => res.send("✅ Backend alive"));

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

startServer();