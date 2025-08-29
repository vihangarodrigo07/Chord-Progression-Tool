// src/components/Dashboard/MusicTheoryDashboard.jsx
import React, { useState } from 'react';
import GeneratorTab from './tabs/GeneratorTab';
import AnalysisTab from './tabs/AnalysisTab';
import PracticeTab from './tabs/PracticeTab';
import CommunityTab from './tabs/CommunityTab';
import { useAuth } from '../Auth/AuthContext';
import StatCard from '../UI/StatCard';
import calculateSkillLevel from '../../utils/calculateSkillLevel';


const MusicTheoryDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('generator');
  const [tensionData, setTensionData] = useState([]);
  const [userStats, setUserStats] = useState({});

  const tabs = [
    { id: 'generator', label: '🎯 Generator', icon: '🎵' },
    { id: 'analyze', label: '📊 Analysis', icon: '🔍' },
    { id: 'practice', label: '🎹 Practice', icon: '🎹' },
    { id: 'community', label: '👥 Community', icon: '🌍' }
  ];

  React.useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    const res = await fetch('/api/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUserStats(data.stats);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            🎵 Advanced Music Theory Platform
          </h1>
          <p className="text-gray-300 text-lg">
            AI-powered chord progressions, melodic analysis, and practice tools
          </p>
        </div>

        {/* User Stats */}
        {user && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Progressions Created" value={userStats.totalProgressions || 0} icon="🎼" />
            <StatCard title="Practice Hours" value={Math.round(userStats.practiceHours || 0)} icon="⏱️" />
            <StatCard title="Favorite Style" value={userStats.favoriteStyle || 'Jazz'} icon="🎭" />
            <StatCard title="Skill Level" value={calculateSkillLevel(userStats)} icon="⭐" />
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-8 bg-black/20 rounded-2xl p-2 backdrop-blur-sm">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 mx-1 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xl mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-black/30 rounded-3xl p-8 backdrop-blur-lg border border-white/10">
          {activeTab === 'generator' && <GeneratorTab />}
          {activeTab === 'analyze' && <AnalysisTab tensionData={tensionData} />}
          {activeTab === 'practice' && <PracticeTab />}
          {activeTab === 'community' && <CommunityTab />}
        </div>
      </div>
    </div>
  );
};

export default MusicTheoryDashboard;
