import { Router } from "express";
import { inspect } from "../controllers/inspect.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(inspect));

export default router;
