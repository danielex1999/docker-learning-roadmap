# Reconstrucción de imágenes Docker y manejo de versiones

En esta etapa ya tenemos una imagen Docker funcional, pero en la vida real constantemente tendremos que hacer cambios.

Algunos motivos para reconstruir una imagen son:

- Correcciones en el código.
- Nuevas funcionalidades.
- Cambios en dependencias.
- Modificaciones en el `Dockerfile`.
- Nuevas versiones de la aplicación.

Docker permite reconstruir imágenes aprovechando las capas existentes mediante el sistema de caché.

---

# Reconstrucción de una imagen

Nuestro comando inicial era:

```bash
docker build -t cron-ticker .
```

Si hacemos nuevamente la construcción, Docker analiza cada instrucción del `Dockerfile`.

Ejemplo:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY app.js package.json .

RUN npm install

CMD ["node","app.js"]
```

Docker revisa cada capa:

```
FROM
 |
WORKDIR
 |
COPY
 |
RUN
 |
CMD
```

Si una capa no cambió, Docker la reutiliza.

---

# Uso de caché en Docker

Ejemplo:

```
Step 1/4 FROM node:19.2-alpine
        ---> Using cache

Step 2/4 WORKDIR /app
        ---> Using cache

Step 3/4 COPY
        ---> Ejecutando nuevamente

Step 4/4 RUN npm install
        ---> Ejecutando nuevamente
```

Las capas anteriores se mantienen porque no tuvieron cambios.

Esto hace que las reconstrucciones sean mucho más rápidas.

---

# Importancia del orden de instrucciones

El orden del Dockerfile afecta el rendimiento.

Ejemplo poco optimizado:

```dockerfile
COPY app.js package.json .

RUN npm install
```

Si cambia `app.js`, Docker puede invalidar las capas siguientes.

Una mejor estructura sería:

```dockerfile
COPY package.json .

RUN npm install

COPY app.js .
```

¿Por qué?

Porque:

- `package.json` cambia menos frecuentemente.
- Las dependencias no necesitan instalarse nuevamente.
- Solo cambia la capa del código.

---

# Ejemplo con múltiples capas

Docker genera capas:

```
Layer 1:
Node + Alpine

Layer 2:
Working Directory

Layer 3:
Dependencias

Layer 4:
Código fuente
```

Si modificamos solamente:

```
app.js
```

Docker reutiliza:

```
Layer 1 ✔
Layer 2 ✔
Layer 3 ✔
Layer 4 🔄
```

Solo reconstruye lo necesario.

---

# Problema de imágenes sin identificar

Si ejecutamos:

```bash
docker image ls
```

podemos observar imágenes antiguas:

```
REPOSITORY      TAG       IMAGE ID

cron-ticker     latest    abc123
<none>          <none>    def456
<none>          <none>    ghi789
```

Estas imágenes:

- No tienen nombre.
- No tienen versión.
- Son versiones anteriores.
- Ocupan espacio.

Docker las mantiene porque todavía pueden ser utilizadas.

---

# Uso de Tags

Los tags permiten identificar versiones de una imagen.

Ejemplo:

```
cron-ticker:latest
```

o:

```
cron-ticker:1.0.0
```

El formato es:

```
nombre-imagen:version
```

Ejemplo:

```bash
docker build -t cron-ticker:1.0.0 .
```

Resultado:

```
cron-ticker
 |
 └── 1.0.0
```

---

# Tag latest

Si no especificamos una versión:

```bash
docker build -t cron-ticker .
```

Docker asigna automáticamente:

```
latest
```

Entonces:

```
cron-ticker
```

es equivalente a:

```
cron-ticker:latest
```

---

# Crear un nuevo tag sin reconstruir

No siempre necesitamos volver a construir una imagen.

Podemos agregar otro nombre usando:

```bash
docker image tag
```

Sintaxis:

```bash
docker image tag imagen_origen imagen_destino
```

Ejemplo:

```bash
docker image tag cron-ticker:1.0.0 cron-ticker:buffalo
```

Ahora tenemos:

```
cron-ticker:1.0.0

cron-ticker:buffalo
```

Ambas apuntan a la misma imagen.

---

# Una imagen puede tener múltiples tags

Ejemplo:

```
IMAGE ID: abc123

Tags:

cron-ticker:latest

cron-ticker:1.0.0

cron-ticker:buffalo

cron-ticker:castor
```

Todos representan la misma imagen.

Los tags funcionan como nombres o referencias.

---

# Crear nuevas versiones

Supongamos que modificamos nuestra aplicación:

Antes:

```
Ejecutando cada 5 segundos
```

Después:

```
Ejecutando cada múltiplo de 5 segundos
```

Construimos nuevamente:

```bash
docker build -t cron-ticker .
```

Docker genera una nueva imagen:

```
cron-ticker:latest
```

con un nuevo `IMAGE ID`.

Las versiones anteriores siguen existiendo:

```
cron-ticker:1.0.0
cron-ticker:buffalo
cron-ticker:castor
```

---

# Versionamiento recomendado

Una buena práctica es usar versiones:

```
MAJOR.MINOR.PATCH
```

Ejemplo:

```
1.0.0
```

Donde:

### Major

Cambios grandes incompatibles.

Ejemplo:

```
2.0.0
```

---

### Minor

Nueva funcionalidad compatible.

Ejemplo:

```
1.1.0
```

---

### Patch

Correcciones pequeñas.

Ejemplo:

```
1.0.1
```

---

# Ejecutar una versión específica

Podemos elegir qué versión ejecutar:

Última versión:

```bash
docker run cron-ticker:latest
```

Versión específica:

```bash
docker run cron-ticker:1.0.0
```

Otra versión:

```bash
docker run cron-ticker:castor
```

Cada una ejecutará el código correspondiente a ese tag.

---

# Administrar contenedores

Ver contenedores activos:

```bash
docker container ls
```

Detener un contenedor:

```bash
docker container stop ID
```

Eliminarlo:

```bash
docker container rm ID
```

Forzar eliminación:

```bash
docker container rm -f ID
```

---

# Flujo completo de trabajo

El flujo real sería:

```
Modificar código
        |
        v
Construir nueva imagen

docker build -t cron-ticker:2.0.0 .

        |
        v

Ejecutar nueva versión

docker run cron-ticker:2.0.0
```