const express = require("express");
const crypto = require('crypto');
const router = express.Router();
const { publish } = require("../adapters/mqtt");

const AlGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.CRYPT_SECRET_KEY;

const ENABLE_CRYPT = process.env.ENABLE_CRYPT == 'true' || false;

const topic = "sensors/data";

function decrypt(encryptedText) {
  const key = Buffer.from(SECRET_KEY, 'hex');
  
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];

  if (key.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes, got ${key.length} bytes`);
  }

  const decipher = crypto.createDecipheriv(AlGORITHM, key, iv);
  decipher.setAutoPadding(true);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

function parseQueryString(queryString) {
  const params = {};
  const pairs = queryString.split('&');
  
  for (const pair of pairs) {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  }
  
  return params;
}

function processSensorData(data) {
  return {
    id_nodo: parseInt(data.id_nodo),
    temperatura: parseFloat(data.temperatura),
    humedad: parseFloat(data.humedad),
    co2: parseFloat(data.co2),
    volatiles: parseFloat(data.volatiles),
  };
}

/*
  GET
*/
router.get("/", function (req, res, next) {
  let sensorData;

  if(ENABLE_CRYPT && req.query.crypt){
    const decryptedParams = decrypt(req.query.crypt);
    const parsedParams = parseQueryString(decryptedParams);
    sensorData =  processSensorData(parsedParams);
  } else {
    sensorData = processSensorData(req.query);
  }

  publish(topic, sensorData);

  res.json({
    success: true,
    message: "Datos recibidos correctamente",
    topic: topic,
    data: sensorData,
  });
});

/*
  POST
*/
router.post("/", function (req, res, next) {
  let sensorData;

  if (ENABLE_CRYPT && req.body.crypt) {
    const decryptedData = decrypt(req.body.crypt);
    sensorData = processSensorData(JSON.parse(decryptedData));
  } else {
    sensorData = processSensorData(req.body);
  }

  publish(topic, sensorData);
  
  res.json({
    success: true,
    message: "Datos recibidos correctamente",
    topic: topic,
    data: sensorData,
  });
});

module.exports = router;
