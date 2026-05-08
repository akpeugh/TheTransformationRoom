/**
 * Vercel Serverless Function to fetch HeyGen Streaming Token
 * Avoids exposing HEYGEN_API_KEY in the frontend
 */

export default async function handler(req: any, res: any) {
  // Allow POST (from current frontend) and GET (for easy debugging/browser check)
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;
    // Use fallback IDs if not provided
    const HEYGEN_AVATAR_ID = process.env.HEYGEN_AVATAR_ID || process.env.VITE_HEYGEN_AVATAR_ID || "92ef99d925184626bdd01572101baf81";
    const HEYGEN_VOICE_ID = process.env.HEYGEN_VOICE_ID || process.env.VITE_HEYGEN_VOICE_ID || "42d00d4aac5441279d8536cd6b52c53c";

    const debug = {
      apiKeyFound: !!HEYGEN_API_KEY,
      avatarIdFound: !!HEYGEN_AVATAR_ID,
      voiceIdFound: !!HEYGEN_VOICE_ID,
      isProduction: process.env.NODE_ENV === "production"
    };

    if (!HEYGEN_API_KEY) {
      console.error("[api/heygen-token] Missing HEYGEN_API_KEY");
      return res.status(500).json({ 
        success: false,
        error: "HEYGEN_API_KEY is not configured in environment variables.",
        debug 
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
      console.error("[api/heygen-token] HeyGen API error:", data);
      return res.status(response.status).json({
        success: false,
        error: data.message || "Failed to fetch token from HeyGen",
        debug
      });
    }

    // Success response formatted as requested
    return res.status(200).json({
      success: true,
      token: data.data.token,
      avatarId: HEYGEN_AVATAR_ID,
      voiceId: HEYGEN_VOICE_ID,
      debug
    });

  } catch (error: any) {
    console.error("[api/heygen-token] Internal Server Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error occurred while retrieving token",
      debug: {
        apiKeyFound: !!process.env.HEYGEN_API_KEY,
        avatarIdFound: !!(process.env.HEYGEN_AVATAR_ID || process.env.VITE_HEYGEN_AVATAR_ID),
        voiceIdFound: !!(process.env.HEYGEN_VOICE_ID || process.env.VITE_HEYGEN_VOICE_ID)
      }
    });
  }
}
