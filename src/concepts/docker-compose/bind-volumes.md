# Bind Volumes con Docker Compose


# 1. Limpiar el entorno

Ver los contenedores activos:

```bash
docker container ls
```

Eliminar los contenedores:

```bash
docker container rm -f <container-id-1> <container-id-2>
```

> **Nota:** Los volúmenes no se eliminan, por lo que la información almacenada permanece.

---

# 2. Crear el proyecto

Crear una carpeta para el laboratorio.

```
PostgreSQL-pgAdmin/
│
└── docker-compose.yml
```

---

# 3. Crear el archivo docker-compose.yml

```yaml
version: "3.8"

services:

  db:
    container_name: postgres_database
    image: postgres:15.1

    volumes:
      - postgres-db:/var/lib/postgresql/data

    environment:
      POSTGRES_PASSWORD: 123456

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

  postgres-db:
```

---

# 4. Explicación del archivo

## version

Define la versión del formato de Docker Compose.

```yaml
version: "3.8"
```

---

## services

Aquí se definen todos los contenedores.

```yaml
services:
```

---

## container_name

Nombre del contenedor.

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

## volumes

Permite persistir la información.

```yaml
volumes:
  - postgres-db:/var/lib/postgresql/data
```

---

## environment

Variables de entorno del contenedor.

```yaml
environment:
  POSTGRES_PASSWORD: 123456
```

---

## depends_on

Hace que pgAdmin espere a PostgreSQL antes de iniciar.

```yaml
depends_on:
  - db
```

---

## ports

Expone un puerto del contenedor hacia el host.

```yaml
ports:
  - "8080:80"
```

Lo que significa:

```
Host        Contenedor
8080   --->     80
```

---

# 5. Levantar la aplicación

```bash
docker compose up
```

Docker Compose realizará automáticamente:

- Crear la red
- Crear el volumen
- Descargar las imágenes
- Crear PostgreSQL
- Crear pgAdmin

---

# 6. Abrir pgAdmin

Ingresar desde el navegador:

```
http://localhost:8080
```

Credenciales:

**Correo**

```
superman@google.com
```

**Contraseña**

```
123456
```

---

# 7. Registrar el servidor PostgreSQL

Crear un nuevo servidor con los siguientes datos:

**Host**

```
postgres_database
```

**Usuario**

```
postgres
```

**Contraseña**

```
123456
```

Si todo es correcto, aparecerán las bases de datos disponibles.

---

# 8. Problema: Docker Compose crea un volumen nuevo

Al ejecutar:

```bash
docker volume ls
```

Podrás observar un volumen similar a:

```
postgresql-pgadmin_postgres-db
```

Este volumen fue creado automáticamente por Docker Compose.

Si anteriormente existía un volumen llamado:

```
postgres-db
```

Docker Compose **no lo utilizará** a menos que se indique explícitamente.

---

# 9. Utilizar un volumen existente

Modificar el archivo:

```yaml
volumes:

  postgres-db:
    external: true
```

Con esto Docker Compose utilizará un volumen previamente creado.

---

# 10. Recrear los servicios

Algunos cambios requieren recrear completamente los contenedores.

Detener la aplicación:

```bash
docker compose down
```

Eliminar el volumen creado por Docker Compose:

```bash
docker volume rm postgresql-pgadmin_postgres-db
```

Levantar nuevamente:

```bash
docker compose up
```

Ahora la aplicación utilizará el volumen externo y recuperará toda la información almacenada.

---

# 11. Utilizar un Bind Mount

También es posible guardar la información directamente dentro del proyecto.

En lugar de utilizar:

```yaml
volumes:
  - postgres-db:/var/lib/postgresql/data
```

Usar:

```yaml
volumes:
  - ./postgres:/var/lib/postgresql/data
```

Docker creará automáticamente la carpeta:

```
PostgreSQL-pgAdmin/

├── docker-compose.yml
└── postgres/
```

Toda la información de PostgreSQL quedará almacenada allí.

---

# 12. Persistir la configuración de pgAdmin

Agregar un volumen para pgAdmin:

```yaml
pgAdmin:

  volumes:
    - ./pgadmin:/var/lib/pgadmin
```

Esto permitirá conservar:

- Servidores registrados
- Configuraciones
- Preferencias
- Conexiones

Aunque los contenedores sean eliminados.

---

# 13. Usuarios Linux

Si aparece un error relacionado con permisos:

```
Permission denied
```

Ejecutar:

```bash
sudo chown -R 5050:5050 ./pgadmin
```

Después levantar nuevamente:

```bash
docker compose up -d
```

---

# 14. Ver los logs

Mostrar todos los logs:

```bash
docker compose logs
```

Seguir los logs en tiempo real:

```bash
docker compose logs -f
```

---

# 15. Ejecutar en segundo plano

```bash
docker compose up -d
```

---

# 16. Detener la aplicación

```bash
docker compose down
```

---

# 17. Eliminar volúmenes

Ver los volúmenes:

```bash
docker volume ls
```

Eliminar un volumen:

```bash
docker volume rm <volume-name>
```

Eliminar todos los volúmenes sin utilizar:

```bash
docker volume prune
```

> ⚠️ **Advertencia:** Esta acción elimina permanentemente la información almacenada en esos volúmenes.

---

# 📚 Conceptos aprendidos

Al finalizar esta práctica aprendiste:

- Crear aplicaciones con múltiples contenedores usando Docker Compose.
- Definir servicios en `docker-compose.yml`.
- Utilizar `depends_on`.
- Configurar variables de entorno.
- Exponer puertos.
- Crear volúmenes automáticamente.
- Utilizar volúmenes externos.
- Crear Bind Mounts.
- Persistir datos de PostgreSQL.
- Persistir configuraciones de pgAdmin.
- Administrar redes creadas automáticamente por Docker Compose.
- Ejecutar y detener aplicaciones con un solo comando.
- Consultar logs y administrar recursos desde Docker Compose.