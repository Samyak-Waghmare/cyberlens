/**
 * Extract a JSON object from an LLM text response, tolerant of stray prose
 * or accidental ```json code fences.
 */
export function parseJsonFromText(text) {
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI response");
  }

  return JSON.parse(cleaned.slice(start, end + 1));
}
