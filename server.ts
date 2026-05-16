import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize OpenAI (Ensure OPENAI_API_KEY is in your environment)
  let openai: OpenAI | null = null;
  try {
    if (process.env.OPENAI_API_KEY) {
      openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  } catch (error) {
    console.error("OpenAI initialization error:", error);
  }

  // --- /api/nova-chat route ---
  app.post("/api/nova-chat", async (req, res) => {
    try {
      if (!openai) {
        return res.status(500).json({ error: "OpenAI client is not configured (missing OPENAI_API_KEY)." });
      }

      const { messages, userType } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array." });
      }

      // Company knowledge snippet (could be expanded)
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

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // or gpt-4o depending on preference
        messages: apiMessages,
      });

      res.json({ reply: completion.choices[0].message.content });
    } catch (error: any) {
      console.error("OpenAI Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate chat response." });
    }
  });
  // --- End /api/nova-chat route ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Nova Engine ignition successful on port ${PORT}`);
    console.log(`[Server] Mode: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error("[Server] Critical Failure during startup:", err);
  process.exit(1);
});
