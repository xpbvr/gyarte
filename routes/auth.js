const express = require('express');
const db = require('../models/db');

const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user) {
      console.error('Error fetching user:', err);
      return res.redirect('/login.html');
    }

    if (password === user.password) {
      req.session.user = { id: user.id, role: user.role };
      return res.redirect('/dashboard.html');
    }

    res.redirect('/login.html');
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router; // Ensure this is exported correctly
