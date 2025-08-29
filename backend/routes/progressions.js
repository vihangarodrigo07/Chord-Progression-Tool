// project/backend/routes/progressions.js
const express2 = require('express');
const router = express2.Router();


const { AdvancedChordGraph } = require('../models/ChordGraph');
const {
Progression,
User,
calculateDifficulty,
} = require('../models/ProgressionEngine');


// helper to get auth middleware from app
function auth(req) {
return req.app.get('authenticateToken');
}

// ------------------ Progression Generation ------------------
router.post('/progressions/generate', auth, async (req, res) => {
    try {
    const { startChord, endChord, length, style, key, save, name } = req.body;
    const chordGraph = new AdvancedChordGraph();
    const progression = chordGraph.findOptimalProgression(startChord, endChord, length, style, key);
    const voicings = chordGraph.optimizeVoiceLeading(progression);
    const tensionAnalysis = chordGraph.analyzeTensionCurve(progression);
    const difficulty = calculateDifficulty(progression, style);
    
    
    if (save) {
    await User.findByIdAndUpdate(req.user.userId, {
    $push: { progressions: { name: name || `${style} progression`, chords: progression, style } },
    });
    }
    
    
    res.json({
    progression,
    voicings,
    tensionAnalysis,
    difficulty,
    metadata: { style, key, generatedAt: new Date() },
    });
    } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate progression' });
    }
    });
    
    
    // ------------------ Community ------------------
    router.get('/community/progressions', async (req, res) => {
    try {
    const { style, difficulty, page = 1, limit = 20 } = req.query;
    const filters = {};
    if (style) filters.style = style;
    if (difficulty) filters.difficulty = { $lte: parseInt(difficulty, 10) };
    
    
    const progressions = await Progression.find(filters)
    .populate('creator', 'email')
    .sort({ likes: -1, createdAt: -1 })
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));
    
    
    res.json(progressions);
    } catch (error) {
    res.status(500).json({ error: 'Failed to load community progressions' });
    }
    });

    router.post('/community/progressions/:id/like', auth, async (req, res) => {
        try {
        const progression = await Progression.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } },
        { new: true }
        );
        res.json({ likes: progression.likes });
        } catch (error) {
        res.status(500).json({ error: 'Failed to like progression' });
        }
        });
        
        
        // ------------------ Practice Tracking ------------------
        router.post('/practice/session', auth, async (req, res) => {
        try {
        const { progression, tempo, accuracy, duration } = req.body;
        
        
        await User.findByIdAndUpdate(req.user.userId, {
        $push: { practiceHistory: { progression, date: new Date(), tempo, accuracy, duration } },
        });
        
        
        await Progression.findOneAndUpdate(
        { chords: { $all: progression } },
        { $inc: { 'analytics.practices': 1 } }
        );
        
        
        res.json({ message: 'Practice session recorded' });
        } catch (error) {
        res.status(500).json({ error: 'Failed to record practice' });
        }
        });
        
        
        // ------------------ Analytics ------------------
        router.get('/analytics/trends', async (_req, res) => {
        try {
        const trendData = await Progression.aggregate([
        { $group: { _id: '$style', count: { $sum: 1 }, averageDifficulty: { $avg: '$difficulty' }, totalPlays: { $sum: '$analytics.plays' } } },
        { $sort: { count: -1 } },
        ]);
        res.json(trendData);
        } catch (error) {
        res.status(500).json({ error: 'Failed to load analytics' });
        }
        });
        
        
        module.exports = router;