const mongoose = require('mongoose');
const Book = require('../models/Book');

const getBooks = async (req, res, next) => {
  try {
    const { search, genre, author, minPrice, maxPrice, sort, page, limit } = req.query;

    if (minPrice !== undefined && (isNaN(minPrice) || minPrice === '')) {
      return res.status(400).json({ error: 'minPrice must be a number' });
    }
    if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice === '')) {
      return res.status(400).json({ error: 'maxPrice must be a number' });
    }
    if (minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice)) {
      return res.status(400).json({ error: 'minPrice cannot be greater than maxPrice' });
    }

    const pageNum = page !== undefined ? parseInt(page, 10) : 1;
    const limitNum = limit !== undefined ? parseInt(limit, 10) : 8;

    if (page !== undefined && (!Number.isInteger(pageNum) || pageNum < 1)) {
      return res.status(400).json({ error: 'page must be a positive integer' });
    }
    if (limit !== undefined && (!Number.isInteger(limitNum) || limitNum < 1)) {
      return res.status(400).json({ error: 'limit must be a positive integer' });
    }
    if (limitNum > 50) {
      return res.status(400).json({ error: 'limit cannot exceed 50' });
    }

    const validSorts = ['price', '-price', 'title', '-title'];
    if (sort !== undefined && !validSorts.includes(sort)) {
      return res.status(400).json({ error: `sort must be one of: ${validSorts.join(', ')}` });
    }

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (genre) {
      query.genre = { $regex: new RegExp(`^${genre}$`, 'i') };
    }

    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    let sortObj = {};
    if (sort) {
      const desc = sort.startsWith('-');
      const field = desc ? sort.slice(1) : sort;
      sortObj[field] = desc ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 };
    }

    const skip = (pageNum - 1) * limitNum;
    const total = await Book.countDocuments(query);
    const books = await Book.find(query).sort(sortObj).skip(skip).limit(limitNum);

    res.json({
      books,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1
    });
  } catch (err) {
    next(err);
  }
};

const getGenres = async (req, res, next) => {
  try {
    const genres = await Book.distinct('genre');
    res.json(genres.filter(Boolean).sort());
  } catch (err) {
    next(err);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, genre, price, stock, coverImage, description, language, pages, isbn } = req.body;
    const book = await Book.create({
      title,
      author,
      genre,
      price,
      stock,
      coverImage,
      description,
      language,
      pages,
      isbn
    });
    res.status(201).json(book);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBooks, getGenres, getBook, createBook, updateBook, deleteBook };
