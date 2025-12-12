// controllers/mentalHealthReport.controller.js

import MentalHealthReport from "../models/mentalHealthReport.model.js";
import { getRecommendations } from "../utils/recommendation.js";

//
// ──────────────────────────────────────────────────────────────
//   QUESTIONS (STATIC)
// ──────────────────────────────────────────────────────────────
//
const QUESTIONS = [
  {
    question: "How often have you felt nervous or anxious in the past 2 weeks?",
    category: "anxiety",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    question: "How often have you felt down, depressed, or hopeless?",
    category: "depression",
    options: ["Not at all", "Several days", "More than half the days", "Nearly every day"],
  },
  {
    question: "How would you rate your current stress level?",
    category: "stress",
    options: ["Very low", "Low", "Moderate", "High", "Very high"],
  },
  {
    question: "How well have you been sleeping recently?",
    category: "wellbeing",
    options: ["Very well", "Well", "Poorly", "Very poorly"],
  },
  {
    question: "Do you feel overwhelmed by daily responsibilities?",
    category: "stress",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    question: "How satisfied are you with your relationships?",
    category: "wellbeing",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
  },
  {
    question: "Have you lost interest in activities you usually enjoy?",
    category: "depression",
    options: ["Not at all", "A little", "Somewhat", "Very much"],
  },
  {
    question: "How often do you engage in self-care activities?",
    category: "wellbeing",
    options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
  },
];

//
// ──────────────────────────────────────────────────────────────
//   HELPERS
// ──────────────────────────────────────────────────────────────
//

const normalizeScore = (optionIndex, optionsLength) => {
  if (optionsLength <= 1) return 0;
  return (optionIndex / (optionsLength - 1)) * 10;
};

export const getQuestions = (req, res) => {
  res.json({ questions: QUESTIONS });
};

//
// ──────────────────────────────────────────────────────────────
//   SUBMIT ASSESSMENT — MAIN CONTROLLER
// ──────────────────────────────────────────────────────────────
//
export const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "answers array required" });
    }

    // -------------------------
    // Build Scored Answers
    // -------------------------
    const finalAnswers = {};

    answers.forEach((ans) => {
      const q = QUESTIONS[ans.questionIndex];
      if (q) {
        const score = normalizeScore(ans.optionIndex, q.options.length);

        finalAnswers[ans.questionIndex] = {
          category: q.category,
          optionIndex: ans.optionIndex,
          optionText: q.options[ans.optionIndex],
          score,
        };
      }
    });

    const filter = (cat) =>
      Object.values(finalAnswers).filter((a) => a.category === cat);

    const mean = (arr) =>
      arr.length ? arr.reduce((sum, a) => sum + a.score, 0) / arr.length : 0;

    const anxietyScore = mean(filter("anxiety"));
    const depressionScore = mean(filter("depression"));
    const stressScore = mean(filter("stress"));
    const wellbeingScore = mean(filter("wellbeing"));

    const avg = (anxietyScore + depressionScore + stressScore) / 3;

    let stress_level =
      avg < 3 ? "low" : avg < 5 ? "moderate" : avg < 7 ? "high" : "severe";

    console.log("[ASSESSMENT] Scores:", {
      anxietyScore,
      depressionScore,
      stressScore,
      wellbeingScore,
      stress_level,
    });

    //
    // ───────────────────────────────────────────
    //   GET RECOMMENDATIONS (GEMINI)
    // ───────────────────────────────────────────
    //
    let recommendations = [];

    try {
      recommendations = await getRecommendations({
        anxietyScore,
        depressionScore,
        stressScore,
        wellbeingScore,
        stressLevel: stress_level,
      });

      if (!Array.isArray(recommendations) || recommendations.length === 0) {
        throw new Error("LLM returned empty recommendations");
      }
    } catch (err) {
      console.error("[recommendation ERROR]", err.message);
      recommendations = [
        "Take a few slow deep breaths to calm your body.",
        "Try writing down what’s troubling you — it can bring clarity.",
        "Talk to someone you trust today, even briefly.",
        "Take a 10-minute walk to reset your mood.",
        "Reduce screen time before sleep for better rest.",
      ];
    }

    //
    // ───────────────────────────────────────────
    //   BUILD FINAL REPORT OBJECT
    // ───────────────────────────────────────────
    //

    const reportData = {
      stress_level,
      anxiety_score: +anxietyScore.toFixed(1),
      depression_score: +depressionScore.toFixed(1),
      wellbeing_score: +wellbeingScore.toFixed(1),
      responses: finalAnswers,
      recommendations,
      report_date: new Date().toISOString().split("T")[0],
    };

    //
    // ───────────────────────────────────────────
    //   SAVE (Mongo OR memory mode)
    // ───────────────────────────────────────────
    //
    let saved;

    if (process.env.USE_IN_MEMORY_DB === "true") {
      global.__REPORT_DB = global.__REPORT_DB || [];
      const id = "mem_" + Date.now();
      saved = { id, ...reportData };
      global.__REPORT_DB.push(saved);
    } else {
      saved = await MentalHealthReport.create(reportData);
    }

    return res.json({ success: true, report: saved });
  } catch (err) {
    console.error("[SUBMIT ERROR]", err);
    return res.status(500).json({
      error: "Failed to generate report",
      message: err.message,
    });
  }
};

//
// ──────────────────────────────────────────────────────────────
//   LIST REPORTS
// ──────────────────────────────────────────────────────────────
//
export const listReports = async (req, res) => {
  try {
    if (process.env.USE_IN_MEMORY_DB === "true") {
      global.__REPORT_DB = global.__REPORT_DB || [];
      return res.json(global.__REPORT_DB);
    }

    const reports = await MentalHealthReport.find().sort({ createdAt: -1 });
    return res.json(reports);
  } catch (err) {
    console.error("[LIST REPORTS ERROR]", err);
    res.status(500).json({ error: "Error fetching reports" });
  }
};
