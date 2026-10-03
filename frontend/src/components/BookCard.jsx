import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/bookcard.css';

export default function BookCard({ book, showPrice = true }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="book-card-container">
      <Link to={`/books/${book._id}`} className="book-card-cover-link">
        {!imgError && book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="book-card-img"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="book-card-placeholder">
            <span className="placeholder-text-title">{book.title}</span>
            <span className="placeholder-text-author">{book.author}</span>
          </div>
        )}
      </Link>

      <div className="book-card-meta">
        <Link to={`/books/${book._id}`}>
          <h4 className="book-card-name" title={book.title}>
            {book.title}
          </h4>
        </Link>
        <p className="book-card-byline">{book.author}</p>
        {showPrice && (
          <div className="book-card-price-row">
            <span className="book-card-price">₹{book.price}</span>
            {book.stock <= 0 && (
              <span className="book-card-out-of-stock">Out of stock</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
