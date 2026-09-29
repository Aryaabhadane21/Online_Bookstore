import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/bookcard.css';

export default function BookCard({ book }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="book-item-card">
      <Link to={`/books/${book._id}`} className="book-card-cover-wrap">
        {!imgError && book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="book-card-cover-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="book-card-cover-fallback">
            <span className="fallback-book-title">{book.title}</span>
            <span className="fallback-book-author">{book.author}</span>
          </div>
        )}
      </Link>

      <div className="book-card-info">
        <Link to={`/books/${book._id}`}>
          <h3 className="book-card-title" title={book.title}>
            {book.title}
          </h3>
        </Link>
        <p className="book-card-author">{book.author}</p>

        <div className="book-card-price-row">
          <span className="book-price-amount">₹{book.price}</span>
          {book.stock <= 0 && (
            <span className="out-of-stock-tag">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
