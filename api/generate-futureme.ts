import { GoogleGenAI, Type } from "@google/genai";

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
    const { name, age, goal, struggle, oneYearVision, tone } = req.body;

    if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
      return res.status(400).json({
        success: false,
        error: "All fields are required: name, age, goal, struggle, oneYearVision, tone."
      });
    }

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

    const response = await aiClient.models.generateContent({
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
              description: "A concise, specific, inspiring description of who the user is becoming (e.g., 'The Relentless Architect of Systems' or 'The Quiet Warrior of Focus').",
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
      const cleanText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      parsedData = JSON.parse(cleanText);
    }

    return res.status(200).json({
      success: true,
      data: parsedData
    });
  } catch (error: any) {
    console.error("Error generating FutureMe profile:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate FutureMe."
    });
  }
}
