# Docker Compose con MongoDB - Práctica Inicial

# Estructura del proyecto

```
PokemonApp/
│
├── docker-compose.yml
└── .env
```

---

# Paso 1. Crear el proyecto

Crear una carpeta para el ejercicio.

```
PokemonApp/
```

Abrir dicha carpeta en Visual Studio Code.

---

# Paso 2. Crear los archivos

Crear los siguientes archivos:

```
docker-compose.yml
```

y

```
.env
```

> Docker Compose detecta automáticamente el archivo `.env` cuando se encuentra en el mismo directorio.

---

# Paso 3. Definir la versión de Docker Compose

```yaml
version: "3"
```

---

# Paso 4. Crear el servicio MongoDB

Dentro del archivo:

```yaml
services:
```

Agregar el servicio:

```yaml
database:
```

---

# Paso 5. Nombre del contenedor

```yaml
container_name: pokemon-db
```

---

# Paso 6. Imagen

Utilizar MongoDB versión 6.

```yaml
image: mongo:6.0
```

---

# Paso 7. Crear el volumen

Agregar:

```yaml
volumes:
  - poke-db:/data/db
```

El directorio interno donde Mongo almacena la información es:

```
/data/db
```

Toda la información persistirá en dicho volumen.

---

# Paso 8. Exponer el puerto

Para las pruebas iniciales se expone MongoDB.

```yaml
ports:
  - "27017:27017"
```

Posteriormente este puerto puede eliminarse para mayor seguridad.

---

# Paso 9. Reinicio automático

Agregar:

```yaml
restart: always
```

Esto permite que el contenedor vuelva a iniciarse automáticamente si ocurre algún problema.

---

# Paso 10. Definir el volumen

Al final del archivo:

```yaml
volumes:
  poke-db:
    external: false
```

## ¿Qué significa?

### external: false

Docker Compose crea automáticamente el volumen.

### external: true

Docker utilizará un volumen existente previamente creado.

---

# docker-compose.yml completo

```yaml
version: "3"

services:

  database:
    container_name: pokemon-db
    image: mongo:6.0

    restart: always

    ports:
      - "27017:27017"

    volumes:
      - poke-db:/data/db

volumes:

  poke-db:
    external: false
```

---

# Paso 11. Levantar el contenedor

Desde la carpeta del proyecto ejecutar:

```bash
docker compose up
```

La primera vez Docker descargará la imagen de MongoDB.

---

# Verificar el contenedor

```bash
docker ps
```

Debe aparecer algo similar a:

```
pokemon-db
mongo:6.0
```

---

# Ver los logs

```bash
docker compose logs
```

o en tiempo real

```bash
docker compose logs -f
```

---

# Probar la conexión

Abrir **TablePlus**.

Crear una nueva conexión MongoDB.

Utilizar:

| Parámetro | Valor |
|-----------|-------|
| Host | localhost |
| Puerto | 27017 |

Cadena de conexión:

```
mongodb://localhost:27017
```

Realizar un **Test Connection**.

Si todo funciona correctamente podrá conectarse y visualizar las bases de datos por defecto:

- admin
- config
- local

---

# Detener el proyecto

Si Docker Compose está ejecutándose en primer plano:

```
CTRL + C
```

---

# Eliminar los contenedores

```bash
docker compose down
```

---

# Comandos útiles

Levantar

```bash
docker compose up
```

Levantar en segundo plano

```bash
docker compose up -d
```

Ver logs

```bash
docker compose logs
```

Seguir logs

```bash
docker compose logs -f
```

Ver contenedores

```bash
docker ps
```

Detener

```bash
docker compose down
```

Ver volúmenes

```bash
docker volume ls
```

Eliminar volúmenes no utilizados

```bash
docker volume prune
```