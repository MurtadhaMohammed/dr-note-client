const { app, BrowserWindow } = require("electron");
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
    width: 1400,
    height: 850,
    minWidth: 1000,
    minHeight: 670,
    show: false,
    //icon: path.join(__dirname, "/logo.ico")
  });

  mainWindow.loadFile("./dist/index.html");

  //mainWindow.webContents.openDevTools();
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.on("window-all-closed", function() {
  app.quit();
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
