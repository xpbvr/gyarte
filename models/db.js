const sqlite3 = require('sqlite3').verbose();

// File-based database
const db = new sqlite3.Database('./data.db');

// Initialize tables
db.serialize(() => {
  // Create Users table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  // Create Articles table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES users(id)
  )`);

  // Check if the default user exists and create it if not
  db.get(`SELECT * FROM users WHERE username = 'author'`, (err, row) => {
    if (!row) {
      db.run(
        `INSERT INTO users (username, password, role) VALUES ('author', 'password123', 'author')`
      );
    }
  });
});

module.exports = db;
