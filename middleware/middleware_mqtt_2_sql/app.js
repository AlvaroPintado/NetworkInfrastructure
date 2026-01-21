const express = require('express');
const { subscribe } = require('./adapters/mqtt');
const { insertSensorData } = require('./adapters/mysql');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Middleware MQTT to SQL service root');
});

const TOPIC_SENSORES = 'sensors/data';

subscribe(TOPIC_SENSORES, async (payload, topic) => {
  console.log(`Mensaje recibido en ${topic}:`, payload);
  
  try {
    await insertSensorData(payload);
  } catch (error) {
    console.error('Error al procesar los datos:', error);
  }
});

// Server
const PORT = process.env.PORT || 5003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Instance ID: ${process.env.HOSTNAME || 'local'}`);
});

module.exports = app;