// project/backend/models/ScaleSystem.js
// Music theory helpers and scale analysis
const noteMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };


function toMidi(note) {
const noteName = note.charAt(0);
const accidental = note.slice(1).replace(/\d+$/, '');
const octaveMatch = note.match(/(\d+)$/);
const octave = octaveMatch ? parseInt(octaveMatch[1], 10) : 4;
let midi = noteMap[noteName] + octave * 12;
if (accidental.includes('#')) midi += 1;
if (accidental.includes('b')) midi -= 1;
return midi;
}


function midiToNote(midi) {
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const octave = Math.floor(midi / 12);
const note = notes[midi % 12];
return note + octave;
}


function interval(note1, note2) {
return Math.abs(toMidi(note2) - toMidi(note1));
}


function isStepwiseInterval(m1, m2) {
return Math.abs(m2 - m1) <= 2;
}

function analyzeScale(scaleType) {
    const scaleAnalyses = {
    major: {
    mood: 'bright, happy',
    commonUses: ['pop', 'classical', 'folk'],
    characteristicIntervals: ['major 2nd', 'major 3rd', 'perfect 4th'],
    suggestions: 'Great for uplifting melodies and happy songs',
    },
    minor: {
    mood: 'dark, melancholic',
    commonUses: ['classical', 'metal', 'blues'],
    characteristicIntervals: ['minor 3rd', 'minor 6th', 'minor 7th'],
    suggestions: 'Perfect for emotional and dramatic pieces',
    },
    dorian: {
    mood: 'mysterious, sophisticated',
    commonUses: ['jazz', 'folk', 'medieval'],
    characteristicIntervals: ['minor 3rd', 'major 6th'],
    suggestions: 'Creates a sophisticated, ancient sound',
    },
    };
    return scaleAnalyses[scaleType] || scaleAnalyses.major;
}
    
    
module.exports = { toMidi, midiToNote, interval, isStepwiseInterval, analyzeScale };