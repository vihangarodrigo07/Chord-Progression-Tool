// src/App.jsx
import React from 'react';
import { AuthProvider } from './components/Auth/AuthContext';
import MusicTheoryDashboard from './components/Dashboard/MusicTheoryDashboard';

function App() {
  return (
    <AuthProvider>
      <MusicTheoryDashboard />
    </AuthProvider>
  );
}

export default App;
