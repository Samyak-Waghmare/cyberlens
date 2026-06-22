import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, hasGeminiKey } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { parseJsonFromText } from "../utils/parseJson.js";

let model = null;

/** Lazily construct a single Gemini model client. */
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
        // Ask Gemini to return strict JSON directly.
        responseMimeType: "application/json",
        maxOutputTokens: config.gemini.maxTokens,
        temperature: 0.4,
        // Disable "thinking" so reasoning tokens don't consume the output
        // budget and truncate the JSON (gemini-2.5-flash thinks by default).
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
  }
  return model;
}

/**
 * Send a prompt to Gemini and return the parsed JSON object it produces.
 */
export async function analyzeWithGemini(prompt) {
  const gemini = getModel();

  let text;
  try {
    const result = await gemini.generateContent(prompt);
    text = result.response.text();
  } catch (err) {
    throw ApiError.badGateway("AI analysis failed.", { detail: err.message });
  }

  try {
    return parseJsonFromText(text);
  } catch (err) {
    throw ApiError.badGateway("Could not parse the AI response.", {
      detail: err.message,
    });
  }
}

/**
 * Ask a follow-up question based on the analysis context.
 * Returns plain text.
 */
export async function chatWithAnalysis(context, question) {
  if (!hasGeminiKey()) {
    throw ApiError.internal("GEMINI_API_KEY is not configured.");
  }
  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  const chatModel = genAI.getGenerativeModel({
    model: config.gemini.model,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });

  const prompt = `You are CyberLens, a cybersecurity AI.
The user previously scanned a suspicious input and received this analysis:
${JSON.stringify(context, null, 2)}

The user now has a follow-up question:
"${question}"

Provide a concise, helpful, and strictly text-based answer (no JSON). Do not hallucinate data not in the context.`;

  try {
    const result = await chatModel.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    throw ApiError.badGateway("Chat failed.", { detail: err.message });
  }
}
