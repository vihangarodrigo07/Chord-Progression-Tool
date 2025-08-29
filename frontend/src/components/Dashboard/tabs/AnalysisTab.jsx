// src/components/Dashboard/tabs/AnalysisTab.jsx
import React, { useState } from 'react';
import { useAuth } from "../../Auth/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const AnalysisTab = ({ tensionData }) => {
const [analysisType, setAnalysisType] = useState('tension');
const [uploadedFile, setUploadedFile] = useState(null);
const [analysisResult, setAnalysisResult] = useState(null);


const analyzeProgression = () => {
const mockData = [
{ chord: 'Dm7', tension: 0.3, position: 0 },
{ chord: 'G7', tension: 0.8, position: 1 },
{ chord: 'Cmaj7', tension: 0.1, position: 2 },
{ chord: 'Am7', tension: 0.4, position: 3 }
];
setAnalysisResult(mockData);
};


return (
<div className="space-y-6">
<h2 className="text-3xl font-bold text-white mb-6">📊 Advanced Music Analysis</h2>


<div className="flex gap-4 mb-6">
{['tension', 'voice-leading', 'harmonic', 'statistical'].map(type => (
<button key={type} onClick={() => setAnalysisType(type)} className={`px-4 py-2 rounded-lg capitalize transition-all ${analysisType === type ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
{type.replace('-', ' ')} Analysis
</button>
))}
</div>


<div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
<div className="text-4xl mb-2">🎼</div>
<p className="text-gray-300 mb-4">Upload MIDI file or paste chord progression for analysis</p>
<input type="file" accept=".mid,.midi" onChange={(e) => setUploadedFile(e.target.files[0])} className="hidden" id="midi-upload" />
<label htmlFor="midi-upload" className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg cursor-pointer hover:from-green-600 hover:to-blue-600 transition-all">Choose MIDI File</label>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<div className="bg-white/5 rounded-lg p-6 border border-white/10">
<h3 className="text-xl font-bold text-white mb-4">Tension Curve Analysis</h3>
<ResponsiveContainer width="100%" height={300}>
<LineChart data={analysisResult || []}>
<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
<XAxis dataKey="chord" stroke="#fff" />
<YAxis stroke="#fff" />
<Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
<Line type="monotone" dataKey="tension" stroke="#8884d8" strokeWidth={3} dot={{ fill: '#8884d8', strokeWidth: 2, r: 6 }} />
</LineChart>
</ResponsiveContainer>
</div>


<div className="bg-white/5 rounded-lg p-6 border border-white/10">
<h3 className="text-xl font-bold text-white mb-4">Voice Leading Efficiency</h3>
<div className="space-y-4">
<div className="flex justify-between items-center">
<span className="text-gray-300">Overall Smoothness</span>
<div className="flex items-center gap-2">
<div className="w-24 bg-gray-700 rounded-full h-2">
<div className="bg-green-500 h-2 rounded-full w-4/5"></div>
</div>
<span className="text-white font-bold">85%</span>
</div>
</div>
<div className="flex justify-between items-center">
<span className="text-gray-300">Average Voice Movement</span>
<span className="text-white font-bold">1.3 semitones</span>
</div>
<div className="flex justify-between items-center">
<span className="text-gray-300">Parallel Fifths</span>
<span className="text-red-400 font-bold">0 detected ✓</span>
</div>
</div>
</div>
</div>
<button onClick={analyzeProgression} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all">🔍 Run Complete Analysis</button>
</div>
);
};


export default AnalysisTab;