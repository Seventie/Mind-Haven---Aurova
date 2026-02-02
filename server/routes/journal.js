const express = require('express');
const Journal = require('../models/Journal');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// @route   POST /api/journal
// @desc    Create a new journal entry
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { content, aiAnalysis } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        const newEntry = new Journal({
            userId: req.user.id,
            content,
            aiAnalysis
        });

        const entry = await newEntry.save();
        res.json(entry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/journal
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const entries = await Journal.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
