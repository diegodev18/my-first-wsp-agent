import { Router } from "express";

import { webhook } from "../controllers/whatsapp.controllers.js";

const router = Router();

router.post("/webhook", webhook);

export default router;
