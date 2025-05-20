const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  obtenerEstado: () => ipcRenderer.invoke("estado-sesion"),
  onQR: (callback) => ipcRenderer.on("qr", (_, data) => callback(data)),
  onLog: (callback) => ipcRenderer.on("log", (_, msg) => callback(msg)),
});
