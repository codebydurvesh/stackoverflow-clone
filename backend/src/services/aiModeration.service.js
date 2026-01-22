import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const moderateQuestion = async ({ title, description }) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a strict moderator for a Stack Overflow like website.

Check the following question and decide if it should be ALLOWED or BLOCKED.

Rules:
- Must be related to programming, software, computers, or technology
- Must NOT be spam, nonsense, offensive, or random text
- Must NOT be personal chat or non-technical
- Must NOT be extremely low effort

Respond ONLY in JSON format like this:
{
  "decision": "ALLOW" or "BLOCK",
  "reason": "short reason"
}

Question:
Title: "${title}"
Description: "${description}"
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    //  if AI responds incorrectly => block
    return {
      decision: "BLOCK",
      reason: "AI moderation failed",
    };
  }

  return parsed;
};
