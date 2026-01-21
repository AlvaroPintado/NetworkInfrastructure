# Middleware Request to MQTT

Este middleware actúa como una capa intermedia entre dispositivos IoT de sensores y un sistema de mensajería MQTT. Recibe datos de sensores a través de endpoints HTTP y los publica en un broker MQTT para su posterior procesamiento.


**Middleware HTTP a MQTT**
- Recibe datos de sensores vía HTTP
- Valida y procesa los datos
- Publica los datos en un broker MQTT

## Endpoints API

### Enviar datos de sensores (GET)

```
GET http://localhost:80/records?id_nodo=ID&temperatura=TEMP&humedad=HUM&co2=CO2&volatiles=VOL
```

Parámetros:
- `id_nodo`: Identificador único del sensor
- `temperatura`: Temperatura en grados Celsius
- `humedad`: Porcentaje de humedad relativa
- `co2`: Nivel de CO2 en PPM
- `volatiles`: Nivel de compuestos orgánicos volátiles

Ejemplo:
```
GET http://localhost:80/records?id_nodo=sensor01&temperatura=25.5&humedad=60&co2=450&volatiles=120
```

### Enviar datos de sensores (POST)

```
POST http://localhost:8000/records
Content-Type: application/json

{
  "id_nodo": ID,
  "temperatura": TEMP,
  "humedad": HUM,
  "co2": CO2,
  "volatiles": VOL
}
```

Ejemplo:
```
POST http://localhost:8000/records
Content-Type: application/json

{
  "id_nodo": 1,
  "temperatura": 25.5,
  "humedad": 60,
  "co2": 450,
  "volatiles": 120
}
```

## Flujo de datos

1. Los dispositivos IoT envían datos a los endpoints HTTP (`/records`)
2. HAProxy recibe la solicitud y la dirige a una de las instancias del middleware
3. El middleware valida los datos recibidos
4. Los datos validados se publican en el tópico MQTT `sensors/data`

## Formato de los mensajes MQTT

Los mensajes se publican en el tópico `sensors/data` con el siguiente formato JSON:

```json
{
  "id_nodo": 1,
  "temperatura": 25.5,
  "humedad": 60,
  "co2": 450,
  "volatiles": 120
}
```
