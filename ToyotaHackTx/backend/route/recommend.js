import express from "express";
import axios from "axios";
import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.post("/", async (req, res) => {
  try {
    const { income, creditScore, lifestyle, preferredType } = req.body;

    const r = await axios.get(
      "https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=toyota",
      { timeout: 8000 }
    );

    let models = [];
    if (typeof r.data === "string") {
      try {
        const jsonStr = r.data.replace(/^.*?\(/, "").replace(/\);?$/, "");
        const json = JSON.parse(jsonStr);
        models = json.Models || [];
      } catch {
        models = [];
      }
    } else {
      models = r.data.Models || [];
    }

    const simplified = models.slice(0, 5).map(m => ({
      name: m.model_name,
      type: m.model_body || "Unknown",
      year: m.model_year || "N/A",
      price: randomPrice(22000, 65000),
    }));

    const prompt = `
You are a helpful automotive expert recommending Toyota models for users.

User info:
- Income: $${income}
- Credit Score: ${creditScore}
- Lifestyle: ${lifestyle}
- Preferred Vehicle Type: ${preferredType}

Available Toyota Models:
${JSON.stringify(simplified, null, 2)}

Recommend the 2–3 best options and briefly explain why each suits the user.
`;

    const response = await cohere.chat({
      model: "command-a-reasoning-08-2025",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
    });

    const recommendation = response.message?.content?.[0]?.text || "No recommendation generated.";

    res.json({ models: simplified, recommendation });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to get recommendation", details: err.message });
  }
});

export default router;