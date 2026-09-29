const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  genre: { type: String, required: true, trim: true },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  coverImage: { type: String, trim: true },
  description: { type: String, trim: true },
  language: { type: String, default: 'English', trim: true },
  pages: { type: Number, min: 1 },
  isbn: { type: String, trim: true }
}, { timestamps: true });

bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ price: 1 });

module.exports = mongoose.model('Book', bookSchema);
