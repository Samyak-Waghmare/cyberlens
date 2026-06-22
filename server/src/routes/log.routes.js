import { Router } from "express";
import { analyzeLog } from "../controllers/log.controller.js";

const router = Router();

router.post("/", analyzeLog);

export default router;
