import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }

    const onStorage = () => {
      const u = localStorage.getItem('user');
      try {
        setUser(u ? JSON.parse(u) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-text">The Bookstore</span>
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Catalog
          </Link>

          {user ? (
            <div className="nav-user-section">
              {user.role === 'admin' && (
                <Link
                  to="/admin/books/new"
                  className={`btn-admin-add ${
                    location.pathname === '/admin/books/new' ? 'active' : ''
                  }`}
                >
                  <span className="plus-sign">+</span> Add Book
                </Link>
              )}
              
              <div className="user-profile-badge">
                <div className="user-avatar">{getInitials(user.name)}</div>
                <div className="user-meta">
                  <span className="user-name">{user.name}</span>
                  {user.role === 'admin' && (
                    <span className="role-tag">Admin</span>
                  )}
                </div>
              </div>

              <button className="btn btn-logout" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-section">
              <Link
                to="/login"
                className={`nav-link ${
                  location.pathname === '/login' ? 'active' : ''
                }`}
              >
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
