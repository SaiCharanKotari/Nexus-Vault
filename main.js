const { app, BrowserWindow, ipcMain, screen, session } = require('electron');
const path = require('path');

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const minWidth = Math.floor(screenWidth * 0.7);
  const minHeight = Math.floor(screenHeight * 0.7);

  const win = new BrowserWindow({
    width: Math.floor(screenWidth * 0.8), // Start at 80%
    height: Math.floor(screenHeight * 0.8),
    minWidth: minWidth,
    minHeight: minHeight,
    maxWidth: screenWidth,
    maxHeight: screenHeight,
    icon: path.join(__dirname, 'public', 'nv-ico.ico'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#050508',
      symbolColor: '#ffffff',
      height: 32
    },
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      autoplayPolicy: "no-user-gesture-required",
    },
    backgroundColor: '#050508',
  });

  // In development, load from vite dev server
  win.loadURL('http://localhost:5173');

  // win.webContents.openDevTools();

  win.on('maximize', () => win.webContents.send('window-state', true));
  win.on('unmaximize', () => win.webContents.send('window-state', false));

  ipcMain.on('window-control', (event, action) => {
    switch (action) {
      case 'minimize':
        // As requested: bring to minimum size instead of hiding
        win.unmaximize();
        win.setSize(minWidth, minHeight);
        win.center();
        break;
      case 'maximize':
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
        break;
      case 'close':
        win.close();
        break;
    }
  });
}

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      details.requestHeaders["User-Agent"] = "Mozilla/5.0 Chrome/120 Safari/537.36";
      callback({ requestHeaders: details.requestHeaders });
    }
  );

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
