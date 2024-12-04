const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models/db');
const articlesRouter = require('./routes/articles');
const authRouter = require('./routes/auth');

const app = express();

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/articles', articlesRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
