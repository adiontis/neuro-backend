const express = require('express');
const cors = require('cors');

const app = express();

// More permissive CORS settings for development
app.use(cors({
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  next();
});

// Test endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
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

app.get('/api/goals', (req, res) => {
  console.log('Sending goals:', goals);
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
  console.log('Added new goal:', goal);
  res.json(goal);
});

app.put('/api/goals/:id', (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (goal) {
    goal.isCompleted = req.body.isCompleted;
    res.json(goal);
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

app.get('/api/quotes/random', (req, res) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  console.log('Sending quote:', quote);
  res.json(quote);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});