const venom = require("venom-bot");
const fs = require("fs");
const path = require("path");

let client;
let estado = "No iniciado";
let callbackQR;
let callbackLog;

function iniciarWhatsApp() {
  log("🔄 Iniciando sesión de WhatsApp...");
  estado = "Iniciando";

  venom
    .create({
      session: "bodas",
      multidevice: true,
      headless: false,
      folderNameToken: "session",
      catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
        estado = "QR requerido";
        log("📸 Mostrando QR para conexión...");
        if (callbackQR) callbackQR(base64Qr);
      },
    })
    .then((cl) => {
      client = cl;
      estado = "Conectado";
      log("✅ Sesión conectada");

      client.onStateChange((state) => {
        log(`📶 Estado de conexión: ${state}`);
        if (
          state === "DISCONNECTED" ||
          state === "UNPAIRED" ||
          state === "UNPAIRED_IDLE"
        ) {
          log("⚠️ Sesión desconectada. Reiniciando...");
          estado = "Desconectado";
          reiniciarSesion();
        }
      });
    })
    .catch((err) => {
      log("❌ Error al iniciar sesión: " + err.message);

      // 🔄 Si es error de Puppeteer/Venom, borramos sesión y reintentamos
      if (
        err.message === undefined ||
        err.message.includes("Failed to launch the browser")
      ) {
        log("🧹 Posible sesión bloqueada. Borrando carpeta y reintentando...");
        eliminarSesionLocal();
        setTimeout(() => iniciarWhatsApp(), 2000);
      }

      estado = "Error";
    });
}

function reiniciarSesion() {
  setTimeout(() => {
    iniciarWhatsApp();
  }, 3000);
}

function eliminarSesionLocal() {
  const sessionPath = path.join(__dirname, "../session/bodas");
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    log("🧹 Datos de sesión eliminados correctamente.");
  } else {
    log("ℹ️ No se encontraron datos de sesión anteriores.");
  }
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

function log(mensaje) {
  console.log(mensaje);
  if (callbackLog) callbackLog(mensaje);
}

module.exports = {
  iniciarWhatsApp,
  estadoSesion,
  onQRCode,
  onMensaje,
};
