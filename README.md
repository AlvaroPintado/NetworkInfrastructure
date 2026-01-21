# Proyecto RA

## Requisitos previos para probar en ordenador personal
- Docker instalado en su sistema
- Docker Compose instalado en su sistema
- Git (para clonar el repositorio)

## Instrucciones de instalación y ejecución

### Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd ra-proyecto
```

### Iniciar la infraestructura

#### Ejecucion
Para iniciar los servicios mostrando los logs en la terminal:
```bash
docker-compose up
```

Para iniciar los servicios en segundo plano:
```bash
docker-compose up -d
```

### Detener la infraestructura
Para detener y eliminar todos los contenedores:
```bash
docker-compose down
```

Para detener pero mantener los contenedores (sin eliminarlos):
```bash
docker-compose stop
```

### Levantar con simulation de trafico
```bash
docker-compose --profile simulator up
```

### Ver logs de los contenedores
```bash
docker-compose logs -f
```