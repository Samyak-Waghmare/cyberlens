import { analyzeContent } from "../services/analysis.service.js";

/** POST /api/analyze — run the full threat-analysis pipeline. */
export async function analyze(req, res) {
  const result = await analyzeContent(req.validatedInput);
  res.json(result);
}
