// project/backend/routes/analysis.js
const express3 = require('express');
const router2 = express3.Router();


const { AdvancedChordGraph } = require('../models/ChordGraph');
const { analyzeScale, midiToNote } = require('../models/ScaleSystem');
const { User, calculatePracticeHours, getMostUsedStyle, getPersonalizedRecommendations } = require('../models/ProgressionEngine');


function auth(req) {
return req.app.get('authenticateToken');
}


// ------------------ Melody Generation ------------------
router2.post('/melody/generate', auth, async (req, res) => {
try {
const { startNote, endNote, scaleType, chordContext, style } = req.body;
const engine = new AdvancedChordGraph();
const melodicPath = engine.findMelodicPathWithChords(startNote, endNote, scaleType, chordContext);


const { generatePhrasing, suggestOrnamentations } = require('../models/ProgressionEngine');
const phrasing = generatePhrasing(melodicPath);
const ornamentations = suggestOrnamentations(melodicPath, style);


res.json({
melodicPath,
phrasing,
ornamentations,
scaleAnalysis: analyzeScale(scaleType),
});
} catch (error) {
res.status(500).json({ error: 'Failed to generate melody' });
}
});


// ------------------ User Dashboard ------------------
router2.get('/user/dashboard', auth, async (req, res) => {
try {
const user = await User.findById(req.user.userId).select('-password');
const stats = {
totalProgressions: user.progressions.length,
practiceHours: calculatePracticeHours(user.practiceHistory),
favoriteStyle: getMostUsedStyle(user.progressions),
recentActivity: user.progressions.slice(-5),
};
res.json({ user, stats, recommendations: await getPersonalizedRecommendations(user) });
} catch (error) {
res.status(500).json({ error: 'Failed to load dashboard' });
}
});


module.exports = router2;