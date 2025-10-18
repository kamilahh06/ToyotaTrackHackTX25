import express from "express";
import axios from "axios";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// helper: generate random price
function randomPrice(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.post("/", async (req, res) => {
  try {
    const { income, creditScore, lifestyle, preferredType } = req.body;

    // 0. Process finicial information
      
    // 1. Fetch Toyota cars from CarQuery API
    const response = await axios.get(
      "https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=toyota"
    );

    const models = response.data.Models.slice(0, 10).map(m => ({
      name: m.model_name,
      type: m.model_body || "Unknown",
      year: m.model_year,
      price: randomPrice(22000, 65000),
    }));

    // 2. Send data to OpenAI for recommendation reasoning
    const prompt = `
      User info:
      - Income: $${income}
      - Credit Score: ${creditScore}
      - Lifestyle: ${lifestyle}
      - Preferred Type: ${preferredType}

      Car data: ${JSON.stringify(models)}

      Recommend 2 Toyota models from this list that best fit the user.
      Justify your choices briefly in one sentence each.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const recommendation = aiResponse.choices[0].message.content;
    res.json({ models, recommendation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get recommendation" });
  }
});

export default router;