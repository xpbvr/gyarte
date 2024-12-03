const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth'); // Ensure this is a proper module
const articleRoutes = require('./routes/articles'); // Ensure this is a proper module

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use('/auth', authRoutes); // Ensure authRoutes is a Router instance
app.use('/articles', articleRoutes); // Ensure articleRoutes is a Router instance

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
