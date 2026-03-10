// public/electron.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const os = require('os');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let pyProc = null;

const createPyProc = () => {
  let backendPath = path.join(__dirname, '../../backend');
  if (!isDev) {
    // In production, the backend folder should be next to the app
    backendPath = path.join(app.getAppPath(), '../../../../backend');
  }

  // Use the system python to run the Flask app for simplicity, assuming the env is available
  const isWindows = os.platform() === 'win32';
  const venvPython = isWindows 
    ? path.join(backendPath, 'venv', 'Scripts', 'python.exe')
    : path.join(backendPath, 'venv', 'bin', 'python');
  
  const scriptPath = path.join(backendPath, 'app.py');

  pyProc = spawn(venvPython, [scriptPath], {
    cwd: backendPath,
    stdio: 'ignore' // or 'inherit' for debugging
  });

  if (pyProc != null) {
    console.log('Backend process spawned successfully');
  }
}

const exitPyProc = () => {
  if (pyProc) pyProc.kill();
  pyProc = null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createPyProc();
  // Wait a second for Flask to start
  setTimeout(createWindow, 1500);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('quit', exitPyProc);
