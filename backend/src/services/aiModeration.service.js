import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const moderateQuestion = async ({ title, description }) => {
  const prompt = `
IMPORTANT:
You must respond with ONLY valid JSON.
Do NOT include explanations, markdown, or extra text.

You are a strict moderator for a Stack Overflow like website.

Rules:
- Must be related to programming, software, computers, or technology
- Must NOT be spam, nonsense, offensive, or random text
- Must NOT be personal chat or non-technical
- Must NOT be extremely low effort

Respond in EXACTLY this JSON format:
{
  "decision": "ALLOW" | "BLOCK",
  "reason": "short reason"
}

Question:
Title: "${title}"
Description: "${description}"
`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0,
      },
    });

    const text = result.text.trim();

    // Safe JSON extraction
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return {
        decision: "BLOCK",
        reason: "AI returned invalid format",
      };
    }

    return JSON.parse(match[0]);
  } catch (error) {
    console.error("AI Moderation Error:", error);
    return {
      decision: "BLOCK",
      reason: "AI moderation failed",
    };
  }
};
