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

const subscribe = (topic, callback) => {
  try {
    client.subscribe(topic, { qos: 1 }, (err) => {
      if (err) {
        console.error(`Error al suscribirse a ${topic}:`, err);
        return;
      }
      console.log(`Suscripción exitosa a ${topic}`);
    });

    client.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          let parsedMessage = JSON.parse(message.toString());
          callback(parsedMessage, receivedTopic);
        } catch (error) {
          console.error(`Error al procesar mensaje de ${topic}:`, error);
        }
      }
    });
  } catch (error) {
    console.error(`Error en la suscripción a ${topic}:`, error);
  }
};

module.exports = {
  client,
  subscribe,
};
