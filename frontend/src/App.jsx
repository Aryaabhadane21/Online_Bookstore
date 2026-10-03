import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LibraryPage from './pages/LibraryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
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
    <div className="app-frame">
      <div className="app-panel">
        <Sidebar />
        <div className="app-main-layout">
          <Header user={user} onLogout={handleLogout} />
          <main className="app-scroll-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/library" element={<LibraryPage />} />
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
    </div>
  );
}
