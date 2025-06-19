require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoute = require('./routes/usersRoute');
const bookingsRoute = require('./routes/bookingsRoute');
const cylindersRoute = require('./routes/cylindersRoute');
const paymentRoute = require('./routes/paymentRoute');

const app = express();

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Production CORS Configuration
const allowedOrigins = [
  'https://gas-agency-client.vercel.app',
  'https://gas-agency-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: ${origin} not allowed`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Updated MongoDB connection (removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully');
  // Add connection event listeners
  mongoose.connection.on('connected', () => console.log('Mongoose connected'));
  mongoose.connection.on('error', (err) => console.error('Mongoose error:', err));
  mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

app.get('/', (req, res) => {
  res.json({
    message: "API is running",
    endpoints: {
      users: '/api/users',
      cylinders: '/api/cylinders',
      bookings: '/api/bookings'
    }
  });
});

// Routes with logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/cylinders', cylindersRoute);
app.use('/api/payment', paymentRoute);

// Enhanced health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    dbState: mongoose.connection.readyState, // 1 = connected
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`API Base URL: ${process.env.NODE_ENV === 'production' 
    ? `https://your-render-url.onrender.com/api`
    : `http://localhost:${PORT}/api`}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});