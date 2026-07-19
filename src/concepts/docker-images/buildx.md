# Docker Buildx

## Introducción

Docker Buildx es una herramienta que permite construir imágenes para múltiples arquitecturas utilizando un único comando. Esto es especialmente útil cuando nuestras aplicaciones serán ejecutadas en distintos entornos, como:

- Linux AMD64 (Intel/AMD)
- Linux ARM64 (Apple Silicon, Raspberry Pi, servidores ARM)
- Otras arquitecturas soportadas por Docker

Gracias a Buildx, una sola imagen publicada en Docker Hub podrá ejecutarse automáticamente en la arquitectura correcta.

---

# ¿Qué es un Builder?

Un **Builder** es el componente encargado de construir imágenes Docker.

Podemos tener varios builders configurados para distintos propósitos y cambiar entre ellos cuando sea necesario.

---

# Verificar los Builders disponibles

Listar los builders instalados:

```bash
docker buildx ls
```

Ejemplo:

```
NAME/NODE      DRIVER/ENDPOINT
default *      docker
desktop-linux  docker-container
```

El asterisco (`*`) indica cuál builder está siendo utilizado actualmente.

---

# Crear un nuevo Builder

Crear un builder personalizado:

```bash
docker buildx create \
--name mybuilder \
--driver docker-container \
--bootstrap
```

Este comando:

- Crea un nuevo builder.
- Descarga la imagen BuildKit necesaria.
- Crea un contenedor encargado de realizar las construcciones.

---

# Verificar el contenedor BuildKit

Podemos comprobar que BuildKit está ejecutándose:

```bash
docker container ls
```

Debería aparecer un contenedor similar a:

```
buildx_buildkit_mybuilder0
```

También podrá verse desde Docker Desktop.

---

# Ver nuevamente los Builders

```bash
docker buildx ls
```

Ahora aparecerá el nuevo builder:

```
default

mybuilder
```

Todavía el builder activo será el que tenga el asterisco.

---

# Seleccionar el Builder

Para comenzar a utilizar el nuevo builder:

```bash
docker buildx use mybuilder
```

Verificar nuevamente:

```bash
docker buildx ls
```

Ahora el asterisco deberá aparecer sobre **mybuilder**.

---

# Inspeccionar el Builder

Para conocer las plataformas soportadas:

```bash
docker buildx inspect
```

Se mostrará información como:

- linux/amd64
- linux/arm64
- linux/arm/v7
- linux/386
- entre muchas otras.

---

# Variables automáticas de Buildx

Buildx proporciona variables internas que pueden utilizarse dentro del Dockerfile.

Por ejemplo:

```dockerfile
FROM --platform=$BUILDPLATFORM node:22-alpine
```

También existen:

- `$BUILDPLATFORM`
- `$TARGETPLATFORM`

Estas variables permiten construir imágenes dependiendo de la arquitectura objetivo sin modificar manualmente el Dockerfile.

---

# Construcción Multi-Arquitectura

Ejemplo de construcción para varias plataformas:

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t usuario/repositorio:tag \
--push .
```

Parámetros:

| Opción | Descripción |
|---------|-------------|
| `buildx build` | Utiliza Buildx para construir imágenes |
| `--platform` | Arquitecturas objetivo |
| `-t` | Nombre y tag de la imagen |
| `--push` | Publica la imagen directamente en Docker Hub |
| `.` | Directorio donde se encuentra el Dockerfile |

---

# Ejemplo práctico

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t danielex1999/cron-ticker:latest \
--push .
```

Este comando:

1. Construye dos imágenes.
2. Una para AMD64.
3. Otra para ARM64.
4. Las agrupa bajo el mismo tag.
5. Las publica automáticamente en Docker Hub.

---

# Construir para más arquitecturas

También es posible agregar más plataformas.

Ejemplo:

```bash
docker buildx build \
--platform linux/amd64,linux/arm64,linux/arm/v7 \
-t usuario/repositorio:latest \
--push .
```

---

# Uso del Caché

Durante construcciones posteriores Docker reutiliza las capas ya construidas.

Esto significa que:

- Las siguientes compilaciones son mucho más rápidas.
- Solo se reconstruyen las capas modificadas.

---

# Publicación en Docker Hub

Al finalizar correctamente el proceso, Docker Hub mostrará que el tag soporta múltiples arquitecturas.

Por ejemplo:

```
latest

linux/amd64
linux/arm64
```

Cuando un usuario ejecute:

```bash
docker pull usuario/repositorio:latest
```

Docker descargará automáticamente la imagen correspondiente a la arquitectura del equipo.

No es necesario indicar manualmente qué versión utilizar.

---

# Crear otro Tag

Si se desea publicar otro tag apuntando a la misma imagen:

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t usuario/repositorio:polar \
--push .
```

Docker reutilizará las capas existentes, haciendo que el proceso sea mucho más rápido.

---

# Ventajas de Docker Buildx

- Construcción para múltiples arquitecturas.
- Publicación de una sola imagen compatible con varios procesadores.
- Compatible con servidores Linux, Apple Silicon y Raspberry Pi.
- Reutilización de caché para acelerar compilaciones.
- Integración directa con Docker Hub.
- Ideal para despliegues en producción.

---

# Flujo de trabajo recomendado

1. Crear un Builder.

```bash
docker buildx create --name mybuilder --driver docker-container --bootstrap
```

2. Seleccionarlo.

```bash
docker buildx use mybuilder
```

3. Verificar plataformas.

```bash
docker buildx inspect
```

4. Construir imagen.

```bash
docker buildx build \
--platform linux/amd64,linux/arm64 \
-t usuario/repositorio:latest \
--push .
```

5. Confirmar en Docker Hub que la imagen soporta múltiples arquitecturas.

---

# Buenas prácticas

- Utilizar siempre **tags específicos** en lugar de depender únicamente de `latest`.
- Publicar imágenes multi-arquitectura cuando la aplicación vaya a ejecutarse en distintos tipos de hardware.
- Aprovechar BuildKit para reutilizar el caché y acelerar las compilaciones.
- Verificar las plataformas soportadas antes de realizar la construcción.
- Mantener un único Dockerfile compatible con todas las arquitecturas utilizando las variables automáticas de Buildx.

---

# Conclusión

Docker Buildx simplifica la creación de imágenes compatibles con múltiples arquitecturas mediante un único proceso de construcción. Esto facilita el despliegue en distintos entornos (Intel, AMD, ARM, Apple Silicon, Raspberry Pi, entre otros) y permite publicar una única imagen en Docker Hub que Docker resolverá automáticamente según la arquitectura del equipo destino.