# Docker Compose para Desarrollo con Multi-Stage Build

## Introducción

En esta clase comenzamos a preparar el entorno para ejecutar una aplicación utilizando **Docker Compose** junto con un **Dockerfile Multi-Stage**, el cual permitirá separar el entorno de desarrollo del entorno de producción.

El objetivo es que Docker pueda construir automáticamente la imagen necesaria para ejecutar la aplicación, evitando depender de instalaciones locales de Node.js.

---

# Estructura del Dockerfile

Hasta este momento ya contamos con varias etapas dentro del Dockerfile:

- **deps** → Instala todas las dependencias del proyecto.
- **builder** → Ejecuta pruebas y genera la aplicación compilada.
- **prod-deps** → Instala únicamente las dependencias necesarias para producción.
- **runner** → Imagen final que ejecutará la aplicación.

Cada etapa tiene un propósito específico, permitiendo reducir considerablemente el tamaño de la imagen final.

---

# ¿Qué ocurre con Docker Compose?

Creamos un nuevo servicio llamado **app**.

```yaml
app:
```

Todavía no definimos una imagen ni un proceso de construcción.

Lo primero fue configurar el volumen.

```yaml
volumes:
  - ./:/app
```

Este volumen sincroniza:

- La carpeta del proyecto en nuestra computadora.
- La carpeta `/app` dentro del contenedor.

Gracias a esto, cualquier cambio realizado en el código fuente se refleja inmediatamente dentro del contenedor.

---

# Nombre del contenedor

Asignamos un nombre personalizado al contenedor.

```yaml
container_name: nest-app
```

Esto facilita su identificación al listar los contenedores.

---

# Exposición de puertos

La aplicación utiliza el puerto **3000**.

```yaml
ports:
  - "3000:3000"
```

Esto significa:

- Puerto **3000** de la computadora.
- Puerto **3000** del contenedor.

De esta manera podremos acceder a la aplicación desde:

```
http://localhost:3000
```

---

# Variables de entorno

Posteriormente agregamos la sección:

```yaml
environment:
```

Aquí definimos todas las variables necesarias para que la aplicación funcione.

Por ejemplo:

```yaml
PORT: 3000
MONGODB: mongodb://...
DB_NAME: pokemondb
JWT_SECRET: ...
```

Es importante entender que estas variables reemplazan al archivo `.env`.

Durante la construcción de la imagen **el archivo `.env` no se copia**, por lo que Docker Compose es el encargado de proporcionarlas al iniciar el contenedor.

---

# El problema con node_modules

Existe un detalle importante.

Al montar el volumen:

```yaml
./:/app
```

también se monta la carpeta:

```
node_modules
```

Si esas dependencias fueron instaladas en Windows, podrían no funcionar correctamente dentro de Linux, ya que contienen binarios específicos para cada sistema operativo.

Más adelante veremos cómo evitar este inconveniente utilizando volúmenes adicionales.

---

# Intentando levantar el proyecto

Al ejecutar:

```bash
docker compose up
```

Docker devuelve un error similar a:

```text
service "app" has neither an image nor a build context specified
```

---

# ¿Por qué aparece este error?

Docker Compose necesita saber cómo obtener la imagen.

Tiene dos opciones:

## Opción 1

Utilizar una imagen existente.

```yaml
image: node:19-alpine3.16
```

## Opción 2

Construir una imagen utilizando un Dockerfile.

```yaml
build:
  context: .
```

En este momento nuestro servicio no posee ninguna de las dos configuraciones, por eso Docker no sabe cómo iniciar el contenedor.