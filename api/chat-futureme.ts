import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed." });
  }

  try {
    const { userProfile, chatHistory, question } = req.body;

    if (!userProfile || !question) {
      return res.status(400).json({
        success: false,
        error: "UserProfile and current question are required."
      });
    }

    const { name, age, goal, struggle, oneYearVision, tone } = userProfile;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY environment variable is missing on Vercel. Please add it to your Vercel Project Settings under Environment Variables."
      });
    }

    const aiClient = new GoogleGenAI({
      apiKey: apiKey,
    });

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

    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    const replyText = response.text || "I was unable to generate a reply. Focus on your actions, not the barriers.";

    return res.status(200).json({
      success: true,
      reply: replyText.trim()
    });
  } catch (error: any) {
    console.error("Error in FutureMe chat:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to communicate with FutureMe."
    });
  }
}
