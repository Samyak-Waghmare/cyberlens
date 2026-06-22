import { VERDICTS } from "../constants/index.js";
import { extractUrls } from "../utils/url.js";
import { ApiError } from "../utils/ApiError.js";
import { scanUrls } from "./virustotal.service.js";
import { analyzeWithGemini } from "./gemini.service.js";
import { buildAnalysisPrompt } from "./prompt.js";
import { checkSafeBrowsing, checkUrlScan, checkAbuseIPDB } from "./additionalApis.service.js";

/** Coerce the raw AI JSON into a safe, predictable shape. */
function normalize(ai, vtSummary) {
  return {
    verdict: VERDICTS.includes(ai.verdict) ? ai.verdict : "SUSPICIOUS",
    score: Math.max(0, Math.min(100, Number(ai.score) || 0)),
    summary: ai.summary || "Analysis complete.",
    explanation: ai.explanation || "",
    red_flags: Array.isArray(ai.red_flags) ? ai.red_flags : [],
    signals: Array.isArray(ai.signals) ? ai.signals : [],
    recommendation: Array.isArray(ai.recommendation) ? ai.recommendation : [],
    virustotal: vtSummary,
    additional_apis: ai.additional_apis || {},
  };
}

/**
 * Full analysis pipeline:
 *   1. extract URLs
 *   2. scan them with VirusTotal (best effort)
 *   3. ask Claude to analyze input + VT findings
 *   4. merge and normalize the result
 */
export async function analyzeContent(input) {
  const urls = extractUrls(input);
  const [vtSummary, safeBrowsing, urlScan, abuseIp] = await Promise.all([
    scanUrls(urls),
    checkSafeBrowsing(urls),
    checkUrlScan(urls),
    checkAbuseIPDB(urls)
  ]);

  const additionalApis = {
    safebrowsing: safeBrowsing,
    urlscan: urlScan,
    abuseipdb: abuseIp
  };

  try {
    const prompt = buildAnalysisPrompt(input, vtSummary);
    const ai = await analyzeWithGemini(prompt);
    const normalized = normalize(ai, vtSummary);
    normalized.additional_apis = additionalApis;
    return normalized;
  } catch (err) {
    // Surface VirusTotal data even when the AI step fails.
    if (err instanceof ApiError) {
      err.payload = { ...(err.payload || {}), virustotal: vtSummary };
    }
    throw err;
  }
}
