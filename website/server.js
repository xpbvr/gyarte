const express = require('express');
const { Article } = require('./models');
const app = express();

// Set up static folder for HTML
app.use(express.static('public'));

app.get('/articles', async (req, res) => {
    const articles = await Article.findAll();
    res.json(articles);
});

app.get('/article/:id', async (req, res) => {
    const article = await Article.findByPk(req.params.id);
    res.json(article);
});

app.listen(4000, () => {
    console.log('Website server running at http://localhost:4000');
});
