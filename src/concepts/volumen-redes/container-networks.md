# Redes de contenedores

## Introducción

En esta sección aprenderemos a utilizar **Docker Networks**, el mecanismo que permite que varios contenedores se comuniquen entre sí de forma segura.

Hasta este punto del curso ya tenemos:

- Un contenedor con **MariaDB**
- Un contenedor con **phpMyAdmin**

Aunque ambos están ejecutándose correctamente, **no pueden comunicarse**, ya que cada contenedor se encuentra aislado.

La solución consiste en crear una **red personalizada** y conectar ambos contenedores a ella.

---

# ¿Qué es una Docker Network?

Una **Docker Network** es una red virtual creada por Docker que permite que varios contenedores puedan comunicarse entre sí.

Cuando dos contenedores pertenecen a la misma red:

- Pueden encontrarse mediante su nombre.
- Docker crea automáticamente un DNS interno.
- No es necesario conocer direcciones IP.
- Pueden acceder a los puertos internos de otros contenedores.

---

# Redes por defecto

Docker crea varias redes automáticamente.

Para verlas:

```bash
docker network ls
```

Salida de ejemplo:

```text
NETWORK ID     NAME      DRIVER    SCOPE
xxxxxx         bridge    bridge    local
xxxxxx         host      host      local
xxxxxx         none      null      local
```

## Bridge

Es la red por defecto.

Si no se especifica ninguna red al crear un contenedor, Docker lo conecta automáticamente a **bridge**.

---

# Comandos disponibles

Consultar los comandos disponibles:

```bash
docker network
```

Algunos de los más utilizados:

| Comando | Descripción |
|----------|-------------|
| `docker network ls` | Lista las redes existentes |
| `docker network create` | Crea una nueva red |
| `docker network connect` | Conecta un contenedor a una red |
| `docker network disconnect` | Desconecta un contenedor |
| `docker network inspect` | Muestra la configuración de una red |
| `docker network rm` | Elimina una red |
| `docker network prune` | Elimina redes que no están siendo utilizadas |

---

# Crear una red

Creamos una red personalizada:

```bash
docker network create world-app
```

Verificamos:

```bash
docker network ls
```

Resultado esperado:

```text
NETWORK ID     NAME
xxxxxxxx       world-app
```

---

# Contenedores existentes

En este laboratorio tenemos dos contenedores:

```bash
docker container ls
```

Ejemplo:

```text
CONTAINER ID    NAME
a7a12c          world-db
b98ef1          phpmyadmin
```

En este momento ambos están aislados.

Todavía no pueden comunicarse.

---

# Conectar un contenedor a una red

Sintaxis:

```bash
docker network connect <red> <contenedor>
```

Conectamos phpMyAdmin:

```bash
docker network connect world-app phpmyadmin
```

Conectamos MariaDB:

```bash
docker network connect world-app world-db
```

Ahora ambos pertenecen a la misma red.

---

# Inspeccionar la red

Podemos comprobar los contenedores conectados:

```bash
docker network inspect world-app
```

Docker mostrará información como:

- Contenedores conectados
- Dirección IP interna
- Gateway
- Configuración de la red

---

# DNS interno de Docker

Una de las mayores ventajas de Docker Networks es que crea automáticamente un **DNS interno**.

Eso significa que podemos acceder a un contenedor utilizando únicamente su nombre.

Por ejemplo:

```
world-db
```

En lugar de utilizar:

```
127.0.0.1
```

o

```
localhost
```

Esto simplifica enormemente la comunicación entre servicios.

---

# Conexión desde phpMyAdmin

Abrimos:

```
http://localhost:8080
```

Configuración:

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

Al iniciar sesión:

✅ phpMyAdmin logra conectarse correctamente con MariaDB.

---

# ¿Por qué localhost no funcionaba?

Cuando phpMyAdmin intentaba conectarse usando:

```
localhost
```

realmente estaba intentando conectarse consigo mismo.

Recordemos que:

```
localhost
```

siempre hace referencia al mismo contenedor.

No apunta al host ni a otro contenedor.

---

# Comunicación correcta

En lugar de:

```
localhost
```

debemos utilizar:

```
world-db
```

porque Docker resuelve automáticamente ese nombre mediante su DNS interno.

---

# Actualizar phpMyAdmin

Una ventaja adicional es que actualizar phpMyAdmin resulta muy sencillo.

Solo debemos descargar otra imagen:

```bash
docker pull phpmyadmin:latest
```

(o cualquier versión específica)

y volver a crear el contenedor utilizando esa imagen.

La base de datos permanece intacta porque está almacenada en el volumen de MariaDB.

---

# Resumen de comandos

Crear una red

```bash
docker network create world-app
```

Listar redes

```bash
docker network ls
```

Conectar phpMyAdmin

```bash
docker network connect world-app phpmyadmin
```

Conectar MariaDB

```bash
docker network connect world-app world-db
```

Inspeccionar una red

```bash
docker network inspect world-app
```

Eliminar una red

```bash
docker network rm world-app
```

Eliminar redes sin uso

```bash
docker network prune
```

---

# Flujo del laboratorio

```text
                Docker Network
                 world-app
        ┌──────────────────────────┐
        │                          │
        │                          │
┌──────────────┐          ┌────────────────┐
│ phpMyAdmin   │◄────────►│   MariaDB      │
│ puerto 8080  │          │ puerto 3306    │
└──────────────┘          └────────────────┘
        │
        │
        ▼
 Navegador Web
 http://localhost:8080
```

---

# Conceptos clave

- Docker Networks permiten la comunicación entre contenedores.
- La red `bridge` es la red por defecto.
- Es recomendable crear redes personalizadas para aplicaciones.
- Docker crea automáticamente un DNS interno.
- Los contenedores pueden comunicarse usando su nombre.
- `localhost` siempre apunta al mismo contenedor.
- phpMyAdmin puede acceder a MariaDB usando el nombre del contenedor (`world-db`).
- Las redes facilitan la construcción de aplicaciones con múltiples servicios.