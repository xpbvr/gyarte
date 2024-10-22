const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    uploadArticle: (articleData) => ipcRenderer.send('upload-article', articleData)
});
