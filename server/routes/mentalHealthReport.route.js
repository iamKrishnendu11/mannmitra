
// routes/mentalhealthreport.route.js
import express from "express";
import {
  getQuestions,
  submitAssessment,
  listReports
} from "../controllers/mentalHealthReport.controller.js";

const router = express.Router();
router.get("/questions", getQuestions);
router.post("/submit", submitAssessment);
router.get("/reports", listReports);

export default router;
