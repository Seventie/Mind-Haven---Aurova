/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";

/* --------------------------------
   Create client (BACKEND ONLY)
--------------------------------- */
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY as string,
});

/* --------------------------------
   Mood Analysis (Structured JSON)
--------------------------------- */
export const analyzeMood = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze the emotional state of this journal entry.
Be empathetic, positive, and clinically grounded (non-diagnostic).
Extract specific patterns to provide professional insights and reframing.

Journal entry:
"${content}"
              `,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            summary: { type: Type.STRING },
            score: { type: Type.NUMBER },
            clinicalInsight: { type: Type.STRING },
            positiveReframing: { type: Type.STRING },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ["mood", "summary", "score", "clinicalInsight", "positiveReframing", "suggestions"],
        },
      },
    });

    return JSON.parse(response.text ?? "{}");
  } catch (err) {
    console.error("analyzeMood error:", err);
    return {
      mood: "Thoughtful",
      summary: "Thank you for sharing your thoughts.",
      score: 5,
      clinicalInsight: "You are showing self-awareness by reflecting on your experiences.",
      positiveReframing: "Even in challenging times, your ability to articulate your feelings is a strength.",
      suggestions: ["Take a deep breath", "Go for a short walk", "Hydrate yourself"]
    };
  }
};

/* --------------------------------
   Empathetic Chat
--------------------------------- */
export const getEmpatheticChatResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
) => {
  try {
    // ✅ Prevent token blow-up
    const safeHistory = history.slice(-6);

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: safeHistory,
      config: {
        systemInstruction: `
You are TENA, an empathetic mental health AI assistant for women and youth.
You are supportive, non-judgmental, calm, and a good listener.
Always prioritize safety.
If the user expresses self-harm or distress, gently encourage reaching out to trusted people or local helplines.
Keep responses concise, warm, and reassuring.
        `.trim(),
      },
    });

    const result = await chat.sendMessage({ message });

    return result.text ?? "I’m here with you. Please continue.";
  } catch (err) {
    console.error("chat error:", err);
    return "I’m here with you. Something went wrong, but you’re not alone.";
  }
};
