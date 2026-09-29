const express = require('express');
const { getBooks, getGenres, getBook, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBooks);
router.get('/genres', getGenres);
router.get('/:id', getBook);
router.post('/', verifyToken, requireAdmin, createBook);
router.patch('/:id', verifyToken, requireAdmin, updateBook);
router.delete('/:id', verifyToken, requireAdmin, deleteBook);

module.exports = router;
