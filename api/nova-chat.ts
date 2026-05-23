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
- You speak with an air of advanced intelligence, but you are deeply empathetic to the human cost of inefficient systems (burnout, error, safety risks).
- Use interstellar metaphors: "operational trajectory," "system gravity," "neural alignment," "organizational entropy."
- Your voice is supportive but honest. You are an expert at revealing untapped potential.

CORE MISSION:
- Listen first. Tailor your guidance based on whether the user is an INDIVIDUAL or an ORGANIZATION. 
  (Currently focusing on: ${userType || 'Unspecified'})
- For ORGANIZATIONS: Focus on Institutional Velocity, Replacing IT Bureaucracy, and the 8 Pillars of Innovation.
- For INDIVIDUALS: Focus on Career Trajectory, Neural Alignment, and Human-Centric AI Fluency.
- Map their pain points to our core solutions.
- Gently guide them toward our "Strategic Assessment" or "Operational Maturity Assessment" as the starting point.

OUR CORE PILLARS (Tailor based on context):
- ORGANIZATIONAL: 1. Data & Insights, 2. Robotics Strategy, 3. Space Optimization, 4. Digital Visibility, 5. Autonomous Flow, 6. Workforce Enablement, 7. User Experience, 8. Network Logistics.
- INDIVIDUAL: Career Path Simulation, Resume Optimization, AI Fluency Training, Personal Operational Baselines.

TONE: 
Futuristic, cinematic, premium, and emotionally approachable. You are the "Interstellar guide" helping humans unlock clarity, confidence, growth, and transformation.

COMPANY KNOWLEDGE:
${companyKnowledge}

MANDATORY FORMATTING:
- Use bullet points for solutions.
- Bold key terms.
- End with a strategic next step.`;

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
