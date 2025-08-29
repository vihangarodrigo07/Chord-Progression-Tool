// src/components/UI/CommunityProgressionCard.jsx
import React from 'react';


const CommunityProgressionCard = ({ progression }) => (
<div className="bg-white/10 rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all cursor-pointer">
<div className="flex justify-between items-start mb-4">
<h3 className="text-lg font-bold text-white">{progression.name}</h3>
<span className={`px-2 py-1 rounded-lg text-xs font-bold ${progression.difficulty <= 3 ? 'bg-green-500' : progression.difficulty <= 6 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
Level {progression.difficulty}
</span>
</div>


<div className="flex flex-wrap gap-2 mb-4">
{progression.chords.map((chord, index) => (
<span key={index} className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded text-sm">{chord}</span>
))}
</div>


<div className="flex justify-between items-center text-sm text-gray-300">
<span>by {progression.creator.email}</span>
<div className="flex items-center gap-2">
<span>❤️ {progression.likes}</span>
<span className="capitalize">{progression.style}</span>
</div>
</div>
</div>
);


export default CommunityProgressionCard;