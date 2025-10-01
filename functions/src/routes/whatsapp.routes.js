import { Router } from "express";

import { postWebhook, getWebhook } from "../controllers/whatsapp.controllers.js";

const router = Router();

router.post("/webhook", postWebhook);

router.get("/webhook", getWebhook);

export default router;
