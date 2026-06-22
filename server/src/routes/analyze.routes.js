import { Router } from "express";
import { analyze } from "../controllers/analyze.controller.js";
import { validateAnalyze } from "../middleware/validateAnalyze.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/", validateAnalyze, asyncHandler(analyze));

export default router;
