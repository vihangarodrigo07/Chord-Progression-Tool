// project/backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');


// Route modules
const progressionRoutes = require('./routes/progressions');
const analysisRoutes = require('./routes/analysis');


// Models (for auth)
const { User } = require('./models/ProgressionEngine');


const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Rate limiting
const limiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 100,
});
app.use(limiter);

// ======================== AUTH ========================
    app.post('/api/auth/register', async (req, res) => {
    try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
    message: 'User created successfully',
    token,
    user: { id: user._id, email: user.email, subscription: user.subscription },
    });
    } catch (error) {
    res.status(500).json({ error: 'Server error' });
    }
    });
    
    
    app.post('/api/auth/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({
    token,
    user: {
    id: user._id,
    email: user.email,
    subscription: user.subscription,
    preferences: user.preferences,
    },
    });
    } catch (error) {
    res.status(500).json({ error: 'Server error' });
    }
    });
    
    
    // Auth middleware (exported for routes to reuse)
    const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // { userId }
    next();
    });
    };
    app.set('authenticateToken', authenticateToken);

    // ===================== API ROUTES =====================
    app.use('/api', (req, _res, next) => {
    // make auth middleware available on req.app for route modules
    req.app.set('authenticateToken', authenticateToken);
    next();
    });
    
    
    app.use('/api', progressionRoutes);
    app.use('/api', analysisRoutes);
    
    
    // ===================== START APP =====================
    const PORT = process.env.PORT || 5000;
    const MONGO = process.env.MONGODB_URI || 'mongodb://localhost:27017/chordgraph';
    
    
    mongoose
    .connect(MONGO)
    .then(() => {
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Music Theory API is ready! 🎵');
    });
    })
    .catch((err) => {
    console.error('Database connection error:', err);
    });
    
    
    module.exports = app;