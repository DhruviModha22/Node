const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register handler
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.render('register', { error: 'All fields are required.' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.render('register', { error: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect('/auth/login');
});

// Login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Login handler
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.render('login', { error: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('login', { error: 'Invalid credentials.' });
    }
    res.cookie('userId', user._id, { httpOnly: true });
    res.redirect('/blog');
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('userId');
    res.redirect('/auth/login');
});

module.exports = router; 