const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const Memory = require('../models/Memory');
const SafetyEvent = require('../models/SafetyEvent');
const auth = require('../middleware/authMiddleware');
const aiService = require('../services/aiService');
const Journal = require('../models/Journal');
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

// @route   POST /api/chat
// @desc    Send a message and get a response
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { text, sessionId, frontendContext } = req.body;
        const userId = req.user.id;

        if (!text) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const client = new GoogleGenAI(process.env.GEMINI_API_KEY);
        // chatModel definition will be moved closer to context assembly

        const riskLevel = await aiService.classifyRisk(text);

        const userMsg = new ChatMessage({
            userId,
            role: 'user',
            content: text,
            sessionId,
            riskLevel
        });
        await userMsg.save();

        if (riskLevel === 'self_harm_risk' || riskLevel === 'suicide_risk') {
            const safetyEvent = new SafetyEvent({
                userId,
                messageId: userMsg._id,
                riskLevel
            });
            await safetyEvent.save();

            const safetyResponse = "I hear you, and I want you to know that you are not alone. It sounds like you're going through a very difficult time right now. Please consider reaching out to someone you trust, or a professional who can support you. You matter, and there is help available. Can we try a grounding exercise together, or would you like me to show you some resources nearby?";

            const botMsg = new ChatMessage({
                userId,
                role: 'model',
                content: safetyResponse,
                sessionId,
                riskLevel: 'safe'
            });
            await botMsg.save();

            return res.json({
                response: safetyResponse,
                riskLevel,
                isCrisis: true
            });
        }

        (async () => {
            try {
                const memoryDecision = await aiService.shouldExtractMemory(text);
                if (memoryDecision.shouldRemember) {
                    const embedding = await aiService.generateEmbedding(text);
                    if (embedding) {
                        const memory = new Memory({
                            userId,
                            embedding,
                            sourceText: text,
                            memoryType: memoryDecision.memoryType
                        });
                        await memory.save();
                    }
                }
            } catch (err) {
                console.error("Memory extraction error:", err);
            }
        })();

        const history = await ChatMessage.find({ userId, sessionId })
            .sort({ createdAt: -1 })
            .limit(10);

        const formattedHistory = history.reverse().map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const userEmbedding = await aiService.generateEmbedding(text);
        let memoryContext = "";

        if (userEmbedding) {
            const allMemories = await Memory.find({ userId });
            const relevantMemories = allMemories
                .map(m => ({
                    text: m.sourceText,
                    similarity: aiService.cosineSimilarity(userEmbedding, m.embedding)
                }))
                .filter(m => m.similarity > 0.7)
                .sort((a, b) => b.similarity - a.similarity)
                .slice(0, 3);

            if (relevantMemories.length > 0) {
                memoryContext = "Relevant Past Memories:\n" + relevantMemories.map(m => `- ${m.text}`).join("\n");
            }
        }

        // 5. Fetch Recent Journals for Context
        const recentJournals = await Journal.find({ userId }).sort({ createdAt: -1 }).limit(3);
        let journalContext = "";
        if (recentJournals.length > 0) {
            journalContext = "User's Recent Journal Reflections:\n" +
                recentJournals.map(j => `- [${j.aiAnalysis?.mood || 'Reflection'}] ${j.content.substring(0, 200)}...`).join("\n");
        }

        // Sanitize history: alternating user/model only
        let sanitizedHistory = [];
        let lastRole = null;
        for (const msg of formattedHistory.slice(0, -1)) {
            if (msg.role !== lastRole) {
                sanitizedHistory.push(msg);
                lastRole = msg.role;
            }
        }

        // Ensure first message is 'user' (Gemini requirement)
        while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== 'user') {
            sanitizedHistory.shift();
        }

        const chat = client.chats.create({
            model: "gemini-2.5-flash",
            history: sanitizedHistory,
            config: {
                systemInstruction: `
                    You are TENA, an empathetic mental health AI assistant.
                    Your goal is to provide deep, meaningful conversation similar to a professional therapist but with the warmth of a friend.
                    
                    CONTEXTUAL AWARENESS:
                    ${journalContext ? `\n${journalContext}` : ""}
                    ${memoryContext ? `\n${memoryContext}` : ""}
                    ${frontendContext ? `\nAdditional Context: ${frontendContext}` : ""}

                    INSTRUCTIONS:
                    1. Use the context above to personalize your responses. If the user mentions something they journaled about, acknowledge it.
                    2. Be supportive, non-judgmental, and calm.
                    3. Avoid diagnoses or clinical labels.
                    4. Encourage reflection and grounding.
                    5. Keep your responses concise but impactful.
                `.trim(),
            }
        });

        const result = await chat.sendMessage({ message: text });
        const botText = result.text;

        const botMsg = new ChatMessage({
            userId,
            role: 'model',
            content: botText,
            sessionId,
            riskLevel: 'safe'
        });
        await botMsg.save();

        res.json({
            response: botText,
            riskLevel,
            isCrisis: false
        });

    } catch (err) {
        console.error("Chat Error:", err.message, err.stack);
        res.status(500).json({
            message: 'Server Error',
            error: err.message
        });
    }
});

router.get('/history/:sessionId', auth, async (req, res) => {
    try {
        const messages = await ChatMessage.find({
            userId: req.user.id,
            sessionId: req.params.sessionId
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
