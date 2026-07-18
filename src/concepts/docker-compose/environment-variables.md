# Variables de Entorno



# Estructura del proyecto

```
PokemonApp/
│
├── docker-compose.yml
└── .env
```

---

# Configuración inicial

En la práctica anterior se creó un servicio MongoDB similar al siguiente:

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

En esta práctica se agregarán nuevas configuraciones.

---

# Paso 1. Habilitar autenticación

La imagen oficial de MongoDB permite crear automáticamente un usuario administrador mediante variables de entorno.

Agregar dentro del servicio:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: Fernando
  MONGO_INITDB_ROOT_PASSWORD: 123456
```

Estas variables son reconocidas automáticamente por la imagen oficial de MongoDB.

---

# Paso 2. Ejecutar MongoDB con autenticación

Para obligar a que todas las conexiones requieran autenticación, agregar el comando:

```yaml
command: ["--auth"]
```

Con esto MongoDB iniciará en modo autenticado.

---

# Servicio actualizado

```yaml
services:

  database:
    container_name: pokemon-db

    image: mongo:6.0

    restart: always

    ports:
      - "27017:27017"

    command: ["--auth"]

    environment:
      MONGO_INITDB_ROOT_USERNAME: Fernando
      MONGO_INITDB_ROOT_PASSWORD: 123456

    volumes:
      - poke-db:/data/db
```

---

# Reiniciar el proyecto

Bajar el proyecto:

```bash
docker compose down
```

Levantar nuevamente:

```bash
docker compose up -d
```

---

# Problema común

Al intentar conectarse utilizando el nuevo usuario puede aparecer un error de autenticación.

¿Por qué ocurre?

Porque el volumen ya contenía una base de datos inicializada.

Las variables:

```
MONGO_INITDB_ROOT_USERNAME
```

y

```
MONGO_INITDB_ROOT_PASSWORD
```

**solo se ejecutan la primera vez que MongoDB crea la base de datos.**

Si el volumen ya existe, MongoDB no vuelve a ejecutar esa inicialización.

---

# Solución

Eliminar el volumen.

Ver los volúmenes:

```bash
docker volume ls
```

Eliminar el volumen correspondiente:

```bash
docker volume rm pokemonapp_poke-db
```

Después levantar nuevamente:

```bash
docker compose up -d
```

Ahora MongoDB volverá a inicializarse utilizando las nuevas credenciales.

---

# Conexión desde TablePlus

Cadena de conexión:

```
mongodb://Fernando:123456@localhost:27017
```

Después de conectarse será posible listar las bases de datos:

- admin
- config
- local

---

# Problema de seguridad

Aunque la configuración funciona correctamente, todavía existe un problema.

Las credenciales están escritas directamente dentro del archivo:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: Fernando
  MONGO_INITDB_ROOT_PASSWORD: 123456
```

Esto no es recomendable porque normalmente el archivo `docker-compose.yml` se comparte mediante Git.

---

# Paso 3. Utilizar variables de entorno

Crear un archivo:

```
.env
```

Agregar las siguientes variables:

```env
MONGO_USERNAME=Strider
MONGO_PASSWORD=123456789
MONGO_DB_NAME=pokemonDB
```

Ahora todas las configuraciones importantes estarán centralizadas.

---

# Utilizar las variables en Docker Compose

Docker Compose permite acceder a las variables usando:

```
${VARIABLE}
```

Por ejemplo:

```yaml
container_name: ${MONGO_DB_NAME}
```

---

# Variables para MongoDB

Actualizar las variables de entorno:

```yaml
environment:
  MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
  MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
```

---

# docker-compose.yml actualizado

```yaml
version: "3"

services:

  database:

    container_name: ${MONGO_DB_NAME}

    image: mongo:6.0

    restart: always

    command: ["--auth"]

    ports:
      - "27017:27017"

    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}

    volumes:
      - poke-db:/data/db

volumes:

  poke-db:
    external: false
```

---

# Reiniciar nuevamente

Como cambió el usuario inicial, es necesario eliminar nuevamente el volumen.

```bash
docker compose down
```

Eliminar volumen:

```bash
docker volume rm pokemonapp_poke-db
```

Levantar nuevamente:

```bash
docker compose up -d
```

Ahora MongoDB será inicializado con las nuevas credenciales.

---

# Nueva conexión

Cadena de conexión:

```
mongodb://Strider:123456789@localhost:27017
```

La autenticación debería realizarse correctamente.

---

# ¿Por qué usar variables de entorno?

Ventajas:

- No repetir valores.
- Cambiar configuraciones fácilmente.
- Evitar credenciales hardcodeadas.
- Compartir el proyecto sin modificar el Docker Compose.
- Utilizar diferentes configuraciones para desarrollo, pruebas o producción.

---

# Comandos utilizados

Levantar proyecto

```bash
docker compose up
```

Segundo plano

```bash
docker compose up -d
```

Detener

```bash
docker compose down
```

Ver contenedores

```bash
docker ps
```

Ver volúmenes

```bash
docker volume ls
```

Eliminar un volumen

```bash
docker volume rm <nombre-volumen>
```

Ver logs

```bash
docker compose logs
```

Seguir logs

```bash
docker compose logs -f
```