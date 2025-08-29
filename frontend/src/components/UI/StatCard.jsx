// src/components/UI/StatCard.jsx
import React from 'react';


const StatCard = ({ title, value, icon }) => (
<div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
<div className="flex items-center justify-between">
<div>
<p className="text-gray-300 text-sm">{title}</p>
<p className="text-2xl font-bold text-white">{value}</p>
</div>
<div className="text-3xl">{icon}</div>
</div>
</div>
);


export default StatCard;