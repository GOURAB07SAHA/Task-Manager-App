const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route files
const auth = require('./routes/auth');
const tasks = require('./routes/tasks');
const users = require('./routes/users');

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL
}));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running...',
    version: '1.0.0'
  });
});

// Mount routers
app.use('/api/auth', auth);
app.use('/api/tasks', tasks);
app.use('/api/users', users);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});
