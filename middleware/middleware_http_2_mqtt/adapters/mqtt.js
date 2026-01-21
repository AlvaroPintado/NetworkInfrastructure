const mqtt = require("mqtt");

const options = {
  clientId: `middleware_${Math.random().toString(16).slice(2, 8)}`,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

const client = mqtt.connect("mqtt://mosquitto:1883", options);

// Manejo de eventos MQTT
client.on("connect", () => {
  console.log("Conectado exitosamente al broker MQTT");
});

client.on("error", (error) => {
  console.error("Error de conexión MQTT:", error);
});

client.on("reconnect", () => {
  console.log("Intentando reconexión a MQTT...");
});

client.on("disconnect", () => {
  console.log("Desconectado del broker MQTT");
});

const publish = (topic, message) => {
  try {
    const payload =
      typeof message === "object" ? JSON.stringify(message) : message;

    client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Error al publicar en ${topic}:`, err);
      } else {
        console.log(`Mensaje publicado en ${topic}`);
      }
    });
  } catch (error) {
    console.error("Error al preparar el mensaje:", error);
  }
};

module.exports = {
  client,
  publish,
};
