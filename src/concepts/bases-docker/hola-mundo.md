# 🐳 Hello world en Docker

## Introducción

Docker permite empaquetar aplicaciones junto con todas sus dependencias dentro de contenedores, logrando que puedan ejecutarse de manera consistente en diferentes ambientes.

En esta práctica aprenderemos los conceptos básicos de Docker utilizando la imagen `hello-world`, entendiendo cómo descargar imágenes, ejecutarlas y cómo funciona la relación entre imágenes y contenedores.

---

# ¿Qué es una imagen Docker?

Una imagen Docker es un archivo construido por capas que contiene todo lo necesario para ejecutar una aplicación.

Una imagen puede incluir:

- Dependencias de la aplicación.
- Configuraciones.
- Scripts de ejecución.
- Archivos binarios.
- Librerías necesarias.
- Código requerido para funcionar.

Una imagen funciona como una plantilla que posteriormente puede ser utilizada para crear contenedores.

Ejemplo:

```
Imagen Docker
      |
      ↓
Contenedor ejecutándose
```

---

# Docker Pull

El comando `docker pull` permite descargar una imagen desde un repositorio de Docker, normalmente desde Docker Hub.

La sintaxis es:

```bash
docker pull <imagen>
```

Ejemplo:

```bash
docker pull hello-world
```

Cuando ejecutamos este comando Docker realiza el siguiente proceso:

1. Busca si la imagen ya existe localmente.
2. Si no existe, consulta el repositorio remoto.
3. Descarga las capas necesarias.
4. Guarda la imagen en nuestro equipo.

Ejemplo de salida:

```text
Unable to find image 'hello-world:latest' locally

Pulling from library/hello-world

Downloaded newer image for hello-world:latest
```

Esto indica que Docker no encontró la imagen en nuestro equipo y procedió a descargarla.

---

# Tags en Docker

Las imágenes Docker pueden tener etiquetas llamadas **tags**, las cuales permiten identificar versiones o variantes de una imagen.

El formato general es:

```bash
imagen:tag
```

Ejemplo:

```bash
hello-world:latest
```

En este caso:

- `hello-world` corresponde al nombre de la imagen.
- `latest` corresponde al tag asignado.

Cuando ejecutamos:

```bash
docker pull hello-world
```

Docker utiliza automáticamente:

```bash
hello-world:latest
```

porque no especificamos una etiqueta.

Ejemplos:

```bash
mysql:8
mysql:5.7

node:20
node:18

ubuntu:22.04
ubuntu:24.04
```

Cada tag puede representar una versión diferente de una misma imagen.

## Importante sobre latest

Aunque `latest` significa "última", realmente es solamente una etiqueta.

No siempre representa la versión más nueva disponible.

En imágenes oficiales como:

- MySQL
- MongoDB
- PostgreSQL
- MariaDB

normalmente apunta a la versión recomendada por sus mantenedores.

Sin embargo, en imágenes creadas por usuarios o terceros, `latest` puede representar cualquier versión.

---

# Validación mediante firmas

Cada imagen Docker posee una firma única que permite identificarla.

Cuando ejecutamos nuevamente:

```bash
docker pull hello-world
```

Docker verifica si la imagen local coincide con la almacenada en el repositorio.

Si la firma coincide:

- No vuelve a descargar la imagen.
- Utiliza la versión existente.
- Ahorra tiempo y ancho de banda.

Ejemplo:

```text
Image is up to date for hello-world:latest
```

Docker solamente verificó que la imagen ya estaba actualizada.

---

# Ejecutar una imagen Docker

Para ejecutar una imagen utilizamos:

```bash
docker container run <imagen>
```

Ejemplo:

```bash
docker container run hello-world
```

Durante este proceso Docker:

1. Utiliza la imagen descargada.
2. Crea un contenedor.
3. Ejecuta el proceso definido.
4. Finaliza el contenedor cuando termina la ejecución.

---

# ¿Qué es un contenedor?

Un contenedor es una instancia de una imagen Docker ejecutándose dentro de un ambiente aislado.

La diferencia principal es:

- Una imagen es una plantilla.
- Un contenedor es la imagen ejecutándose.

Ejemplo:

```
Imagen hello-world
        |
        ↓
Creación del contenedor
        |
        ↓
Ejecución del proceso
        |
        ↓
Contenedor finalizado
```

