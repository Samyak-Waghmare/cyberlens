import { Router } from "express";
import { scanContract } from "../controllers/web3.controller.js";

const router = Router();

router.post("/scan", scanContract);

export default router;
