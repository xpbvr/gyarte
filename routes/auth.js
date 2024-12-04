const express = require('express');
const db = require('../models/db');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err || !user) {
      return res.status(401).send('Invalid credentials');
    }

    req.session.user = user;
    res.redirect('/dashboard.html');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
