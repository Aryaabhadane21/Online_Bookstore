import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import BookDetailPage from './pages/BookDetailPage';
import BookFormPage from './pages/BookFormPage';
import OrderPage from './pages/OrderPage';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

function ProtectedRoute({ children, adminOnly = false }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleStorage = () => {
      setUser(getUser());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <div className="app-wrapper">
      <Sidebar user={user} onLogout={handleLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header
          user={user}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLogout={handleLogout}
        />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<CatalogPage searchQuery={searchQuery} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route
              path="/books/:id/order"
              element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/books/new"
              element={
                <ProtectedRoute adminOnly>
                  <BookFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/books/:id/edit"
              element={
                <ProtectedRoute adminOnly>
                  <BookFormPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
