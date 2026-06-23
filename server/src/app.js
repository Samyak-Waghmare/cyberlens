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

export function createApp() {
  const app = express();

  app.use(helmet());

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

