# ¿Qué es Docker Compose?

Hasta ahora hemos utilizado comandos como:

```bash
docker container run ...
```

para levantar cada contenedor manualmente.

Cuando una aplicación necesita varios contenedores (por ejemplo, una base de datos y un administrador como pgAdmin), escribir todos esos comandos una y otra vez resulta poco práctico.

**Docker Compose** permite describir toda la infraestructura de la aplicación en un único archivo YAML.

Con ello podremos iniciar todos los servicios utilizando un solo comando.

---

# Ventajas de Docker Compose

- Evita escribir comandos largos.
- Centraliza toda la configuración.
- Facilita compartir proyectos.
- Crea automáticamente redes entre servicios.
- Permite definir dependencias.
- Hace más sencillo levantar y detener aplicaciones completas.

---

# Crear el proyecto

Crear una carpeta para el proyecto.

```
Docker/
└── PostgreSQL-PgAdmin/
```

Abrir la carpeta con Visual Studio Code.

---

# Crear el archivo Compose

Crear el archivo:

```text
docker-compose.yml
```

También es válido:

```text
docker-compose.yaml
```

Ambas extensiones funcionan de la misma manera.

---

# Definir la versión

Todo archivo Compose comienza indicando la versión del formato.

```yaml
version: "3.8"
```

Esta versión indica las características disponibles para Docker Compose.

---

# Definir los servicios

Todos los contenedores se describen dentro de:

```yaml
services:
```

Cada servicio representa un contenedor.

Ejemplo:

```yaml
services:
```

---

# Servicio PostgreSQL

Crear un servicio para la base de datos.

```yaml
services:
  database:
```

El nombre `database` identifica al servicio dentro del proyecto.

---

# Nombre del contenedor

Se recomienda asignar un nombre fijo al contenedor.

```yaml
container_name: postgres-db
```

De esta forma el contenedor siempre tendrá el mismo nombre.

---

# Imagen

Especificar la imagen que utilizará el servicio.

```yaml
image: postgres:15.1
```

Siempre es recomendable utilizar una versión específica en lugar de `latest`.

---

# Configurar el volumen

Asociar el volumen persistente con PostgreSQL.

```yaml
volumes:
  - postgres-db:/var/lib/postgresql/data
```

Esto garantiza que la información de la base de datos permanezca incluso si el contenedor es eliminado.

---

# Variables de entorno

Las configuraciones necesarias para PostgreSQL se definen mediante variables de entorno.

```yaml
environment:
  POSTGRES_PASSWORD: 123456
  POSTGRES_DB: postgres-db
  POSTGRES_USER: postgres
```

---

# Servicio pgAdmin

Agregar un segundo servicio.

```yaml
pgadmin:
```

---

# Dependencias

pgAdmin necesita que PostgreSQL esté disponible antes de iniciar.

Se define mediante:

```yaml
depends_on:
  - database
```

> **Nota:** `depends_on` utiliza el nombre del **servicio**, no el nombre del contenedor.

---

# Imagen de pgAdmin

```yaml
image: dpage/pgadmin4:7.8
```

---

# Publicación de puertos

Exponer el puerto del contenedor.

```yaml
ports:
  - "8080:80"
```

Donde:

- **8080** → puerto del host.
- **80** → puerto interno del contenedor.

---

# Variables de entorno de pgAdmin

```yaml
environment:
  PGADMIN_DEFAULT_EMAIL: admin@admin.com
  PGADMIN_DEFAULT_PASSWORD: admin123
```

Estas credenciales se utilizarán para iniciar sesión en pgAdmin.

---

# Estructura parcial del archivo

```yaml
version: "3.8"

services:

  database:
    container_name: postgres-db
    image: postgres:15.1

    volumes:
      - postgres-db:/var/lib/postgresql/data

    environment:
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: postgres-db
      POSTGRES_USER: postgres

  pgadmin:
    depends_on:
      - database

    image: dpage/pgadmin4:7.8

    ports:
      - "8080:80"

    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin123
```

> **Importante:** En esta etapa aún falta definir el volumen `postgres-db`, lo cual se realizará en la siguiente práctica.

---

# Conceptos aprendidos

| Concepto | Descripción |
|----------|-------------|
| `version` | Versión del formato Docker Compose. |
| `services` | Define todos los contenedores del proyecto. |
| `container_name` | Nombre del contenedor. |
| `image` | Imagen que utilizará el servicio. |
| `volumes` | Persistencia de datos. |
| `environment` | Variables de entorno del contenedor. |
| `ports` | Publicación de puertos. |
| `depends_on` | Define dependencias entre servicios. |

---

# Flujo de la aplicación

```text
docker-compose.yml
        │
        ▼
+-------------------------+
|      Docker Compose     |
+-------------------------+
        │
        ├───────────────► PostgreSQL
        │
        └───────────────► pgAdmin
                 │
                 ▼
          Se conecta a PostgreSQL
```

---

# Conclusiones

- Docker Compose permite administrar múltiples contenedores desde un solo archivo.
- Cada contenedor se representa mediante un **servicio**.
- Es posible definir imágenes, variables de entorno, puertos, volúmenes y dependencias.
- `depends_on` facilita controlar el orden de inicio de los servicios.