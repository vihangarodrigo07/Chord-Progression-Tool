// project/backend/models/ProgressionEngine.js
// ================== Mongoose Schemas/Models ==================
const UserSchema = new mongoose2.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
    preferences: {
    favoriteKeys: [String],
    preferredStyles: [String],
    instruments: [String],
    },
    progressions: [
    {
    name: String,
    chords: [String],
    style: String,
    createdAt: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: false },
    },
    ],
    practiceHistory: [
    {
    progression: [String],
    date: Date,
    accuracy: Number,
    tempo: Number,
    duration: Number,
    },
    ],
    });
    
    
    const ProgressionSchema = new mongoose2.Schema({
    name: String,
    chords: [String],
    style: String,
    difficulty: { type: Number, min: 1, max: 10 },
    tags: [String],
    creator: { type: mongoose2.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    analytics: {
    plays: { type: Number, default: 0 },
    practices: { type: Number, default: 0 },
    averageRating: Number,
    },
    });
    
    
    const User = mongoose2.model('User', UserSchema);
    const Progression = mongoose2.model('Progression', ProgressionSchema);

    // ================== Engine/Helpers (difficulty, phrasing) ==================
function calculateDifficulty(progression, style) {
    let difficulty = 1;
    progression.forEach((chord) => {
    if (chord.includes('7')) difficulty += 1;
    if (/(9|11|13)/.test(chord)) difficulty += 2;
    if (/[b#]/.test(chord)) difficulty += 1;
    });
    switch (style) {
    case 'classical':
    difficulty += 1;
    break;
    case 'jazz':
    difficulty += 3;
    break;
    case 'blues':
    difficulty += 1;
    break;
    case 'pop':
    difficulty -= 1;
    break;
    }
    return Math.min(Math.max(difficulty, 1), 10);
    }
    
    
    function isPhrasePeak(melodicPath, index) {
    if (index === 0 || index === melodicPath.length - 1) return false;
    const prev = toMidi(melodicPath[index - 1]);
    const curr = toMidi(melodicPath[index]);
    const next = toMidi(melodicPath[index + 1]);
    return curr > prev && curr > next;
    }
    
    
    function generatePassingTones(note1, note2) {
    const start = toMidi(note1);
    const end = toMidi(note2);
    const tones = [];
    if (end > start) {
    for (let i = start + 1; i < end; i++) tones.push(midiToNote(i));
    } else {
    for (let i = start - 1; i > end; i--) tones.push(midiToNote(i));
    }
    return tones.slice(0, 2);
    }

    function isStepwise(melodicPath, index) {
        if (index === 0 || index >= melodicPath.length - 1) return false;
        return interval(melodicPath[index], melodicPath[index + 1]) <= 2;
        }
        
        
        function generatePhrasing(melodicPath) {
        const phrases = [];
        let current = [];
        for (let i = 0; i < melodicPath.length; i++) {
        current.push(melodicPath[i]);
        if (isPhrasePeak(melodicPath, i) || current.length >= 8) {
        phrases.push([...current]);
        current = [];
        }
        }
        if (current.length) phrases.push(current);
        return phrases;
        }
        
        
        function suggestOrnamentations(melodicPath, style) {
        const orns = [];
        for (let i = 0; i < melodicPath.length - 1; i++) {
        const iv = interval(melodicPath[i], melodicPath[i + 1]);
        if (iv >= 3) {
        orns.push({ position: i, type: 'passing_tone', notes: generatePassingTones(melodicPath[i], melodicPath[i + 1]) });
        }
        if (style === 'baroque' && isStepwise(melodicPath, i)) {
        orns.push({ position: i, type: 'trill', duration: '16n' });
        }
        }
        return orns;
        }
        
        
        function calculatePracticeHours(practiceHistory) {
        return practiceHistory.reduce((total, s) => total + (s.duration || 0), 0) / 3600;
        }
        
        
        function getMostUsedStyle(progressions) {
        const counts = {};
        progressions.forEach((p) => {
        if (!p || !p.style) return;
        counts[p.style] = (counts[p.style] || 0) + 1;
        });
        return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b), Object.keys(counts)[0] || 'pop');
        }
        
        
        async function getPersonalizedRecommendations(user) {
        const favoriteStyle = getMostUsedStyle(user.progressions || []);
        // naive difficulty proxy
        const avgDiff = 5;
        const recs = await Progression.find({ style: favoriteStyle, difficulty: { $gte: avgDiff - 1, $lte: avgDiff + 2 } }).limit(5);
        return recs;
        }

        module.exports = {
            User,
            Progression,
            calculateDifficulty,
            generatePhrasing,
            suggestOrnamentations,
            calculatePracticeHours,
            getMostUsedStyle,
            getPersonalizedRecommendations,
            };