const express = require('express');
const db = require('../models/db');

const router = express.Router();

// Get all articles
router.get('/', (req, res) => {
  db.all(`SELECT * FROM articles`, [], (err, articles) => {
    if (err) {
      console.error('Error fetching articles:', err);
      return res.status(500).send('Error fetching articles');
    }
    res.json(articles);
  });
});

// Create article (only for logged-in authors)
router.post('/create', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'author') {
    return res.status(403).send('Unauthorized');
  }

  const { title, content } = req.body;
  const author_id = req.session.user.id;

  db.run(
    `INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)`,
    [title, content, author_id],
    (err) => {
      if (err) {
        console.error('Error creating article:', err);
        return res.status(500).send('Error creating article');
      }
      res.redirect('/dashboard.html');
    }
  );
});

// Delete article (only for logged-in authors)
router.post('/delete/:id', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'author') {
    return res.status(403).send('Unauthorized');
  }

  const { id } = req.params;

  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, article) => {
    if (err || !article) {
      return res.status(404).send('Article not found');
    }

    if (article.author_id !== req.session.user.id) {
      return res.status(403).send('Unauthorized to delete this article');
    }

    db.run(`DELETE FROM articles WHERE id = ?`, [id], (err) => {
      if (err) {
        return res.status(500).send('Error deleting article');
      }
      res.redirect('/dashboard.html');
    });
  });
});

module.exports = router;
