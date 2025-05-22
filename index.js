require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dummyRoutes = require('./routes/dummyRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS configuration
const allowedOrigins = [
  'https://frontendpennywise.netlify.app',
  'https://backendpennywise.netlify.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ✅ No need to manually set headers — CORS handles it above 👆

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error('❌ Error: MONGO_URI is not defined in .env file');
  process.exit(1); 
}

// ✅ MongoDB connection
mongoose.set('strictQuery', true);
mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('❌ Error connecting to MongoDB:', err);
  });

// ✅ Routes
app.use('/api', dummyRoutes);
app.use('/api', userRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});