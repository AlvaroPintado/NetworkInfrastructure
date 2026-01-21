CREATE DATABASE `sensor_data`;

USE `sensor_data`;

CREATE TABLE `datos` (
    `timestep`  DATETIME(3) PRIMARY KEY,
    `id_nodo` INTEGER NOT NULL,
    `temperatura` DOUBLE NOT NULL,
    `humedad` DOUBLE NOT NULL,
    `co2` DOUBLE NOT NULL,
    `volatiles` DOUBLE NOT NULL
);
