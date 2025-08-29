// src/components/UI/ProgressionDisplay.jsx
import React from 'react';


const ProgressionDisplay = ({ progression }) => (
<div className="bg-white/5 rounded-lg p-6 border border-white/10">
<h3 className="text-xl font-bold text-white mb-4">🎼 Generated Progression</h3>
<div className="flex flex-wrap gap-3 mb-4">
{progression.map((chord, index) => (
<div
key={index}
className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold text-lg shadow-lg"
style={{ animationDelay: `${index * 0.1}s` }}
>
{chord}
</div>
))}
</div>
<div className="flex gap-3">
<button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all">▶️ Play</button>
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">💾 Save</button>
<button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all">🔄 Generate Variation</button>
</div>
</div>
);


export default ProgressionDisplay;