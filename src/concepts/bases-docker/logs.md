# Visualización de Logs en Contenedores

## Introducción

Los **logs** son registros generados por las aplicaciones que se ejecutan dentro de un contenedor. Estos mensajes permiten conocer el estado de una aplicación, detectar errores, confirmar que un servicio está listo para recibir conexiones o simplemente monitorear su funcionamiento.

Docker ofrece comandos sencillos para visualizar estos registros sin necesidad de ingresar al contenedor.

En esta práctica aprenderemos a:

- Consultar los logs de un contenedor.
- Seguir los logs en tiempo real.
- Desplegar una instancia de MariaDB.
- Obtener una contraseña generada automáticamente.
- Conectarnos a MariaDB utilizando TablePlus.
- Observar cómo los eventos aparecen en los logs.

---

# ¿Qué son los logs?

Los logs son mensajes emitidos por la aplicación que se ejecuta dentro del contenedor.

Dependiendo del tipo de aplicación, pueden mostrar información como:

- Inicio del servicio.
- Errores.
- Advertencias.
- Conexiones realizadas.
- Consultas ejecutadas.
- Estado de la aplicación.
- Información de depuración.

Cada imagen genera sus propios registros según su funcionamiento.

---

# Ver los logs de un contenedor

Para visualizar los registros de un contenedor utilizamos:

```bash
docker container logs <id-contenedor>
```

Ejemplo:

```bash
docker container logs abc123
```

También podemos utilizar el nombre del contenedor.

```bash
docker container logs mariadb
```

---

# Seguir los logs en tiempo real

Si queremos monitorear continuamente los nuevos mensajes, utilizamos:

```bash
docker container logs -f <id-contenedor>
```

o

```bash
docker container logs --follow <id-contenedor>
```

Mientras el comando permanezca ejecutándose, Docker mostrará automáticamente cada nuevo mensaje generado por la aplicación.

Para salir del seguimiento:

```text
Ctrl + C
```

---

# Descargar MariaDB

Para esta práctica utilizaremos la imagen oficial de MariaDB.

Descargar la imagen:

```bash
docker pull mariadb:yammy
```

En este caso utilizaremos específicamente el tag:

```text
yammy
```

---

# Tags de una imagen

Una imagen puede tener múltiples tags.

Por ejemplo:

```text
latest
11.8
11.8.2
yammy
```

En algunos casos diferentes tags pueden apuntar exactamente a la misma imagen.

Esto permite ofrecer nombres más descriptivos para una misma versión.

---

# Ejecutar MariaDB

Crearemos una instancia utilizando una contraseña aleatoria para el usuario administrador.

```bash
docker container run \
  -e MARIADB_RANDOM_ROOT_PASSWORD=yes \
  -p 3306:3306 \
  mariadb:yammy
```

---

# Variable de entorno

La variable:

```text
MARIADB_RANDOM_ROOT_PASSWORD=yes
```

indica que MariaDB debe generar automáticamente una contraseña para el usuario **root**.

No es necesario definirla manualmente.

---

# Verificar el contenedor

```bash
docker container ls
```

Ejemplo:

```text
CONTAINER ID   IMAGE            STATUS

abc123         mariadb:yammy    Up
```

---

# Obtener la contraseña generada

Consultar los logs:

```bash
docker container logs abc123
```

Entre los mensajes aparecerá una línea similar a:

```text
GENERATED ROOT PASSWORD: ************
```

Ese valor corresponde a la contraseña generada automáticamente para el usuario **root**.

---

# Conectarse desde TablePlus

Crear una nueva conexión con los siguientes datos:

| Campo | Valor |
|--------|-------|
| Host | localhost |
| Puerto | 3306 |
| Usuario | root |
| Contraseña | Contraseña obtenida en los logs |

Si la configuración es correcta, la conexión será exitosa.

---

# Monitorear los logs en tiempo real

Ejecutar:

```bash
docker container logs -f abc123
```

Ahora cualquier evento nuevo aparecerá inmediatamente en la consola.

---

# Ejemplo de eventos

Si realizamos una conexión correcta desde TablePlus, normalmente no aparecerán errores importantes.

Sin embargo, si intentamos conectarnos con un usuario o contraseña incorrectos, MariaDB registrará mensajes similares a:

```text
Access denied for user 'root2'
```

También pueden aparecer mensajes cuando una conexión se cierra inesperadamente.

Estos registros son muy útiles para diagnosticar problemas de autenticación o comunicación.

---

# Flujo de la práctica

```text
Docker Hub
      │
      ▼
docker pull mariadb:yammy
      │
      ▼
docker container run
      │
      ▼
MariaDB
      │
      ▼
docker container logs
      │
      ▼
Obtener contraseña
      │
      ▼
TablePlus
      │
      ▼
Conexión a MariaDB
```

---

# Comandos utilizados

Descargar la imagen:

```bash
docker pull mariadb:yammy
```

Ejecutar MariaDB:

```bash
docker container run \
  -e MARIADB_RANDOM_ROOT_PASSWORD=yes \
  -p 3306:3306 \
  mariadb:yammy
```

Ver contenedores:

```bash
docker container ls
```

Ver logs:

```bash
docker container logs <id>
```

Seguir logs en tiempo real:

```bash
docker container logs -f <id>
```

---

# Conclusión

Los logs son una herramienta fundamental para monitorear y diagnosticar aplicaciones ejecutándose dentro de Docker.

Durante esta práctica aprendimos a consultar los registros de un contenedor, seguirlos en tiempo real y utilizar la información generada por MariaDB para obtener una contraseña automática y establecer una conexión desde un cliente de base de datos.

El uso adecuado de los logs facilita la identificación de errores y el monitoreo del comportamiento de cualquier aplicación ejecutada en contenedores.