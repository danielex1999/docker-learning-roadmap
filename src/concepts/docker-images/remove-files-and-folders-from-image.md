# Docker: Optimización de imágenes con `.dockerignore` y limpieza de dependencias

## Objetivo

Optimizar la imagen Docker para:

- Reducir el tamaño de la imagen.
- Evitar copiar archivos innecesarios.
- Ejecutar pruebas automáticas durante el build.
- Eliminar dependencias de desarrollo antes de producción.
- Preparar la imagen para un entorno de producción.

---

# ¿Qué es un `.dockerignore`?

El archivo `.dockerignore` funciona de manera similar a un `.gitignore`.

Mientras que:

- **`.gitignore`** indica qué archivos Git no debe rastrear.
- **`.dockerignore`** indica qué archivos **Docker NO debe copiar** durante el proceso de construcción.

Cuando usamos:

```dockerfile
COPY . .
```

Docker copiará **todo el contenido del proyecto**, excepto los archivos indicados dentro del `.dockerignore`.

---

# Problema

Al copiar todo el proyecto también se copian:

- node_modules
- Dockerfile
- .git
- .gitignore
- archivos temporales
- otros archivos innecesarios

Esto provoca:

- imágenes más grandes
- builds más lentos
- duplicación de dependencias

---

# Crear el archivo `.dockerignore`

Ejemplo:

```text
node_modules
Dockerfile
.dockerignore
.git
.gitignore
```

Con esto Docker ignorará esos elementos al ejecutar:

```dockerfile
COPY . .
```

---

# ¿Por qué NO ignoramos la carpeta `test`?

Durante el build ejecutamos:

```dockerfile
RUN npm run test
```

Si excluimos la carpeta `test`:

```text
test
```

Docker no encontrará las pruebas y fallará con un error similar a:

```
No tests found
```

Por eso:

- Durante el build **sí necesitamos** los tests.
- Después del testing **ya no son necesarios**.

---

# Construcción de la nueva imagen

```bash
docker build -t usuario/cronticker:tigre .
```

Al construirse correctamente podremos verla con:

```bash
docker image ls
```

---

# Verificando el contenido de la imagen

Ejecutar la imagen:

```bash
docker run -d usuario/cronticker:tigre
```

Entrar al contenedor:

```bash
docker exec -it <container_id> /bin/sh
```

Listar archivos:

```bash
ls
```

También podemos ver archivos ocultos:

```bash
ls -la
```

Aquí podremos comprobar que:

- node_modules existe
- test existe
- Dockerfile ya no existe
- .git tampoco existe

---

# Eliminando archivos innecesarios después del testing

Una vez que:

- npm install terminó
- npm run test pasó correctamente

Ya no necesitamos:

- carpeta test
- dependencias de desarrollo

Podemos eliminarlas dentro del Dockerfile.

Ejemplo:

```dockerfile
RUN rm -rf test \
    && rm -rf node_modules \
    && npm install --production
```

---

## Explicación

### Eliminar pruebas

```bash
rm -rf test
```

Elimina completamente la carpeta de pruebas.

---

### Eliminar dependencias

```bash
rm -rf node_modules
```

Elimina todas las dependencias instaladas.

---

### Instalar solo producción

```bash
npm install --production
```

Instala únicamente las dependencias necesarias para producción.

No instala:

- Jest
- herramientas de testing
- paquetes de desarrollo

---

# Dockerfile completo

```dockerfile
FROM node:19-alpine3.16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run test

RUN rm -rf test \
    && rm -rf node_modules \
    && npm install --production

CMD ["npm", "start"]
```

---

# Resultado

La imagen:

✅ ejecuta pruebas

✅ elimina el testing

✅ elimina dependencias innecesarias

✅ instala solo producción

✅ queda preparada para producción

---

# Verificación

Ejecutar nuevamente:

```bash
docker run -d usuario/cronticker:pantera
```

Entrar:

```bash
docker exec -it <container_id> /bin/sh
```

Verificar:

```bash
ls
```

Ya no debería existir:

```
test/
```

---

# Revisar módulos instalados

Entrar a:

```bash
cd node_modules

ls
```

Ahora únicamente estarán las dependencias necesarias para producción.

---

# Flujo completo del Dockerfile

1. Seleccionar la imagen base.

```dockerfile
FROM node:19-alpine3.16
```

---

2. Definir directorio de trabajo.

```dockerfile
WORKDIR /app
```

---

3. Copiar archivos de dependencias.

```dockerfile
COPY package*.json ./
```

---

4. Instalar dependencias.

```dockerfile
RUN npm install
```

---

5. Copiar el proyecto.

```dockerfile
COPY . .
```

Respetando el contenido del `.dockerignore`.

---

6. Ejecutar pruebas.

```dockerfile
RUN npm run test
```

Si alguna prueba falla:

- el build se detiene
- la imagen no se genera

---

7. Limpiar archivos innecesarios.

```dockerfile
RUN rm -rf test \
    && rm -rf node_modules \
    && npm install --production
```

---

8. Definir el comando de inicio.

```dockerfile
CMD ["npm", "start"]
```

---

# Comandos utilizados

Construir imagen

```bash
docker build -t usuario/cronticker:tigre .
```

Listar imágenes

```bash
docker image ls
```

Ejecutar contenedor

```bash
docker run -d usuario/cronticker:pantera
```

Entrar al contenedor

```bash
docker exec -it <container_id> /bin/sh
```

Ver archivos

```bash
ls
```

Ver archivos ocultos

```bash
ls -la
```

Eliminar contenedor

```bash
docker container rm -f <container_id>
```

---

# Buenas prácticas

- Utilizar siempre un `.dockerignore`.
- No copiar `node_modules` del equipo local.
- Ejecutar pruebas durante el build.
- No incluir archivos de testing en producción.
- Instalar únicamente dependencias de producción.
- Mantener imágenes pequeñas.
- Eliminar archivos innecesarios antes de finalizar el build.