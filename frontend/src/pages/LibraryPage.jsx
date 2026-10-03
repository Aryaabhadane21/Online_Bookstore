import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import '../styles/library.css';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export default function LibraryPage() {
  const user = getUser();
  const isAdmin = user?.role === 'admin';
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchFromUrl = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    search: searchFromUrl,
    genre: '',
    author: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });
  const [applied, setApplied] = useState(filters);

  // Sync with search URL parameter changes
  useEffect(() => {
    const urlQuery = searchParams.get('search') || '';
    setFilters((prev) => ({ ...prev, search: urlQuery }));
    setApplied((prev) => ({ ...prev, search: urlQuery }));
    setPage(1);
  }, [searchParams]);

  // Load distinct genres
  useEffect(() => {
    api
      .get('/books/genres')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setGenres(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const fetchBooks = useCallback(async (params, pg) => {
    setLoading(true);
    setError('');
    try {
      const query = { page: pg, limit: 12 };
      if (params.search) query.search = params.search;
      if (params.genre) query.genre = params.genre;
      if (params.author) query.author = params.author;
      if (params.minPrice) query.minPrice = params.minPrice;
      if (params.maxPrice) query.maxPrice = params.maxPrice;
      if (params.sort) query.sort = params.sort;

      const res = await api.get('/books', { params: query });
      setBooks(res.data.books || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load library books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks(applied, page);
  }, [applied, page, fetchBooks]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied(filters);
    if (filters.search) {
      setSearchParams({ search: filters.search });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    const empty = {
      search: '',
      genre: '',
      author: '',
      minPrice: '',
      maxPrice: '',
      sort: ''
    };
    setFilters(empty);
    setApplied(empty);
    setPage(1);
    setSearchParams({});
  };

  const currentCount = books.length;
  const formattedCount = currentCount < 10 ? `0${currentCount}` : currentCount;

  // Render page numbers array for pagination
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="library-view-container">
      {/* Top Header Row: Heading & Count & Add Book */}
      <div className="library-header-row">
        <h1 className="library-heading">Library</h1>

        <div className="library-header-actions">
          {isAdmin && (
            <Link to="/admin/books/new" className="btn-dark btn-sm">
              <Plus size={16} /> Add Book
            </Link>
          )}

          <div className="library-count-indicator">
            <span className="count-coral">{formattedCount}</span> / {total} books
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <form onSubmit={handleApply} className="library-filter-bar">
        <select
          name="genre"
          value={filters.genre}
          onChange={handleFilterChange}
          className="lib-filter-control select-control"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="author"
          placeholder="Author name..."
          value={filters.author}
          onChange={handleFilterChange}
          className="lib-filter-control"
        />

        <input
          type="number"
          name="minPrice"
          placeholder="Min ₹"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="lib-filter-control price-control"
          min="0"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Max ₹"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="lib-filter-control price-control"
          min="0"
        />

        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="lib-filter-control select-control"
        >
          <option value="">Sort by</option>
          <option value="price">Price: low to high</option>
          <option value="-price">Price: high to low</option>
          <option value="title">Title: A to Z</option>
          <option value="-title">Title: Z to A</option>
        </select>

        <button type="submit" className="btn-dark btn-sm">
          Filter
        </button>
        <button type="button" onClick={handleClear} className="btn-outline btn-sm">
          Clear
        </button>
      </form>

      {error && <div className="error-msg">{error}</div>}

      {/* Grid or Empty */}
      {loading ? (
        <div className="library-empty-box">
          <p>Loading catalog...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="library-empty-box">
          <p className="empty-title">No books found</p>
          <button type="button" onClick={handleClear} className="btn-outline btn-sm" style={{ marginTop: '1rem' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div className="library-books-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} showPrice={true} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="library-pagination-row">
          <button
            type="button"
            className="pagination-round-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            title="Previous Page"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="pagination-numbers">
            {getPageNumbers().map((num) => (
              <button
                key={num}
                type="button"
                className={`page-num-btn ${page === num ? 'active-page' : ''}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="pagination-round-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            title="Next Page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
