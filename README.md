# 📡 Proyecto RA: Infraestructura de Red IoT

> **Plataforma de microservicios para la ingesta, procesamiento, almacenamiento y visualización de datos de sensores IoT.**

Este repositorio contiene la infraestructura completa para desplegar un sistema de monitorización IoT escalable. El proyecto simula el tráfico de dispositivos, gestiona la mensajería mediante MQTT, procesa los datos a través de middlewares intermedios y permite su visualización y gestión mediante dashboards y bots de mensajería.

---

## 🏗️ Arquitectura del Sistema

El proyecto está diseñado bajo una arquitectura de **Microservicios** contenerizados con Docker, orquestando los siguientes componentes principales:

1.  **Fuentes de Datos (Simulación):** Generación de tráfico de sensores sintético.
2.  **Ingesta y Mensajería:** Broker MQTT para la comunicación asíncrona y Gateway HTTP para dispositivos sin capacidad MQTT.
3.  **Middleware (Lógica de Negocio):**
    * **Token Bucket:** Control de flujo y *rate limiting*.
    * **Adaptadores:** Conversión de protocolos (HTTP $\to$ MQTT, MQTT $\to$ SQL).
4.  **Almacenamiento:** Base de datos relacional persistente.
5.  **Interfaz de Usuario:** Dashboards de monitorización y notificaciones vía Telegram.

---

## 📂 Estructura del Proyecto

El repositorio se organiza en los siguientes módulos:

```text
NetworkInfrastructure/
├── broker_mosquitto/      # Configuración del Broker Eclipse Mosquitto (MQTT)
├── grafana/               # Dashboards y aprovisionamiento de fuentes de datos
├── haproxy/               # Balanceador de carga y Proxy Inverso
├── middleware/            # Lógica de procesamiento de datos
│   ├── middleware_http_2_mqtt  # Pasarela REST a MQTT
│   ├── middleware_mqtt_2_sql   # Persistencia de mensajes a Base de Datos
│   └── middleware_token_bucket # Implementación del algoritmo Token Bucket (Rate Limiting)
├── mysql/                 # Scripts de inicialización de la Base de Datos
├── sensor-simulator/      # Generador de tráfico/datos de sensores dummy
├── telegram-bot/          # Servicio de notificaciones e interacción vía Telegram
├── service_description/   # Documentación de interfaces y servicios
├── .env                   # Variables de entorno y secretos
└── docker-compose.yml     # Orquestación de contenedores
```

## ⚙️ Requisitos Previos

Para ejecutar este proyecto en un ordenador personal, asegúrese de tener instalado:
- **Docker Engine**
- **Docker Compose**
- **Git** (para clonar el repositorio)

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd ra-proyecto
```
### 2. Configuración (Opcional)
Revise el archivo `.env` en la carpeta `NetworkInfrastructure/` si necesita modificar credenciales de base de datos o tokens de servicios externos.

### 3. Iniciar la infraestructura
**Opción A: Ejecución en segundo plano (Recomendado)**
Para iniciar los servicios liberando la terminal:
```bash
docker-compose up -d
```

**Opción B: Ejecución con logs en vivo**
Para ver la salida de todos los servicios en la terminal actual:
```bash
docker-compose up
```

### 4. Simulación de Tráfico
El sistema incluye un perfil específico (`simulator`) para levantar generadores de datos falsos que prueban la red automáticamente:
```bash
docker-compose --profile simulator up
```

### 5. Gestión del Ciclo de Vida
**Detener la infraestructura:**
Para detener y eliminar todos los contenedores y redes (limpieza completa):
```bash
docker-compose down
```

**Pausar la infraestructura:**
Para detener los contenedores manteniendo su estado (sin eliminarlos):
```bash
docker-compose stop
```

**Ver logs de los contenedores:**
Si necesitas depurar un servicio en ejecución:
```bash
docker-compose logs -f
```

## 📊 Acceso a los Servicios

---

Una vez desplegada la infraestructura, los servicios principales están disponibles en los siguientes puertos locales (sujeto a configuración en `docker-compose.yml` y `haproxy`):

| Servicio | URL / Puerto | Descripción | Credenciales (Default) |
| :--- | :--- | :--- | :--- |
| **Grafana** | `http://localhost:3000` | Visualización de datos | `admin` / `admin` |
| **Broker MQTT** | `localhost:1883` | Puerto de mensajería | N/A |
| **HAProxy/Web** | `http://localhost:80` | Entrada principal HTTP | N/A |
| **MySQL** | `localhost:3306` | Base de datos | Ver archivo `.env` |

> **Nota:** La disponibilidad de los puertos depende de la configuración final de `HAProxy` y del mapeo en `docker-compose`.