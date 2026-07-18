# Docker Compose - Integración de Mongo Express

# ¿Qué es Mongo Express?

Mongo Express es una aplicación desarrollada en **Node.js** que proporciona una interfaz web para administrar bases de datos MongoDB.

Permite:

- Crear bases de datos.
- Crear colecciones.
- Visualizar documentos.
- Editar documentos.
- Eliminar colecciones.
- Consultar información almacenada.

No reemplaza herramientas más completas, pero es perfecta para desarrollo.

---

# ¿Por qué utilizar una versión específica?

Nunca es recomendable utilizar:

```yaml
image: mongo-express
```

porque Docker descargará automáticamente la versión **latest**, la cual puede introducir cambios incompatibles.

Es preferible utilizar un **tag específico**, por ejemplo:

```yaml
image: mongo-express:1.0.0-alpha.4
```

De esta forma el proyecto siempre utilizará exactamente la misma versión.

---

# Agregando un nuevo servicio

Dentro de `docker-compose.yml` se crea un segundo servicio.

```yaml
services:

  db:
    ...

  mongo-express:
```

---

# Dependencia entre contenedores

Mongo Express depende de MongoDB.

Docker Compose permite indicarlo mediante:

```yaml
depends_on:
  - db
```

**Importante**

`depends_on` utiliza el **nombre del servicio**, no el nombre del contenedor.

Correcto:

```yaml
depends_on:
  - db
```

Incorrecto:

```yaml
depends_on:
  - pokemon-db
```

---

# Imagen utilizada

```yaml
image: mongo-express:1.0.0-alpha.4
```

---

# Variables de entorno

Mongo Express necesita conocer:

- usuario administrador
- contraseña
- servidor MongoDB

Se configuran mediante variables de entorno.

```yaml
environment:
  ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_USERNAME}
  ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_PASSWORD}
  ME_CONFIG_MONGODB_SERVER: ${MONGO_DB_NAME}
```

---

# ¿Qué representa ME_CONFIG_MONGODB_SERVER?

Esta variable indica el servidor MongoDB al que debe conectarse Mongo Express.

No se utiliza:

```text
localhost
```

porque ambos contenedores viven dentro de una red Docker.

En Docker Compose cada servicio recibe automáticamente un nombre DNS.

Por ejemplo:

```yaml
container_name: pokemon-db
```

Entonces el servidor será:

```text
pokemon-db
```

Docker resolverá automáticamente ese nombre hacia la IP del contenedor.

No es necesario conocer la IP.

---

# DNS interno de Docker

Cuando Docker Compose crea una red:

```
docker-compose up
```

también crea un DNS interno.

Por ejemplo:

```
Mongo Express
        │
        │
        ▼
pokemon-db
        │
        ▼
MongoDB
```

Los contenedores se comunican usando únicamente sus nombres.

---

# Publicación del puerto

Mongo Express expone el puerto:

```
8081
```

Se publica hacia el host mediante:

```yaml
ports:
  - "8080:8081"
```

Donde:

- 8080 → Puerto del host
- 8081 → Puerto interno del contenedor

---

# Reinicio automático

```yaml
restart: always
```

Permite que el contenedor vuelva a levantarse automáticamente en caso de fallo.

---

# docker-compose.yml

El servicio queda similar a:

```yaml
mongo-express:
  depends_on:
    - db

  image: mongo-express:1.0.0-alpha.4

  environment:
    ME_CONFIG_MONGODB_ADMINUSERNAME: ${MONGO_USERNAME}
    ME_CONFIG_MONGODB_ADMINPASSWORD: ${MONGO_PASSWORD}
    ME_CONFIG_MONGODB_SERVER: ${MONGO_DB_NAME}

  ports:
    - "8080:8081"

  restart: always
```

---

# Levantar los servicios

Detener los servicios anteriores:

```bash
docker compose down
```

Iniciar nuevamente:

```bash
docker compose up
```

o

```bash
docker compose up -d
```

---

# Verificando los contenedores

```bash
docker ps
```

Debe aparecer algo similar a:

```
pokemon-db
mongo-express
```

También puede verificarse desde Docker Desktop.

---

# Acceder a Mongo Express

Abrir el navegador:

```
http://localhost:8080
```

Se visualizará la interfaz web.

Desde allí es posible:

- Crear bases de datos
- Crear colecciones
- Explorar documentos
- Eliminar información

---

# Verificación desde TablePlus

Si MongoDB continúa exponiendo el puerto 27017, TablePlus podrá conectarse normalmente.

```
MongoDB
│
├── admin
├── config
└── local
```

Además, cualquier base de datos creada desde Mongo Express será visible en TablePlus.

---

# Mejorando la seguridad

La base de datos no necesita estar expuesta al exterior.

Únicamente deben acceder a ella:

- Mongo Express
- La aplicación

Por ello pueden eliminarse los puertos del servicio MongoDB.

Antes:

```yaml
ports:
  - "27017:27017"
```

Después:

```yaml
# ports:
#   - "27017:27017"
```

o simplemente eliminar el bloque.

---

# Resultado

Después de reiniciar los contenedores:

```bash
docker compose down
docker compose up -d
```

Mongo Express continuará funcionando correctamente.

Sin embargo, herramientas externas como TablePlus ya no podrán conectarse mediante:

```
localhost:27017
```

porque el puerto dejó de estar publicado.

La comunicación seguirá existiendo únicamente dentro de la red de Docker.

---

# Ventajas de ocultar MongoDB

- Mayor seguridad.
- Menor superficie de ataque.
- Solo los contenedores autorizados pueden acceder.
- Arquitectura más limpia.
- Aislamiento entre servicios.

---

# Flujo final de la arquitectura

```
                Navegador
                    │
                    ▼
          localhost:8080
                    │
                    ▼
             Mongo Express
                    │
                    │ DNS interno
                    ▼
              pokemon-db
                    │
                    ▼
                MongoDB
```

La base de datos permanece aislada y únicamente es accesible desde los servicios que pertenecen a la misma red creada por Docker Compose.

---

# Comandos utilizados

Levantar servicios

```bash
docker compose up
```

Modo detached

```bash
docker compose up -d
```

Detener servicios

```bash
docker compose down
```

Ver contenedores

```bash
docker ps
```

Ver logs

```bash
docker compose logs
```

Seguir logs en tiempo real

```bash
docker compose logs -f
```

Abrir Mongo Express

```
http://localhost:8080
```
