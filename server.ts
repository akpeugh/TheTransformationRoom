import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route: HeyGen Token and Config
  app.post("/api/heygen-token", async (req, res) => {
    try {
      const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
      const HEYGEN_AVATAR_ID = process.env.HEYGEN_AVATAR_ID || process.env.VITE_HEYGEN_AVATAR_ID;
      const HEYGEN_VOICE_ID = process.env.HEYGEN_VOICE_ID || process.env.VITE_HEYGEN_VOICE_ID;

      console.log("[HeyGen] API Key defined:", !!HEYGEN_API_KEY);
      console.log("[HeyGen] Avatar ID defined:", !!HEYGEN_AVATAR_ID);
      console.log("[HeyGen] Voice ID defined:", !!HEYGEN_VOICE_ID);

      if (!HEYGEN_API_KEY) {
        return res.status(500).json({ 
          error: "HEYGEN_API_KEY is not configured on the server.",
          debug: {
            apiKeyFound: false,
            avatarIdFound: !!HEYGEN_AVATAR_ID,
            voiceIdFound: !!HEYGEN_VOICE_ID
          }
        });
      }

      const response = await fetch("https://api.heygen.com/v1/streaming.create_token", {
        method: "POST",
        headers: {
          "x-api-key": HEYGEN_API_KEY,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[HeyGen] Token Fetch Failed:", data);
        throw new Error(data.message || "Failed to fetch token from HeyGen");
      }

      res.json({ 
        token: data.data.token,
        config: {
          avatarId: HEYGEN_AVATAR_ID,
          voiceId: HEYGEN_VOICE_ID
        },
        debug: {
          apiKeyFound: true,
          avatarIdFound: !!HEYGEN_AVATAR_ID,
          voiceIdFound: !!HEYGEN_VOICE_ID
        }
      });
    } catch (error: any) {
      console.error("HeyGen Token Error:", error);
      res.status(500).json({ 
        error: error.message,
        debug: {
          apiKeyFound: !!process.env.HEYGEN_API_KEY,
          avatarIdFound: !!(process.env.HEYGEN_AVATAR_ID || process.env.VITE_HEYGEN_AVATAR_ID),
          voiceIdFound: !!(process.env.HEYGEN_VOICE_ID || process.env.VITE_HEYGEN_VOICE_ID)
        }
      });
    }
  });

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
