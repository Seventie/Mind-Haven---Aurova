const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'model', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['safe', 'emotional_distress', 'self_harm_risk', 'suicide_risk'],
        default: 'safe'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
