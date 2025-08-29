// src/components/Dashboard/tabs/GeneratorTab.jsx
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../Auth/AuthContext.jsx'; // ✅ Ensure the extension is added
import api from '../../../services/api';
import ProgressionDisplay from '../../UI/ProgressionDisplay';
import VoicingDisplay from '../../UI/VoicingDisplay';
import TensionAnalysis from '../../UI/TensionAnalysis';

const GeneratorTab = () => {
  const { token } = useContext(AuthContext);

  const [config, setConfig] = useState({
    startChord: 'C',
    endChord: 'C',
    length: 4,
    style: 'jazz',
    key: 'majorKey'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateProgression = async () => {
    setLoading(true);

    // Mock fallback result for offline testing
    const mockResult = {
      progression: ['Dm7', 'G7', 'Cmaj7', 'A7'],
      voicings: [
        { notes: ['D', 'F', 'A', 'C'] },
        { notes: ['G', 'B', 'D', 'F'] },
        { notes: ['C', 'E', 'G', 'B'] },
        { notes: ['A', 'C#', 'E', 'G'] }
      ],
      tensionAnalysis: [
        { chord: 'Dm7', tension: 0.3, position: 0 },
        { chord: 'G7', tension: 0.8, position: 1 },
        { chord: 'Cmaj7', tension: 0.1, position: 2 },
        { chord: 'A7', tension: 0.6, position: 3 }
      ]
    };

    try {
      const res = await api.generateProgression(config, token);
      if (res.success) {
        setResult({
          progression: res.progression || [],
          voicings: res.voicings || [],
          tensionAnalysis: res.analysis || res.tensionAnalysis || []
        });
      } else {
        setResult(mockResult);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setResult(mockResult);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">
        🎯 Intelligent Progression Generator
      </h2>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Start Chord */}
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Start Chord</label>
          <select
            value={config.startChord}
            onChange={(e) => setConfig({ ...config, startChord: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
          >
            <option value="C">C Major</option>
            <option value="Dm">D minor</option>
            <option value="Em">E minor</option>
            <option value="F">F Major</option>
            <option value="G">G Major</option>
            <option value="Am">A minor</option>
            <option value="Bdim">B diminished</option>
          </select>
        </div>

        {/* End Chord */}
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">End Chord</label>
          <select
            value={config.endChord}
            onChange={(e) => setConfig({ ...config, endChord: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
          >
            <option value="C">C Major</option>
            <option value="Dm">D minor</option>
            <option value="Em">E minor</option>
            <option value="F">F Major</option>
            <option value="G">G Major</option>
            <option value="Am">A minor</option>
            <option value="Bdim">B diminished</option>
          </select>
        </div>

        {/* Length Slider */}
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">
            Length: {config.length}
          </label>
          <input
            type="range"
            min="3"
            max="12"
            value={config.length}
            onChange={(e) =>
              setConfig({ ...config, length: parseInt(e.target.value) })
            }
            className="w-full accent-blue-500"
          />
        </div>

        {/* Style Selector */}
        <div>
          <label className="block text-gray-300 mb-2 font-semibold">Style</label>
          <select
            value={config.style}
            onChange={(e) => setConfig({ ...config, style: e.target.value })}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-500 focus:outline-none"
          >
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
            <option value="pop">Pop</option>
            <option value="blues">Blues</option>
          </select>
        </div>

        {/* Generate Button */}
        <div className="flex items-end">
          <button
            onClick={generateProgression}
            disabled={loading}
            className={`w-full p-3 rounded-lg font-bold text-white transition-all duration-300 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95'
            }`}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate'}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-8 space-y-6">
          <ProgressionDisplay progression={result.progression} />
          <VoicingDisplay voicings={result.voicings} />
          <TensionAnalysis data={result.tensionAnalysis} />
        </div>
      )}
    </div>
  );
};

export default GeneratorTab;
