# Variables de Entorno

## Introducción

Las variables de entorno son una de las herramientas más utilizadas al trabajar con Docker, ya que permiten enviar configuraciones a los contenedores en el momento de su creación.

Estas variables permiten configurar aplicaciones sin modificar directamente el código o la imagen.

En esta práctica aprenderemos:

- Qué son las variables de entorno.
- Cómo enviarlas al ejecutar un contenedor.
- Cómo identificar qué variables acepta una imagen.
- Uso de imágenes oficiales.
- Ejecutar PostgreSQL mediante Docker.
- Configurar una base de datos usando variables de entorno.

---

# ¿Qué son las variables de entorno?

Una variable de entorno es un valor de configuración disponible dentro del ambiente donde se ejecuta una aplicación.

En Docker, ese ambiente normalmente es un contenedor.

Ejemplo:

```
Contenedor Docker

Aplicación
    |
    |
Variables de entorno
    |
    |
Configuración
```

Estas variables permiten enviar información como:

- Contraseñas.
- Usuarios.
- Configuraciones de conexión.
- Modos de ejecución.
- Parámetros de una aplicación.

---

# Variables de entorno en Docker

Para enviar una variable de entorno al crear un contenedor utilizamos:

```bash
-e
```

o:

```bash
--env
```

La estructura es:

```bash
docker container run -e VARIABLE=VALOR imagen
```

Ejemplo:

```bash
docker container run -e PASSWORD=123456 imagen
```

Docker creará el contenedor con esa variable disponible internamente.

---

# ¿Qué variables de entorno puedo utilizar?

Las variables disponibles dependen de la imagen que estamos utilizando.

Cada imagen define sus propias variables de configuración.

Por ejemplo:

- PostgreSQL utiliza variables para configurar usuarios y contraseñas.
- MySQL utiliza variables para crear bases de datos.
- Aplicaciones personalizadas pueden utilizar variables definidas por el desarrollador.

La documentación de cada imagen indica cuáles variables están disponibles.

---

# Docker Hub

Docker Hub es el repositorio donde podemos encontrar imágenes Docker.

Ejemplo:

```
hub.docker.com
```

Al buscar una imagen podemos encontrar diferentes tipos:

- Imágenes oficiales.
- Imágenes verificadas.
- Imágenes de comunidad.
- Proyectos Open Source.

Las imágenes oficiales son recomendadas porque:

- Son mantenidas por sus creadores.
- Siguen buenas prácticas.
- Tienen mayor confiabilidad.
- Reciben actualizaciones constantes.

---

# Imagen oficial de PostgreSQL

Para esta práctica utilizaremos PostgreSQL.

Podemos encontrar la imagen oficial:

```bash
postgres
```

Antes de utilizarla podemos descargarla:

```bash
docker pull postgres
```

Si no indicamos un tag:

```bash
docker pull postgres
```

Docker utiliza automáticamente:

```bash
postgres:latest
```

---

# Tags de PostgreSQL

Una imagen puede tener diferentes versiones mediante sus tags.

Ejemplos:

```bash
postgres:15
postgres:14
postgres:13
```

También existen variantes basadas en Alpine Linux:

```bash
postgres:15-alpine
postgres:14-alpine
```

---

# ¿Qué es Alpine?

Alpine es una distribución Linux ligera enfocada en:

- Seguridad.
- Bajo consumo de recursos.
- Tamaño reducido.

Muchas imágenes Docker utilizan Alpine porque permite crear imágenes más pequeñas y eficientes.

Ejemplo:

```
postgres
      |
      |
postgres basado en Alpine
```

---

# Arquitectura de imágenes Docker

Cuando observamos los tags de una imagen podemos encontrar información sobre las arquitecturas soportadas.

Ejemplos:

- AMD64.
- ARM64.

Docker permite ejecutar imágenes en diferentes arquitecturas gracias a mecanismos de compatibilidad.

Ejemplo:

