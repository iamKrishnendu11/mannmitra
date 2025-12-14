// utils/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("[Gemini] API Key Loaded:", apiKey ? "✅ Yes" : "❌ No (Check .env file)");

let client = null;
if (apiKey) {
  client = new GoogleGenerativeAI(apiKey);
}

let cachedModel = null;
const CANDIDATE_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-2.5-flash",
  "gemini-2.1",
  "gemini-1.5-flash",
  "text-bison-001"
];

async function retry(fn, retries = 5, delay = 300, maxDelay = 2000) {
  try {
    return await fn();
  } catch (err) {
    // Do not retry on auth errors
    if (err?.status === 401 || err?.status === 403) throw err;

    if (retries <= 0) throw err;
    console.warn(`[Gemini] transient error — retrying in ${delay}ms (${retries} left):`, err?.status ?? err?.message ?? err);
    await new Promise(res => setTimeout(res, delay));
    const nextDelay = Math.min(delay * 2, maxDelay);
    return retry(fn, retries - 1, nextDelay, maxDelay);
  }
}

async function probeModel(modelId) {
  if (!client) return false;
  try {
    const model = client.getGenerativeModel({ model: modelId });
    const result = await model.generateContent("Ping: reply 'ok' as a single word.");
    const response = await result.response;
    const text = (typeof response.text === "function") ? response.text() : (response.text || "");
    const t = (text || "").toString().trim().toLowerCase();
    if (t.length > 0) {
      console.log(`[Gemini] probe success for model=${modelId} -> "${t.slice(0,60)}"`);
      return true;
    }
    console.warn(`[Gemini] probe returned empty for ${modelId}`);
    return false;
  } catch (err) {
    console.warn(`[Gemini] probe failed for ${modelId}:`, err?.status ?? err?.message ?? err);
    return false;
  }
}

async function findWorkingModel() {
  if (!client) return null;
  if (cachedModel) return cachedModel;

  for (const m of CANDIDATE_MODELS) {
    const ok = await probeModel(m);
    if (ok) {
      cachedModel = m;
      console.log("[Gemini] Selected working model:", cachedModel);
      return cachedModel;
    }
  }

  console.error("[Gemini] No candidate models worked. Check API key, project access, or update candidate list.");
  return null;
}

// Attempt to switch to another candidate model (used when current model returns 429/503)
async function switchToAnotherModel(current) {
  for (const m of CANDIDATE_MODELS) {
    if (m === current) continue;
    try {
      const ok = await probeModel(m);
      if (ok) {
        cachedModel = m;
        console.log("[Gemini] Switched to fallback model:", m);
        return m;
      }
    } catch (e) {
    }
  }
  cachedModel = null;
  return null;
}
export async function generateWithGemini(messages) {
  if (!client) {
    console.error("[Gemini] Error: Client not initialized. Missing API Key.");
    return "I am unable to connect to the AI service right now. Please contact support.";
  }

  // Ensure we have a working model
  let modelId = await findWorkingModel();
  if (!modelId) {
    return "I am having trouble processing that right now. Could you ask me something else?";
  }

  const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n") + "\nAssistant:";

  try {
    const model = client.getGenerativeModel({ model: modelId });
    const result = await retry(() => model.generateContent(prompt), 5, 300);
    const response = await result.response;

    if (response) {
      const text = (typeof response.text === "function") ? response.text() : (response.text || "");
      return text.toString();
    }

    throw new Error("Empty response from model");
  } catch (err) {
    console.error("[Gemini] Generation Error:", err);

    if (err?.status === 429 || err?.status === 503 || (err?.message && /rate limit|overload|overloaded|service unavailable/i.test(err.message))) {
      console.warn("[Gemini] Rate-limited/overloaded. Attempting to switch to another candidate model...");
      const fallback = await switchToAnotherModel(modelId);
      if (fallback) {
        try {
          const fallbackModel = client.getGenerativeModel({ model: fallback });
          const result2 = await retry(() => fallbackModel.generateContent(
            messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n") + "\nAssistant:"
          ), 3, 400);
          const response2 = await result2.response;
          const text2 = (typeof response2.text === "function") ? response2.text() : (response2.text || "");
          return text2.toString();
        } catch (err2) {
          console.error("[Gemini] Fallback generation also failed:", err2);
          cachedModel = null;
        }
      } else {
        console.warn("[Gemini] No fallback model available or probe failed.");
      }
    }


    if (err?.status === 401 || err?.status === 403) {
      console.error("[Gemini] Authorization error. Check GEMINI_API_KEY and project permissions.");
      return "I am having trouble processing that right now. Could you ask me something else?";
    }

    if (err?.status === 404 || (err?.message && /not found|is not found|not supported/i.test(err.message))) {
      console.warn("[Gemini] Cached model appears unsupported. Clearing cache to re-probe on next request.");
      cachedModel = null;
    }

    return "I am having trouble processing that right now. Could you ask me something else?";
  }
}

export function __getCachedModel() {
  return cachedModel;
}

export default generateWithGemini;
