const express = require('express');
const cors = require('cors');

const app = express();

// Add startup logging
console.log('Starting server...');

// Enable CORS for your frontend
app.use(cors());
app.use(express.json());

// Add a basic health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
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
app.get('/api/goals', (req, res) => {
  console.log('GET /api/goals called');
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  console.log('POST /api/goals called with:', req.body);
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

app.put('/api/goals/:id', (req, res) => {
  console.log('PUT /api/goals/:id called with:', req.params.id);
  const goal = goals.find(g => g.id === req.params.id);
  if (goal) {
    goal.isCompleted = req.body.isCompleted;
    res.json(goal);
  } else {
    res.status(404).json({ error: 'Goal not found' });
  }
});

app.get('/api/quotes/random', (req, res) => {
  console.log('GET /api/quotes/random called');
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json(quote);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Start server with proper error handling
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`Server successfully started and running on port ${PORT}`);
});