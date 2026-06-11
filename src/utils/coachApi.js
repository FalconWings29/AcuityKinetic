// Calls Google's Gemini API directly from the browser. The key is read from
// VITE_GEMINI_API_KEY at build time. NOTE: this exposes the key in the client
// bundle, fine for a local/demo build, but for production put it behind a proxy
// (see vite.config.js for the pattern previously used for Anthropic).
// flash-lite: 30 RPM on the free tier (2x regular flash) + lower latency, so the
// 2.5s capture cadence stays well under the limit and cues arrive faster.
const MODEL = import.meta.env.VITE_COACH_MODEL || 'gemini-2.5-flash-lite';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const REQUEST_TIMEOUT_MS = 8000;

const systemPrompt = (sport) => `You are an elite ${sport} coach analyzing a single frame from a live video feed of an athlete training.

Your job is to give ONE piece of concise, actionable coaching feedback based on what you can see in the image. Focus on body mechanics, posture, form, positioning, or technique, whichever matters most in this frame.

Rules:
- Maximum 1 sentence. 15 words or fewer.
- Be specific and direct, like a real coach would speak out loud.
- If the image is unclear, dark, or shows no athlete, respond only with: "Adjust your camera position."
- Do not use filler phrases like "Great job" or "Keep it up."
- Do not explain what you're doing. Just give the feedback.
- Use plain punctuation. Do not use em dashes.

Example outputs:
- "Drive your elbow in closer on the release."
- "Bend your knees more on landing."
- "Keep your back straight through the lift."
- "Weight is too far forward, shift back to your heels."`;

export async function getCoachingFeedback(base64Frame, sport) {
  if (!API_KEY) throw new Error('Missing VITE_GEMINI_API_KEY');

  // Abort a hung request so a dead socket can't silently freeze the capture
  // loop. An aborted fetch rejects, so the caller's retry path still fires.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Frame,
                  },
                },
                {
                  text: `Analyze this frame. I am training ${sport}. Give me one coaching cue.`,
                },
              ],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt(sport) }],
          },
          generationConfig: {
            // Gemini 2.5 Flash is a thinking model: without this, "thinking"
            // consumes the whole token budget and the response comes back with
            // no text. thinkingBudget: 0 disables it for fast, short cues.
            thinkingConfig: { thinkingBudget: 0 },
            maxOutputTokens: 80,
            temperature: 0.4,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error('Empty response');

    // Strip wrapping quotes the model may add around a short cue.
    return text.replace(/^["']|["']$/g, '');
  } finally {
    clearTimeout(timeout);
  }
}
