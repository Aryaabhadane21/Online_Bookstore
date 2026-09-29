import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import '../styles/bookform.css';

export default function BookFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    stock: '',
    coverImage: '',
    description: '',
    language: 'English',
    pages: '',
    isbn: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/books/${id}`)
      .then((res) => {
        const {
          title,
          author,
          genre,
          price,
          stock,
          coverImage,
          description,
          language,
          pages,
          isbn
        } = res.data;
        setForm({
          title: title || '',
          author: author || '',
          genre: genre || '',
          price: price !== undefined ? price : '',
          stock: stock !== undefined ? stock : '',
          coverImage: coverImage || '',
          description: description || '',
          language: language || 'English',
          pages: pages || '',
          isbn: isbn || ''
        });
      })
      .catch(() => setError('Failed to load book data'));
  }, [id, isEdit]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        coverImage: form.coverImage.trim() || undefined,
        description: form.description.trim() || undefined,
        language: form.language.trim() || 'English',
        pages: form.pages ? Number(form.pages) : undefined,
        isbn: form.isbn.trim() || undefined
      };

      if (isEdit) {
        await api.patch(`/books/${id}`, payload);
      } else {
        await api.post('/books', payload);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-page-wrap">
      <div className="book-form-card">
        <div className="book-form-header">
          <h1 className="book-form-title">{isEdit ? 'Edit Book' : 'Add Book'}</h1>
          <p className="book-form-subtitle">
            {isEdit
              ? 'Update catalog and inventory details'
              : 'Add a new book to the catalog'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. A Game of Thrones"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                placeholder="e.g. George R.R. Martin"
                value={form.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Genre *</label>
              <input
                type="text"
                name="genre"
                placeholder="e.g. Fantasy"
                value={form.genre}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                placeholder="499"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                step="1"
              />
            </div>

            <div className="form-group">
              <label>Stock *</label>
              <input
                type="number"
                name="stock"
                placeholder="10"
                value={form.stock}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              placeholder="https://covers.openlibrary.org/b/isbn/9780553103540-L.jpg"
              value={form.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Short description of the book..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid-3col">
            <div className="form-group">
              <label>Language</label>
              <input
                type="text"
                name="language"
                placeholder="English"
                value={form.language}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Pages</label>
              <input
                type="number"
                name="pages"
                placeholder="694"
                value={form.pages}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                name="isbn"
                placeholder="9780553103540"
                value={form.isbn}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <div className="form-actions-row">
            <button
              className="btn btn-dark"
              type="submit"
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading
                ? 'Saving...'
                : isEdit
                ? 'Update Book'
                : 'Add Book'}
            </button>
            <Link to="/" className="btn btn-outline" style={{ flex: 1 }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
