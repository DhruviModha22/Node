const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Index - Show all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.render('movies/index', { movies });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// New - Show form to create new movie
router.get('/new', (req, res) => {
    res.render('movies/new');
});

// Create - Add new movie
router.post('/', async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.redirect('/movies');
    } catch (error) {
        console.error(error);
        res.status(400).render('movies/new', { error: 'Please fill all required fields' });
    }
});

// Show - Show details of one movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.render('movies/show', { movie });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Edit - Show form to edit movie
router.get('/:id/edit', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.render('movies/edit', { movie });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Update - Update movie
router.put('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.redirect(`/movies/${movie._id}`);
    } catch (error) {
        console.error(error);
        res.status(400).render('movies/edit', { error: 'Please fill all required fields' });
    }
});

// Delete - Delete movie
router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.redirect('/movies');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 