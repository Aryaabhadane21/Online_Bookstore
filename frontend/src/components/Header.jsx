import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import '../styles/header.css';

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (query.trim()) {
        navigate(`/library?search=${encodeURIComponent(query.trim())}`);
      } else {
        navigate('/library');
      }
    }
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
    <header className="header-bar">
      <div className="header-search-wrap">
        <Search size={22} strokeWidth={1.5} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search book name, author, edition ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="header-right-side">
        {user ? (
          <div className="header-user-badge">
            <div className="header-avatar-circle">
              {getInitials(user.name)}
            </div>
            <span className="header-user-name">{user.name}</span>
            <button onClick={onLogout} className="header-logout-btn" title="Sign Out">
              Logout
            </button>
            <div className="header-bell-wrap" title="Notifications">
              <Bell size={20} strokeWidth={1.5} />
            </div>
          </div>
        ) : (
          <div className="header-auth-group">
            <Link to="/login" className="btn-outline btn-sm">
              Sign In
            </Link>
            <Link to="/register" className="btn-dark btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
