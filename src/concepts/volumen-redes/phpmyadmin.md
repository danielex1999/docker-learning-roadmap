# Introducción a Redes entre Contenedores: phpMyAdmin y MariaDB

En esta práctica aprenderás por qué dos contenedores no pueden comunicarse entre sí de forma predeterminada y cómo Docker Networks resuelve este problema.

---

# Objetivos

- Mantener la base de datos MariaDB ejecutándose.
- Descargar y ejecutar phpMyAdmin.
- Comprender por qué phpMyAdmin no puede conectarse a MariaDB inicialmente.
- Entender la importancia de las redes (Networks) en Docker.

---

# Requisitos

Antes de comenzar debes tener:

- Docker funcionando correctamente.
- El contenedor de **MariaDB** en ejecución.
- El volumen persistente creado en las prácticas anteriores.
- La base de datos `world-db` con información cargada.

Verifica que MariaDB esté ejecutándose:

```bash
docker container ls
```

Deberías ver un contenedor similar a:

```
world-db
```

---

# ¿Qué es phpMyAdmin?

**phpMyAdmin** es una aplicación web desarrollada en PHP que permite administrar bases de datos MySQL y MariaDB desde el navegador.

Con ella es posible:

- Crear bases de datos.
- Crear tablas.
- Ejecutar consultas SQL.
- Importar y exportar datos.
- Administrar usuarios.

---

# Buscar la imagen oficial

Desde Docker Hub busca:

```
phpmyadmin
```

Utiliza la imagen oficial.

Para esta práctica se utilizará el tag:

```
5.2.0-apache
```

Siempre es recomendable utilizar una versión específica en lugar de `latest`.

---

# Ejecutar phpMyAdmin

```bash
docker container run -d \
  --name phpmyadmin \
  --env PMA_ARBITRARY=1 \
  -p 8080:80 \
  phpmyadmin:5.2.0-apache
```

En PowerShell utiliza **backtick (`)** para dividir el comando en varias líneas.

---

# Explicación del comando

## Nombre del contenedor

```bash
--name phpmyadmin
```

Asigna un nombre fijo al contenedor.

---

## Variable de entorno

```bash
--env PMA_ARBITRARY=1
```

Permite que phpMyAdmin pueda conectarse manualmente a cualquier servidor MariaDB o MySQL.

---

## Publicación del puerto

```bash
-p 8080:80
```

Mapea:

- Puerto **8080** del equipo
- Puerto **80** del contenedor

De esta forma podremos acceder desde el navegador.

---

## Imagen utilizada

```bash
phpmyadmin:5.2.0-apache
```

Esta imagen ya incluye:

- Apache
- PHP
- phpMyAdmin

Todo listo para utilizarse.

---

# Verificar los contenedores

```bash
docker container ls
```

Ahora deberían aparecer dos contenedores:

- MariaDB
- phpMyAdmin

---

# Abrir phpMyAdmin

En el navegador abre:

```
http://localhost:8080
```

Aparecerá la pantalla de inicio de sesión.

---

# Credenciales

Utiliza las mismas creadas para MariaDB.

Ejemplo:

Usuario:

```
example-user
```

Contraseña:

```
user-password
```

---

# ¿Qué servidor debemos indicar?

Muchas personas intentan escribir:

```
localhost
```

o

```
127.0.0.1
```

Sin embargo, la conexión falla.

---

# ¿Por qué falla?

Aunque ambos contenedores están ejecutándose, **no pueden verse entre sí**.

Cuando phpMyAdmin intenta conectarse a:

```
localhost
```

en realidad está intentando conectarse a **él mismo**, no a MariaDB.

Dentro del contenedor:

```
localhost
```

significa:

> "Yo mismo"

No hace referencia al equipo host ni a otros contenedores.

---

# ¿Por qué TablePlus sí funciona?

TablePlus se ejecuta directamente en el sistema operativo del usuario.

Como MariaDB publica el puerto:

```
3306
```

el programa puede conectarse mediante:

```
localhost:3306
```

Porque ambos se comunican a través del equipo host.

---

# ¿Qué sucede con phpMyAdmin?

phpMyAdmin vive dentro de otro contenedor completamente independiente.

Su petición nunca sale automáticamente hacia el contenedor de MariaDB.

Por eso escribir:

```
localhost
```

o

```
127.0.0.1
```

no encuentra la base de datos.

---

# El problema

Actualmente tenemos dos contenedores aislados:

```
+----------------------+
|      phpMyAdmin      |
|      localhost       |
+----------------------+

          X

+----------------------+
|       MariaDB        |
|      localhost       |
+----------------------+
```

No existe comunicación entre ellos.

---

# ¿Cómo se resuelve?

Docker permite crear **redes (Networks)**.

Si ambos contenedores pertenecen a la misma red:

- podrán comunicarse;
- podrán descubrirse automáticamente;
- podrán usar el nombre del contenedor como dirección.

---

# Regla de oro

> **Si dos contenedores pertenecen a la misma Docker Network, pueden comunicarse entre sí utilizando el nombre del contenedor.**

---

# Ejemplo

En lugar de conectarse a:

```
localhost
```

phpMyAdmin podrá conectarse usando algo como:

```
world-db
```

(si ese es el nombre del contenedor de MariaDB).

Docker resolverá automáticamente ese nombre mediante su DNS interno.

---

# ¿Qué aprenderemos en la siguiente práctica?

En la próxima clase aprenderás a:

- Crear una Docker Network.
- Agregar contenedores a esa red.
- Permitir que phpMyAdmin encuentre automáticamente a MariaDB.
- Conectarte usando únicamente el nombre del contenedor.

---

# Conceptos clave

- Los contenedores están aislados por defecto.
- `localhost` dentro de un contenedor solo hace referencia a ese mismo contenedor.
- TablePlus funciona porque se ejecuta desde el sistema operativo host.
- phpMyAdmin necesita una Docker Network para comunicarse con MariaDB.
- Docker proporciona un DNS interno que permite usar el nombre del contenedor como dirección cuando ambos pertenecen a la misma red.