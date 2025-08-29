// project/backend/algorithms/voiceLeading.js
const { toMidi, midiToNote } = require('../models/ScaleSystem');


function optimizeVoiceLeading(progression) {
// Return simple 3-note voicings trying to minimize movement
let last = [toMidi('C4'), toMidi('E4'), toMidi('G4')];
return progression.map((chord) => {
const targetRoot = chord.replace(/[^A-G#b]/g, '') + '4';
const rootMidi = toMidi(targetRoot);
const third = rootMidi + 4; // naive
const fifth = rootMidi + 7;
const candidate = [rootMidi, third, fifth];
// choose inversion with minimal distance
const options = [
candidate,
[candidate[1] - 12, candidate[2] - 12, candidate[0]],
[candidate[2] - 12, candidate[0], candidate[1]],
];
let best = options[0];
let bestCost = Infinity;
options.forEach((opt) => {
const cost = opt.reduce((sum, m, idx) => sum + Math.abs(m - last[idx]), 0);
if (cost < bestCost) {
bestCost = cost;
best = opt;
}
});
last = best;
return best.map(midiToNote);
});
}


module.exports = { optimizeVoiceLeading };