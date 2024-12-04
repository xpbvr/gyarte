const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    author_id INTEGER,
    FOREIGN KEY (author_id) REFERENCES users(id)
  )`);

  db.get(`SELECT * FROM users WHERE username = 'author'`, (err, row) => {
    if (!row) {
      db.run(
        `INSERT INTO users (username, password, role) VALUES ('author', 'password123', 'author')`
      );
    }
  });
});

module.exports = db;
