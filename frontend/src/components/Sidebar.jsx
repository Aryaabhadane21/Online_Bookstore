import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Clock, Bookmark, Settings, Menu } from 'lucide-react';
import '../styles/sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isLibrary = location.pathname === '/library';

  return (
    <aside className="sidebar-container">
      <div className="sidebar-top-logo">
        <Link to="/" title="Home">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="brand-drawn-logo"
          >
            <path d="M6 23C8.5 21 12 21 16 23C20 21 23.5 21 26 23V8C23.5 6 20 6 16 8C12 6 8.5 6 6 8V23Z" />
            <path d="M16 8V23" />
            <path d="M8 12C10 10.8 12.5 10.8 14 11.5" />
          </svg>
        </Link>
      </div>

      <nav className="sidebar-icon-nav">
        <Link
          to="/"
          className={`sidebar-nav-item ${isHome ? 'active' : ''}`}
          title="Home"
        >
          <div className="sidebar-icon-wrap">
            <Home size={26} strokeWidth={1.5} />
          </div>
        </Link>

        <Link
          to="/library"
          className={`sidebar-nav-item ${isLibrary ? 'active' : ''}`}
          title="Library"
        >
          <div className="sidebar-icon-wrap">
            <BookOpen size={26} strokeWidth={1.5} />
          </div>
        </Link>

        <div className="sidebar-nav-item static" title="Timer">
          <div className="sidebar-icon-wrap">
            <Clock size={26} strokeWidth={1.5} />
          </div>
        </div>

        <div className="sidebar-nav-item static" title="Bookmark">
          <div className="sidebar-icon-wrap">
            <Bookmark size={26} strokeWidth={1.5} />
          </div>
        </div>

        <div className="sidebar-nav-item static" title="Settings">
          <div className="sidebar-icon-wrap">
            <Settings size={26} strokeWidth={1.5} />
          </div>
        </div>
      </nav>

      <div className="sidebar-bottom-action">
        <div className="sidebar-menu-circle" title="Menu">
          <Menu size={22} strokeWidth={1.5} />
        </div>
      </div>
    </aside>
  );
}
