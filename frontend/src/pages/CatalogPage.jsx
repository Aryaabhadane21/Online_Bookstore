import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import '../styles/catalog.css';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export default function CatalogPage({ searchQuery = '' }) {
  const user = getUser();

  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: searchQuery,
    genre: '',
    author: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });
  const [applied, setApplied] = useState(filters);

  // Fetch distinct genres from backend on mount
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

  // Sync external search query from top header
  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setApplied((prev) => ({ ...prev, search: searchQuery }));
    setPage(1);
  }, [searchQuery]);

  const fetchBooks = useCallback(async (params, pg) => {
    setLoading(true);
    setError('');
    try {
      const query = { page: pg, limit: 8 };
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
      setError(err.response?.data?.error || 'Failed to load books');
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

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setApplied(filters);
  };

  const clearFilters = () => {
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
  };

  const scrollToGrid = () => {
    const gridEl = document.getElementById('books-section');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredBook = books[0] || null;
  const currentCount = books.length;
  const formattedCount = currentCount < 10 ? `0${currentCount}` : currentCount;

  return (
    <div className="catalog-container">
      {/* Top Banner with Greeting & Featured Card */}
      <section className="catalog-top-banner">
        <div className="banner-left">
          <h1 className="banner-heading">
            Happy reading{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="banner-subtext">
            Explore our curated collection of books and find your next read.
          </p>
          <button onClick={scrollToGrid} className="btn btn-dark btn-browse-action">
            Browse books ↗
          </button>
        </div>

        {featuredBook && (
          <Link to={`/books/${featuredBook._id}`} className="featured-book-panel">
            <div className="featured-book-cover-wrap">
              {featuredBook.coverImage ? (
                <img
                  src={featuredBook.coverImage}
                  alt={featuredBook.title}
                  className="featured-cover-img"
                />
              ) : (
                <div className="featured-cover-fallback">
                  <span>{featuredBook.title}</span>
                </div>
              )}
            </div>
            <div className="featured-book-details">
              <h3 className="featured-title">{featuredBook.title}</h3>
              <p className="featured-author">{featuredBook.author}</p>
              {featuredBook.description && (
                <p className="featured-snippet">
                  {featuredBook.description.split('.')[0]}.
                </p>
              )}
              <div className="featured-price-tag">₹{featuredBook.price}</div>
            </div>
          </Link>
        )}
      </section>

      {/* Filter Row in Pill Style */}
      <section className="catalog-filter-section" id="books-section">
        <form onSubmit={applyFilters} className="pill-filters-form">
          <select
            name="genre"
            value={filters.genre}
            onChange={handleFilterChange}
            className="filter-pill-select"
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
            className="filter-pill-input"
          />

          <input
            type="number"
            name="minPrice"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className="filter-pill-input-price"
            min="0"
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="filter-pill-input-price"
            min="0"
          />

          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="filter-pill-select"
          >
            <option value="">Sort by</option>
            <option value="price">Price: low to high</option>
            <option value="-price">Price: high to low</option>
            <option value="title">Title: A to Z</option>
            <option value="-title">Title: Z to A</option>
          </select>

          <button type="submit" className="btn btn-coral btn-sm">
            Filter
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="btn btn-outline btn-sm"
          >
            Clear
          </button>
        </form>
      </section>

      {error && <div className="error-msg">{error}</div>}

      {/* Book Grid */}
      {loading ? (
        <div className="catalog-status-state">
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="catalog-status-state">
          <p className="empty-heading">No books found</p>
          <button
            className="btn btn-outline btn-sm"
            onClick={clearFilters}
            style={{ marginTop: '0.75rem' }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="books-grid-4col">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {/* Pagination & Count */}
      {books.length > 0 && (
        <div className="catalog-pagination-row">
          <div className="pagination-arrows">
            <button
              className="round-page-btn"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                scrollToGrid();
              }}
              disabled={page === 1}
              title="Previous Page"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="round-page-btn"
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                scrollToGrid();
              }}
              disabled={page === totalPages}
              title="Next Page"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="catalog-count-display">
            <span className="count-coral">{formattedCount}</span> / {total} books
          </div>
        </div>
      )}
    </div>
  );
}
