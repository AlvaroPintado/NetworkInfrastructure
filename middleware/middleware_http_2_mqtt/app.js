const express = require("express");
const logger = require("morgan");

const recordsRouter = require("./routes/records");

const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Middleware HTTP to MQTT service root');
});

// Routes
app.use("/records", recordsRouter);

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Instance ID: ${process.env.HOSTNAME || 'local'}`);
});

module.exports = app;