```
Computadora ARM64

        ↓

Imagen AMD64

        ↓

Compatibilidad Docker
```

Aunque puede funcionar, el rendimiento puede variar dependiendo del hardware.

---

# Ejecutar PostgreSQL utilizando variables de entorno

La imagen oficial de PostgreSQL requiere ciertas variables para iniciar correctamente.

Ejemplo:

```bash
docker container run \
--name postgres-db \
-e POSTGRES_PASSWORD=mysecretpassword \
postgres
```

Este comando realiza:

1. Crea un contenedor.
2. Asigna un nombre.
3. Define la contraseña del usuario administrador.
4. Inicia PostgreSQL.

---

# Explicación del comando

Ejemplo:

```bash
docker container run \
--name postgres-db \
-e POSTGRES_PASSWORD=mysecretpassword \
postgres
```

## Nombre del contenedor

```bash
--name postgres-db
```

Permite asignar un nombre personalizado.

En lugar de un nombre aleatorio generado por Docker tendremos:

```
postgres-db
```

---

## Variable de entorno

```bash
-e POSTGRES_PASSWORD=mysecretpassword
```

Define la contraseña inicial de PostgreSQL.

La imagen utiliza esta variable durante el inicio para configurar la base de datos.

---

## Imagen utilizada

```bash
postgres
```

Indica qué imagen utilizar.

Como no especificamos una versión:

```bash
postgres:latest
```

será utilizada.

---

# Verificar el contenedor PostgreSQL

Después de ejecutar el comando podemos comprobarlo con:

```bash
docker container ls
```

Ejemplo:

```
CONTAINER ID     IMAGE       STATUS

abc123           postgres    Up
```

PostgreSQL estará ejecutándose dentro del contenedor.

---

# Puerto de PostgreSQL

Por defecto PostgreSQL utiliza:

```
5432
```

El contenedor expone ese puerto internamente.

Sin embargo, si no publicamos el puerto:

```bash
-p
```

nuestra computadora no podrá acceder directamente al servicio.

Ejemplo:

```
Contenedor

PostgreSQL
Puerto 5432

       X

Equipo local
```

Para conectarnos desde fuera necesitamos publicar el puerto.

---

# Publicar PostgreSQL hacia nuestro equipo

Podemos utilizar:

```bash
-p puerto-local:puerto-contenedor
```

Ejemplo:

```bash
docker container run \
--name postgres-db \
-e POSTGRES_PASSWORD=mysecretpassword \
-p 5432:5432 \
postgres
```

Ahora la conexión será:

```
Equipo local          Contenedor

5432       --->       5432
```

---

# Flujo completo

```
Docker Hub
     |
     ↓
docker pull postgres
     |
     ↓
Imagen PostgreSQL local
     |
     ↓
docker container run
     |
     ↓
Variables de entorno
     |
     ↓
Contenedor PostgreSQL
     |
     ↓
Base de datos ejecutándose
```

---

# Comandos utilizados

Descargar PostgreSQL:

```bash
docker pull postgres
```

Ejecutar PostgreSQL:

```bash
docker container run postgres
```

Ejecutar con variable de entorno:

```bash
docker container run -e VARIABLE=VALOR postgres
```

Asignar nombre al contenedor:

```bash
--name nombre-contenedor
```

Publicar puerto:

```bash
-p 5432:5432
```

Ver contenedores activos:

```bash
docker container ls
```

---

# Conclusión

Las variables de entorno permiten configurar aplicaciones Docker sin modificar las imágenes.

Gracias a ellas podemos enviar información como:

- Contraseñas.
- Usuarios.
- Configuraciones.
- Parámetros de ejecución.

En esta práctica utilizamos una variable de entorno para configurar PostgreSQL y levantar una instancia completa de base de datos utilizando únicamente un comando Docker.

Este concepto es fundamental para trabajar con aplicaciones reales, especialmente en ambientes de desarrollo, pruebas y producción.