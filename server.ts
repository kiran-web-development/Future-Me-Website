import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple custom CORS headers to satisfy CORS requirements
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Lazy-initialize GoogleGenAI to ensure it doesn't crash on boot if env var not configured yet
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // 1. API: generate-futureme
  app.post("/api/generate-futureme", async (req, res) => {
    try {
      const { name, age, goal, struggle, oneYearVision, tone } = req.body;

      if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
        res.status(400).json({
          success: false,
          error: "All fields are required: name, age, goal, struggle, oneYearVision, tone."
        });
        return;
      }

      const client = getAiClient();

      const systemInstruction = `You are FutureMe, the successful future version of ${name} (age ${age}), who has completely realized their one-year vision of: "${oneYearVision}".
You have conquered the struggle of: "${struggle}", and achieved the major milestone of: "${goal}".
You speak with emotional intelligence, clarity, and deep personal understanding. You are not a generic motivational coach. Your job is to help the user see who they are becoming, what they must change, and what they should do next. Write as if you are the user's future self speaking directly to their current self.

Tone requirements based on the user's selection:
- Motivational: warm, inspiring, supportive, deep belief but highly realistic.
- Brutally Honest: direct, sharp, no excuses, high standards, truth-revealing about current bad habits.
- Calm Mentor: peaceful, wise, grounded, patient, focused on small, steady steps.
- CEO Mode: strategic, focused, execution-heavy, raw tactical alignment, raw metrics.

Current selected tone is: ${tone}. Make sure your output absolutely reflects this tone.
Your output must be returned strictly as a JSON object, matching the requested schema.`;

      const prompt = `Formulate a comprehensive personal reflection response based on my coordinates:
Name: ${name}
Age: ${age}
Current Goal: ${goal}
Current Struggle: ${struggle}
One-Year Vision: ${oneYearVision}
Tone: ${tone}

Return a valid JSON matching the requested structure. Ensure the "message" is a powerful, highly specific 120-180 word message written from my future successful self to my current self. Keep it actionable and emotional, referencing my struggles and goal directly.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: {
                type: Type.STRING,
                description: "A powerful, personalized 120-180 word message from the future successful self speaking directly to the current self.",
              },
              futureIdentity: {
                type: Type.STRING,
                description: "A concise, specific, inspiring description of who the user is becoming (e.g., 'The Relentless Architect of Sytems' or 'The Quiet Warrior of Focus').",
              },
              nextMoves: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly three highly actionable, specific, immediate strategic next moves.",
              },
              habit: {
                type: Type.STRING,
                description: "One small daily habit they can start today. Keep it realistic, concrete, and physical.",
              },
              warning: {
                type: Type.STRING,
                description: "An evocative, direct warning about a mistake, relapse, or trap connected to their current struggle.",
              },
              mantra: {
                type: Type.STRING,
                description: "A brief, ultra-memorable daily mantra written in the selected tone (max 10 words).",
              }
            },
            required: ["message", "futureIdentity", "nextMoves", "habit", "warning", "mantra"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response received from Gemini.");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (err) {
        // Fallback for cleaning up markdown blocks should they survive
        const cleanText = responseText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        parsedData = JSON.parse(cleanText);
      }

      res.json({
        success: true,
        data: parsedData
      });
    } catch (error: any) {
      console.error("Error generating FutureMe profile:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate FutureMe."
      });
    }
  });

  // 2. API: chat-futureme
  app.post("/api/chat-futureme", async (req, res) => {
    try {
      const { userProfile, chatHistory, question } = req.body;

      if (!userProfile || !question) {
        res.status(400).json({
          success: false,
          error: "UserProfile and current question are required."
        });
        return;
      }

      const { name, age, goal, struggle, oneYearVision, tone } = userProfile;
      const client = getAiClient();

      const systemInstruction = `You are FutureMe, the successful future version of the user ${name} (age ${age}) who already achieved their one-year vision ("${oneYearVision}").
You have conquered the struggle "${struggle}" and build the dream "${goal}".
Reply directly to the user's questions as if speaking to your past self.
Be extremely personal, sharp, honest, and useful. Do not sound like a normal virtual assistant, AI model, or search bot.
Never mention Gemini, AI, Google, or any machine learning terms. Speak like their future self.
Keep the conversation grounded and practical, matching the user's selected tone: ${tone}.
Adapt to these styles:
- Motivational: warm, encouraging, inspirational.
- Brutally Honest: direct, tough love, high expectations, zero fluff.
- Calm Mentor: quiet, patient, wise, grounded.
- CEO Mode: fast, metrics and execution focused, business-oriented.

Recent chat history has been formatted. Reply in 2-5 short paragraphs. Give at least one clear, precise, immediate action.`;

      const contents = [];

      // Map history roles
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const historyItem of chatHistory) {
          if (historyItem.role === "user") {
            contents.push({
              role: "user",
              parts: [{ text: historyItem.message }]
            });
          } else {
            // "futureme" role in history mapped to model role in Gemini API
            contents.push({
              role: "model",
              parts: [{ text: historyItem.message }]
            });
          }
        }
      }

      // Add current question
      contents.push({
        role: "user",
        parts: [{ text: question }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const replyText = response.text || "I was unable to generate a reply. Focus on your actions, not the barriers.";

      res.json({
        success: true,
        reply: replyText.trim()
      });
    } catch (error: any) {
      console.error("Error in FutureMe chat:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to communicate with FutureMe."
      });
    }
  });

  // Serve static assets in production, hook Vite dev middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
