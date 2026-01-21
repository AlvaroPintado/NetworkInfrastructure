# Instalación y Configuración de HAProxy

## Debian / Ubuntu

### Instalación

```bash
sudo apt update
sudo apt upgrade

sudo apt install haproxy
```

Verificar que la instalación fue exitosa: `haproxy -v`

### Configuración

1. Clona el repositorio del proyecto en tu directorio home:
   ```bash
   git clone <url>
   ```

2. Crea una copia de seguridad de la configuración predeterminada:
   ```bash
   sudo cp /etc/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg.bkp
   ```

3. Copia la configuración de HAProxy del proyecto:
   ```bash
   sudo cp ~/haproxy/haproxy.cfg /etc/haproxy/haproxy.cfg
   ```

4. Edita la configuración copiada con tu editor preferido:
   ```bash
   sudo nano /etc/haproxy/haproxy.cfg
   # o
   sudo vim /etc/haproxy/haproxy.cfg
   ```

5. Modifica la sección de backend para apuntar a tus servidores reales:
   ```
   backend mqtt_middleware
       balance roundrobin
       # Reemplaza los servidores de ejemplo con tu configuración real
       # Usa 127.0.0.1 para localhost y configura los puertos adecuados (ej: 3000)
       server mqtt_middleware_1 127.0.0.1:3000 check
       server mqtt_middleware_2 127.0.0.1:3001 check
   ```

### Administración del servicio

**Iniciar HAProxy:**
```bash
sudo systemctl start haproxy
```

**Habilitar el inicio automático al arrancar el sistema:**
```bash
sudo systemctl enable haproxy
```

**Gestionar el servicio:**
```bash
sudo systemctl stop haproxy     # Detener
sudo systemctl restart haproxy  # Reiniciar
sudo systemctl status haproxy   # Verificar estado y ver logs recientes
```

**Después de cambiar la configuración:**
```bash
sudo systemctl restart haproxy
```

### Solución de problemas

Si encuentras problemas con HAProxy, puedes validar la configuración antes de reiniciar el servicio:

```bash
sudo haproxy -c -f /etc/haproxy/haproxy.cfg
```

Este comando verificará tu archivo de configuración y mostrará errores o configuraciones incorrectas sin intentar iniciar el servicio.