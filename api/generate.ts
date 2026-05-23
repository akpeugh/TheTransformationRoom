import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed. Use POST.` });
  }

  const openAIKey = process.env.OPEN_AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    console.error("[API Generate] Error: OpenAI API key is missing from environment variables.");
    return res.status(500).json({ error: "OpenAI client is not configured (missing API key)." });
  }

  const openai = new OpenAI({ apiKey: openAIKey });

  try {
    const { messages, systemInstruction } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages array." });
    }

    const apiMessages = [];
    if (systemInstruction) {
      apiMessages.push({ role: "system", content: systemInstruction });
    }
    apiMessages.push(...messages);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("[API Generate] Error in /api/generate handler:", error.message || error);
    res.status(500).json({ error: error.message || "Failed to generate text response." });
  }
}
