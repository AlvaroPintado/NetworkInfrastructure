# Sistema de Middleware MQTT a MySQL

Este sistema permite recibir datos de sensores a través de MQTT y almacenarlos en una base de datos MySQL.

## Arquitectura

El sistema consta de los siguientes componentes:

1. **Middleware MQTT a MySQL**: Suscrito a tópicos MQTT y almacena los datos en MySQL
2. **Base de datos MySQL**: Almacena los datos de los sensores

## Estructura de los datos

Los datos de los sensores tienen la siguiente estructura:

```json
{
  "id_nodo": 1,
  "temperatura": 25.5,
  "humedad": 60.2,
  "co2": 430,
  "volatiles": 120
}
```

## Endpoints

- **MQTT**: Tópico `sensors/data`
- **MySQL**: Puerto 3306

