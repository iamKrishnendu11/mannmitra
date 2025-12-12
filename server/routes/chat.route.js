
import express from "express";
import { handleChat } from "../controllers/chat.controller.js";

const router = express.Router();

// POST /api/chat
// Body: { messages: [{ role: 'user'|'assistant'|'system', content: '...' }, ...] }
router.post("/", handleChat);

export default router;
