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
      .catch(() => navigate('/'));
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
      <div className="order-page-wrapper">
        <p>Loading order details...</p>
      </div>
    );
  }

  const isAvailable = book.stock > 0;
  const totalPrice = book.price * quantity;

  return (
    <div className="order-page-wrapper">
      <div className="order-card-panel">
        <div className="order-card-header">
          <h1 className="order-card-title">Place Order</h1>
          <p className="order-card-subtitle">Review your book and confirm quantity</p>
        </div>

        <div className="order-book-summary-box">
          <div className="order-book-cover-thumb">
            {!imgError && book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="thumb-fallback">
                <span>{book.title}</span>
              </div>
            )}
          </div>

          <div className="order-book-info">
            <h3 className="order-summary-title">{book.title}</h3>
            <p className="order-summary-author">by {book.author}</p>
            <div className="order-summary-price">₹{book.price} per copy</div>
            <div className={`order-summary-stock ${isAvailable ? 'stock-ok' : 'stock-out'}`}>
              {isAvailable ? `${book.stock} copies in stock` : 'Out of stock'}
            </div>
          </div>
        </div>

        {!success ? (
          <form onSubmit={placeOrder} className="order-form-body">
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

            <div className="order-total-summary-row">
              <span className="order-total-label">Total Amount:</span>
              <span className="order-total-amount">₹{totalPrice}</span>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <div className="order-buttons-group">
              <button
                className="btn btn-dark btn-place-order"
                type="submit"
                disabled={loading || !isAvailable}
              >
                {loading ? 'Placing order...' : 'Place Order ↗'}
              </button>
              <Link to={`/books/${id}`} className="btn btn-outline">
                Cancel
              </Link>
            </div>
          </form>
        ) : (
          <div className="order-success-screen">
            <div className="order-success-pill">Order placed</div>
            <p className="order-success-text">{success}</p>
            <Link to="/" className="btn btn-dark" style={{ marginTop: '1.25rem' }}>
              Back to Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
