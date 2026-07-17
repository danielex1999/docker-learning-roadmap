# Tipos de volúmenes

En esta práctica aprenderás a utilizar **volúmenes en Docker** para mantener la información aunque un contenedor sea eliminado. Este es uno de los conceptos más importantes de Docker, ya que permite separar los datos del ciclo de vida del contenedor.

---

# Objetivos

- Comprender qué es un volumen en Docker.
- Conocer los tipos de volúmenes disponibles.
- Crear un volumen persistente.
- Asociar un volumen a un contenedor de MariaDB.
- Verificar que la información permanece después de eliminar el contenedor.

---

# ¿Qué es un volumen?

Un **volumen** es un espacio de almacenamiento administrado por Docker donde se guardan los datos de forma persistente.

La gran ventaja es que:

- Los datos sobreviven al eliminar un contenedor.
- Permanecen después de reiniciar Docker.
- Pueden reutilizarse por nuevos contenedores.

En otras palabras, el contenedor puede desaparecer, pero la información sigue existiendo.

---

# Tipos de volúmenes

Docker permite trabajar con tres tipos principales:

## 1. Named Volumes

Son volúmenes a los que nosotros les asignamos un nombre.

Ejemplo:

```bash
docker volume create world-db
```

Son los más utilizados para bases de datos.

---

## 2. Anonymous Volumes

Docker crea automáticamente un nombre aleatorio para el volumen.

No es necesario administrarlo manualmente.

---

## 3. Bind Mounts

Permiten enlazar una carpeta de nuestra computadora con una carpeta dentro del contenedor.

Se utilizan principalmente durante el desarrollo para trabajar directamente sobre los archivos del proyecto.

---

# Crear un volumen

Creamos un volumen llamado:

```bash
docker volume create world-db
```

Docker responderá con el nombre del volumen creado.

---

# Listar volúmenes

```bash
docker volume ls
```

---

# Ver información de un volumen

```bash
docker volume inspect world-db
```

La información incluye:

- Nombre
- Ruta física
- Fecha de creación
- Driver utilizado

---

# Utilizar el volumen en MariaDB

El volumen debe montarse indicando:

```
HOST:CONTENEDOR
```

En MariaDB los datos se almacenan en:

```
/var/lib/mysql
```

Por lo tanto el parámetro será:

```text
world-db:/var/lib/mysql
```

---

# Crear el contenedor utilizando el volumen

```bash
docker container run \
-dp 3306:3306 \
--name world-db \
--env MARIADB_USER=example-user \
--env MARIADB_PASSWORD=user-password \
--env MARIADB_ROOT_PASSWORD=root-password \
--env MARIADB_DATABASE=world-db \
--volume world-db-volume:/var/lib/mysql \
mariadb:jammy
```

En PowerShell utiliza **backtick (`)** para continuar en varias líneas.

---

# Conectarse a la base de datos

Utiliza TablePlus (o cualquier cliente SQL).

Configuración:

| Parámetro | Valor |
|-----------|-------|
| Host | localhost |
| Puerto | 3306 |
| Usuario | example-user |
| Contraseña | user-password |
| Base de datos | world-db |

---

# Importar la base de datos

Abre el archivo SQL proporcionado en el curso.

Ejecuta todas las instrucciones.

Al finalizar deberían aparecer las tablas:

- Country
- CountryLanguage

---

# Verificar el volumen

En Docker Desktop aparecerá un volumen similar a:

```
world-db
```

Docker mostrará el tamaño utilizado por la base de datos.

---

# Probar la persistencia

Eliminar completamente el contenedor:

```bash
docker container rm -f world-db
```

---

# Volver a crear el contenedor

Ejecuta exactamente el mismo comando utilizado anteriormente.

Como el volumen ya existe:

```
world-db:/var/lib/mysql
```

MariaDB volverá a utilizar los datos almacenados.

---

# Comprobar la persistencia

Conéctate nuevamente con TablePlus.

Actualiza la conexión.

Las tablas y los registros seguirán existiendo sin necesidad de volver a importar el archivo SQL.

Esto demuestra que los datos ya no dependen del contenedor, sino del volumen.

---

# Comandos utilizados

Crear volumen

```bash
docker volume create world-db
```

Listar volúmenes

```bash
docker volume ls
```

Inspeccionar volumen

```bash
docker volume inspect world-db
```

Eliminar contenedor

```bash
docker container rm -f world-db
```

Crear contenedor con volumen

```bash
docker container run -d \
  --name world-db \
  -p 3306:3306 \
  --env MARIADB_USER=example-user \
  --env MARIADB_PASSWORD=user-password \
  --env MARIADB_ROOT_PASSWORD=root-password \
  --env MARIADB_DATABASE=world-db \
  --volume world-db:/var/lib/mysql \
  mariadb:yamy
```

---

# Conceptos clave

- Un volumen almacena información de forma persistente.
- Los datos sobreviven aunque el contenedor sea eliminado.
- MariaDB guarda sus archivos en `/var/lib/mysql`.
- Los **Named Volumes** son la mejor opción para bases de datos.
- El contenedor puede recrearse cuantas veces sea necesario reutilizando el mismo volumen.