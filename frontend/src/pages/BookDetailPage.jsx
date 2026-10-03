import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Bookmark, Share2, Download } from 'lucide-react';
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
    if (!window.confirm('Delete this book from the catalog?')) return;
    try {
      await api.delete(`/books/${id}`);
      navigate('/library');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="book-detail-wrapper">
        <p className="detail-loading-text">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-detail-wrapper">
        <div className="detail-not-found-card">
          <h2>Book Not Found</h2>
          <p>{error || 'The requested book does not exist.'}</p>
          <Link to="/library" className="btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.stock > 0;
  const firstLine = book.description ? book.description.split('.')[0] + '.' : '';

  return (
    <div className="book-detail-wrapper">
      <div className="book-detail-frame">
        {/* Upper Hero Section on --bg */}
        <div className="detail-upper-block">
          {/* Cover & chevrons */}
          <div className="detail-cover-showcase">
            <div className="detail-nav-chevrons">
              <span className="chevron-icon-up" title="Previous">
                <ChevronUp size={16} strokeWidth={1.5} />
              </span>
              <span className="chevron-circle-down" title="Next">
                <ChevronDown size={16} strokeWidth={1.5} />
              </span>
            </div>

            <div className="detail-large-cover-card">
              {!imgError && book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="detail-large-cover-img"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="detail-large-cover-placeholder">
                  <span className="placeholder-title">{book.title}</span>
                  <span className="placeholder-author">{book.author}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details column: 6rem gap from cover */}
          <div className="detail-header-info">
            <h1 className="detail-heading-title">{book.title}</h1>
            <p className="detail-heading-author">{book.author}</p>

            {firstLine && (
              <p className="detail-tagline-text">{firstLine}</p>
            )}
          </div>
        </div>

        {/* Lower Surface Section */}
        <div className="detail-lower-surface">
          {/* Action Toolbar inside Surface */}
          <div className="detail-action-toolbar">
            {isAvailable ? (
              <Link to={`/books/${book._id}/order`} className="btn-dark detail-order-btn">
                Order now ↗
              </Link>
            ) : (
              <button className="btn-dark detail-order-btn" disabled>
                Out of stock
              </button>
            )}

            <div className="detail-price-status-wrap">
              <span className="detail-coral-price">₹{book.price}</span>
              <span className="detail-stock-note">
                {isAvailable ? `${book.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="detail-icon-circles-group">
              <div className="detail-circle-icon-btn" title="Bookmark">
                <Bookmark size={18} strokeWidth={1.5} />
              </div>
              <div className="detail-circle-icon-btn" title="Share">
                <Share2 size={18} strokeWidth={1.5} />
              </div>
              <div className="detail-circle-icon-btn" title="Download">
                <Download size={18} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="detail-admin-row">
              <Link to={`/admin/books/${book._id}/edit`} className="btn-outline btn-sm">
                Edit
              </Link>
              <button onClick={deleteBook} className="btn-outline btn-sm" style={{ color: 'var(--coral)' }}>
                Delete
              </button>
            </div>
          )}

          {/* Specs & Description Grid */}
          <div className="detail-specs-grid">
            {/* Left Column: Description & Review */}
            <div className="lower-col-description">
              <h3 className="lower-section-heading">Description</h3>
              <p className="lower-description-body">
                {book.description || 'No detailed description provided for this volume.'}
              </p>

              <div className="lower-review-block">
                <div className="lower-review-avatar">RJ</div>
                <div className="lower-review-content">
                  <span className="lower-reviewer-name">Roberto Jordan</span>
                  <p className="lower-reviewer-quote">
                    What a delightful and magical book it is! It indeed transports readers to the wizarding world.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Specs */}
            <div className="lower-col-specs">
              <div className="specs-meta-item">
                <span className="specs-item-label">Author</span>
                <span className="specs-item-value">{book.author}</span>
              </div>

              <div className="specs-meta-item">
                <span className="specs-item-label">Genre</span>
                <span className="specs-item-value">{book.genre}</span>
              </div>

              <div className="specs-meta-item">
                <span className="specs-item-label">Language</span>
                <span className="specs-item-value">{book.language || 'English'}</span>
              </div>

              <div className="specs-meta-item">
                <span className="specs-item-label">Paperback</span>
                <span className="specs-item-value">
                  {book.pages ? `paper textured, full colour, ${book.pages} pages` : 'Standard edition'}
                </span>
                {book.isbn && (
                  <span className="specs-item-isbn">ISBN: {book.isbn}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
