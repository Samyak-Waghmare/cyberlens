import { ApiError } from "../utils/ApiError.js";

/** 404 handler for unknown routes. */
export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
}

/** Centralised error renderer — always returns clean JSON. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    const body = { error: err.message, ...(err.payload || {}) };
    return res.status(err.statusCode).json(body);
  }

  // Silently handle error in production
  res.status(500).json({ error: "Internal server error", detail: err.message });
}
