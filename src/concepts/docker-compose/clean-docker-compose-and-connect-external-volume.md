#  Volúmenes Externos y Recreación de Contenedores

# Problema

En el ejercicio anterior Docker Compose creó automáticamente un volumen nuevo.

Al ejecutar:

```bash
docker volume ls
```

observamos algo similar a:

```text
postgresql-pgadmin_postgres-db
```

Sin embargo, el volumen que realmente queríamos utilizar era el que ya habíamos creado anteriormente:

```text
postgres-db
```

Por esa razón la base de datos aparecía completamente vacía.

---

# Configurar un volumen externo

En el archivo `docker-compose.yml`, dentro de la sección `volumes`, debemos indicar que el volumen ya existe.

Antes:

```yaml
volumes:
  postgres-db:
```

Después:

```yaml
volumes:
  postgres-db:
    external: true
```

Con esta configuración Docker Compose dejará de crear un volumen nuevo y utilizará el volumen existente.

> **Importante:** la indentación (tabulación o espacios) debe mantenerse correctamente.

---

# ¿Basta con ejecutar nuevamente `docker compose up`?

No.

Algunos cambios en Docker Compose se aplican simplemente bajando y levantando los servicios.

Pero otros cambios, como modificar un volumen utilizado por un contenedor, requieren recrear completamente los contenedores.

---

# Detener la aplicación

Si la aplicación se está ejecutando en primer plano, basta con presionar:

```text
Ctrl + C
```

Esto detendrá los servicios.

---

# Eliminar la aplicación creada por Docker Compose

Ejecutar:

```bash
docker compose down
```

Este comando elimina:

- Contenedor de PostgreSQL
- Contenedor de pgAdmin
- Red creada automáticamente

**No elimina los volúmenes**, por lo que la información permanece almacenada.

---

# Verificar los volúmenes

Consultar los volúmenes disponibles:

```bash
docker volume ls
```

Todavía podremos observar el volumen creado anteriormente.

---

# Eliminar el volumen incorrecto

Si Docker Compose creó un volumen que ya no necesitamos, podemos eliminarlo manualmente.

```bash
docker volume rm postgresql-pgadmin_postgres-db
```

Después de eliminarlo:

```bash
docker volume ls
```

debería permanecer únicamente el volumen externo que deseamos reutilizar.

---

# Levantar nuevamente la aplicación

Ahora sí podemos ejecutar:

```bash
docker compose up
```

Docker Compose realizará nuevamente el proceso de:

- Crear la red.
- Crear los contenedores.
- Conectar ambos servicios.
- Utilizar el volumen externo existente.

---

# Acceder a pgAdmin

Abrir:

```text
http://localhost:8080
```

Credenciales:

**Email**

```text
superman@google.com
```

**Password**

```text
123456
```

---

# Registrar nuevamente el servidor

Como pgAdmin no posee un volumen propio, la configuración del servidor debe registrarse nuevamente.

Configuración:

**Nombre**

```text
HeroesDB
```

**Host**

```text
postgres-db
```

**Puerto**

```text
5432
```

**Usuario**

```text
postgres
```

**Contraseña**

```text
123456
```

---

# Verificar la información

Una vez conectados podremos observar nuevamente la base de datos creada anteriormente.

Ejemplo:

```text
HeroesDB
```

Dentro de ella aparecerán:

```text
Schemas
└── public
    └── Tables
        └── heroes
```

Al consultar la tabla se visualizarán los registros previamente almacenados, por ejemplo:

```text
Superman
Batman
```

Esto confirma que PostgreSQL reutilizó correctamente el volumen externo.

---

# ¿Qué aprendimos?

Docker Compose puede trabajar con distintos tipos de almacenamiento:

### Volumen administrado por Docker Compose

```yaml
volumes:
  postgres-db:
```

Docker Compose crea automáticamente el volumen.

---

### Volumen externo

```yaml
volumes:
  postgres-db:
    external: true
```

Docker Compose utiliza un volumen previamente existente.

---

### Bind Mount (próxima clase)

También es posible enlazar directamente una carpeta del sistema operativo con una carpeta del contenedor.

Ejemplo:

```yaml
volumes:
  - ./data:/var/lib/postgresql/data
```

Esta configuración se estudiará en la siguiente práctica.

---

# Comandos utilizados

```bash
docker compose up

docker compose down

docker volume ls

docker volume rm <nombre-del-volumen>
```
