# Online Bookstore

A full-stack online bookstore application where customers can browse, search, and order books, and administrators can manage the book catalog.

## Tech Stack

- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT Authentication, bcryptjs
- Frontend: React (Vite), React Router, Axios, Lucide React, Plain CSS
- Database: MongoDB Atlas

## Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend application runs on `http://localhost:5173`.

## Seeded Test Accounts

The seed script (`npm run seed`) populates 24 books across multiple genres and creates the following test accounts:

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@bookstore.com    | Admin@123    |
| Customer | customer@bookstore.com | Customer@123 |

## Environment Variables

### backend/.env

| Variable   | Description                      |
|------------|----------------------------------|
| PORT       | Port for the Express server      |
| MONGO_URI  | MongoDB connection string        |
| JWT_SECRET | Secret key for signing JWTs      |
| CLIENT_URL | Frontend client URL for CORS     |

### frontend/.env

| Variable          | Description          |
|-------------------|----------------------|
| VITE_API_BASE_URL | Backend API base URL |

## REST API Endpoints

| Method | Endpoint        | Access         | Description                                |
|--------|-----------------|----------------|--------------------------------------------|
| POST   | /auth/register  | Public         | Register a new customer account            |
| POST   | /auth/login     | Public         | Login with email and password              |
| GET    | /books          | Public         | List books with search, filters and paging |
| GET    | /books/genres   | Public         | Get distinct list of book genres           |
| GET    | /books/:id      | Public         | Get single book details                    |
| POST   | /books          | Admin only     | Add a new book to catalog                  |
| PATCH  | /books/:id      | Admin only     | Update an existing book                    |
| DELETE | /books/:id      | Admin only     | Delete a book from catalog                 |
| POST   | /orders         | Logged-in user | Place an order for a book                  |

### Query Parameters for GET /books

- `search`: Full text search on title and author
- `genre`: Case-insensitive exact genre match
- `author`: Case-insensitive partial author match
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: `price`, `-price`, `title`, `-title`
- `page`: Page number (default 1)
- `limit`: Items per page (default 8, max 50)


**## Live Demo

- Frontend: https://online-bookstore-2026.netlify.app
- Backend API: https://online-bookstore-c16k.onrender.com/books**
