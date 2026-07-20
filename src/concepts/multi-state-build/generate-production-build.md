# Docker Compose - Configuración de Producción

## Introducción

En esta sección configuraremos Docker Compose para trabajar con un entorno de producción.

La idea principal es separar la configuración de desarrollo y producción, evitando cargar configuraciones innecesarias como volúmenes, módulos de desarrollo o archivos locales cuando generamos la imagen final.

---

# Detener contenedores existentes

Antes de iniciar cualquier proceso de construcción, es recomendable detener los contenedores actuales.

```bash
docker compose down
```

Si queremos eliminar completamente los volúmenes asociados:

```bash
docker compose down --volumes
```

Esto permite asegurarnos de que no existan datos persistidos o configuraciones antiguas que puedan afectar las pruebas.

---

# Variables de entorno para producción

En producción debemos cambiar la variable de entorno correspondiente.

Por ejemplo, si anteriormente utilizábamos:

```env
NODE_ENV=stage
```

debemos asegurarnos de utilizar la configuración adecuada para producción.

El valor puede mantenerse como `stage` dependiendo del flujo de trabajo:

- development
- testing
- staging
- production

Un entorno staging permite probar una configuración muy cercana a producción antes de realizar el despliegue definitivo.

---

# Configuración SSL

En algunos proyectos es necesario activar SSL para conectarse a bases de datos externas.

Ejemplo:

- Bases de datos en la nube pueden requerir SSL.
- Bases de datos ejecutadas dentro de Docker generalmente no lo necesitan.

Por lo tanto, para un ambiente local con PostgreSQL dentro de Docker podemos desactivar esta configuración.

La configuración debe adaptarse dependiendo del proveedor de base de datos utilizado.

---

# Docker Compose para producción

En Docker Compose no existe una condición directa para indicar:

> "Si estoy en producción, no cargues estos volúmenes".

Por esta razón existen diferentes estrategias.

Una alternativa es utilizar múltiples archivos:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up
```

El segundo archivo sobrescribe o complementa la configuración base.

Aunque funciona correctamente, puede resultar confuso cuando el proyecto crece.

---

# Archivo docker-compose.prod.yml

Una estrategia más clara es crear un archivo específico:

```
docker-compose.prod.yml
```

Este archivo contiene únicamente la configuración necesaria para producción.

Ejemplo:

```yaml
services:
  app:
    build:
      context: .
      target: prod

    image: usuario-docker/test-shop-backend

    environment:
      NODE_ENV: production

    ports:
      - "3000:3000"

  db:
    image: postgres:latest
```

---

# Diferencias con desarrollo

En producción eliminamos:

## Volúmenes de desarrollo

Ejemplo:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

Estos volúmenes son útiles durante desarrollo porque permiten:

- Hot reload.
- Actualización automática del código.
- Compartir archivos locales.

Pero en producción pueden generar problemas porque:

- Sobrescriben archivos dentro de la imagen.
- Pueden cargar módulos incorrectos.
- Pueden generar comportamientos inesperados.

---

# Construcción de imagen de producción

Para construir utilizando únicamente el archivo de producción:

```bash
docker compose -f docker-compose.prod.yml build
```

También podemos levantar los servicios:

```bash
docker compose -f docker-compose.prod.yml up
```

Docker utilizará las etapas definidas en nuestro Dockerfile:

1. Dependencias de producción.
2. Instalación de dependencias.
3. Builder.
4. Copia del proyecto compilado.
5. Creación de la imagen final.

---

# Multi Stage Build

El Dockerfile utiliza diferentes etapas:

```
prod-deps
    |
    v
dependencies
    |
    v
builder
    |
    v
runner
```

Cada etapa tiene una responsabilidad específica.

Esto permite:

- Imágenes más pequeñas.
- Menos archivos innecesarios.
- Mayor seguridad.
- Mejor rendimiento.

---

# Agregar nombre y tag a la imagen

Si ejecutamos:

```bash
docker image ls
```

podemos encontrar imágenes sin nombre:

```
<none>
```

Para evitar esto podemos definir un nombre:

```yaml
image:
  usuario-docker/test-shop-backend
```

Ejemplo:

```yaml
image: danielex1999/test-shop-backend
```

Ahora Docker generará una imagen identificable.

---

# Uso de tags

Las imágenes pueden manejar diferentes versiones.

Ejemplo:

```yaml
image: danielex1999/test-shop-backend:2.0.0
```

Otro ejemplo:

```yaml
image: danielex1999/test-shop-backend:2.5
```

Esto permite mantener versiones diferentes de la aplicación.

Podemos verificar:

```bash
docker image ls
```

Resultado:

```
test-shop-backend   2.5
test-shop-backend   2.0.0
```

---

# Construcción sin utilizar caché

Docker normalmente reutiliza capas existentes.

Para forzar una construcción completa:

```bash
docker compose build --no-cache
```

Esto obliga a Docker a crear nuevamente todas las capas.

Es útil cuando:

- Cambiamos dependencias.
- Existen problemas con capas antiguas.
- Queremos verificar una construcción limpia.

---

# Construcción de un servicio específico

Docker Compose permite construir solamente un servicio.

Ejemplo:

```bash
docker compose -f docker-compose.prod.yml build app
```

Esto solamente construirá:

```
app
```

No reconstruirá otros servicios como:

```
database
```

---

# ¿Por qué no construir la base de datos?

La base de datos utiliza una imagen oficial:

Ejemplo:

```yaml
db:
  image: postgres
```

No existe código personalizado dentro del contenedor.

Solamente configuramos:

- Usuario.
- Password.
- Variables de entorno.

Por esta razón no tiene sentido crear una imagen propia.

La buena práctica es que cada contenedor tenga una responsabilidad específica.

Ejemplo:

```
APP Container
    |
    |-- Código personalizado

DATABASE Container
    |
    |-- Imagen oficial PostgreSQL
```

---

# Publicar imagen en Docker Hub

Una vez creada la imagen podemos subirla:

```bash
docker push usuario-docker/test-shop-backend:2.5
```

Ejemplo:

```bash
docker push danielex1999/test-shop-backend:2.5
```

Esto permitirá utilizar la imagen desde cualquier servidor.

---

# Flujo recomendado para producción

Proceso completo:

## 1. Detener contenedores actuales

```bash
docker compose down --volumes
```

---

## 2. Construir imagen de producción

```bash
docker compose -f docker-compose.prod.yml build
```

---

## 3. Levantar aplicación

```bash
docker compose -f docker-compose.prod.yml up
```

---

## 4. Verificar imágenes creadas

```bash
docker image ls
```

---

## 5. Crear nueva versión

Ejemplo:

```yaml
image: usuario/test-shop-backend:2.5
```

---

## 6. Publicar imagen

```bash
docker push usuario/test-shop-backend:2.5
```