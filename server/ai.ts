import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

let genAIClient: GoogleGenAI | null = null;
let openAIClient: OpenAI | null = null;

export function getAIClient() {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAIKey = process.env.OPEN_AI_API_KEY || process.env.OPENAI_API_KEY;

  if (geminiKey && !genAIClient) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("[AI Server] Google GenAI initialized successfully.");
    } catch (err) {
      console.error("[AI Server] Google GenAI init error:", err);
    }
  }

  if (openAIKey && !openAIClient) {
    try {
      openAIClient = new OpenAI({ apiKey: openAIKey });
      console.log("[AI Server] OpenAI initialized successfully.");
    } catch (err) {
      console.error("[AI Server] OpenAI init error:", err);
    }
  }

  return { genAIClient, openAIClient };
}

export async function generateAIContent({
  systemInstruction,
  prompt,
  jsonMode = false,
}: {
  systemInstruction?: string;
  prompt: string;
  jsonMode?: boolean;
}): Promise<string> {
  const { genAIClient, openAIClient } = getAIClient();

  // 1. Try Gemini if available
  if (genAIClient && process.env.GEMINI_API_KEY) {
    const modelsToTry = ["gemini-3.7-flash", "gemini-2.5-flash", "gemini-flash-latest"];
    for (const modelName of modelsToTry) {
      try {
        const response = await genAIClient.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || "You are an expert executive resume and career coach.",
            responseMimeType: jsonMode ? "application/json" : "text/plain",
            temperature: 0.2,
          },
        });

        if (response.text && response.text.trim().length > 0) {
          let text = response.text.trim();
          if (jsonMode) {
            // Strip any markdown code fences if model included them
            text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
          }
          return text;
        }
      } catch (err: any) {
        console.warn(`[AI Server] Gemini model ${modelName} call failed:`, err.message);
      }
    }
  }

  // 2. Try OpenAI if Gemini not available or failed
  if (openAIClient) {
    try {
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      messages.push({ role: "user", content: prompt });

      const completion = await openAIClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        response_format: jsonMode ? { type: "json_object" } : undefined,
        temperature: 0.2,
      });

      let content = completion.choices[0]?.message?.content || "";
      if (jsonMode) {
        content = content.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
      }
      return content;
    } catch (err: any) {
      console.error("[AI Server] OpenAI call failed:", err.message);
      throw err;
    }
  }

  throw new Error("No AI API client is configured (neither GEMINI_API_KEY nor OPENAI_API_KEY found).");
}
