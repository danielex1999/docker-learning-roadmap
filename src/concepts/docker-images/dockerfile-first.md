# Creación de imágenes Docker con Node.js

## Introducción

Docker permite empaquetar una aplicación junto con todas sus dependencias dentro de una imagen, facilitando su despliegue y ejecución en cualquier servidor sin preocuparse por configuraciones externas.

Por ejemplo, podemos tener una aplicación Node.js que:

- Consume información desde una API.
- Lee o sincroniza datos desde una base de datos.
- Inserta información en otra base de datos.
- Ejecuta procesos automáticos mediante tareas programadas.

En un entorno tradicional necesitaríamos instalar:

- Node.js.
- Dependencias del proyecto.
- Librerías adicionales.
- Configuraciones del sistema operativo.

Con Docker podemos crear una imagen que contenga todo lo necesario para ejecutar nuestra aplicación.

---

# ¿Por qué crear una imagen Docker?

Una imagen Docker permite:

- Mantener versiones de una aplicación.
- Actualizar fácilmente procesos.
- Ejecutar la aplicación en diferentes servidores.
- Evitar problemas de dependencias.
- Garantizar que el ambiente sea igual en desarrollo y producción.

Ejemplo:

```bash
docker run nombre-imagen
```

Con este simple comando podemos iniciar nuestra aplicación sin instalar manualmente Node.js ni sus dependencias.

---

# Dependencias de la aplicación

Una aplicación no depende únicamente del código fuente.

También necesita:

## Lenguaje de programación

Ejemplo:

```
Node.js
```

Si el servidor no tiene Node instalado:

```bash
node app.js
```

fallará porque el comando no existe.

---

## Librerías del proyecto

Ejemplo:

```
package.json
```

Contiene las dependencias necesarias:

```json
{
  "dependencies": {
    "node-cron": "^4.0.0"
  }
}
```

Docker permitirá instalar estas dependencias automáticamente.

---

## Sistema operativo

Toda aplicación necesita ejecutarse sobre un sistema operativo.

Docker permite incluir una imagen base como:

- Linux.
- Alpine Linux.
- Ubuntu.

Ejemplo:

```
Node + Alpine Linux
```

Esto significa:

- Sistema Linux ligero.
- Node.js instalado.
- Ambiente preparado para producción.

---

# Dockerfile

Todo comienza con un archivo llamado:

```
Dockerfile
```

Este archivo contiene instrucciones que Docker utiliza para construir una imagen.

Cada instrucción genera una capa (*layer*).

Ejemplo:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY app.js package.json .
```

---

# Capas de Docker (Layers)

Cuando Docker descarga una imagen podemos observar varias capas.

Ejemplo:

```
Layer 1 -> Sistema operativo
Layer 2 -> Node.js
Layer 3 -> Dependencias
Layer 4 -> Código de la aplicación
```

Las capas permiten:

- Reutilización.
- Mayor velocidad.
- Uso de caché.

Si una capa no cambia, Docker no necesita volver a construirla.

---

# Imagen base

La primera instrucción normalmente es:

```dockerfile
FROM
```

Indica la imagen inicial sobre la cual construiremos nuestra aplicación.

Ejemplo:

```dockerfile
FROM node:19.2-alpine
```

Significa:

- Utilizar Node.js versión 19.2.
- Usar Alpine Linux.
- Tener Node instalado previamente.

---

# ¿Qué es Alpine?

Alpine Linux es una distribución ligera de Linux.

Características:

- Menor tamaño.
- Más rápida de descargar.
- Ideal para contenedores.

Ejemplo:

```
node:19.2-alpine
```

Incluye:

```
Linux Alpine
+
Node.js
```

---

# Working Directory

Después de definir la imagen base, configuramos el directorio de trabajo.

Comando:

```dockerfile
WORKDIR /app
```

Es equivalente a:

```bash
cd /app
```

A partir de este punto todos los comandos serán ejecutados dentro de:

```
/app
```

---

# Copiar archivos del proyecto

Actualmente la imagen tiene:

```
Linux
+
Node.js
```

Pero todavía no tiene nuestra aplicación.

Necesitamos copiar los archivos necesarios.

Ejemplo:

```dockerfile
COPY app.js package.json .
```

Esto copia:

```
app.js
package.json
```

dentro del contenedor.

Resultado:

```
/app
 ├── app.js
 └── package.json
```

---

# Sintaxis del Dockerfile

Las instrucciones normalmente se escriben en mayúsculas:

Ejemplo:

```dockerfile
FROM
WORKDIR
COPY
RUN
CMD
ENV
EXPOSE
```

Docker interpreta cada línea como una instrucción para construir la imagen.

---

# Flujo inicial de construcción

Hasta ahora nuestra imagen contiene:

```
Node.js Alpine Linux
        |
        |
        v
Cambiar directorio a /app
        |
        |
        v
Copiar archivos del proyecto
```

Dockerfile actual:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY app.js package.json .
```

---

# Próximos pasos

Para completar la imagen todavía faltan algunos comandos:

- Instalar dependencias.
- Definir el comando de ejecución.
- Construir la imagen.
- Crear un contenedor usando la imagen.

Ejemplo final esperado:

```bash
docker build -t mi-aplicacion .

docker run mi-aplicacion
```

---

# Resumen

Docker permite crear imágenes reproducibles con:

✅ Sistema operativo  
✅ Runtime (Node.js)  
✅ Dependencias  
✅ Código fuente  
✅ Configuración de ejecución  

El objetivo es que cualquier servidor pueda ejecutar nuestra aplicación sin configuraciones adicionales.