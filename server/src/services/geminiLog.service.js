import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, hasGeminiKey } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { parseJsonFromText } from "../utils/parseJson.js";

let model = null;

function getModel() {
  if (!hasGeminiKey()) {
    throw ApiError.internal(
      "GEMINI_API_KEY is not configured on the server. Add it to your .env file."
    );
  }
  if (!model) {
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    model = genAI.getGenerativeModel({
      model: config.gemini.model,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1, // Low temp for analytical consistency
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
  }
  return model;
}

export async function analyzeServerLogs(logData) {
  const prompt = `You are an elite SIEM/SOC Analyst and Incident Responder.
Analyze the following raw server/firewall/application logs and identify any cybersecurity threats, attacks, or anomalies.

If the logs are benign or just normal traffic, classify as "Safe".
If there are attacks (e.g., SQLi, XSS, Brute Force, Path Traversal, DDoS, bot scanners), classify them.

Provide your analysis EXACTLY as a JSON object matching this schema, with no markdown block formatting:
{
  "severity": "Safe" | "Low" | "Medium" | "High" | "Critical",
  "summary": "A 1-2 sentence plain-English summary of what is happening in the logs.",
  "threats": [
    {
      "name": "Name of the attack (e.g., SQL Injection)",
      "description": "Brief explanation of what the attacker is trying to do",
      "indicators": ["List of IPs, payloads, or user-agents involved"]
    }
  ],
  "remediation": [
    "Actionable step 1 to mitigate this",
    "Actionable step 2..."
  ]
}

Here are the logs:
${logData}
`;

  const gemini = getModel();

  try {
    const result = await gemini.generateContent(prompt);
    const text = result.response.text();
    return parseJsonFromText(text);
  } catch (err) {
    throw ApiError.badGateway("Failed to analyze logs with AI.", { detail: err.message });
  }
}
