import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/order.css';

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    api
      .get(`/books/${id}`)
      .then((res) => setBook(res.data))
      .catch(() => navigate('/library'));
  }, [id, navigate]);

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/orders', { bookId: id, quantity });
      setSuccess(
        `Order placed successfully! You ordered ${quantity} copy(s) of "${book.title}".`
      );
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!book) {
    return (
      <div className="order-page-centered">
        <p>Loading order details...</p>
      </div>
    );
  }

  const isAvailable = book.stock > 0;
  const totalPrice = book.price * quantity;

  return (
    <div className="order-page-centered">
      <div className="order-centered-card">
        <h1 className="order-card-title">Place Order</h1>
        <p className="order-card-subtitle">Review your book and confirm quantity</p>

        <div className="order-book-summary-row">
          <div className="order-book-cover-thumb">
            {!imgError && book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="order-thumb-fallback">
                <span>{book.title}</span>
              </div>
            )}
          </div>

          <div className="order-summary-text">
            <h3 className="order-book-name">{book.title}</h3>
            <p className="order-book-byline">by {book.author}</p>
            <div className="order-book-unit-price">₹{book.price} per copy</div>
            <div className={`order-book-stock-tag ${isAvailable ? 'in-stock' : 'out-stock'}`}>
              {isAvailable ? `${book.stock} copies available` : 'Out of stock'}
            </div>
          </div>
        </div>

        {!success ? (
          <form onSubmit={placeOrder} className="order-form-controls">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                max={book.stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) {
                    setQuantity(Math.min(book.stock, Math.max(1, val)));
                  }
                }}
                required
                disabled={!isAvailable}
              />
            </div>

            <div className="order-total-price-bar">
              <span className="order-total-text">Total:</span>
              <span className="order-total-val">₹{totalPrice}</span>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="order-btn-actions">
              <button
                className="btn-dark order-submit-btn"
                type="submit"
                disabled={loading || !isAvailable}
              >
                {loading ? 'Placing order...' : 'Place Order ↗'}
              </button>
              <Link to={`/books/${id}`} className="btn-outline">
                Cancel
              </Link>
            </div>
          </form>
        ) : (
          <div className="order-success-box">
            <div className="success-msg">{success}</div>
            <Link to="/library" className="btn-dark" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
              Back to Library ↗
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
