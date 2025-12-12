// backend/models/MentalHealthReport.js
import mongoose from "mongoose";

const MentalHealthReportSchema = new mongoose.Schema({
  stress_level: {
    type: String,
    enum: ["low", "moderate", "high", "severe"],
    required: true,
  },
  anxiety_score: { type: Number },
  depression_score: { type: Number },
  wellbeing_score: { type: Number },
  responses: { type: Object }, // store question indexes -> chosen option info
  recommendations: [String],
  report_date: { type: String, required: true }, // YYYY-MM-DD
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MentalHealthReport ||
  mongoose.model("MentalHealthReport", MentalHealthReportSchema);

