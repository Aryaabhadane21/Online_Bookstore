const mongoose = require('mongoose');
const Order = require('../models/Order');
const Book = require('../models/Book');

const createOrder = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity) {
      return res.status(400).json({ error: 'bookId and quantity are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: 'Invalid book ID' });
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'quantity must be a positive integer' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (book.stock < qty) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    book.stock -= qty;
    await book.save();

    const order = await Order.create({
      book: bookId,
      customer: req.user.id,
      quantity: qty,
      totalPrice: book.price * qty
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder };
