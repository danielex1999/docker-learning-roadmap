# Docker: Construcción de imágenes para diferentes arquitecturas

# Problema de arquitecturas

Actualmente existen diferentes arquitecturas:

- `linux/amd64`
- `linux/arm64`
- `linux/arm/v7`
- entre otras.

Ejemplo:

Una Mac con procesador M1/M2 utiliza:

```
linux/arm64
```

Pero muchos servidores en la nube utilizan:

```
linux/amd64
```

Si construimos una imagen localmente, Docker puede tomar automáticamente la arquitectura del equipo donde estamos trabajando.

---

# Especificar una plataforma manualmente

En Dockerfile podemos indicar una plataforma específica usando:

```dockerfile
FROM --platform=<arquitectura> imagen
```

Ejemplo:

```dockerfile
FROM --platform=linux/amd64 node:19-alpine3.16
```

Esto obliga a Docker a construir la imagen utilizando:

```
Linux AMD64
```

aunque nuestro equipo sea ARM.

---

# Ejemplo completo

Dockerfile:

```dockerfile
FROM --platform=linux/amd64 node:19-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run test

CMD ["npm", "start"]
```

---

# Construcción de la imagen

Crear una nueva versión:

```bash
docker build -t usuario/cronticker:amd64 .
```

Docker descargará la imagen base correspondiente:

```
linux/amd64
```

y reconstruirá los layers necesarios.

---

# ¿Por qué Docker reconstruye todo?

Docker utiliza capas (*layers*).

Ejemplo:

```
FROM node:alpine
        |
        v
WORKDIR /app
        |
        v
COPY package.json
        |
        v
RUN npm install
        |
        v
COPY código
        |
        v
RUN npm test
```

Si cambia la imagen base:

```dockerfile
FROM --platform=linux/amd64
```

Docker considera que esa capa cambió.

Por lo tanto:

- invalida el caché de las capas siguientes
- vuelve a construir los pasos posteriores

---

# Ver imágenes creadas

```bash
docker image ls
```

Ejemplo:

```
REPOSITORY              TAG       IMAGE ID

usuario/cronticker      latest    abc123
```

---

# Subir imagen a Docker Hub

```bash
docker push usuario/cronticker
```

Si no especificamos tag:

```bash
docker push usuario/cronticker
```

Docker utiliza:

```
latest
```

automáticamente.

---

# Problema al cambiar plataformas

Supongamos:

Primero construimos:

```
linux/amd64
```

Luego cambiamos a:

```
linux/arm64
```

y hacemos:

```bash
docker push usuario/cronticker
```

El nuevo push reemplazará la referencia `latest`.

No tendremos ambas arquitecturas correctamente asociadas.

---

# Solución

Crear imágenes para múltiples plataformas.

Ejemplo:

```
cronticker:latest

        |
        |-- linux/amd64
        |
        |-- linux/arm64
```

Esto permite que Docker seleccione automáticamente la imagen correcta según el equipo donde se ejecute.

---

# Multi Architecture Images

La idea es crear una imagen que soporte:

```
linux/amd64
linux/arm64
```

y Docker decidirá cuál descargar.

Ejemplo:

Un usuario con:

```
Mac M2
```

obtendrá:

```
linux/arm64
```

Mientras un servidor:

```
AWS EC2
```

obtendrá:

```
linux/amd64
```

---

# Arquitecturas disponibles

Podemos consultar arquitecturas soportadas con:

```bash
docker buildx ls
```

Ejemplo:

```
linux/amd64
linux/arm64
linux/arm/v7
```

---

# Crear imágenes multiplataforma

Se utiliza:

```bash
docker buildx build
```

Ejemplo:

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t usuario/cronticker:latest \
--push .
```

Esto:

1. Construye AMD64.
2. Construye ARM64.
3. Crea un manifiesto.
4. Lo sube a Docker Hub.

---

# Ventajas

✅ Compatible con diferentes equipos.

✅ Evita errores de arquitectura.

✅ Ideal para despliegues cloud.

✅ Una sola etiqueta soporta múltiples plataformas.