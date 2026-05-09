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
    
    // Improved Domain Detection logic using requested fallback order
    const appUrl =
      process.env.APP_URL ||
      process.env.VITE_APP_URL ||
      req.headers.origin ||
      (req.headers.host ? `https://${req.headers.host}` : "Unknown Domain");

    // Use environment variables for IDs with no hardcoded fallback
    const avatarId =
      process.env.HEYGEN_AVATAR_ID ||
      process.env.VITE_HEYGEN_AVATAR_ID;

    const voiceId =
      process.env.HEYGEN_VOICE_ID ||
      process.env.VITE_HEYGEN_VOICE_ID;

    const debug: any = {
      apiKeyFound: !!HEYGEN_API_KEY,
      avatarIdFound: !!avatarId,
      voiceIdFound: !!voiceId,
      detectedAppUrl: appUrl,
      appUrl: appUrl,
      isProduction: process.env.NODE_ENV === "production"
    };

    if (!HEYGEN_API_KEY) {
      console.error("[api/heygen-token] Missing HEYGEN_API_KEY");
      return res.status(500).json({ 
        success: false,
        error: "HEYGEN_API_KEY is not configured in environment variables.",
        troubleshooting: "Please add HEYGEN_API_KEY to your AI Studio Secrets panel.",
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
      let errorMessage = data.message || "Failed to fetch token from HeyGen";
      let troubleshooting = "Ensure your HEYGEN_API_KEY is correct and your plan supports Streaming Avatar (Team or Enterprise plans).";
      
      if (response.status === 401) {
        troubleshooting = "Unauthorized: The HEYGEN_API_KEY provided is invalid. Check your HeyGen settings.";
      } else if (response.status === 403) {
        troubleshooting = "Forbidden: Streaming is not enabled for your account or this domain. You MUST whitelist the domain in HeyGen Space Settings.";
      } else if (response.status === 429) {
        troubleshooting = "Rate Limit: You have exceeded the HeyGen API rate limits.";
      }

      return res.status(response.status).json({
        success: false,
        error: errorMessage,
        heygenStatus: response.status,
        heygenResponseBody: data,
        detectedAppUrl: appUrl,
        apiKeyFound: !!HEYGEN_API_KEY,
        avatarIdFound: !!avatarId,
        voiceIdFound: !!voiceId,
        isProduction: process.env.NODE_ENV === "production",
        troubleshooting,
        debug: {
          ...debug,
          heygenStatus: response.status,
          heygenResponseBody: data
        }
      });
    }

    // Success response formatted as requested
    return res.status(200).json({
      success: true,
      token: data.data.token,
      avatarId,
      voiceId,
      detectedAppUrl: appUrl,
      debug
    });

  } catch (error: any) {
    console.error("[api/heygen-token] Internal Server Error:", error);
    const appUrl =
      process.env.APP_URL ||
      process.env.VITE_APP_URL ||
      req.headers.origin ||
      (req.headers.host ? `https://${req.headers.host}` : "Unknown Domain");

    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error occurred while retrieving token",
      detectedAppUrl: appUrl,
      apiKeyFound: !!process.env.HEYGEN_API_KEY,
      avatarIdFound: !!(process.env.HEYGEN_AVATAR_ID || process.env.VITE_HEYGEN_AVATAR_ID),
      voiceIdFound: !!(process.env.HEYGEN_VOICE_ID || process.env.VITE_HEYGEN_VOICE_ID),
      isProduction: process.env.NODE_ENV === "production",
      debug: {
        apiKeyFound: !!process.env.HEYGEN_API_KEY,
        avatarIdFound: !!(process.env.HEYGEN_AVATAR_ID || process.env.VITE_HEYGEN_AVATAR_ID),
        voiceIdFound: !!(process.env.HEYGEN_VOICE_ID || process.env.VITE_HEYGEN_VOICE_ID),
        detectedAppUrl: appUrl,
        appUrl: appUrl
      }
    });
  }
}
