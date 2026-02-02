const { GoogleGenAI } = require("@google/genai");

let genAI;

function init() {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing from environment variables");
        }
        genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
    }
}

/**
 * Classifies the risk level of a message.
 */
exports.classifyRisk = async (text) => {
    try {
        init();
        const prompt = `
            Analyze the following message for mental health risk.
            Message: "${text}"

            Determine if it contains:
            1. No risk (safe)
            2. High emotional distress (emotional_distress)
            3. Intent or thoughts of self-harm (self_harm_risk)
            4. Suicide intent or ideation (suicide_risk)

            Respond ONLY with one of these words: safe, emotional_distress, self_harm_risk, suicide_risk.
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });
        const responseText = result.text.trim().toLowerCase();

        const validRisks = ['safe', 'emotional_distress', 'self_harm_risk', 'suicide_risk'];
        return validRisks.includes(responseText) ? responseText : 'safe';
    } catch (error) {
        console.error("Risk classification error:", error);
        return 'safe';
    }
};

const axios = require('axios');
const EMBEDDING_SERVICE_URL = 'http://localhost:5001/embed';

/**
 * Generates an embedding for a piece of text using local Python service.
 */
exports.generateEmbedding = async (text) => {
    try {
        const response = await axios.post(EMBEDDING_SERVICE_URL, {
            text: text
        }, {
            timeout: 2000 // Shorten timeout to 2s
        });

        return response.data.embedding;
    } catch (error) {
        // Log sparingly
        if (error.code === 'ECONNREFUSED') {
            // Keep it silent to avoid log spam, returning null skips memory gracefully
        } else {
            console.error("Embedding error:", error.message);
        }
        return null;
    }
};

/**
 * Calculates cosine similarity between two vectors.
 */
exports.cosineSimilarity = (vecA, vecB) => {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Decides if a message should be stored as a long-term memory.
 */
exports.shouldExtractMemory = async (text) => {
    try {
        init();
        const prompt = `
            Determine if the following message contains important personal context, preferences, or recurring themes that should be remembered for long-term support.
            Message: "${text}"

            If yes, respond with a JSON object like:
            {"shouldRemember": true, "memoryType": "emotion|recurring_theme|preference|life_context", "summary": "brief factual summary"}
            If no, respond with:
            {"shouldRemember": false}
        `;

        const result = await genAI.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const responseText = result.text;

        // Basic JSON extraction if not pure
        const jsonMatch = responseText.match(/\{.*\}/s);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : { shouldRemember: false };
    } catch (error) {
        console.error("Memory extraction error:", error);
        return { shouldRemember: false };
    }
};
