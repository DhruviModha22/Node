const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('books/index', { books });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show form to create new book
router.get('/new', (req, res) => {
  res.render('books/new');
});

// Create new book
router.post('/', async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.redirect('/books');
  } catch (error) {
    res.status(400).render('books/new', { error: error.message });
  }
});

// Show single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.render('books/show', { book });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.render('books/edit', { book });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.redirect('/books');
  } catch (error) {
    res.status(400).render('books/edit', { error: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.redirect('/books');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router; 