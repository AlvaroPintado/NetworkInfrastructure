const axios = require("axios");
const crypto = require('crypto');

const AlGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.CRYPT_SECRET_KEY;

const ENABLE_CRYPT = process.env.ENABLE_CRYPT == 'true' || false;

const URL =
  process.env.SENSOR_SIMULATOR_URL_BASE || "http://localhost:80/records";
const INTERVAL = process.env.SENSOR_SIMULATOR_DATA_REQUEST_DELAY || 1000; // ms

const sensorState = {
  1: { temperatura: 25.0, humedad: 60.0, co2: 500.0, volatiles: 100.0 },
  2: { temperatura: 24.5, humedad: 55.0, co2: 480.0, volatiles: 120.0 },
  3: { temperatura: 26.0, humedad: 65.0, co2: 520.0, volatiles: 90.0 },
};

function encrypt(text) {
  const key = Buffer.from(SECRET_KEY, 'hex');
  const iv = crypto.randomBytes(16);

  if (key.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes, got ${key.length} bytes`);
  }
  

  const cipher = crypto.createCipheriv(AlGORITHM, key, iv);
  cipher.setAutoPadding(true);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
}

function getRandomDelta(maxDelta = 0.5) {
  return (Math.random() * 2 - 1) * maxDelta; // [-maxDelta, +maxDelta]
}

function generateSensorData() {
  const id_nodo = Math.floor(Math.random() * 3) + 1;
  const state = sensorState[id_nodo];

  // Suavizamos con pequeñas variaciones
  state.temperatura += getRandomDelta(0.3); // cambia ±0.3
  state.humedad += getRandomDelta(1.0);
  state.co2 += getRandomDelta(5.0);
  state.volatiles += getRandomDelta(3.0);

  // Limitamos los valores a rangos realistas
  state.temperatura = Math.max(20, Math.min(30, state.temperatura));
  state.humedad = Math.max(40, Math.min(80, state.humedad));
  state.co2 = Math.max(400, Math.min(600, state.co2));
  state.volatiles = Math.max(50, Math.min(200, state.volatiles));

  return {
    id_nodo,
    temperatura: parseFloat(state.temperatura.toFixed(1)),
    humedad: parseFloat(state.humedad.toFixed(1)),
    co2: parseFloat(state.co2.toFixed(1)),
    volatiles: parseFloat(state.volatiles.toFixed(1)),
  };
}

async function sendGetRequest(data) {
  const params = `id_nodo=${data.id_nodo}&temperatura=${data.temperatura}&humedad=${data.humedad}&co2=${data.co2}&volatiles=${data.volatiles}`;
  const url = `${URL}?${ENABLE_CRYPT ? ('crypt=' + encrypt(params)) : params}`
  try {
    const response = await axios.get(url);
    console.log(`[GET] Enviado: ${url} → ${response.status}`);
  } catch (error) {
    console.error(`[GET] Error: ${error.message}`);
  }
}

async function sendPostRequest(data) {
  try {
    let payload;
    let headers = { "Content-Type": "application/json" };

    if (ENABLE_CRYPT) {
      const jsonData = JSON.stringify(data);
      payload = { crypt: encrypt(jsonData) };
    } else {
      payload = data;
    }

    const response = await axios.post(URL, payload, { headers });
    console.log(`[POST] Enviado a ${URL} → ${response.status}`);
  } catch (error) {
    console.error(`[POST] Error: ${error.message}`);
  }
}

function startSimulation() {
  setInterval(() => {
    const data = generateSensorData();
    if(Math.random() < 0.5) {
      sendGetRequest(data);
    } else {
      sendPostRequest(data);
    }
  }, INTERVAL);
}

startSimulation();
