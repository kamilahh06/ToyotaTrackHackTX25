import express from "express";
import axios from "axios";
import { CohereClientV2 } from "cohere-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

// New chatbot endpoint
router.post("/chat", async (req, res) => {
    try {
      const { 
        message, 
        sessionId, 
        userProfile 
      } = req.body;
  
      console.log("🔍 Incoming request body:", req.body);
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
  
      // Get or create conversation history
      let conversationHistory = conversationSessions.get(sessionId) || [];
      
      // Build context from user profile
      let contextPrompt = "You are a helpful financial and automotive advisor assistant. ";
      
      if (userProfile) {
        contextPrompt += "\n\nUser Profile:";
        if (userProfile.income) contextPrompt += `\n- Annual Income: $${userProfile.income}`;
        if (userProfile.creditScore) contextPrompt += `\n- Credit Score: ${userProfile.creditScore}`;
        if (userProfile.lifestyle) contextPrompt += `\n- Lifestyle: ${userProfile.lifestyle}`;
        if (userProfile.preferredType) contextPrompt += `\n- Preferred Vehicle Type: ${userProfile.preferredType}`;
        if (userProfile.carModels && userProfile.carModels.length > 0) {
          contextPrompt += `\n- Recommended Car Models: ${JSON.stringify(userProfile.carModels, null, 2)}`;
        }
      }
      
      contextPrompt += "\n\nAnswer questions about their financial situation, car recommendations, financing options, budgeting, and related topics. Be conversational, helpful, and concise.";
  
      // Build messages array for Cohere
      const messages = [
        { role: "system", content: contextPrompt },
        ...conversationHistory,
        { role: "user", content: message }
      ];
  
      const response = await cohere.chat({
        model: "command-a-reasoning-08-2025",
        messages: messages,
        temperature: 0.7,
      });
  
      const botReply = response.message?.content?.[0]?.text || "I'm sorry, I couldn't generate a response.";
  
      // Update conversation history
      conversationHistory.push({ role: "user", content: message });
      conversationHistory.push({ role: "assistant", content: botReply });
      
      // Keep only last 20 messages to avoid token limits
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }
      
      conversationSessions.set(sessionId, conversationHistory);
  
      res.json({ 
        reply: botReply,
        sessionId: sessionId 
      });
  
    } catch (err) {
      console.error("❌ Chat Error:", err);
      res.status(500).json({ error: "Failed to process chat message", details: err.message });
    }
  });
  
  // Clear conversation history
  router.delete("/chat/:sessionId", (req, res) => {
    const { sessionId } = req.params;
    conversationSessions.delete(sessionId);
    res.json({ message: "Conversation history cleared" });
  });

  export default router;
