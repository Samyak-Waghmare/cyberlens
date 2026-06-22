import { inspectWebsite } from "../services/inspect.service.js";

/** POST /api/inspect — scan a website's security headers and grade it. */
export async function inspect(req, res) {
  const url = (req.body?.url || "").toString();
  const result = await inspectWebsite(url);
  res.json(result);
}
