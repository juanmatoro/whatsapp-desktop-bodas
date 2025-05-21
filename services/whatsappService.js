const venom = require("venom-bot");

let client;
let estado = "No iniciado";
let callbackQR;
let callbackLog;

function iniciarWhatsApp() {
  logMensaje("🚀 Iniciando sesión de WhatsApp...");

  venom
    .create({
      session: "bodas",
      multidevice: true,
      headless: false,
      folderNameToken: "session",
      catchQR: (qrBase64) => {
        logMensaje("🔑 QR recibido");
        if (callbackQR) callbackQR(qrBase64);
      },
      statusFind: (status) => {
        logMensaje(`📡 Estado detectado: ${status}`);
        estado = status;
      },
    })
    .then((cl) => {
      client = cl;
      estado = "Conectado";
      logMensaje("✅ Sesión iniciada correctamente");

      // Opcional: enviar mensaje de prueba
      const telefonoDestino = "34676983429@c.us"; // ← número con prefijo internacional
      const mensaje =
        "¡Hola! Este es un mensaje de prueba desde la app de escritorio 🎉";

      client
        .sendText(telefonoDestino, mensaje)
        .then(() => {
          logMensaje("📨 Mensaje de prueba enviado correctamente");
        })
        .catch((err) => {
          logMensaje("❌ Error al enviar el mensaje de prueba: " + err.message);
        });

      // Escuchar cambios de estado (por ejemplo: CONNECTING, TIMEOUT, etc.)
      client.onStateChange((nuevoEstado) => {
        estado = nuevoEstado;
        logMensaje(`📡 Estado: ${nuevoEstado}`);
      });
    })
    .catch((err) => {
      estado = "Error";
      logMensaje("❌ Error al iniciar sesión: " + err.message);
    });
}

function logMensaje(msg) {
  console.log(msg); // Mantener consola
  if (callbackLog) callbackLog(msg); // Enviar al frontend
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

module.exports = {
  iniciarWhatsApp,
  estadoSesion,
  onQRCode,
  onMensaje,
};
