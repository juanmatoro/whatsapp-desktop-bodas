/* const venom = require("venom-bot");

let client;
let estado = "No iniciado";
let callbackQR;
let callbackLog;

function iniciarWhatsApp() {
  venom
    .create({
      session: "bodas",
      multidevice: true,
      headless: true,
    })
    .then((cl) => {
      client = cl;
      estado = "Conectado";
      callbackLog?.("✅ Sesión conectada");

      // Aquí puedes añadir polling al backend
    })
    .catch((err) => {
      estado = "Error";
      callbackLog?.("❌ Error al iniciar sesión: " + err.message);
    });
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
 */

const venom = require("venom-bot");

let client;
let estado = "No iniciado";

function iniciarWhatsApp() {
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
      console.log("✅ Sesión iniciada");

      // Aquí puedes cambiar por tu número o el de prueba
      const telefonoDestino = "34676983429@c.us"; // número con prefijo país y sin +
      const mensaje =
        "¡Hola! Este es un mensaje de prueba desde la app de escritorio 🎉";

      client
        .sendText(telefonoDestino, mensaje)
        .then(() => {
          console.log("✅ Mensaje enviado correctamente");
        })
        .catch((err) => {
          console.error("❌ Error al enviar el mensaje:", err.message);
        });
    })
    .catch((err) => {
      estado = "Error";
      console.error("❌ Error al iniciar sesión:", err.message);
    });
}

function estadoSesion() {
  return estado;
}

function onQRCode(callback) {
  // Aquí podrías emitir el QR si lo necesitas
}

function onMensaje(callback) {
  // Aquí podrías emitir mensajes al frontend si lo necesitas
}

module.exports = {
  iniciarWhatsApp,
  estadoSesion,
  onQRCode,
  onMensaje,
};
