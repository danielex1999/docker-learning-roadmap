# ¿Qué problema resuelve Docker Compose?

Hasta ahora hemos levantado los contenedores utilizando comandos como:

- PostgreSQL
- pgAdmin

Cada vez debíamos recordar:

- Imagen
- Variables de entorno
- Puertos
- Volúmenes
- Redes
- Nombre del contenedor

Cuando una aplicación utiliza varios contenedores, repetir todos estos comandos resulta incómodo.

Docker Compose permite guardar toda esa configuración dentro de un solo archivo.

Con ello podremos iniciar toda la aplicación mediante un único comando.

---

# Estructura del proyecto

Crear una carpeta para el proyecto:

```text
Docker/
└── PostgreSQL-pgAdmin/
```

Dentro de ella crear el archivo:

```text
docker-compose.yml
```

---

# Versión de Docker Compose

Todo archivo comienza indicando la versión.

```yaml
version: "3.8"
```

Esta versión define las características que Docker Compose utilizará.

---

# Definir servicios

Todos los contenedores se encuentran dentro de:

```yaml
services:
```

Cada servicio representa un contenedor.

Ejemplo:

```yaml
services:
  db:
  pgadmin:
```

---

# Servicio PostgreSQL

Definimos el primer servicio.

```yaml
services:

  db:
```

---

## Nombre del contenedor

```yaml
container_name: postgres-db
```

Permite identificar fácilmente el contenedor.

---

## Imagen

```yaml
image: postgres:15.1
```

Docker descargará esa imagen si no existe localmente.

---

## Volumen

Se reutiliza el volumen utilizado anteriormente.

```yaml
volumes:
  - postgres-db:/var/lib/postgresql/data
```

Este volumen almacenará la información de la base de datos.

---

## Variables de entorno

```yaml
environment:
  POSTGRES_PASSWORD: 123456
  POSTGRES_DB: HeroesDB
  POSTGRES_USER: postgres
```

Estas variables inicializan PostgreSQL automáticamente.

---

# Servicio pgAdmin

Agregar el segundo servicio.

```yaml
pgadmin:
```

---

## Dependencia

pgAdmin depende de PostgreSQL.

```yaml
depends_on:
  - db
```

Esto indica que primero debe iniciarse la base de datos.

---

## Imagen

```yaml
image: dpage/pgadmin4:6.17
```

---

## Publicación de puertos

```yaml
ports:
  - "8080:80"
```

Accederemos mediante:

```
http://localhost:8080
```

---

## Variables de entorno

```yaml
environment:
  PGADMIN_DEFAULT_EMAIL: superman@google.com
  PGADMIN_DEFAULT_PASSWORD: 123456
```

---

# Archivo completo

```yaml
version: "3.8"

services:

  db:
    container_name: postgres-db
    image: postgres:15.1

    volumes:
      - postgres-db:/var/lib/postgresql/data

    environment:
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: HeroesDB
      POSTGRES_USER: postgres

  pgadmin:
    depends_on:
      - db

    image: dpage/pgadmin4:6.17

    ports:
      - "8080:80"

    environment:
      PGADMIN_DEFAULT_EMAIL: superman@google.com
      PGADMIN_DEFAULT_PASSWORD: 123456

volumes:
  postgres-db:
```

---

# Levantar los servicios

Ubicarse en la carpeta donde se encuentra el archivo.

```bash
docker compose up
```

Docker Compose realizará automáticamente:

- Crear la red.
- Crear los contenedores.
- Crear el volumen.
- Descargar imágenes si hacen falta.
- Levantar PostgreSQL.
- Esperar que PostgreSQL inicie.
- Levantar pgAdmin.

Todo con un solo comando.

---

# Consultar ayuda

```bash
docker compose --help
```

Algunos comandos disponibles:

```bash
docker compose up
docker compose down
docker compose ps
docker compose logs
docker compose restart
docker compose stop
docker compose start
docker compose exec
```

---

# Acceder a pgAdmin

Abrir:

```
http://localhost:8080
```

Credenciales:

**Email**

```text
superman@google.com
```

**Password**

```text
123456
```

---

# Crear conexión

Registrar un nuevo servidor.

Host:

```text
postgres-db
```

Usuario:

```text
postgres
```

Contraseña:

```text
123456
```

---

# ¿Por qué no aparece la base de datos anterior?

Aunque ya existía un volumen llamado:

```text
postgres-db
```

Docker Compose creó uno nuevo automáticamente.

Si ejecutamos:

```bash
docker volume ls
```

Veremos un volumen similar a:

```text
postgresql-pgadmin_postgres-db
```

Docker Compose creó un volumen perteneciente al proyecto.

Por ello PostgreSQL inicia completamente vacío.

---

# ¿Qué crea automáticamente Docker Compose?

Además de los contenedores, también crea:

- Una red propia.
- Un volumen nuevo.
- Un grupo de servicios.

En Docker Desktop aparecerán agrupados dentro del mismo proyecto.

---

# Nomenclatura utilizada

Docker Compose genera nombres siguiendo este patrón:

```text
<proyecto>_<servicio>_<réplica>
```

Ejemplo:

```text
postgresql-pgadmin_db_1
postgresql-pgadmin_pgadmin_1
```

---

# Comandos utilizados

```bash
docker compose up

docker compose --help

docker volume ls
```
