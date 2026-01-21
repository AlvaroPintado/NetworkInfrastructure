# Manual práctico de configuración de HAProxy (`haproxy.cfg`)

## Estructura General

El archivo se divide en 4 bloques principales:

1. `global` — Parámetros generales.
2. `defaults` — Valores por defecto que aplican a frontends y backends.
3. `frontend` — Define la entrada del tráfico.
4. `backend` — Define los servidores destino.

---

## 1. Bloque `global`

Especifica configuraciones generales del proceso HAProxy.

```haproxy
global
    log /dev/log local0
    maxconn 2048
    user haproxy
    group haproxy
    daemon
```

### Significado:

| Directiva  | Descripción                                |
| ---------- | ------------------------------------------ |
| log        | Dónde guardar los logs (puede ser syslog). |
| maxconn    | Máximo de conexiones simultáneas.          |
| user/group | Usuario y grupo que corre HAProxy.         |
| daemon     | Corre en segundo plano.                    |

---

## 2. Bloque `defaults`

Define valores por defecto para los `frontend` y `backend` si no los defines allí.

```haproxy
defaults
    log global
    mode http
    option httplog
    timeout connect 5s
    timeout client 50s
    timeout server 50s
```

### Significado:

| Directiva      | Descripción                                     |
| -------------- | ----------------------------------------------- |
| mode http      | Trabaja a nivel HTTP (también puede ser `tcp`). |
| option httplog | Formato de logs especial para HTTP.             |
| timeout        | Tiempo máximo de espera en diferentes etapas.   |

---

## 3. Bloque `frontend`

Define _cómo_ y _dónde_ recibe tráfico HAProxy.

```haproxy
frontend entrada_http
    bind *:80
    default_backend servidores_web
```

### Significado:

| Directiva       | Descripción                                 |
| --------------- | ------------------------------------------- |
| bind \*:80      | Escucha en todas las IP por puerto 80.      |
| default_backend | A qué backend envía el tráfico por defecto. |

---

## 4. Bloque `backend`

Define los servidores reales que atienden las peticiones.

```haproxy
backend servidores_web
    balance roundrobin
    option httpchk
    server web1 192.168.1.10:80 check
    server web2 192.168.1.11:80 check
```

### Significado:

| Directiva      | Descripción                                                         |
| -------------- | ------------------------------------------------------------------- |
| balance        | Algoritmo de balanceo (roundrobin, leastconn, source).              |
| option httpchk | Hace un chequeo HTTP de salud.                                      |
| server         | Nombre, IP y puerto del servidor destino. `check` activa monitoreo. |

---

## Otras configuraciones útiles:

### Redirección HTTP a HTTPS

```haproxy
frontend entrada_http
    bind *:80
    redirect scheme https code 301 if !{ ssl_fc }
```

---

### Balanceo con persistencia de sesión (Sticky)

```haproxy
backend servidores_web
    balance roundrobin
    cookie SERVERID insert indirect nocache
    server web1 192.168.1.10:80 check cookie web1
    server web2 192.168.1.11:80 check cookie web2
```

---

### Activar estadísticas web de HAProxy

```haproxy
listen stats
    bind *:9000
    stats enable
    stats uri /stats
    stats refresh 10s
```

Accedes a:

```
http://IP_SERVIDOR:9000/stats
```

---

## Resumen de Algoritmos de Balanceo

| Método     | Descripción                                     |
| ---------- | ----------------------------------------------- |
| roundrobin | Reparto equitativo (por turnos).                |
| leastconn  | Envía al servidor con menos conexiones activas. |
| source     | Mantiene la misma IP en el mismo servidor.      |

---

## Comandos importantes

Validar config:

```bash
haproxy -c -f /etc/haproxy/haproxy.cfg
```

Reiniciar HAProxy:

```bash
sudo systemctl restart haproxy
```

Ver logs:

```bash
tail -f /var/log/haproxy.log
```

---

## Recomendación final de estructura de `/etc/haproxy/haproxy.cfg`

```haproxy
global
    log /dev/log local0
    maxconn 2048
    user haproxy
    group haproxy
    daemon

defaults
    log global
    mode http
    option httplog
    timeout connect 5s
    timeout client 50s
    timeout server 50s

frontend entrada_http
    bind *:80
    default_backend servidores_web

backend servidores_web
    balance roundrobin
    option httpchk
    server web1 192.168.1.10:80 check
    server web2 192.168.1.11:80 check

listen stats
    bind *:9000
    stats enable
    stats uri /stats
    stats refresh 10s
```
