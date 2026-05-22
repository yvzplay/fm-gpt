const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/api/teams', (req, res) => {
  res.json({ message: 'Teams endpoint - Coming soon' });
});

app.get('/api/teams/:teamId', (req, res) => {
  res.json({ message: `Team ${req.params.teamId} endpoint - Coming soon` });
});

app.get('/api/matches', (req, res) => {
  res.json({ message: 'Matches endpoint - Coming soon' });
});

app.listen(PORT, () => {
  console.log(`FM-GPT Server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

module.exports = app;
