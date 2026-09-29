require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/orders', orderRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
