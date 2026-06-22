import { chatWithAnalysis } from "../services/gemini.service.js";
import { ApiError } from "../utils/ApiError.js";

export async function chat(req, res) {
  const { context, question } = req.body;
  if (!context || !question) {
    throw ApiError.badRequest("Context and question are required.");
  }
  const answer = await chatWithAnalysis(context, question);
  res.json({ answer });
}
