// server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to handle JSON
app.use(express.json());

// Route for home
app.get('/', (req, res) => {
  res.send('🎵 Chord Graph Backend is Running!');
});

// Example API to get a chord
app.get('/api/chord', (req, res) => {
  res.json({ chord: 'C Major', notes: ['C', 'E', 'G'] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
