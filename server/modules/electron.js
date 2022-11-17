const { app, BrowserWindow, Menu } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // Press alt to see menu
  });

  // Load the webpage
  const port = 4620;
  mainWindow.loadURL(`http://localhost:${port}`)
  
  // Remove Help from default menu
  const menu = Menu.getApplicationMenu()
  const items = menu?.items.filter((item) => item.role !== 'help')
  Menu.setApplicationMenu(Menu.buildFromTemplate(items))
  // Menu.setApplicationMenu(null); // Remove Menu permanently

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const serverApp = require('../server');