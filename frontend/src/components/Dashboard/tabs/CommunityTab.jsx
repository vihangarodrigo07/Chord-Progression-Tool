// src/components/Dashboard/tabs/CommunityTab.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import CommunityProgressionCard from '../../UI/CommunityProgressionCard';


const CommunityTab = () => {
const [communityProgressions, setCommunityProgressions] = useState([]);
const [filter, setFilter] = useState('popular');


useEffect(() => {
loadCommunityProgressions();
}, [filter]);


const loadCommunityProgressions = async () => {
// keep mock fallback to preserve UI behavior
const mockProgressions = [
{ id: 1, name: 'Jazz Standard Changes', chords: ['Cmaj7', 'Am7', 'Dm7', 'G7'], style: 'jazz', difficulty: 6, likes: 156, creator: { email: 'jazzmaster@music.com' }, createdAt: new Date().toISOString() },
{ id: 2, name: 'Pop Ballad Progression', chords: ['C', 'Am', 'F', 'G'], style: 'pop', difficulty: 3, likes: 89, creator: { email: 'popwriter@music.com' }, createdAt: new Date().toISOString() }
];


try {
// map filter to style when appropriate
const filters = {};
if (['jazz', 'classical', 'pop'].includes(filter)) filters.style = filter;
else filters.sort = filter;


const res = await api.getCommunityProgressions(filters);
if (res.success) setCommunityProgressions(res.progressions || mockProgressions);
else setCommunityProgressions(mockProgressions);
} catch (error) {
console.error('Load community failed:', error);
setCommunityProgressions(mockProgressions);
}
};
return (
    <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white mb-6">👥 Music Community</h2>
    
    
    <div className="flex gap-4 mb-6">
    {['popular', 'recent', 'jazz', 'classical', 'pop'].map(filterType => (
    <button key={filterType} onClick={() => setFilter(filterType)} className={`px-4 py-2 rounded-lg capitalize transition-all ${filter === filterType ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
    {filterType}
    </button>
    ))}
    </div>
    
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {communityProgressions.map(progression => (
    <CommunityProgressionCard key={progression.id} progression={progression} />
    ))}
    </div>
    
    
    <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6 border border-purple-500/30">
    <h3 className="text-xl font-bold text-white mb-4">🚀 Share Your Creation</h3>
    <p className="text-gray-300 mb-4">Upload your chord progressions and share them with the community!</p>
    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all">📤 Upload Progression</button>
    </div>
    </div>
    );
    };
    export default CommunityTab;