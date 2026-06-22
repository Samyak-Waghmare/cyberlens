import dotenv from "dotenv";

dotenv.config();

/**
 * Centralised, validated runtime configuration.
 * Import this anywhere instead of reading process.env directly.
 */
export const config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  isServerless: process.env.VERCEL === "1",

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "gemini-2.5-flash",
    maxTokens: 4096,
  },

  virustotal: {
    apiKey: process.env.VIRUSTOTAL_API_KEY || "",
    baseUrl: "https://www.virustotal.com/api/v3",
    maxUrlsPerScan: 4,
  },

  safebrowsing: {
    apiKey: process.env.SAFEBROWSING_API_KEY || "",
  },

  urlscan: {
    apiKey: process.env.URLSCAN_API_KEY || "",
  },

  abuseipdb: {
    apiKey: process.env.ABUSEIPDB_API_KEY || "",
  },
};

export const hasGeminiKey = () => Boolean(config.gemini.apiKey);
export const hasVirusTotalKey = () => Boolean(config.virustotal.apiKey);
