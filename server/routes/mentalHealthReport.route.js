
// routes/mentalhealthreport.route.js

import express from "express";
import {
  getQuestions,
  submitAssessment,
  listReports
} from "../controllers/mentalHealthReport.controller.js";

const router = express.Router();

// GET all questions
router.get("/questions", getQuestions);

// POST submit responses → generates full Gemini-powered report
router.post("/submit", submitAssessment);

// GET reports list
router.get("/reports", listReports);

export default router;