El aislamiento permite que cada contenedor tenga sus propios procesos y recursos sin afectar otros contenedores del sistema.

---

# Docker Engine

Docker Engine es el servicio encargado de administrar Docker.

Se encarga de:

- Crear contenedores.
- Ejecutar contenedores.
- Administrar imágenes.
- Gestionar recursos.
- Controlar el ciclo de vida de los contenedores.

Cuando ejecutamos:

```bash
docker container run hello-world
```

realmente estamos solicitando a Docker Engine que cree y ejecute un contenedor utilizando la imagen indicada.

---

# Docker Desktop

Docker Desktop permite administrar Docker mediante una interfaz gráfica.

Dentro de Docker Desktop podemos visualizar:

- Contenedores.
- Imágenes.
- Volúmenes.
- Recursos utilizados.

Después de ejecutar:

```bash
docker container run hello-world
```

podremos observar un contenedor creado.

Ejemplo:

```
Container:
hello-world

Status:
Exited
```

---

# Estado Exited

Cuando un contenedor aparece con estado:

```
Exited
```

significa que:

- El contenedor fue creado correctamente.
- El proceso terminó su ejecución.
- Actualmente no está activo.

En el caso de `hello-world`, el contenedor solamente imprime un mensaje y finaliza.

---

# Creación de múltiples contenedores

Cada vez que ejecutamos:

```bash
docker container run hello-world
```

Docker crea un nuevo contenedor.

Ejemplo:

```
hello-world-container-1
hello-world-container-2
hello-world-container-3
```

Todos utilizan la misma imagen, pero cada contenedor es una instancia independiente.

---

# Docker Hub

Docker Hub es el repositorio público donde se almacenan imágenes Docker.

Podemos encontrar imágenes para:

- Bases de datos.
- Servidores web.
- Lenguajes de programación.
- Herramientas DevOps.
- Aplicaciones completas.

Ejemplos:

```
mysql
postgres
mongo
nginx
node
java
```

Cuando ejecutamos:

```bash
docker pull hello-world
```

sin indicar un repositorio, Docker busca automáticamente la imagen en Docker Hub.

---

# Imágenes oficiales

Docker recomienda utilizar imágenes oficiales porque normalmente:

- Siguen buenas prácticas.
- Son mantenidas por sus creadores.
- Tienen mayor confiabilidad.
- Reciben actualizaciones constantes.

Ejemplo:

```bash
docker pull nginx
```

Obtiene la imagen oficial de Nginx desde Docker Hub.

---

# Administrar imágenes y contenedores

## Ver imágenes disponibles

```bash
docker images
```

Ejemplo:

```
REPOSITORY      SIZE

hello-world     9.9MB
```

Las imágenes almacenadas ocupan espacio en nuestro equipo.

---

## Ver contenedores activos

```bash
docker ps
```

---

## Ver todos los contenedores

```bash
docker ps -a
```

Ejemplo:

```
CONTAINER ID    IMAGE          STATUS

abc123          hello-world    Exited
```

---

# Flujo completo de Docker

El proceso aprendido en esta práctica es:

```
Docker Hub
    |
    ↓
docker pull
    |
    ↓
Imagen almacenada localmente
    |
    ↓
docker container run
    |
    ↓
Contenedor creado
    |
    ↓
Proceso ejecutándose
    |
    ↓
Contenedor finalizado
```

---

# Comandos utilizados

Descargar una imagen:

```bash
docker pull hello-world
```

Ejecutar un contenedor:

```bash
docker container run hello-world
```

Listar imágenes:

```bash
docker images
```

Listar contenedores activos:

```bash
docker ps
```

Listar todos los contenedores:

```bash
docker ps -a
```

---

# Conclusión

En esta práctica aprendimos los conceptos fundamentales de Docker:

- Una **imagen** contiene todo lo necesario para ejecutar una aplicación.
- Un **contenedor** es una instancia de esa imagen ejecutándose.
- `docker pull` permite descargar imágenes desde Docker Hub.
- Docker utiliza firmas para verificar imágenes existentes.
- Los contenedores permiten ejecutar aplicaciones en ambientes aislados.

Estos conceptos son la base para trabajar posteriormente con aplicaciones reales utilizando Docker.