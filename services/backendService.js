const axios = require("axios");

// Cambia esta URL por la de tu backend
const API_BASE_URL = "https://api.celebra-conmigo.com"; // ejemplo

// Obtener mensajes pendientes (puedes adaptar el endpoint)
async function getMensajesPendientes(bodaId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/mensajes/pendientes/${bodaId}`
    );
    return response.data; // lista de mensajes
  } catch (error) {
    console.error("❌ Error al obtener mensajes pendientes:", error.message);
    return [];
  }
}

// Marcar mensaje como enviado
async function marcarMensajeComoEnviado(mensajeId) {
  try {
    await axios.post(`${API_BASE_URL}/mensajes/marcar-enviado/${mensajeId}`);
  } catch (error) {
    console.error("❌ Error al marcar mensaje como enviado:", error.message);
  }
}

module.exports = {
  getMensajesPendientes,
  marcarMensajeComoEnviado,
};
