import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import '../styles/home.css';

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
}

export default function HomePage() {
  const user = getUser();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(new Date().getDay());

  useEffect(() => {
    api
      .get('/books', { params: { limit: 8, sort: 'title' } })
      .then((res) => {
        setBooks(res.data.books || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featuredBook = books[0] || null;
  const popularBooks = books.slice(1, 5);
  const seriesBook1 = books[5] || null;
  const seriesBook2 = books[6] || null;

  // Generate 7 days for current week offset
  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay + weekOffset * 7);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames.map((name, idx) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + idx);
      return {
        name,
        date: d.getDate(),
        isSunday: idx === 0,
        index: idx
      };
    });
  };

  const weekDays = getWeekDays();

  return (
    <div className="home-two-col-layout">
      {/* Left Column (55% width, --bg) */}
      <div className="home-left-col">
        {/* 1. Hero */}
        <section className="home-hero-section">
          <div className="home-hero-content">
            <h1 className="home-hero-title">
              Happy reading,
              {user?.name && <span className="home-hero-name">{user.name.split(' ')[0]}</span>}
            </h1>
            <p className="home-hero-subtitle">
              Browse the library, search by title, author or genre, and order the books you want.
            </p>
            <Link to="/library" className="btn-dark home-hero-btn">
              Browse books ↗
            </Link>
          </div>

          {featuredBook && (
            <div className="home-hero-featured-wrap">
              <Link to={`/books/${featuredBook._id}`} className="home-hero-featured-cover">
                {featuredBook.coverImage ? (
                  <img
                    src={featuredBook.coverImage}
                    alt={featuredBook.title}
                    className="hero-featured-img"
                  />
                ) : (
                  <div className="hero-featured-placeholder">
                    <span>{featuredBook.title}</span>
                  </div>
                )}
              </Link>
            </div>
          )}
        </section>

        {/* 2. Popular Now */}
        <section className="home-popular-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Popular Now</h2>
            <div className="section-dots-icon">••</div>
          </div>

          <div className="popular-now-grid">
            {popularBooks.map((book) => (
              <BookCard key={book._id} book={book} showPrice={false} />
            ))}
          </div>
        </section>

        {/* 3. New Series Collection */}
        {seriesBook1 && (
          <section className="home-series-section">
            <div className="home-section-header">
              <h2 className="home-section-title">New Series Collection</h2>
              <div className="section-dots-icon">••</div>
            </div>

            <Link to={`/books/${seriesBook1._id}`} className="series-collection-card">
              <div className="series-stacked-covers">
                <div className="series-cover-back">
                  {seriesBook2?.coverImage ? (
                    <img src={seriesBook2.coverImage} alt={seriesBook2.title} />
                  ) : (
                    <div className="series-placeholder">Vol II</div>
                  )}
                </div>
                <div className="series-cover-front">
                  {seriesBook1.coverImage ? (
                    <img src={seriesBook1.coverImage} alt={seriesBook1.title} />
                  ) : (
                    <div className="series-placeholder">Vol I</div>
                  )}
                </div>
              </div>

              <div className="series-info">
                <h3 className="series-title">{seriesBook1.title}</h3>
                <p className="series-author">{seriesBook1.author}</p>
              </div>

              <div className="series-count-badge">2 books</div>
            </Link>
          </section>
        )}
      </div>

      {/* Right Column (45% width, --surface) */}
      <div className="home-right-col">
        {/* 1. Featured Book Details */}
        {featuredBook && (
          <section className="featured-details-block">
            <Link to={`/books/${featuredBook._id}`}>
              <h2 className="featured-right-title">{featuredBook.title}</h2>
            </Link>

            <div className="featured-right-sub">
              <span className="featured-coral-price">₹{featuredBook.price}</span>
              <span className="featured-dot-sep">·</span>
              <span className="featured-page-count">
                {featuredBook.pages ? `${featuredBook.pages} pages` : 'Paperback'}
              </span>
            </div>

            <p className="featured-right-desc">
              {featuredBook.description || 'A timeless narrative waiting to be uncovered in our library.'}
            </p>

            <p className="featured-right-author">- {featuredBook.author}</p>
          </section>
        )}

        {/* 2. Schedule Reading (centered in remaining space) */}
        <section className="schedule-reading-block">
          <div className="schedule-header">
            <h3 className="schedule-title">Schedule Reading</h3>
            <div className="schedule-nav-arrows">
              <button
                type="button"
                className="schedule-arrow-btn"
                onClick={() => setWeekOffset((w) => w - 1)}
                title="Previous Week"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="schedule-arrow-btn"
                onClick={() => setWeekOffset((w) => w + 1)}
                title="Next Week"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="schedule-days-row">
            {weekDays.map((day) => {
              const isSelected = selectedDayIdx === day.index;
              return (
                <div
                  key={day.name}
                  className={`schedule-day-cell ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDayIdx(day.index)}
                >
                  <span className={`day-name ${day.isSunday ? 'coral-text' : ''}`}>
                    {day.name}
                  </span>
                  <span className={`day-number ${day.isSunday ? 'coral-text' : ''}`}>
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
