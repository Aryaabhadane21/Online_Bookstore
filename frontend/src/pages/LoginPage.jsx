import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-centered">
      <div className="auth-centered-card">
        <h1 className="auth-card-title">Sign In</h1>
        <p className="auth-card-subtitle">Enter your details to access your account</p>

        <form onSubmit={handleSubmit} className="auth-form-content">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="name@bookstore.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button
            className="btn-dark auth-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In ↗'}
          </button>
        </form>

        <div className="auth-footer-prompt">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
