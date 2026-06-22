import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { securityHeaders } from "./middleware/securityHeaders.js";

/**
 * Build and configure the Express application.
 * Kept free of side effects (no listen) so it can be imported by both the
 * local dev server and the Vercel serverless handler.
 */
export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  app.use(securityHeaders);
  app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }));
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

