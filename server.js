const express = require('express');
const cors = require('cors');

const app = express();

console.log('Starting server initialization...');

// More permissive CORS settings
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Basic health check
app.get('/', (req, res) => {
  console.log('Health check endpoint hit');
  res.json({ 
    status: 'Server is running',
    timestamp: new Date(),
    port: process.env.PORT || 3001
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// In-memory storage
let goals = [];

// Pre-loaded quotes
const QUOTES = [
  { text: "The unexamined life is not worth living", author: "Socrates" },
  { text: "I think, therefore I am", author: "René Descartes" },
  { text: "He who has a why to live can bear almost any how", author: "Friedrich Nietzsche" },
  { text: "Life must be understood backward. But it must be lived forward", author: "Søren Kierkegaard" }
];

app.get('/api/quotes/random', (req, res) => {
  console.log('Random quote endpoint hit');
  try {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    console.log('Sending quote:', quote);
    res.json(quote);
  } catch (error) {
    console.error('Error in /api/quotes/random:', error);
    res.status(500).json({ error: 'Failed to get quote', details: error.message });
  }
});

app.get('/api/goals', (req, res) => {
  console.log('Goals endpoint hit. Current goals:', goals.length);
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  console.log('Received new goal:', req.body);
  const goal = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    isCompleted: false,
    createdAt: new Date()
  };
  goals.unshift(goal);
  console.log('Added new goal. Total goals:', goals.length);
  res.json(goal);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error in middleware:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 3001;

// Start server with detailed error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started successfully`);
  console.log(`Running on port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Current time: ${new Date().toISOString()}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});