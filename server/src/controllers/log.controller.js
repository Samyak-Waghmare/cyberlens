import { analyzeServerLogs } from "../services/geminiLog.service.js";

export const analyzeLog = async (req, res, next) => {
  try {
    const { logs } = req.body;

    if (!logs || typeof logs !== "string") {
      return res.status(400).json({ error: "No log data provided" });
    }

    // Truncate to ~50KB or ~500 lines to prevent context window blowout
    // A typical log line is ~100-200 bytes. 50,000 chars is plenty for AI to detect patterns.
    const truncatedLogs = logs.slice(0, 50000);

    const result = await analyzeServerLogs(truncatedLogs);

    return res.json(result);
  } catch (err) {
    next(err);
  }
};
