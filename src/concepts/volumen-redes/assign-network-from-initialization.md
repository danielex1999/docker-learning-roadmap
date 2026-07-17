# Docker Networks (Parte 2)

## Introducción



Hasta este momento tenemos dos comandos principales.

## MariaDB

```bash
docker container run -d \
  --name world-db \
  --network world-app \
  --publish 3306:3306 \
  --volume world-db:/var/lib/mysql \
  --env MARIADB_USER=example-user \
  --env MARIADB_PASSWORD=user-password \
  --env MARIADB_ROOT_PASSWORD=root-password \
  --env MARIADB_DATABASE=world-db \
  mariadb:yammy
```

Este comando:

- Crea el contenedor.
- Publica el puerto 3306.
- Usa un volumen para persistencia.
- Define variables de entorno.
- Lo conecta automáticamente a la red `world-app`.

---

## phpMyAdmin

```bash
docker container run -d \
  --name phpmyadmin \
  --network world-app \
  --publish 8080:80 \
  --env PMA_ARBITRARY=1 \
  phpmyadmin:5.2.0-apache
```

Este contenedor también queda conectado automáticamente a la misma red.

---

# Eliminar los contenedores

Antes de volver a levantarlos podemos eliminarlos.

Ver los contenedores:

```bash
docker container ls
```

Eliminar:

```bash
docker container rm -f <contenedor1> <contenedor2>
```

Ejemplo:

```bash
docker container rm -f world-db phpmyadmin
```

---

# La red sigue existiendo

Aunque eliminemos los contenedores:

```bash
docker container ls
```

No mostrará ninguno.

Pero la red continúa disponible.

Verificar:

```bash
docker network ls
```

Resultado:

```text
NETWORK ID     NAME
xxxxxxxx       world-app
```

No es necesario volver a crearla.

---

# Conectar un contenedor al crearlo

En lugar de ejecutar después:

```bash
docker network connect world-app world-db
```

podemos hacerlo directamente durante la creación.

Simplemente agregamos:

```bash
--network world-app
```

al comando `docker container run`.

Esto evita un paso adicional.

---

# Levantar nuevamente los contenedores

MariaDB:

```bash
docker container run ...
```

phpMyAdmin:

```bash
docker container run ...
```

Ambos quedarán automáticamente dentro de la red `world-app`.

---

# Verificar la aplicación

Abrimos:

```
http://localhost:8080
```

Credenciales:

Servidor:

```
world-db
```

Usuario:

```
example-user
```

Contraseña:

```
user-password
```

Resultado:

✅ phpMyAdmin vuelve a conectarse correctamente.

---

# Problema de administrar muchos contenedores

Imaginemos que empezamos a crear más instancias.

Por ejemplo:

```
phpmyadmin
```

```
phpmyadmin-1
```

```
phpmyadmin-2
```

cada una utilizando diferentes puertos:

```
8080
8081
8082
```

Visualmente Docker Desktop mostrará algo parecido a:

```
world-db

phpmyadmin

phpmyadmin-1

phpmyadmin-2
```

Pero surge un problema.

No existe una forma sencilla de identificar:

- cuál pertenece a qué aplicación;
- qué contenedores están relacionados;
- cuál utiliza determinada base de datos;
- qué red comparten.

Todo queda administrado manualmente.

---

# Limitaciones del enfoque manual

Cuando una aplicación comienza a crecer aparecen muchos elementos:

- contenedores;
- redes;
- volúmenes;
- variables de entorno;
- puertos;
- imágenes.

Mantener toda esa configuración mediante comandos individuales se vuelve difícil.

Por ejemplo, si queremos reconstruir toda la aplicación debemos recordar:

- todas las variables;
- todos los puertos;
- todos los volúmenes;
- todas las redes;
- todas las imágenes;
- el orden correcto.

Esto rápidamente se vuelve poco práctico.

---

# La solución: Docker Compose

En la siguiente sección aprenderemos **Docker Compose**.

Docker Compose permite:

- crear redes automáticamente;
- crear volúmenes automáticamente;
- levantar múltiples contenedores con un solo comando;
- guardar toda la configuración en un archivo;
- mantener agrupados todos los servicios de una aplicación.

En lugar de ejecutar muchos comandos:

```text
docker network create ...

docker volume create ...

docker container run ...

docker container run ...
```

solo necesitaremos un único archivo de configuración.

---

# Limpieza del laboratorio

Antes de continuar se recomienda eliminar todo lo creado.

---

## 1. Eliminar contenedores

Ver contenedores:

```bash
docker container ls
```

Eliminar:

```bash
docker container rm -f world-db phpmyadmin
```

---

## 2. Eliminar volúmenes

Listar:

```bash
docker volume ls
```

Eliminar:

```bash
docker volume rm world-db
```

Con esto también desaparecen los datos persistentes almacenados.

---

## 3. Eliminar la red

Listar:

```bash
docker network ls
```

Eliminar una red específica:

```bash
docker network rm world-app
```

O eliminar todas las redes sin uso:

```bash
docker network prune
```

---

# Comandos utilizados

Ver contenedores

```bash
docker container ls
```

Eliminar contenedores

```bash
docker container rm -f <contenedor>
```

Ver volúmenes

```bash
docker volume ls
```

Eliminar volumen

```bash
docker volume rm <volumen>
```

Ver redes

```bash
docker network ls
```

Eliminar red

```bash
docker network rm <red>
```

Eliminar redes sin uso

```bash
docker network prune
```

---

# Flujo del laboratorio

```text
Crear red
      │
      ▼
Levantar MariaDB
      │
      ▼
Levantar phpMyAdmin
      │
      ▼
Comunicación mediante la red
      │
      ▼
Eliminar contenedores
      │
      ▼
Eliminar volumen
      │
      ▼
Eliminar red
```

---

# Conceptos clave

- `--network` permite conectar un contenedor a una red desde su creación.
- Ya no es necesario utilizar `docker network connect` posteriormente.
- Las redes siguen existiendo aunque los contenedores sean eliminados.
- Los volúmenes almacenan los datos persistentes y deben eliminarse explícitamente.
- Administrar múltiples contenedores manualmente resulta complejo.
- Docker Compose resolverá este problema centralizando toda la configuración en un único archivo.