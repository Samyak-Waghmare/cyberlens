import { Router } from "express";
import analyzeRoutes from "./analyze.routes.js";
import healthRoutes from "./health.routes.js";
import inspectRoutes from "./inspect.routes.js";
import logRoutes from "./log.routes.js";
import chatRoutes from "./chat.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/analyze", analyzeRoutes);
router.use("/inspect", inspectRoutes);
router.use("/analyze-log", logRoutes);
router.use("/chat", chatRoutes);

export default router;
