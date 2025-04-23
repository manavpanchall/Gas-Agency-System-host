require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRoute = require('./routes/usersRoute');
const bookingsRoute = require('./routes/bookingsRoute');
const cylindersRoute = require('./routes/cylindersRoute');
const paymentRoute = require('./routes/paymentRoute');

const app = express();

// Production CORS Configuration
const allowedOrigins = [
  'https://gas-agency-client.vercel.app',    // Your Vercel client URL
  'https://gas-agency-admin.vercel.app',     // Your Vercel admin URL
  ...(process.env.NODE_ENV === 'development' ? [
    'http://localhost:3000',                 // Local client
    'http://localhost:3001'                  // Local admin
  ] : [])
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', usersRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/cylinders', cylindersRoute);
app.use('/api/payment', paymentRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});