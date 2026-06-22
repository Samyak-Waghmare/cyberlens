import { hasGeminiKey, hasVirusTotalKey } from "../config/env.js";

/** GET /api/health — liveness + key-configuration status. */
export function health(req, res) {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      gemini: hasGeminiKey() ? "configured" : "missing",
      virustotal: hasVirusTotalKey() ? "configured" : "missing",
    },
  });
}
