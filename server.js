const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173'],
//     credentials: true
// }));

// Routes
const bookRoutes = require('./src/books/book.route.js');
const orderRoutes = require('./src/orders/order.route.js');
const userRoutes = require('./src/users/user.route.js');
const adminRoutes = require('./src/stats/admin.stats.js');

app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/admin', adminRoutes);

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.use('/', (req, res) => {
      res.send('Book Store Server is running!');
    });

    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.log(err);
  }
}

main();

// Serve static files if in production environment
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
