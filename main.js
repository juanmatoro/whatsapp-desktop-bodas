const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {
  iniciarWhatsApp,
  estadoSesion,
  onQRCode,
  onMensaje,
} = require("./services/whatsappService");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile("renderer/index.html");
}

app.whenReady().then(() => {
  createWindow();
  iniciarWhatsApp();

  ipcMain.handle("estado-sesion", async () => estadoSesion());

  onQRCode((qrData) => {
    mainWindow.webContents.send("qr", qrData);
  });

  onMensaje((mensaje) => {
    mainWindow.webContents.send("log", mensaje);
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
