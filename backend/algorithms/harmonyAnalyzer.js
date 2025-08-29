// project/backend/algorithms/harmonyAnalyzer.js
function analyzeHarmony(progression) {
    // produce a simple tension curve (0-10)
    const curve = progression.map((chord, i) => {
    let t = 2;
    if (/7|dim|aug/.test(chord)) t += 3;
    if (/b|#/.test(chord)) t += 2;
    if (/9|11|13/.test(chord)) t += 2;
    // cadence relief near end
    if (i === progression.length - 1) t = Math.max(0, t - 4);
    return Math.min(10, t);
    });
    return { curve, peak: Math.max(...curve), average: curve.reduce((a, b) => a + b, 0) / curve.length };
    }
    
    
    module.exports = { analyzeHarmony };