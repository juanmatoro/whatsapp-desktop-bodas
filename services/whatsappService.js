const venom = require("venom-bot");

let client;
let estado = "No iniciado";
let callbackQR;
let callbackLog;
let mainWindow;

function iniciarWhatsApp(windowRef) {
  mainWindow = windowRef;
  estado = "Iniciando...";
  logEstado("🔄 Iniciando sesión de WhatsApp...");

  venom
    .create({
      session: "bodas",
      multidevice: true,
      headless: false,
      folderNameToken: "session",
    })
    .then((cl) => {
      client = cl;
      estado = "Conectado";
      logEstado("✅ Sesión conectada");

      // Conexión establecida
      client.onStateChange((estadoConexion) => {
        logEstado(`📶 Estado de conexión: ${estadoConexion}`);
      });

      // Escucha cambios de token para detectar cierre de sesión
      client.onStreamChange((estado) => {
        if (estado === "DISCONNECTED") {
          logEstado("❌ Sesión desconectada desde el dispositivo móvil.");
          reiniciarSesion();
        }
      });

      // Esperar confirmación visual antes de permitir enviar mensajes
      mainWindow.webContents.send("sesion-iniciada");
    })
    .catch((err) => {
      estado = "Error";
      logEstado("❌ Error al iniciar sesión: " + err.message);
    });
}

function reiniciarSesion() {
  logEstado("♻️ Reintentando sesión desde cero...");
  iniciarWhatsApp(mainWindow);
}

function estadoSesion() {
  return estado;
}

function onQRCode(callback) {
  callbackQR = callback;
}

function onMensaje(callback) {
  callbackLog = callback;
}

function logEstado(msg) {
  console.log(msg);
  if (callbackLog) callbackLog(msg);
}

function enviarMensaje(numero, mensaje) {
  if (!client || estado !== "Conectado") {
    logEstado("❌ No se puede enviar el mensaje: cliente no conectado.");
    return;
  }
  const numeroFormateado = numero + "@c.us";
  client
    .sendText(numeroFormateado, mensaje)
    .then(() => logEstado("✅ Mensaje enviado correctamente."))
    .catch((err) => logEstado("❌ Error al enviar el mensaje: " + err.message));
}

module.exports = {
  iniciarWhatsApp,
  estadoSesion,
  onQRCode,
  onMensaje,
  enviarMensaje,
};
