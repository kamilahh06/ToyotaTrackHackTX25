// import express from "express";
// import axios from "axios";
// import { CohereClientV2 } from "cohere-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const router = express.Router();
// const cohere = new CohereClientV2({
//   token: process.env.CO_API_KEY,
// });

// function randomPrice(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// // Helper to extract model names like "Camry", "RAV4"
// function extractModelNames(text) {
//  const modelRegex = /Toyota\s([\w\-]+(?:\s[\w\-]+)?)/gi;
//   const matches = [];
//   let match;
//   while ((match = modelRegex.exec(text)) !== null) {
//     matches.push(match[1]);
//   }
//   return [...new Set(matches)];
// }

// // Fetch image using Google Custom Search API
// async function fetchCarImage(model) {
//   try {
//     const r = await axios.get(
//       "https://www.googleapis.com/customsearch/v1",
//       {
//         params: {
//           key: process.env.GOOGLE_API_KEY,
//           cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
//           searchType: "image",
//           q: `Toyota ${model} car`,
//           num: 1,
//         },
//       }
//     );
//     return r.data.items?.[0]?.link || null;
//   } catch (e) {
//     console.error(`❌ Error fetching image for ${model}:`, e.message);
//     return null;
//   }
// }

// router.post("/", async (req, res) => {
//   try {
//     const { income, creditScore, lifestyle, preferredType } = req.body;

//     // Get Toyota models from CarQuery API
//     const r = await axios.get(
//       "https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=toyota",
//       { timeout: 8000 }
//     );

//     let models = [];
//     if (typeof r.data === "string") {
//       try {
//         const jsonStr = r.data.replace(/^.*?\(/, "").replace(/\);?$/, "");
//         const json = JSON.parse(jsonStr);
//         models = json.Models || [];
//       } catch {
//         models = [];
//       }
//     } else {
//       models = r.data.Models || [];
//     }

//     // Simplify model list for AI context (can be many models)
//       const seatCount = parseInt(lifestyle.seats, 10);
//       const preferredRange = lifestyle.range;

//       const simplified = (await Promise.all(
//         models.slice(0, 25).map(async (m) => {
//           let type = m.model_body || "Unknown";

//           // Try to get model_body from trims
//           try {
//             const trimRes = await axios.get(
//               `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=toyota&model=${m.model_name}`
//             );
//             const trimData = JSON.parse(
//               trimRes.data.replace(/^.*?\(/, "").replace(/\);?$/, "")
//             );
//             const trim = trimData?.Trims?.[0];

//             if (trim?.model_body) type = trim.model_body;
//           } catch (err) {
//             console.warn(`Could not get type for ${m.model_name}`);
//           }

//           return {
//             name: m.model_name,
//             type,
//             year: m.model_year || "N/A",
//             seats: m.model_seats || 5,
//             range: preferredRange, // default to user's preference
//             price: randomPrice(22000, 40000),
//           };
//         })
//       )).filter((model) => {
//         // You can decide how strict you want filtering to be here
//         return model.seats >= seatCount;
//       });


//     // Prompt to Cohere
//     const prompt = `
//     You are a helpful automotive expert recommending Toyota models for users.

//     User info:
//     - Income: $${income}
//     - Credit Score: ${creditScore}
//     - Preferred Vehicle Type: ${preferredType}
//     - Seats: ${lifestyle.seats}
//     - Range: ${lifestyle.range}
//     - Accessories: ${(lifestyle.accessories || []).join(", ") || "None"}
//     - Preferred Color: ${lifestyle.carColor}

//     Available Toyota Models:
//     ${JSON.stringify(simplified, null, 2)}

//     Recommend the 3 best options and briefly explain why each suits the user.
//     `;
 
//     // AI response
//     const response = await cohere.chat({
//       model: "command-a-reasoning-08-2025",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.6,
//     });
    
//     console.log('AI raw response:', response);
//     const content = response.message?.content;

//   const recommendationContent = Array.isArray(content)
//     ? content
//         .filter(part => part.type === "text")
//         .map(part => part.text)
//         .join("\n\n")
//     : content || "No recommendation.";
//   const extractedModels = extractModelNames(recommendationContent);




//     // Build models with images and price
//    const modelsWithImages = await Promise.all(
//   extractedModels.map(async (modelName) => {
//   let seats = parseInt(lifestyle.seats, 10) || 5;
//   let range = lifestyle.range || "medium";


//     try {
//       const trimRes = await axios.get(
//         `https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=toyota&model=${modelName}`
//       );

//       const trimData = JSON.parse(
//         trimRes.data.replace(/^.*?\(/, "").replace(/\);?$/, "")
//       );

//       const trim = trimData?.Trims?.[0]; // first trim as example

//       // Enrich range from highway MPG if available
//       if (trim?.model_mpg_hwy) {
//         const mpg = parseFloat(trim.model_mpg_hwy);
//         if (mpg >= 35) range = "long";
//         else if (mpg >= 25) range = "medium";
//         else range = "short";
//       }

//       // Enrich seats
//       if (trim?.model_seats) {
//         seats = parseInt(trim.model_seats);
//       }
//     } catch (e) {
//       console.warn(`⚠️ Could not enrich ${modelName}:`, e.message);
//     }

//     // Always fetch image
//     const image = await fetchCarImage(modelName);

