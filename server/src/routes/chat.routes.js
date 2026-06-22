import { Router } from "express";
import { chat } from "../controllers/chat.controller.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(chat));

export default router;
