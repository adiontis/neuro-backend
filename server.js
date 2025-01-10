const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
let goals = [];

// Pre-loaded quotes
const QUOTES = [
  { text: "The unexamined life is not worth living", author: "Socrates" },
  { text: "I think, therefore I am", author: "René Descartes" },
  { text: "He who has a why to live can bear almost any how", author: "Friedrich Nietzsche" },
  { text: "Life must be understood backward. But it must be lived forward", author: "Søren Kierkegaard" }
];

// Routes
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
  goals.unshift(goal); // Add to start of array
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
  res.json(quote);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});