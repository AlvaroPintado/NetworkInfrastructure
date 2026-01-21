const mysql = require("mysql2/promise");

const dbConfig = {
  host: "mysql",
  user: "root",
  password: "root",
  database: "sensor_data",
};

async function insertSensorData(payload) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const now = new Date();
    const formattedDate = now.toISOString().replace("T", " ").replace("Z", "");

    const query = `
      INSERT INTO datos (timestep, id_nodo, temperatura, humedad, co2, volatiles)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
      formattedDate,
      payload.id_nodo,
      payload.temperatura,
      payload.humedad,
      payload.co2,
      payload.volatiles,
    ];

    const [result] = await connection.execute(query, values);

    console.log(
      `Datos insertados correctamente en: ${formattedDate}`
    );
    return result;
  } catch (error) {
    console.error("Error al insertar datos en MySQL:", error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

module.exports = {
  insertSensorData,
};
