const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

function isAuthenticated(req, res, next) {
    if (!req.cookies.userId) {
        return res.redirect('/auth/login');
    }
    next();
}

router.get('/', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.cookies.userId);
    if (!user) return res.status(404).render('error', { error: 'User not found!' });
    const blogs = await Blog.find({ author: user._id }).sort({ createdAt: -1 });
    res.render('profile', { user, blogs });
});

module.exports = router; 