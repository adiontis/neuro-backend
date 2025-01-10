const express = require('express');

const mongoose = require('mongoose');

const cors = require('cors');

require('dotenv').config();



const app = express();

app.use(cors());

app.use(express.json());



// Combined models

const Goal = mongoose.model('Goal', {

  title: String,

  description: String,

  isCompleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },

});



// Pre-loaded quotes (no database needed for quotes)

const QUOTES = [

  { text: "The unexamined life is not worth living", author: "Socrates" },

  { text: "I think, therefore I am", author: "René Descartes" },

  { text: "He who has a why to live can bear almost any how", author: "Friedrich Nietzsche" },

];



// Routes

app.get('/api/goals', async (req, res) => {

  const goals = await Goal.find().sort({ createdAt: -1 });

  res.json(goals);

});



app.post('/api/goals', async (req, res) => {

  const goal = new Goal(req.body);

  await goal.save();

  res.json(goal);

});



app.get('/api/quotes/random', (req, res) => {

  res.json(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

});



mongoose

  .connect(process.env.MONGODB_URI)

  .then(() => app.listen(process.env.PORT || 3000))

  .catch((error) => console.error('Error connecting to MongoDB:', error));