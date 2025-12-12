// backend/controllers/chat.controller.js
import { generateWithGemini, __getCachedModel } from "../utils/gemini.js";

/**
 * POST /api/chat
 * body: { messages: [{ role: 'user'|'assistant'|'system', content: '...' }, ...] }
 *
 * Returns: { reply: string }
 */
export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "invalid_request", message: "messages array required" });
    }

    // Validate structure quickly
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || typeof m.role !== "string") {
        return res.status(400).json({ error: "invalid_request", message: "each message must have role and content strings" });
      }
    }

    // Strong system prompt tailored to mental-health companion
    const systemPrompt = `
You are MannMitra — a compassionate, concise mental health companion. Be empathetic, non-judgmental and calm.
Answer in 2-4 short sentences. If the user expresses self-harm, suicide, or imminent danger, respond with a safety-first script:
- acknowledge feelings,
- provide immediate crisis resources (e.g., local emergency services or suicide/crisis hotlines),
- advise to contact trusted person or emergency services now.
Do NOT provide medical diagnosis. Encourage professional help when appropriate.
`.trim();

    // Keep a short context window
    const recent = messages.slice(-12);
    const modelMessages = [
      { role: "system", content: systemPrompt },
      ...recent.map(m => ({ role: m.role, content: m.content }))
    ];

    // Call the model wrapper
    const modelResult = await generateWithGemini(modelMessages);

    // debug logs to help correlate failures (server-only)
    try {
      console.log("[Chat] cachedModel:", __getCachedModel?.() || null);
      console.log("[Chat] modelResult type:", typeof modelResult);
      console.log("[Chat] modelResult preview:", (typeof modelResult === "string") ? modelResult.slice(0,200) : JSON.stringify(modelResult).slice(0,200));
    } catch (e) {
      // ignore logging errors
    }

    // Normalise different return shapes:
    // Accept string, { content: string }, or { reply: string }
    let replyText = null;
    if (typeof modelResult === "string") replyText = modelResult;
    else if (modelResult && typeof modelResult === "object") {
      replyText = modelResult.content || modelResult.reply || modelResult.text || null;
      // Some wrappers return nested message arrays:
      if (!replyText && Array.isArray(modelResult.messages) && modelResult.messages.length) {
        replyText = modelResult.messages[modelResult.messages.length - 1].content || null;
      }
    }

    // If model did not return text, use a moderate server-side fallback
    if (!replyText || typeof replyText !== "string") {
      // Attempt a rule-based empathetic fallback using last user text
      const lastUser = [...recent].reverse().find(m => m.role === "user")?.content || "";
      const lower = lastUser.toLowerCase();
      let safeFallback = "Thanks for sharing — I hear you. Tell me more if you like.";

      if (/\b(suicide|kill myself|end my life|i cant go on|want to die|hurting myself)\b/i.test(lower)) {
        safeFallback = "I'm really sorry you're feeling this way. If you're thinking about harming yourself, please contact your local emergency services or a crisis hotline right now. If you can, reach out to someone you trust — you don't have to go through this alone.";
      } else if (/\b(sad|depress|anxious|hopeless|lonely)\b/i.test(lower)) {
        safeFallback = "I'm sorry you're feeling that way. Would you like to tell me what happened or how long you've been feeling like this?";
      }

      // include server log hint (not sent to client) — still return just the fallback text
      console.log("[Chat] Returning server-side fallback to user");
      return res.json({ reply: safeFallback });
    }

    // Trim and return
    replyText = replyText.trim();
    return res.json({ reply: replyText });
  } catch (err) {
    console.error("Chat controller error:", err);
    // Helpful error message so client can differentiate server vs fallback
    return res.status(500).json({
      error: "server_error",
      message: "Chat service failed. Please try again.",
      details: err?.message || String(err)
    });
  }
};

export default handleChat;
