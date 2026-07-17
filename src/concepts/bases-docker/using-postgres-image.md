# Conectando PostgreSQL desde el Equipo Host

## Introducción

En la clase anterior levantamos una instancia de PostgreSQL utilizando Docker y configuramos la contraseña mediante una variable de entorno. Sin embargo, aunque la base de datos estaba ejecutándose correctamente, todavía no podíamos conectarnos desde nuestra computadora.

En esta práctica aprenderemos cómo publicar el puerto de PostgreSQL para acceder a la base de datos desde un cliente como TablePlus.

Al finalizar, podremos:

- Publicar el puerto de PostgreSQL.
- Conectarnos desde el equipo host.
- Crear una base de datos.
- Crear tablas.
- Comprender por qué la información se pierde al eliminar un contenedor.
- Entender la necesidad de los volúmenes en Docker.

---

# Verificar el contenedor

Podemos comprobar que PostgreSQL está ejecutándose con:

```bash
docker container ls
```

Ejemplo:

```text
CONTAINER ID   IMAGE      STATUS

abc123         postgres   Up
```

Aunque el contenedor esté funcionando, todavía no significa que podamos conectarnos desde nuestra computadora.

---

# El puerto interno del contenedor

Por defecto, PostgreSQL escucha en el puerto:

```text
5432
```

Ese puerto existe **dentro del contenedor**.

Los demás contenedores pueden comunicarse con él si pertenecen a la misma red de Docker, pero nuestro equipo todavía no tiene acceso porque ese puerto no ha sido publicado.

Visualmente:

```text
┌─────────────────────────────┐
│      Contenedor Docker      │
│                             │
│ PostgreSQL                  │
│ Puerto 5432                 │
└──────────────┬──────────────┘
               │
         (No existe conexión)
               │
┌──────────────▼──────────────┐
│      Equipo Host            │
│                             │
│ TablePlus                   │
└─────────────────────────────┘
```

---

# Intentando conectarnos

Podemos utilizar cualquier cliente de bases de datos compatible con PostgreSQL.

Por ejemplo:

- TablePlus
- DBeaver
- pgAdmin
- DataGrip

La configuración inicial sería:

| Campo | Valor |
|--------|-------|
| Host | localhost |
| Puerto | 5432 |
| Usuario | postgres |
| Contraseña | La definida mediante `POSTGRES_PASSWORD` |

Si intentamos realizar la conexión obtendremos un error similar a:

```text
Connection refused
```

Esto ocurre porque el puerto aún no ha sido publicado.

---

# Usuario por defecto

La imagen oficial de PostgreSQL crea automáticamente un usuario administrador.

Por defecto es:

```text
postgres
```

Este usuario puede modificarse utilizando la variable de entorno:

```bash
POSTGRES_USER
```

Si no la especificamos, Docker utilizará automáticamente:

```text
postgres
```

---

# Contraseña

La contraseña corresponde al valor enviado mediante la variable de entorno durante la creación del contenedor.

Ejemplo:

```bash
-e POSTGRES_PASSWORD=mysecretpassword
```

Entonces la contraseña será:

```text
mysecretpassword
```

---

# Publicar el puerto

Para permitir que nuestra computadora acceda a PostgreSQL debemos publicar el puerto al crear el contenedor.

La sintaxis es:

```bash
-p puerto-host:puerto-contenedor
```

Para PostgreSQL:

```bash
-p 5432:5432
```

---

# Ejecutar PostgreSQL publicando el puerto

Podemos crear nuevamente el contenedor utilizando:

```bash
docker container run \
--name postgres-db \
-e POSTGRES_PASSWORD=mysecretpassword \
-d \
-p 5432:5432 \
postgres
```

Este comando realiza:

- Crea el contenedor.
- Lo ejecuta en segundo plano.
- Configura la contraseña.
- Publica el puerto 5432.

---

# Verificar el mapeo de puertos

Si ejecutamos:

```bash
docker container ls
```

obtendremos una salida similar a:

```text
PORTS

0.0.0.0:5432->5432/tcp
```

Esto significa:

```text
Equipo Host                Contenedor

Puerto 5432  ----------->  Puerto 5432
```

Ahora cualquier aplicación instalada en nuestro equipo podrá conectarse utilizando:

```text
localhost:5432
```

---

# Probar la conexión

Con la misma configuración anterior:

| Campo | Valor |
|--------|-------|
| Host | localhost |
| Puerto | 5432 |
| Usuario | postgres |
| Contraseña | mysecretpassword |

Ahora la prueba de conexión será exitosa.

Una vez conectados podremos administrar PostgreSQL normalmente.

---

# Crear una base de datos

Desde el cliente de base de datos podemos crear una nueva base.

Ejemplo:

```text
pruebas
```

Después de crearla podremos conectarnos y comenzar a trabajar con ella.

---

# Crear tablas

Una vez dentro de la base de datos podemos crear tablas como normalmente lo haríamos.

Ejemplo:

```sql
CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100)
);
```

También podremos:

- Insertar registros.
- Consultar información.
- Modificar datos.
- Eliminar registros.

Todo funciona igual que una instalación tradicional de PostgreSQL.

---

# ¿Qué ocurre si eliminamos el contenedor?

Toda la información que estamos creando actualmente se encuentra almacenada **dentro del contenedor**.

Si eliminamos el contenedor utilizando:

```bash
docker container rm -f <id>
```

también eliminaremos:

- Bases de datos.
- Tablas.
- Registros.
- Configuración interna.

Es decir, perderemos toda la información.

---

# Persistencia de datos

Actualmente los datos viven únicamente dentro del contenedor.

```text
Contenedor

PostgreSQL
│
├── Base de datos
├── Tablas
├── Registros
└── Configuración
```

Al eliminar el contenedor todo desaparece.

Más adelante aprenderemos cómo utilizar **volúmenes**, que permiten almacenar la información fuera del contenedor para conservar los datos incluso después de eliminarlo.

---

# Eliminar el contenedor

Una vez terminada la práctica podemos eliminar el contenedor utilizando:

```bash
docker container rm -f <id>
```

Ejemplo:

```bash
docker container rm -f abc123
```

El parámetro:

```text
-f
```

realiza la eliminación de manera forzada, incluso si el contenedor continúa ejecutándose.

---

# Conservar la imagen

Aunque eliminemos el contenedor, la imagen de PostgreSQL permanecerá almacenada en nuestro equipo.

Esto permitirá reutilizarla en las siguientes prácticas sin necesidad de volver a descargarla.

---

# Comandos utilizados

Ver contenedores:

```bash
docker container ls
```

Ejecutar PostgreSQL:

```bash
docker container run \
--name postgres-db \
-e POSTGRES_PASSWORD=mysecretpassword \
-d \
-p 5432:5432 \
postgres
```

Eliminar un contenedor:

```bash
docker container rm -f <id>
```

---

# Conclusión

En esta práctica aprendimos cómo conectar una base de datos PostgreSQL ejecutándose dentro de Docker con aplicaciones instaladas en nuestro equipo mediante la publicación de puertos.

También comprobamos que, aunque el contenedor funciona correctamente, la información almacenada dentro de él se pierde al eliminarlo. Este comportamiento introduce uno de los conceptos más importantes de Docker: **la persistencia de datos mediante volúmenes**, tema que se abordará en las siguientes prácticas.