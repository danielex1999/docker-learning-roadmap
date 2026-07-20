# Docker Compose + Dockerfile Multi Stage - Entorno de Desarrollo


# Configuración de Build en Docker Compose

Para indicarle a Docker cómo construir la imagen utilizamos la propiedad `build`.

Ejemplo:

```yaml
services:
  app:
    build:
      context: .
```

La propiedad `context` indica la ubicación donde Docker buscará los archivos necesarios para construir la imagen.

El punto:

```yaml
context: .
```

significa:

```
Utilizar el directorio actual como contexto de construcción.
```

Normalmente la estructura del proyecto sería:

```
proyecto/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── src/
```

Docker buscará el archivo:

```
Dockerfile
```

dentro de ese contexto.

---

# Cambiar ubicación del Dockerfile

También podemos cambiar la ubicación del Dockerfile.

Ejemplo:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
```

Esto permite utilizar diferentes archivos:

```
Dockerfile.dev
Dockerfile.test
Dockerfile.prod
```

Sin embargo, otra alternativa es utilizar un único Dockerfile con diferentes etapas.

---

# Multi Stage Builds

Docker permite crear diferentes etapas dentro del mismo Dockerfile.

Ejemplo:

```dockerfile
FROM node:19-alpine AS dev

FROM node:19-alpine AS prod
```

Cada etapa representa una configuración diferente.

Podemos tener:

- Desarrollo.
- Testing.
- Staging.
- Producción.

Esto evita tener muchos Dockerfiles separados.

---

# Crear etapa de desarrollo

Nuestro Dockerfile originalmente estaba pensado para producción.

Si lo ejecutamos directamente, Docker realizaría procesos como:

- Instalación de dependencias.
- Construcción de la aplicación.
- Creación del bundle final.

Pero para desarrollo necesitamos algo diferente.

Queremos ejecutar:

```bash
npm run start:dev
```

Por eso creamos una nueva etapa.

Ejemplo:

```dockerfile
FROM node:19-alpine AS dev

WORKDIR /app

COPY package.json ./

RUN npm install

CMD ["npm", "run", "start:dev"]
```

---

# Explicación del Stage Dev

## Imagen base

```dockerfile
FROM node:19-alpine AS dev
```

Creamos una imagen basada en Node.js y le asignamos el nombre:

```
dev
```

---

## Working Directory

```dockerfile
WORKDIR /app
```

Indicamos que todos los comandos se ejecutarán dentro de:

```
/app
```

Este directorio será la ubicación principal de nuestra aplicación dentro del contenedor.

---

## Copiar package.json

```dockerfile
COPY package.json ./
```

Copiamos el archivo donde se encuentran las dependencias del proyecto.

---

## Instalar dependencias

```dockerfile
RUN npm install
```

Instala todas las dependencias necesarias:

```
node_modules
```

---

## Ejecutar aplicación

```dockerfile
CMD ["npm", "run", "start:dev"]
```

Cuando el contenedor inicie ejecutará:

```bash
npm run start:dev
```

---

# Seleccionar Stage desde Docker Compose

Ahora debemos indicar qué etapa utilizar.

En nuestro `docker-compose.yml`:

```yaml
services:
  app:
    build:
      context: .
      target: dev
```

La propiedad:

```yaml
target: dev
```

indica:

```
Utiliza la etapa dev del Dockerfile.
```

---

# Volúmenes y Node Modules

Al utilizar un volumen:

```yaml
volumes:
  - .:/app
```

Estamos sincronizando nuestro proyecto local con el contenedor.

Pero existe un problema.

La carpeta:

```
node_modules
```

puede ser sobrescrita por el volumen.

Por eso agregamos un volumen adicional:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

Esto crea un volumen independiente administrado por Docker.

La estructura queda:

```
Proyecto local
       |
       |
       v

     /app

       |
       |
       v

node_modules dentro del contenedor
```

---

# Construcción de la imagen

Primero detenemos los contenedores actuales:

```bash
docker compose down
```

Si también queremos eliminar volúmenes:

```bash
docker compose down --volumes
```

Esto deja limpio el ambiente.

---

## Construir nuevamente

Ejecutamos:

```bash
docker compose build
```

Docker comenzará la construcción utilizando la etapa indicada:

```
dev
```

Solamente ejecutará las instrucciones necesarias hasta llegar a ese punto.

---

# Ejecutar la aplicación

Levantamos los servicios:

```bash
docker compose up
```

Docker realizará:

1. Creación del contenedor.
2. Montaje de volúmenes.
3. Instalación de dependencias.
4. Ejecución del comando:

```bash
npm run start:dev
```

---

# Problema con conexión a Base de Datos

Al iniciar la aplicación apareció un error de conexión:

```
Connection refused localhost
```

El problema estaba en la variable:

```env
DATABASE_HOST=localhost
```

Dentro de Docker:

```
localhost
```

hace referencia al mismo contenedor.

No apunta a otro contenedor.

---

# Comunicación entre contenedores

Ejemplo:

```
+----------------+
|      app       |
|                |
| localhost ❌   |
+----------------+

        |

        |

+----------------+
|       db       |
|   postgres     |
+----------------+
```

Cada contenedor tiene su propio localhost.

Docker Compose crea una red interna donde los servicios pueden comunicarse usando el nombre del servicio.

Ejemplo:

```yaml
services:
  db:
    image: postgres
```

Entonces desde la aplicación:

```env
DATABASE_HOST=db
```

Docker resolverá automáticamente ese nombre.

---

# Ventajas de usar variables de entorno

Las variables permiten cambiar configuraciones dependiendo del ambiente.

Desarrollo:

```env
DATABASE_HOST=db
```

Producción:

```env
DATABASE_HOST=production-db
```

El código de la aplicación permanece igual.

---

# CMD en Dockerfile vs Command en Docker Compose

Podemos definir el comando directamente en el Dockerfile:

```dockerfile
CMD ["npm", "run", "start:dev"]
```

O desde Docker Compose:

```yaml
services:
  app:
    command: npm run start:dev
```

Ambas opciones funcionan.

---

# Verificación de la aplicación

Si todo funciona correctamente veremos:

```
Application running on port 3000
```

Podemos acceder desde:

```
http://localhost:3000
```

Ejemplo:

```
http://localhost:3000/api
```

Si responde correctamente:

- La imagen fue creada.
- El contenedor está activo.
- Node está ejecutándose.
- Docker Compose funciona correctamente.

---

# Limpieza y reconstrucción

Ver imágenes disponibles:

```bash
docker images
```

Detener servicios:

```bash
docker compose down
```

Reconstruir:

```bash
docker compose build
```

---

# Flujo final

```
docker-compose.yml

        |
        |

build:
  context: .
  target: dev

        |
        |

Dockerfile

        |
        |

FROM node:19-alpine AS dev

        |
        |

npm install

        |
        |

npm run start:dev

        |
        |

Aplicación ejecutándose
```