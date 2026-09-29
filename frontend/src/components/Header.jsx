import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import '../styles/header.css';

export default function Header({ user, searchQuery, onSearchChange, onLogout }) {
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
    <header className="app-top-header">
      <div className="search-box-container">
        <Search size={16} className="search-box-icon" />
        <input
          type="text"
          className="search-box-input"
          placeholder="Search book name, author, edition..."
          value={searchQuery || ''}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      <div className="header-user-section">
        {user ? (
          <div className="user-profile-pill">
            <div className="user-initials-avatar">
              {getInitials(user.name)}
            </div>
            <span className="user-full-name">{user.name}</span>
            <button onClick={onLogout} className="btn-user-logout" title="Sign Out">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-nav-group">
            <Link to="/login" className="btn btn-outline btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-coral btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
