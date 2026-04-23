// Replace with your actual Gemini API key
// For GitHub, NEVER commit your real key — use an input field or env variable
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

const SYSTEM_CONTEXT = `You are an expert Election Guide for India, created to help citizens understand the Indian election process. You work for a civic education platform.

Your knowledge covers:
- ECI (Election Commission of India) processes and rules
- Voter registration via NVSP (nvsp.in), Form 6, Form 6A, Form 8
- EPIC card (Elector Photo Identity Card) — how to get it, e-EPIC download
- Model Code of Conduct (MCC)
- EVM (Electronic Voting Machine) and VVPAT
- NOTA (None of the Above)
- Candidate nomination and withdrawal process
- Polling day procedures
- Counting and result declaration
- Lok Sabha vs Rajya Sabha vs State Assembly elections
- Voter Helpline: 1950
- BLO (Booth Level Officer) role
- First-past-the-post system used in India

Rules:
- Answer ONLY election and voting related questions
- Be simple, clear and friendly — explain for a first-time voter
- If the user writes in Hindi, respond in Hindi
- Keep answers concise but complete — use numbered lists when steps are involved
- If unsure, say so and direct them to voters.eci.gov.in or helpline 1950
- Do not answer questions unrelated to elections`;

export async function askGemini(userMessage, conversationHistory = []) {
  const messages = [
    ...conversationHistory,
    { role: "user", parts: [{ text: userMessage }] }
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_CONTEXT }] },
        contents: messages,
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 600,
        }
      })
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || "API error");
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I could not get a response. Please try again.";
}