//     return {
//       name: `Toyota ${modelName}`,
//       seats,
//       range,
//       price: randomPrice(22000, 65000),
//       image,
//     };
//   })
// );



//     // Final response
//     res.json({
//       recommendationContent,
//       models: modelsWithImages,
//     });
//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).json({
//       error: "Failed to get recommendation",
//       details: err.message,
//     });
//   }
// });


// export default router;

// backend/route/recommend.js
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

// Simple, resilient text→model matching
function selectModelsFromText(text, candidates) {
  const t = (text || "").toLowerCase();
  const clean = (s) =>
    s.toLowerCase().replace(/^toyota\s+/, "").replace(/\s*hybrid\b/, "");
  const names = candidates.map((c) => c.name);
  const found = [];

  for (const name of names) {
    const n = clean(name);
    // match “camry”, “toyota camry”, “camry hybrid”, etc.
    if (t.includes(n)) found.push(name);
    else if (t.includes(`toyota ${n}`)) found.push(name);
  }
  return [...new Set(found)].slice(0, 3);
}

async function fetchCarImage(model) {
  try {
    const r = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        searchType: "image",
        q: `Toyota ${model} car`,
        num: 1,
      },
      timeout: 7000,
    });
    return r.data?.items?.[0]?.link || null;
  } catch (e) {
    console.warn(`⚠️ Image fetch failed for ${model}: ${e.message}`);
    return null;
  }
}

router.post("/", async (req, res) => {
  try {
    const { income, creditScore, lifestyle, preferredType } = req.body;

    // 1) Get Toyota models
    const r = await axios.get(
      "https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=toyota",
      { timeout: 8000 }
    );

    let modelsRaw = [];
    if (typeof r.data === "string") {
      // JSONP -> JSON
      try {
        const jsonStr = r.data.replace(/^.*?\(/, "").replace(/\);?$/, "");
        const json = JSON.parse(jsonStr);
        modelsRaw = json.Models || [];
      } catch {
        modelsRaw = [];
      }
    } else {
      modelsRaw = r.data?.Models || [];
    }

    // 2) Simplify (no trim enrichment to avoid errors/latency)
    const simplified = modelsRaw.slice(0, 25).map((m) => ({
      name: m.model_name,                          // e.g., "Camry", "Avalon Hybrid"
      type: m.model_body || "Unknown",             // body from main list only
      year: m.model_year || "N/A",
      seats: m.model_seats || 5,
      price: randomPrice(22000, 45000),
    }));

    // 3) Build prompt
    const prompt = `
You are a helpful automotive expert recommending Toyota models for users.

User info:
- Income: $${income}
- Credit Score: ${creditScore}
- Preferred Vehicle Type: ${preferredType}
- Seats: ${lifestyle?.seats}
- Range: ${lifestyle?.range}
- Accessories: ${(lifestyle?.accessories || []).join(", ") || "None"}
- Preferred Color: ${lifestyle?.carColor}

Available Toyota Models (choose only from these by exact model_name field):
${JSON.stringify(simplified.map(({ name, type }) => ({ name, type })), null, 2)}

Return a short explanation and mention the chosen model names exactly as shown above.
Pick 2–3 models max.
`;

    // 4) Call Cohere v2
    const ai = await cohere.chat({
      model: "command-a-reasoning-08-2025",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    // 5) Extract text content (Cohere v2 returns array parts)
    const parts = ai?.message?.content || [];
    const recommendationContent = Array.isArray(parts)
      ? parts
          .filter((p) => p?.type === "text")
          .map((p) => p.text)
          .join("\n\n")
      : (ai?.message?.content ?? "No recommendation.");

    // 6) Try to pick models mentioned in the text
    let pickedNames = selectModelsFromText(
      recommendationContent,
      simplified
    );

    // 7) Fallback if AI didn’t name any: simple score by seats/type/price
    if (pickedNames.length === 0) {
      const seatNeed = parseInt(lifestyle?.seats, 10) || 5;
      const typePref = (preferredType || "").toLowerCase();
      const scored = simplified
        .map((m) => {
          let score = 0;
          if (typePref && m.type?.toLowerCase().includes(typePref)) score += 2;
          if (m.seats >= seatNeed) score += 1;
          // rough budget proxy: cheaper if income lower
          const inc = parseFloat(income) || 0;
          if (inc < 40000 && m.price < 28000) score += 2;
          else if (inc < 70000 && m.price < 35000) score += 1;
          return { ...m, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      pickedNames = scored.map((s) => s.name);
    }

    // 8) Build final models with images (with fallback image)
    const pickedModels = simplified.filter((m) => pickedNames.includes(m.name));
    const modelsWithImages = await Promise.all(
      pickedModels.map(async (m) => {
        const image =
          (await fetchCarImage(m.name)) ||
          "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800"; // fallback
        return {
          name: `Toyota ${m.name}`,
          seats: m.seats,
          range: lifestyle?.range || "medium",
          price: m.price,
          image,
        };
      })
    );

    res.json({
      recommendationContent,
      models: modelsWithImages,
    });
  } catch (err) {
    console.error("❌ /api/recommend error:", err);
    res.status(500).json({
      error: "Failed to get recommendation",
      details: err.message,
    });
  }
});

export default router;