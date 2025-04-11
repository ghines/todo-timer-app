// File: backend/index.js
// A basic Express server to handle task storage in a text-based JSON file

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 4000;
const DATA_FILE = 'tasks.json';

app.use(cors());
app.use(express.json());

app.get('/tasks', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) return res.json([]);
    try {
      res.json(JSON.parse(data));
    } catch {
      res.json([]);
    }
  });
});

app.post('/tasks', (req, res) => {
  fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).send('Failed to save');
    res.send('Saved');
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
