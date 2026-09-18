import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  const mainWindow = new BrowserWindow({
    width: 430,
    height: 780,
    x: width - 450, // position on the right side of the screen
    y: Math.max(10, height - 800), // position nicely on screen
    frame: false,    // No window borders or title bar
    transparent: true, // Make the background transparent
    alwaysOnTop: false, // Set to true if you want it always on top of other windows
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load the Vite dev server
  mainWindow.loadURL('http://localhost:8080');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
