# Construcción de una imagen

Creamos nuestro primer `Dockerfile` utilizando una imagen base de Node.js con Alpine Linux.

Hasta este punto teníamos:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY app.js package.json .
```

Esto nos daba:

- Un sistema operativo Linux ligero.
- Node.js instalado.
- Nuestro directorio de trabajo.
- Los archivos principales de nuestra aplicación.

Sin embargo, todavía faltaban las dependencias necesarias para ejecutar nuestro proyecto.

---

# Instalación de dependencias con npm install

En aplicaciones Node.js las dependencias se encuentran definidas dentro del archivo:

```
package.json
```

Ejemplo:

```json
{
  "dependencies": {
    "node-cron": "^4.0.0"
  }
}
```

Para instalar estas dependencias normalmente ejecutamos:

```bash
npm install
```

Este comando:

- Lee el archivo `package.json`.
- Instala los paquetes necesarios.
- Crea la carpeta:

```
node_modules
```

- Genera el archivo:

```
package-lock.json
```

Docker también debe realizar este proceso durante la construcción de la imagen.

---

# RUN en Dockerfile

Para ejecutar comandos durante la construcción de una imagen utilizamos:

```dockerfile
RUN
```

Ejemplo:

```dockerfile
RUN npm install
```

Esto equivale a ejecutar en la terminal:

```bash
npm install
```

pero dentro del proceso de construcción de Docker.

---

# Dockerfile actualizado

Nuestro archivo ahora queda:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY app.js package.json .

RUN npm install
```

Proceso:

```
1. Crear Linux + Node
        |
        v
2. Crear carpeta /app
        |
        v
3. Copiar archivos del proyecto
        |
        v
4. Instalar dependencias
```

---

# CMD: comando de inicio

Después de instalar dependencias, nuestra aplicación ya está lista para ejecutarse.

Para indicar qué comando debe ejecutarse cuando iniciemos un contenedor usamos:

```dockerfile
CMD
```

Ejemplo:

```dockerfile
CMD ["node", "app.js"]
```

Esto significa:

Cuando alguien ejecute:

```bash
docker run nombre-imagen
```

Docker automáticamente ejecutará:

```bash
node app.js
```

---

# Diferencia entre RUN y CMD

## RUN

Se ejecuta durante la construcción de la imagen:

```dockerfile
RUN npm install
```

Ejemplo:

```bash
docker build .
```

---

## CMD

Se ejecuta cuando iniciamos el contenedor:

```dockerfile
CMD ["node","app.js"]
```

Ejemplo:

```bash
docker run cron-ticker
```

---

# Dockerfile completo

Nuestro Dockerfile final:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY app.js package.json .

RUN npm install

CMD ["node","app.js"]
```

---

# Construcción de la imagen

Para crear una imagen usamos:

```bash
docker build
```

Ejemplo:

```bash
docker build -t cron-ticker .
```

Explicación:

| Comando | Descripción |
|---|---|
| docker build | Construye una imagen |
| -t | Define un nombre/tag |
| cron-ticker | Nombre de la imagen |
| . | Ubicación del Dockerfile |

El punto significa:

```
Utiliza el Dockerfile del directorio actual
```

---

# Proceso de construcción

Durante el build Docker ejecuta cada instrucción:

```
[1/4] FROM node:19.2-alpine

[2/4] WORKDIR /app

[3/4] COPY archivos

[4/4] RUN npm install
```

El comando:

```dockerfile
CMD
```

no aparece como ejecución porque solamente será utilizado cuando el contenedor inicie.

---

# Caché de Docker

Docker utiliza capas (*layers*) para acelerar las construcciones.

Si ejecutamos nuevamente:

```bash
docker build -t cron-ticker .
```

Docker revisará:

- Cambios en archivos.
- Cambios en instrucciones.
- Cambios en el orden del Dockerfile.

Si una capa no cambió, Docker reutiliza la versión almacenada.

Ejemplo:

Primera ejecución:

```
FROM
WORKDIR
COPY
RUN npm install
```

Segunda ejecución:

```
FROM     ---> CACHE
WORKDIR  ---> CACHE
COPY     ---> CACHE
RUN      ---> CACHE
```

La construcción será mucho más rápida.

---

# Buenas prácticas con Layers

Las instrucciones que menos cambian deberían colocarse primero.

Ejemplo:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY app.js .
```

¿Por qué?

Porque si cambia solamente:

```
app.js
```

Docker no necesita volver a instalar todas las dependencias.

---

# Ver imágenes creadas

Para listar imágenes disponibles:

```bash
docker image ls
```

Ejemplo:

```
REPOSITORY       TAG
cron-ticker      latest
```

---

# Ejecutar nuestra imagen

Para iniciar un contenedor:

```bash
docker container run cron-ticker
```

Docker realizará:

```
Crear contenedor
        |
        v
Ejecutar CMD
        |
        v
node app.js
```

Nuestra aplicación comienza a ejecutarse automáticamente.

---

# Detener un contenedor

Si necesitamos detener la ejecución:

```
CTRL + C
```

También podemos administrar contenedores desde otra terminal.

Ver contenedores activos:

```bash
docker container ls
```

Ejemplo:

```
CONTAINER ID
e56xxxxx
```

Detener un contenedor:

```bash
docker container stop e56xxxxx
```

Eliminarlo:

```bash
docker container rm e56xxxxx
```

---

# Resultado final

Tenemos nuestra primera imagen Docker funcional:

```
Imagen Docker
│
├── Alpine Linux
│
├── Node.js
│
├── Dependencias npm
│
├── Código fuente
│
└── Comando de ejecución
        |
        v
   node app.js
```

Ahora podemos ejecutar nuestra aplicación en cualquier servidor que tenga Docker instalado sin preocuparnos por configuraciones adicionales.
