// src/components/UI/TensionAnalysis.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const TensionAnalysis = ({ data }) => (
<div className="bg-white/5 rounded-lg p-6 border border-white/10">
<h3 className="text-xl font-bold text-white mb-4">📈 Tension Analysis</h3>
<ResponsiveContainer width="100%" height={200}>
<LineChart data={data}>
<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
<XAxis dataKey="chord" stroke="#fff" />
<YAxis stroke="#fff" />
<Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff' }} />
<Line type="monotone" dataKey="tension" stroke="#ff6b6b" strokeWidth={3} dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 5 }} />
</LineChart>
</ResponsiveContainer>
</div>
);


export default TensionAnalysis;