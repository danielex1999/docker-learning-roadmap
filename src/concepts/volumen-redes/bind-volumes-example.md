# Ejecutando una aplicación Node.js dentro de un contenedor

## 📖 Introducción

En esta clase se pone en práctica el uso de **Bind Mounts** ejecutando una aplicación **Node.js + NestJS** completamente dentro de un contenedor Docker.

La idea principal es:

- Mantener el código fuente en la computadora (Host).
- Ejecutar toda la aplicación dentro de un contenedor Linux.
- Instalar las dependencias desde el contenedor.
- Sincronizar automáticamente los archivos entre el Host y el contenedor.

De esta forma no es necesario instalar Node.js ni las dependencias localmente para desarrollar la aplicación.

---

# Objetivo

Conectar el proyecto local con un contenedor Docker utilizando un **Bind Mount** para que:

- El código permanezca en la computadora.
- El contenedor ejecute la aplicación.
- Las dependencias se instalen dentro del contenedor.
- Los cambios se reflejen automáticamente en ambos lados.

---

# Preparación del proyecto

1. Descargar el proyecto proporcionado por el instructor.
2. Descomprimir el archivo.
3. Crear una carpeta llamada:

```text
Docker
```

4. Copiar el proyecto dentro de dicha carpeta.
5. Abrir el proyecto con Visual Studio Code.

El proyecto es una aplicación desarrollada con **NestJS**, aunque no es necesario conocer esta tecnología para realizar el laboratorio.

---

# Eliminación del archivo Lock

Antes de iniciar el ejercicio se elimina el archivo:

```text
yarn.lock
```

Esto permite que Yarn genere nuevamente el archivo de dependencias dentro del contenedor.

---

# Objetivo del laboratorio

Se desea que la aplicación:

- No se ejecute directamente en Windows.
- No instale dependencias en el Host.
- Corra completamente dentro de un contenedor Linux.

---

# Imagen utilizada

Se utiliza una imagen oficial de Node.js desde Docker Hub.

Versión recomendada:

```text
node:16-alpine3.16
```

Esta imagen incluye:

- Node.js 16
- Alpine Linux (distribución ligera)
- Excelente rendimiento para desarrollo

---

# Comando utilizado

```bash
docker container run \
--name nest-app \
-w /app \
-p 1080:3000 \
-v "$(pwd):/app" \
node:16-alpine3.16 \
sh -c "yarn install && yarn start:dev"
```

---

# Explicación del comando

## Nombre del contenedor

```bash
--name nest-app
```

Asigna un nombre al contenedor.

---

## Working Directory

```bash
-w /app
```

Indica que todos los comandos posteriores se ejecutarán dentro de:

```text
/app
```

Es equivalente a ejecutar:

```bash
cd /app
```

dentro del contenedor.

---

## Publicación de puertos

```bash
-p 1080:3000
```

Conecta:

```text
Host
1080
```

con

```text
Contenedor
3000
```

La aplicación escucha internamente en el puerto 3000.

---

## Bind Mount

```bash
-v "$(pwd):/app"
```

Es la parte más importante del ejercicio.

Significa:

```text
Carpeta actual del Host
        │
        ▼
       /app
```

Todo el proyecto queda sincronizado con la carpeta `/app` dentro del contenedor.

---

## Imagen utilizada

```bash
node:16-alpine3.16
```

Docker descarga (si es necesario) la imagen oficial de Node.js basada en Alpine Linux.

---

## Comando ejecutado al iniciar

```bash
sh -c "yarn install && yarn start:dev"
```

Cuando el contenedor inicia:

1. Instala todas las dependencias:

```bash
yarn install
```

2. Luego ejecuta:

```bash
yarn start:dev
```

Este comando inicia NestJS en modo desarrollo con recarga automática.

---

# Instalación automática de dependencias

Durante la primera ejecución Docker realiza:

- Descarga de la imagen.
- Instalación de paquetes.
- Resolución de dependencias.
- Creación del directorio:

```text
node_modules
```

Lo interesante es que **node_modules aparece automáticamente en el proyecto local**, ya que ambos sistemas de archivos están sincronizados mediante el Bind Mount.

---

# Flujo del laboratorio

```text
Proyecto Local
        │
        ▼
Bind Mount
        │
        ▼
Contenedor Docker
        │
        ▼
yarn install
        │
        ▼
node_modules
        │
        ▼
yarn start:dev
        │
        ▼
NestJS ejecutándose
```

---

# Verificación

Una vez iniciado el contenedor se puede acceder desde el navegador:

```text
http://localhost:1080
```

La aplicación responde correctamente.

---

# GraphQL Playground

La aplicación también expone GraphQL en:

```text
http://localhost:1080/graphql
```

Desde allí es posible realizar consultas como:

```graphql
{
  hello
}
```

Respuesta:

```text
Hola Mundo
```

Esto confirma que la aplicación está funcionando correctamente dentro del contenedor.

---

# ¿Qué ocurrió realmente?

Aunque el código permanece en Windows:

```text
Host
```

la aplicación se está ejecutando completamente dentro de:

```text
Linux
```

Gracias al Bind Mount ambos sistemas comparten exactamente los mismos archivos.

---

# Detener el contenedor

Para finalizar el laboratorio se detiene el proceso con:

```text
Ctrl + C
```

Luego se elimina el contenedor:

```bash
docker container rm -f nest-app
```

---

# Comprobación

Después de eliminar el contenedor:

- `http://localhost:1080`
- `http://localhost:1080/graphql`

dejan de responder, confirmando que la aplicación dependía completamente del contenedor Docker.

---

# Conceptos aprendidos

En esta práctica se utilizaron:

- Imagen oficial de Node.js.
- Working Directory (`-w`).
- Publicación de puertos (`-p`).
- Bind Mount (`-v`).
- Instalación automática de dependencias.
- Ejecución de una aplicación NestJS dentro de Linux.
- Sincronización en tiempo real entre el Host y el contenedor.

