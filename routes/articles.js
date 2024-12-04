const express = require('express');
const db = require('../models/db');
const router = express.Router();

// Get all articles
router.get('/', (req, res) => {
  db.all(`SELECT * FROM articles`, [], (err, articles) => {
    if (err) {
      return res.status(500).send('Error fetching articles');
    }
    res.json(articles);
  });
});

// Get a specific article by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, article) => {
    if (err || !article) {
      return res.status(404).send('Article not found');
    }
    res.json(article);
  });
});

// Create a new article (only for logged-in authors)
router.post('/create', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'author') {
    return res.status(403).send('Unauthorized');
  }

  const { title, content } = req.body;

  db.run(`INSERT INTO articles (title, content, author_id) VALUES (?, ?, ?)`,
    [title, content, req.session.user.id],
    function(err) {
      if (err) {
        return res.status(500).send('Error creating article');
      }
      res.redirect('/dashboard.html');
    }
  );
});

// Edit article (only for logged-in authors)
router.post('/edit/:id', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'author') {
    return res.status(403).send('Unauthorized');
  }

  const { id } = req.params;
  const { title, content } = req.body;

  db.get(`SELECT * FROM articles WHERE id = ?`, [id], (err, article) => {
    if (err || !article) {
      return res.status(404).send('Article not found');
    }

    if (article.author_id !== req.session.user.id) {
      return res.status(403).send('You can only edit your own articles');
    }

    db.run(`UPDATE articles SET title = ?, content = ? WHERE id = ?`,
      [title, content, id],
      function(err) {
        if (err) {
          return res.status(500).send('Error updating article');
        }
        res.redirect('/dashboard.html');
      }
    );
  });
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
      return res.status(403).send('You can only delete your own articles');
    }

    db.run(`DELETE FROM articles WHERE id = ?`, [id], function(err) {
      if (err) {
        return res.status(500).send('Error deleting article');
      }
      res.redirect('/dashboard.html');
    });
  });
});

module.exports = router;