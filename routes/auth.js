const express = require('express');
const db = require('../models/db');

const router = express.Router();
// V Funktion för inloggningen till artikel uppladdningsidan
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Tar från databasens användare samt lösenord för att kolla om autentiseringsuppgifterna är korrekta
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
    if (err || !user) {
      return res.status(401).send('Invalid credentials');
    }

    req.session.user = user;
    res.redirect('/dashboard.html');
  });
});
// Funktion för att logga ut den aktiva användaren från sidan
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

module.exports = router;
