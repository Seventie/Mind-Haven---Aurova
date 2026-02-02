const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    },
    sourceText: {
        type: String,
        required: true
    },
    memoryType: {
        type: String,
        enum: ['emotion', 'recurring_theme', 'preference', 'life_context'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Memory', MemorySchema);
