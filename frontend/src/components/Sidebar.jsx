import { Link, useLocation } from 'react-router-dom';
import { BookOpen, LayoutGrid, Plus, LogIn, LogOut } from 'lucide-react';
import '../styles/sidebar.css';

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <Link to="/" className="sidebar-brand-logo" title="Online Bookstore">
          <BookOpen size={22} strokeWidth={2} />
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`sidebar-icon-link ${location.pathname === '/' ? 'active' : ''}`}
          title="Catalog"
        >
          <LayoutGrid size={19} strokeWidth={2} />
        </Link>

        {isAdmin && (
          <Link
            to="/admin/books/new"
            className={`sidebar-icon-link ${location.pathname === '/admin/books/new' ? 'active' : ''}`}
            title="Add Book"
          >
            <Plus size={20} strokeWidth={2.2} />
          </Link>
        )}
      </nav>

      <div className="sidebar-bottom">
        {user ? (
          <button
            onClick={onLogout}
            className="sidebar-icon-link btn-sidebar-action"
            title="Log Out"
          >
            <LogOut size={18} strokeWidth={2} />
          </button>
        ) : (
          <Link
            to="/login"
            className={`sidebar-icon-link ${location.pathname === '/login' || location.pathname === '/register' ? 'active' : ''}`}
            title="Log In"
          >
            <LogIn size={18} strokeWidth={2} />
          </Link>
        )}
      </div>
    </aside>
  );
}
