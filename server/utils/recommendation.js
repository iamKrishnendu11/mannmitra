// utils/recommendation.js
import { generateWithGemini } from "./gemini.js";

/**
 * getRecommendations({ anxietyScore, depressionScore, stressScore, wellbeingScore, stressLevel })
 * Returns an array of 4-6 recommendation strings.
 * Uses Gemini (via generateWithGemini). If Gemini fails or returns unusable output,
 * falls back to a deterministic set of suggestions.
 */
export async function getRecommendations({ anxietyScore = 0, depressionScore = 0, stressScore = 0, wellbeingScore = 0, stressLevel = 'moderate' }) {
  // Build a concise but explicit prompt (ask for JSON).
  const system = `You are MannMitra, a compassionate mental wellness assistant. Be empathetic, supportive, concise (2-3 sentences each). If a user is in crisis, include a clear safety recommendation. Output must be valid JSON with a single property "recommendations" which is an array of strings.`;

  const user = `
User assessment scores (0-10 scale):
- Anxiety: ${Number(anxietyScore).toFixed(1)}
- Depression: ${Number(depressionScore).toFixed(1)}
- Stress: ${Number(stressScore).toFixed(1)}
- Wellbeing: ${Number(wellbeingScore).toFixed(1)}
Overall level: ${stressLevel}

Provide 4-6 personalized, actionable recommendations to help this user improve their mental wellness.
Return ONLY a JSON object, for example:
{
  "recommendations": [
    "Recommendation 1 ...",
    "Recommendation 2 ..."
  ]
}
`;

  try {
    const reply = await generateWithGemini([{ role: "system", content: system }, { role: "user", content: user }]);
    if (!reply || typeof reply !== "string") throw new Error("Empty LLM reply");

    // try to extract JSON from the reply robustly
    let jsonText = reply.trim();

    // Some LLMs include code fences — remove them
    jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    // Attempt to find the first JSON object in the text
    const firstBrace = jsonText.indexOf("{");
    if (firstBrace > 0) {
      jsonText = jsonText.slice(firstBrace);
    }

    const parsed = JSON.parse(jsonText);
    if (parsed && Array.isArray(parsed.recommendations)) {
      return parsed.recommendations.map(String).slice(0, 10);
    }

    // If reply is a plain array or plain text, try some fallback parsing
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch (err) {
    console.warn("getRecommendations: LLM parsing failed or LLM error:", err?.message || err);
  }

  // Fallback deterministic recommendations (safe, helpful)
  const fallback = [
    "Try a short breathing exercise (4 in, hold 4, 6 out) for 3–5 minutes when you feel anxious.",
    "Keep a brief daily mood log — write one sentence about how you feel and one small positive thing that happened.",
    "If sleep is poor, reduce screens 1 hour before bed; try a calming routine (warm shower, dim lights).",
    "Reach out to one supportive person and share how you feel — connection helps a lot.",
    "Try a short guided relaxation (8–12 minutes) or gentle yoga session 3 times this week."
  ];

  // Slightly tailor fallback to scores
  const tailored = [...fallback];
  if (Number(depressionScore) >= 6) {
    tailored.unshift("If you are feeling severely depressed or have thoughts of harming yourself, please contact local emergency services or a crisis hotline immediately.");
  }
  return tailored.slice(0, 6);
}

export default getRecommendations;
