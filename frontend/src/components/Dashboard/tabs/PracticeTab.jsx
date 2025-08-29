// src/components/Dashboard/tabs/PracticeTab.jsx
import React, { useState } from 'react';


const PracticeTab = () => {
const [practiceMode, setPracticeMode] = useState('chord-recognition');
const [currentChord, setCurrentChord] = useState('Cmaj7');
const [score, setScore] = useState(0);
const [streak, setStreak] = useState(0);
const [tempo, setTempo] = useState(120);


const practiceTypes = [
{ id: 'chord-recognition', name: '🎯 Chord Recognition', description: 'Identify chords by ear' },
{ id: 'progression-practice', name: '🎹 Progression Practice', description: 'Practice chord progressions' },
{ id: 'scale-training', name: '🎼 Scale Training', description: 'Master scales and modes' },
{ id: 'interval-training', name: '🎵 Interval Training', description: 'Perfect your interval recognition' }
];


return (
<div className="space-y-6">
<h2 className="text-3xl font-bold text-white mb-6">🎹 Interactive Practice Studio</h2>


<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{practiceTypes.map(type => (
<div key={type.id} onClick={() => setPracticeMode(type.id)} className={`p-6 rounded-lg cursor-pointer transition-all duration-300 border-2 ${practiceMode === type.id ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
<h3 className="text-xl font-bold text-white mb-2">{type.name}</h3>
<p className="text-gray-300">{type.description}</p>
</div>
))}
</div>
<div className="bg-white/5 rounded-lg p-8 border border-white/10">
<div className="text-center mb-6">
<div className="text-6xl font-bold text-white mb-4">{currentChord}</div>
<p className="text-gray-300 mb-6">Listen and identify this chord</p>


<div className="flex justify-center gap-4 mb-6">
<button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">▶️ Play Chord</button>
<button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">🔁 Replay</button>
</div>


<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
{['Cmaj7', 'Dm7', 'Em7b5', 'Fmaj7', 'G7', 'Am7', 'Bdim7', 'C7'].map(chord => (
<button key={chord} className="p-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/20">{chord}</button>
))}
</div>
</div>


<div className="flex justify-center gap-8 text-center">
<div>
<div className="text-2xl font-bold text-green-400">{score}</div>
<div className="text-gray-400">Score</div>
</div>
<div>
<div className="text-2xl font-bold text-yellow-400">{streak}</div>
<div className="text-gray-400">Streak</div>
</div>
<div>
<div className="text-2xl font-bold text-blue-400">{tempo}</div>
<div className="text-gray-400">BPM</div>
</div>
</div>
</div>
</div>
);
};


export default PracticeTab;