const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp');

// Score Schema
const scoreSchema = new mongoose.Schema({
  playerName: String,
  score: Number,
  total: Number,
  category: String,
  date: { type: Date, default: Date.now }
});
const Score = mongoose.model('Score', scoreSchema);

// Quiz Questions
const questions = {
  general: [
    { id: 1, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], answer: "Paris" },
    { id: 2, question: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Earth", "Mars"], answer: "Mercury" },
    { id: 3, question: "How many continents are there?", options: ["5", "6", "7", "8"], answer: "7" },
    { id: 4, question: "What is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: "Pacific" },
    { id: 5, question: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"], answer: "Da Vinci" },
  ],
  tech: [
    { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None"], answer: "Hyper Text Markup Language" },
    { id: 2, question: "Which language runs in the browser?", options: ["Python", "Java", "JavaScript", "C++"], answer: "JavaScript" },
    { id: 3, question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Coded Style Sheets"], answer: "Cascading Style Sheets" },
    { id: 4, question: "What is React?", options: ["A database", "A JS framework", "A JS library", "A programming language"], answer: "A JS library" },
    { id: 5, question: "What does API stand for?", options: ["Application Programming Interface", "Applied Program Integration", "App Process Interface", "None"], answer: "Application Programming Interface" },
  ],
  science: [
    { id: 1, question: "What is H2O?", options: ["Oxygen", "Hydrogen", "Water", "Carbon Dioxide"], answer: "Water" },
    { id: 2, question: "What is the speed of light?", options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "200,000 km/s"], answer: "300,000 km/s" },
    { id: 3, question: "What gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"], answer: "Carbon Dioxide" },
    { id: 4, question: "How many bones in a human body?", options: ["196", "206", "216", "186"], answer: "206" },
    { id: 5, question: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], answer: "Mitochondria" },
  ]
};

app.get('/api/questions/:category', (req, res) => {
  const { category } = req.params;
  const qs = questions[category] || questions.general;
  const sanitized = qs.map(({ answer, ...rest }) => rest);
  res.json(sanitized);
});

app.post('/api/submit', async (req, res) => {
  const { playerName, answers, category } = req.body;
  const qs = questions[category] || questions.general;
  let score = 0;
  qs.forEach((q) => {
    if (answers[q.id] === q.answer) score++;
  });
  const result = await Score.create({ playerName, score, total: qs.length, category });
  res.json({ score, total: qs.length, _id: result._id });
});

app.get('/api/leaderboard', async (req, res) => {
  const scores = await Score.find().sort({ score: -1 }).limit(10);
  res.json(scores);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Quiz server running on port ${PORT}`));
