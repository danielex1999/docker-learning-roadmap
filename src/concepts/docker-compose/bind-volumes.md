# Bind Volumes


# 📁 Estructura del proyecto

```
PostgreSQL-pgAdmin/
│
├── docker-compose.yml
├── postgres/      # Datos persistentes de PostgreSQL (Bind Mount)
└── pgadmin/       # Configuración persistente de pgAdmin
```

---

# 🚀 Levantar la aplicación

Desde la carpeta donde se encuentra el `docker-compose.yml` ejecutar:

```bash
docker compose up
```

O en segundo plano:

```bash
docker compose up -d
```

Docker Compose realizará automáticamente:

- Crear la red
- Crear los contenedores
- Configurar PostgreSQL
- Configurar pgAdmin
- Crear los volúmenes necesarios

---

# 🗄️ Servicios

## PostgreSQL

| Configuración | Valor |
|--------------|-------|
| Imagen | postgres:15.1 |
| Puerto | 5432 |
| Usuario | postgres |
| Password | 123456 |

---

## pgAdmin

| Configuración | Valor |
|--------------|-------|
| Imagen | dpage/pgadmin4 |
| Puerto Host | 8080 |
| Puerto Contenedor | 80 |
| Usuario | superman@google.com |
| Password | 123456 |

Acceder desde:

```
http://localhost:8080
```

---

# 📄 docker-compose.yml

```yaml
version: "3.8"

services:

  db:
    container_name: postgres_database

    image: postgres:15.1

    environment:
      POSTGRES_PASSWORD: 123456

    volumes:
      - ./postgres:/var/lib/postgresql/data

  pgAdmin:

    depends_on:
      - db

    image: dpage/pgadmin4

    ports:
      - "8080:80"

    environment:
      PGADMIN_DEFAULT_EMAIL: superman@google.com
      PGADMIN_DEFAULT_PASSWORD: 123456

    volumes:
      - ./pgadmin:/var/lib/pgadmin
```

---

# 🔍 Explicación

## services

Define todos los contenedores que compondrán la aplicación.

```yaml
services:
```

---

## container_name

Nombre personalizado del contenedor.

```yaml
container_name: postgres_database
```

---

## image

Imagen descargada desde Docker Hub.

```yaml
image: postgres:15.1
```

---

## environment

Variables de entorno utilizadas por la imagen.

```yaml
environment:
  POSTGRES_PASSWORD: 123456
```

---

## ports

Expone un puerto del contenedor al equipo anfitrión.

```yaml
ports:
  - "8080:80"
```

Significa:

```
Host            Contenedor
8080  ------->      80
```

---

## depends_on

Hace que pgAdmin espere a que PostgreSQL inicie primero.

```yaml
depends_on:
  - db
```

---

## volumes

Permite almacenar información de forma persistente.

Ejemplo usando un **Bind Mount**:

```yaml
volumes:
  - ./postgres:/var/lib/postgresql/data
```

Toda la información de PostgreSQL se almacenará en:

```
postgres/
```

---

# 💾 Volúmenes

Docker ofrece tres formas principales de persistir información.

## 1. Volúmenes administrados por Docker

```yaml
volumes:
  - postgres-db:/var/lib/postgresql/data
```

Docker administra completamente el almacenamiento.

---

## 2. Volúmenes externos

```yaml
volumes:
  postgres-db:
    external: true
```

Docker utilizará un volumen existente.

---

## 3. Bind Mounts

```yaml
volumes:
  - ./postgres:/var/lib/postgresql/data
```

La información queda almacenada dentro del proyecto.

---

# 🌐 Redes

Docker Compose crea automáticamente una red privada.

Los servicios pueden comunicarse utilizando el nombre del servicio.

Por ejemplo:

```
Host:

db
```

No es necesario utilizar IPs.

---

# 🔌 Conectar pgAdmin

Crear un nuevo servidor.

**General**

```
Nombre:
HeroesDB
```

**Connection**

Host:

```
db
```

Usuario:

```
postgres
```

Password:

```
123456
```

Guardar.

---

# 📋 Comandos útiles

## Levantar servicios

```bash
docker compose up
```

---

## Levantar en segundo plano

```bash
docker compose up -d
```

---

## Detener servicios

```bash
docker compose down
```

---

## Ver logs

```bash
docker compose logs
```

---

## Seguir logs

```bash
docker compose logs -f
```

---

## Ver contenedores

```bash
docker container ls
```

---

## Ver volúmenes

```bash
docker volume ls
```

---

## Eliminar un volumen

```bash
docker volume rm <nombre-del-volumen>
```

---

## Eliminar volúmenes sin uso

```bash
docker volume prune
```

> ⚠️ **Advertencia:** elimina permanentemente la información almacenada.

---

# 🐧 Usuarios Linux

Si pgAdmin presenta errores de permisos:

```bash
sudo chown -R 5050:5050 ./pgadmin
```

Luego iniciar nuevamente:

```bash
docker compose up -d
```

---

# 📌 Recomendaciones

Agregar los directorios de datos al `.gitignore`.

```gitignore
postgres/
pgadmin/
```

No es recomendable subir los datos de una base de datos al repositorio.

