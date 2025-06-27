const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/User');

// Middleware to check authentication
function isAuthenticated(req, res, next) {
    if (!req.cookies.userId) {
        return res.redirect('/auth/login');
    }
    next();
}

// List all blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username').sort({ createdAt: -1 });
    res.render('blogs', { blogs });
});

// New blog form
router.get('/new', isAuthenticated, (req, res) => {
    res.render('blog', { edit: false, blog: undefined });
});

// Create blog
router.post('/', isAuthenticated, async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.render('blog', { error: 'All fields are required.', edit: false, blog: undefined });
    }
    const blog = new Blog({
        title,
        content,
        author: req.cookies.userId
    });
    await blog.save();
    res.redirect('/blog');
});

// View single blog
router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('author', 'username');
    if (!blog) return res.status(404).render('error', { error: 'Blog not found!' });
    res.render('blog', { blog, edit: false });
});

// Edit blog form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).render('error', { error: 'Blog not found!' });
    if (blog.author.toString() !== req.cookies.userId) {
        return res.status(403).render('error', { error: 'Unauthorized' });
    }
    res.render('blog', { blog, edit: true });
});

// Update blog
router.put('/:id', isAuthenticated, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).render('error', { error: 'Blog not found!' });
    if (blog.author.toString() !== req.cookies.userId) {
        return res.status(403).render('error', { error: 'Unauthorized' });
    }
    const { title, content } = req.body;
    blog.title = title;
    blog.content = content;
    await blog.save();
    res.redirect('/blog/' + blog._id);
});

// Delete blog
router.delete('/:id', isAuthenticated, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).render('error', { error: 'Blog not found!' });
    if (blog.author.toString() !== req.cookies.userId) {
        return res.status(403).render('error', { error: 'Unauthorized' });
    }
    await blog.deleteOne();
    res.redirect('/blog');
});

module.exports = router; 