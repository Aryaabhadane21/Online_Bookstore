import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/bookdetail.css';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const isAdmin = user?.role === 'admin';

  const [book, setBook] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => setError('Book not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const deleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <p className="detail-status-text">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-container">
        <div className="detail-error-card">
          <h2>Book Not Found</h2>
          <p>{error || 'The requested book does not exist.'}</p>
          <Link to="/" className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.stock > 0;
  const firstDescriptionLine = book.description ? book.description.split('.')[0] + '.' : '';

  return (
    <div className="book-detail-container">
      {/* Top Section: Cover on Left, Header & Actions on Right */}
      <div className="book-detail-hero">
        <div className="detail-cover-column">
          <div className="detail-cover-frame">
            {!imgError && book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="detail-cover-image"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="detail-cover-placeholder">
                <span className="placeholder-title">{book.title}</span>
                <span className="placeholder-author">{book.author}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-main-info">
          <h1 className="detail-book-title">{book.title}</h1>
          <p className="detail-book-author">{book.author}</p>

          {firstDescriptionLine && (
            <p className="detail-first-line">{firstDescriptionLine}</p>
          )}

          <div className="detail-action-bar">
            {isAvailable ? (
              <Link to={`/books/${book._id}/order`} className="btn btn-dark btn-order-action">
                Order now ↗
              </Link>
            ) : (
              <button className="btn btn-dark btn-order-action" disabled>
                Out of stock
              </button>
            )}

            <div className="detail-price-stock-info">
              <span className="detail-price-value">₹{book.price}</span>
              <span className={`detail-stock-indicator ${isAvailable ? 'in-stock' : 'out-stock'}`}>
                {isAvailable ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {isAdmin && (
            <div className="detail-admin-controls">
              <Link to={`/admin/books/${book._id}/edit`} className="btn btn-outline btn-sm">
                Edit Book
              </Link>
              <button className="btn btn-danger btn-sm" onClick={deleteBook}>
                Delete Book
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="detail-section-divider" />

      {/* Two Column Details Panel */}
      <div className="detail-specs-panel">
        <div className="specs-col-left">
          <h3 className="specs-section-title">Description</h3>
          <p className="specs-description-text">
            {book.description || 'No description available for this book.'}
          </p>
        </div>

        <div className="specs-col-right">
          <div className="spec-item-group">
            <span className="spec-group-label">Genre</span>
            <span className="spec-group-value">{book.genre}</span>
          </div>

          <div className="spec-item-group">
            <span className="spec-group-label">Language</span>
            <span className="spec-group-value">{book.language || 'English'}</span>
          </div>

          <div className="spec-item-group">
            <span className="spec-group-label">Format</span>
            <span className="spec-group-value">
              {book.pages ? `${book.pages} pages` : 'Standard edition'}
            </span>
            {book.isbn && (
              <span className="spec-group-sub">ISBN: {book.isbn}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
