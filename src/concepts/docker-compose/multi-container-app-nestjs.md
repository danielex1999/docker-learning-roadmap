# Docker Compose - Agregando la Aplicación Pokémon

# Arquitectura final

```
                 Navegador
                      │
         ┌────────────┴─────────────┐
         │                          │
         ▼                          ▼
 localhost:3000               localhost:8080
 Pokémon API                 Mongo Express
         │                          │
         └──────────────┬───────────┘
                        ▼
                  pokemon-db
                     MongoDB
```

---

# ¿Por qué separar la aplicación?

Aunque técnicamente sería posible incluir el frontend y el backend dentro del mismo contenedor, una buena práctica es que cada contenedor tenga una única responsabilidad.

De esta manera:

- El backend puede actualizarse sin modificar el frontend.
- El frontend puede desplegarse independientemente.
- El mantenimiento es más sencillo.
- La escalabilidad mejora.

---

# Imagen Docker

La aplicación ya se encuentra publicada en Docker Hub.

Es recomendable utilizar una versión específica y no `latest`.

Ejemplo:

```yaml
image: giansalex/pokemon-nestjs:1.0.0
```

De esta forma siempre se ejecutará exactamente la misma versión.

---

# Compatibilidad entre arquitecturas

La imagen fue publicada para múltiples arquitecturas.

Esto permite ejecutarla en:

- Windows
- Linux
- macOS
- Intel/AMD (x86_64)
- ARM (Apple Silicon, Raspberry Pi)

Docker descargará automáticamente la imagen correspondiente para la arquitectura del equipo.

---

# Agregando un nuevo servicio

Dentro de `docker-compose.yml` agregamos un tercer servicio.

```yaml
services:

  db:
    ...

  mongo-express:
    ...

  poke-app:
```

---

# Dependencias

La aplicación necesita que MongoDB ya esté disponible.

También se puede esperar a que Mongo Express haya iniciado.

```yaml
depends_on:
  - db
  - mongo-express
```

---

# Imagen utilizada

```yaml
image: giansalex/pokemon-nestjs:1.0.0
```

---

# Publicación del puerto

La aplicación expone el puerto **3000**.

```yaml
ports:
  - "3000:3000"
```

Donde:

- Puerto izquierdo → Host.
- Puerto derecho → Contenedor.

---

# Variables de entorno

La aplicación necesita una cadena de conexión hacia MongoDB.

Se configura mediante:

```yaml
environment:
  MONGODB: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@pokemon-db:27017
  DB_NAME: ${MONGO_DB_NAME}
```

---

# Cadena de conexión

La URL tiene la siguiente estructura:

```
mongodb://usuario:password@host:puerto
```

Por ejemplo:

```
mongodb://strider:123456@pokemon-db:27017
```

---

# ¿Por qué no usar localhost?

Dentro del contenedor:

```
localhost
```

significa:

> "Yo mismo"

No hace referencia a MongoDB.

Como MongoDB vive en otro contenedor, debe utilizarse el nombre DNS generado por Docker Compose.

En este caso:

```
pokemon-db
```

Docker resolverá automáticamente ese nombre hacia la IP correcta.

---

# Variables reutilizadas

Las credenciales ya existen dentro del archivo `.env`.

```env
MONGO_USERNAME=strider
MONGO_PASSWORD=123456
MONGO_DB_NAME=pokemon-db
```

Docker Compose reemplaza automáticamente:

```yaml
${MONGO_USERNAME}
```

por:

```
strider
```

---

# Configuración completa

```yaml
poke-app:

  depends_on:
    - db
    - mongo-express

  image: giansalex/pokemon-nestjs:1.0.0

  ports:
    - "3000:3000"

  environment:
    MONGODB: mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@pokemon-db:27017
    DB_NAME: ${MONGO_DB_NAME}

  restart: always
```

---

# Levantar todos los servicios

```bash
docker compose up -d
```

Docker realizará automáticamente:

- Crear la red.
- Crear el volumen.
- Iniciar MongoDB.
- Iniciar Mongo Express.
- Iniciar Pokémon App.

Todo mediante un único comando.

---

# Verificando los contenedores

```bash
docker ps
```

Debe mostrar tres contenedores similares a:

```
pokemon-db
mongo-express
poke-app
```

---

# Probar la aplicación

Abrir:

```
http://localhost:3000
```

La aplicación responderá indicando que el backend está funcionando.

---

# Consultar los Pokémon

La API expone un endpoint para listar Pokémon.

Ejemplo:

```
http://localhost:3000/api/v2/pokemon
```

Respuesta:

```json
[
  {
    "id": 1,
    "name": "bulbasaur"
  },
  {
    "id": 2,
    "name": "ivysaur"
  }
]
```

---

# Utilizar parámetros

También pueden enviarse parámetros.

Ejemplo:

```
http://localhost:3000/api/v2/pokemon?limit=20&offset=40
```

Donde:

- `limit` → cantidad de registros.
- `offset` → posición inicial.

---

# Administrar MongoDB

Abrir:

```
http://localhost:8080
```

Desde Mongo Express será posible visualizar:

- Bases de datos.
- Colecciones.
- Documentos.
- Conteo de registros.
- Edición de documentos.

La colección de Pokémon aparecerá automáticamente una vez que la aplicación cargue la información inicial.

---

# Beneficios de Docker Compose

Con un único comando:

```bash
docker compose up
```

se obtiene automáticamente:

- MongoDB.
- Mongo Express.
- Backend.
- Red interna.
- Variables de entorno.
- Persistencia mediante volúmenes.
- Comunicación entre servicios.

No es necesario instalar ninguna dependencia manualmente.

---

# Actualización de versiones

Si aparece una nueva versión de la aplicación solamente es necesario cambiar el tag.

Antes:

```yaml
image: giansalex/pokemon-nestjs:1.0.0
```

Después:

```yaml
image: giansalex/pokemon-nestjs:1.1.0
```

Luego:

```bash
docker compose pull
docker compose up -d
```

Docker descargará únicamente la nueva imagen.

---

# Flujo completo

```
                Usuario
                   │
                   ▼
        http://localhost:3000
                   │
             Pokémon App
                   │
          mongodb://...
                   │
                   ▼
              MongoDB
                   ▲
                   │
          Mongo Express
        http://localhost:8080
```

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

Seguir logs

```bash
docker compose logs -f
```
