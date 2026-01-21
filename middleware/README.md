# Despliegue al servidor

## Install Node 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -

sudo apt install -y nodejs
```

## Clonar el repositorio

```bash
git clone [URL_DE_TU_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

## Instalar dependencias

```bash
npm install
```

## Configurar el servicio en múltiples puertos

1. Instalar PM2 globalmente:

```bash
npm install -g pm2
```

2. Crear archivo de configuración para PM2 (ecosystem.config.js):

```javascript
module.exports = {
  apps: [
    {
      name: "app-5001",
      script: "./index.js",
      env: {
        PORT: 5001,
        NODE_ENV: "production"
      }
    },
    {
      name: "app-5002",
      script: "./index.js",
      env: {
        PORT: 5002,
        NODE_ENV: "production"
      }
    }
  ]
};
```

3. Iniciar el servicio con PM2:

```bash
pm2 start ecosystem.config.js
```

4. Configurar inicio automático tras reinicios:

```bash
pm2 startup
pm2 save
```

## Verificar que el servicio está funcionando

```bash
curl http://localhost:5001
curl http://localhost:5002
```