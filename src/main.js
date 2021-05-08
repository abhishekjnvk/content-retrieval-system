const { app, BrowserWindow, Menu } = require("electron");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 2000,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      transparent: true,
      frame: false,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/content/index.html`);
    mainWindow.webContents.openDevTools()
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

