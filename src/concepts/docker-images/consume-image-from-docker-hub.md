# Ejecutar imágenes Docker desde Docker Hub y arquitecturas

Hasta este punto ya tenemos nuestra imagen:

```
cron-ticker
```

publicada en Docker Hub con diferentes tags:

```
latest
castor
buffalo
1.0.0
```

Ahora vamos a probar algo importante:

> Ejecutar una imagen que no existe localmente y que Docker tenga que descargar desde un registro remoto.

---

# Limpiar imágenes locales

Si ejecutamos:

```bash
docker image ls
```

veremos todas nuestras imágenes locales.

Ejemplo:

```
REPOSITORY              TAG

cron-ticker             latest

cron-ticker             castor
```

Si intentamos ejecutar:

```bash
docker run cron-ticker:castor
```

Docker utilizará la imagen local.

Para probar Docker Hub debemos eliminar la imagen local.

---

# Eliminar imágenes no utilizadas

Docker tiene imágenes temporales o sin referencia:

Ejemplo:

```
<none>      <none>
<none>      <none>
```

Estas son conocidas como imágenes huérfanas.

Para eliminarlas:

```bash
docker image prune
```

Docker preguntará:

```
Are you sure?
```

Confirmamos:

```
y
```

---

# Eliminar todas las imágenes

Si queremos borrar todas las imágenes locales:

```bash
docker image prune -a
```

Esto eliminará:

- Imágenes sin uso.
- Imágenes con tags.
- Capas locales.

Después:

```bash
docker image ls
```

Resultado:

```
No images found
```

---

# Ejecutar una imagen desde Docker Hub

Ahora que no tenemos la imagen local, ejecutamos:

```bash
docker container run usuario/cron-ticker:castor
```

Docker realiza:

```
Buscar imagen local
        |
        v
No existe
        |
        v
Buscar en Docker Hub
        |
        v
Descargar layers
        |
        v
Crear contenedor
        |
        v
Ejecutar aplicación
```

---

# Descarga de layers

Durante la descarga veremos algo similar:

```
Pulling from usuario/cron-ticker

Layer 1 downloading
Layer 2 downloading
Layer 3 downloading

Status: Download complete
```

Docker descarga solamente las capas necesarias.

---

# Resultado

Aunque no teníamos la imagen local:

```
cron-ticker:castor
```

Docker pudo:

1. Encontrarla en Docker Hub.
2. Descargarla.
3. Crear un contenedor.
4. Ejecutar nuestra aplicación.

Ejemplo:

```
Tick
Tick
Tick
Tick
```

La aplicación funciona exactamente igual.

---

# Arquitecturas de CPU

Un punto importante en Docker es la arquitectura del procesador.

Existen diferentes arquitecturas:

```
AMD64

ARM64

ARMv7

Linux 386
```

Ejemplo:

Computadoras Apple Silicon:

```
M1
M2
M3

Arquitectura:
ARM64
```

Servidores tradicionales:

```
Intel / AMD

Arquitectura:
AMD64
```

---

# Problema de arquitectura

Una imagen creada en una arquitectura puede no funcionar correctamente en otra.

Ejemplo:

Crear imagen en:

```
ARM64
```

Intentar ejecutar en:

```
AMD64
```

Puede provocar:

- Error de compatibilidad.
- Uso de emulación.
- Problemas de rendimiento.

---

# Imágenes multi-arquitectura

Las imágenes oficiales normalmente soportan varias arquitecturas.

Ejemplo:

```
postgres

├── linux/amd64
├── linux/arm64
└── linux/386
```

Cuando descargamos:

```bash
docker pull postgres
```

Docker selecciona automáticamente la versión correcta.

---

# Construcción según arquitectura

Docker permite crear imágenes específicas.

Ejemplo:

```bash
docker buildx build
```

Permite construir imágenes para diferentes plataformas:

```bash
linux/amd64

linux/arm64
```

---

# Ejemplo conceptual

Una misma aplicación:

```
cron-ticker
```

Puede tener:

```
cron-ticker:1.0.0-amd64

cron-ticker:1.0.0-arm64
```

Cada una preparada para una arquitectura distinta.

---

# La importancia del Dockerfile

Independientemente del lenguaje:

Node.js:

```dockerfile
RUN npm install
```

Python:

```dockerfile
RUN pip install -r requirements.txt
```

Java:

```dockerfile
RUN mvn install
```

La estructura general es:

```
FROM imagen base

WORKDIR directorio

COPY archivos

RUN instalar dependencias

CMD ejecutar aplicación
```

---

# Flujo completo aprendido

Hasta ahora nuestro flujo es:

```
Código fuente
      |
      v
Dockerfile
      |
      v
docker build
      |
      v
Imagen Docker
      |
      v
Docker Hub
      |
      v
docker pull
      |
      v
Contenedor ejecutándose
```