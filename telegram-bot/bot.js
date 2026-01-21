require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');

// Bot token desde .env
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'mysql',  // nombre del servicio en docker-compose
  user: 'root',
  password: 'root',   // cambia si es diferente en tu init.sql
  database: 'sensor_data'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar con MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL desde el bot');
});

// Comando /start
bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, '🤖 ¡Hola! Este bot consulta datos del sensor.');
});

// Comando /ultimo
bot.onText(/\/ultimo/, msg => {
  db.query('SELECT * FROM datos ORDER BY timestep DESC LIMIT 1', (err, results) => {
    if (err || results.length === 0) {
      bot.sendMessage(msg.chat.id, '⚠️ No se pudo obtener el último dato.');
    } else {
      const r = results[0];
      bot.sendMessage(msg.chat.id,
        `📊 Última medición:\n🕒 ${r.timestep}\n🌡️ ${r.temperatura}°C\n💧 ${r.humedad}%\n🟤 CO2: ${r.co2}\n🧪 Volátiles: ${r.volatiles}\n🔢 Nodo: ${r.id_nodo}`
      );
    }
  });
});
