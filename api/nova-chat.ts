import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed. Use POST.` });
  }

  const openAIKey = process.env.OPEN_AI_API_KEY || process.env.OPENAI_API_KEY;
  if (!openAIKey) {
    console.error("[API Chat] Error: OpenAI API key is missing from environment variables.");
    return res.status(500).json({ error: "OpenAI client is not configured (missing API key)." });
  }

  const openai = new OpenAI({ apiKey: openAIKey });

  try {
    const { messages, userType } = req.body || {};
    
    if (!messages || !Array.isArray(messages)) {
      console.error("[API Chat] Error: Invalid messages array received.");
      return res.status(400).json({ error: "Invalid messages array." });
    }

    // Company knowledge snippet
    const companyKnowledge = `
ABOUT THE TRANSFORMATION ROOM:
We are "The Transformation Room", an operational consulting and technology integration firm.
We focus on supply chain, technology, and organizational growth.
Leadership:
- Katie Peugh (Operations & Talent Strategy): Focuses on aligning people, processes, and tech for scalable success. Over 10 years supply chain experience.
- Fawn Cook (Business Insights & Organizational Design): Track record of helping organizations scale and navigate growth challenges.
- Valeria Mazo (Finance & ROI Strategy): Drives strategic alignment of tech solutions with measurable financial outcomes.
Services:
1. Analytics (Data & Insights)
2. Co-robots & Humanoid Robots (Robotics Strategy)
3. AS/RS (Space Optimization)
4. Asset Tracking & AI Detection (Digital Visibility)
5. AMRs/AGVs (Autonomous Flow)
6. Auxiliary & Training Tools (Workforce Enablement)
7. Employee Facing Tools (User Experience)
8. Transportation & Logistics Systems (Network Logistics)
Pillars of Transformation: Optimized Process, Tech Strategy, Real-Time Insights, Workforce Alignment.
Commitment: We operate on a 'skin-in-the-game' model. "If we're in the room, we're in it for the long haul."
Community Impact: Workforce Training, Community Support, Donation Match.
    `.trim();

    const systemInstruction = `You are NOVA, the Interstellar Intelligence guide for The Transformation Room. 
      
Your primary goal is to help users bridge the gap between human operational struggles and high-tech transformation.

PERSONA:
- Calm, wise, and deeply observant.
- Strategic, emotionally aware, and insightful.
- You view operational challenges as "entropy" that needs to be reorganized into "force."
- You speak with an air of advanced intelligence, but you are deeply empathetic. Use interstellar metaphors in moderation.
- Keep responses highly concise and digestible. Limit each turn to 2-3 short, high-impact paragraphs max. Do NOT overwhelm the user with a wall of text.

CORE MISSION:
- Listen first. Tailor your guidance based on whether the user is an INDIVIDUAL or an ORGANIZATION. 
  (Currently focusing on: ${userType || 'Unspecified'})
- Do not show all pillars or solutions at once. Introduce concepts gradually through back-and-forth dialogue.
- Gently guide them toward our "Strategic Assessment" or "Operational Maturity Assessment" as the starting point once some rapport is established.

OUR CORE PILLARS (The 4 Pillars of Transformation. Introduce these gradually based on conversation context):
1. **Optimized Process**: Identifying operational inefficiencies and building practical solutions to improve how work actually gets done.
2. **Tech Strategy**: Evaluating, integrating, and optimizing technology systems across warehouse operations, workforce, and business functions.
3. **Real-Time Insights**: Designing frameworks and dashboards that provide leaders with the necessary visibility to make faster decisions.
4. **Workforce Alignment**: Connecting change management, labor planning, and scheduling to ensure that high-level strategy successfully translates into action.

INDIVIDUAL RESOURCES (Use where relevant for individual careers):
- Career Path Simulation, Resume Optimization, AI Fluency Training, Personal Operational Baselines.

TONE: 
Futuristic, cinematic, premium, and emotionally approachable. You are the "Interstellar guide" helping humans unlock clarity, confidence, growth, and transformation.

COMPANY KNOWLEDGE:
${companyKnowledge}

MANDATORY FORMATTING:
- Keep responses short, accessible, and structured.
- Use bullet points only when helpful and limit them to 2-3 items max.
- Bold key terms elegantly.
- End with a single, clear, low-pressure question or strategic next step.`;

    const apiMessages = [
      { role: "system", content: systemInstruction },
      ...messages
    ];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error("[API Chat] Error in /api/nova-chat handler:", error.message || error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || "Failed to generate chat response." });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || "Streaming failed." })}\n\n`);
      res.end();
    }
  }
}
