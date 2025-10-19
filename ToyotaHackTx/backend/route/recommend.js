import express from "express";
import axios from "axios";
import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const cohere = new CohereClientV2({
  token: process.env.CO_API_KEY,
});

function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to extract model names like "Camry", "RAV4"
function extractModelNames(text) {
  const modelRegex = /Toyota\s([\w\-]+)/g;
  const matches = [];
  let match;
  while ((match = modelRegex.exec(text)) !== null) {
    matches.push(match[1]);
  }
  return [...new Set(matches)];
}

// Fetch image using Google Custom Search API
async function fetchCarImage(model) {
  try {
    const r = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          searchType: "image",
          q: `Toyota ${model} car`,
          num: 1,
        },
      }
    );
    return r.data.items?.[0]?.link || null;
  } catch (e) {
    console.error(`❌ Error fetching image for ${model}:`, e.message);
    return null;
  }
}

router.post("/", async (req, res) => {
  try {
    const { income, creditScore, lifestyle, preferredType } = req.body;

    // Get Toyota models from CarQuery API
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

    // Simplify model list for AI context (can be many models)
    const simplified = models.slice(0, 10).map(m => ({
     name: m.model_name,
      type: m.model_body || "Unknown",
      year: m.model_year || "N/A",
      seats: m.model_seats || 5,  // Might be undefined; default to 5
      range: "medium",            // We’ll update this based on MPG below
      price: randomPrice(22000, 40000),
    }));

    // Prompt to Cohere
    const prompt = `
      You are a helpful automotive expert recommending Toyota models for users.

      User info:
      - Income: $${income}
      - Credit Score: ${creditScore}
      - Lifestyle: ${lifestyle}
      - Preferred Vehicle Type: ${preferredType}

      Available Toyota Models:
      ${JSON.stringify(simplified, null, 2)}

Recommend the 3 best options and briefly explain why each suits the user.
`;

    // AI response
    const response = await cohere.chat({
      model: "command-a-reasoning-08-2025",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const recommendation = response.message?.content?.[0]?.text || "No recommendation generated.";

    // Extract model names from AI output
    const extractedModels = extractModelNames(recommendation); // e.g., ['Camry', 'RAV4']

    // Build models with images and price
   const modelsWithImages = await Promise.all(
  extractedModels.map(async (modelName) => {
    let seats = 5;
    let range = "medium";

    try {
      const trimRes = await axios.get(
        `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=toyota&model=${modelName}`
      );

      const trimData = JSON.parse(
        trimRes.data.replace(/^.*?\(/, "").replace(/\);?$/, "")
      );

      const trim = trimData?.Trims?.[0]; // first trim as example

      // Enrich range from highway MPG if available
      if (trim?.model_mpg_hwy) {
        const mpg = parseFloat(trim.model_mpg_hwy);
        if (mpg >= 35) range = "long";
        else if (mpg >= 25) range = "medium";
        else range = "short";
      }

      // Enrich seats
      if (trim?.model_seats) {
        seats = parseInt(trim.model_seats);
      }
    } catch (e) {
      console.warn(`⚠️ Could not enrich ${modelName}:`, e.message);
    }

    // Always fetch image
    const image = await fetchCarImage(modelName);

    return {
      name: `Toyota ${modelName}`,
      seats,
      range,
      price: randomPrice(22000, 65000),
      image,
    };
  })
);


    // Final response
    res.json({
      recommendation,
      models: modelsWithImages,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({
      error: "Failed to get recommendation",
      details: err.message,
    });
  }
});


export default router;
