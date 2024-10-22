const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { Article } = require('./models');

const server = express();
server.use(bodyParser.json());

// Create the Express server that will handle the database operations
server.post('/upload', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newArticle = await Article.create({ title, content });
        res.json({ success: true, article: newArticle });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

server.listen(3000, () => {
    console.log('Express server running on http://localhost:3000');
});

// Create a new Electron window
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
