const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running on port 3001' });
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
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  res.json(quote);
});

app.get('/api/goals', (req, res) => {
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});