const express = require('express');
const cors = require('cors');

const app = express();

// Starting log
console.log('Server starting up...');

// CORS configuration
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(express.json());

// Basic route to verify server is running
app.get('/', (req, res) => {
  res.json({ 
    status: 'active',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
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

// Routes with logging
app.get('/api/quotes/random', (req, res) => {
  console.log('Random quote requested');
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  console.log('Sending quote:', quote);
  res.json(quote);
});

app.get('/api/goals', (req, res) => {
  console.log('Goals requested');
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  console.log('New goal received:', req.body);
  const goal = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    isCompleted: false,
    createdAt: new Date()
  };
  goals.unshift(goal);
  res.json(goal);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error', details: err.message });
});

const PORT = process.env.PORT || 3001;

// Start server with explicit host binding
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Current time:', new Date().toISOString());
  console.log('Environment:', process.env.NODE_ENV);
});