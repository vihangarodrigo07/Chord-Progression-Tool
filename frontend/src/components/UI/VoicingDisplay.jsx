// src/components/UI/VoicingDisplay.jsx
import React from 'react';


const VoicingDisplay = ({ voicings }) => (
<div className="bg-white/5 rounded-lg p-6 border border-white/10">
<h3 className="text-xl font-bold text-white mb-4">🎹 Optimized Voicings</h3>
<div className="space-y-3">
{voicings?.map((voicing, index) => (
<div key={index} className="flex items-center gap-4">
<span className="text-gray-300 w-16">{index + 1}:</span>
<div className="flex gap-2">
{voicing.notes?.map((note, noteIndex) => (
<span key={noteIndex} className="px-2 py-1 bg-gray-700 text-white rounded text-sm">{note}</span>
))}
</div>
</div>
))}
</div>
</div>
);


export default VoicingDisplay;