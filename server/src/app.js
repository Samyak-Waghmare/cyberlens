import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import apiRoutes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: "Too many requests, please try again later." }
});

const validateRequest = (req, res, next) => {
  // Very basic validation to prevent payload bombs before reaching Gemini/VirusTotal
  if (req.body && req.body.input) {
    if (typeof req.body.input !== 'string') {
      return res.status(400).json({ error: "Input must be a string." });
    }
    if (req.body.input.length > 50000) { // Limit to 50k characters
      return res.status(400).json({ error: "Payload too large. Please limit input size." });
    }
    req.validatedInput = req.body.input.trim();
  }
  next();
};

/**
 * Build and configure the Express application.
 * Kept free of side effects (no listen) so it can be imported by both the
 * local dev server and the Vercel serverless handler.
 */
export function createApp() {
  const app = express();
  
  // Hardened Security Headers via Helmet
  app.use(helmet());
  
  // Rate limiting to protect API quotas
  app.use(limiter);

  app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }));
  app.use(express.json({ limit: "1mb" }));
  app.use(validateRequest);

  app.get("/", (req, res) => {
    res.json({ status: "ok", message: "CyberLens API Gateway is running" });
  });

  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

