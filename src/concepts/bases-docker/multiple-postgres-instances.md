# Múltiples Instancias de PostgreSQL

## Introducción

Una de las principales ventajas de Docker es la posibilidad de ejecutar múltiples instancias de una misma aplicación en una sola computadora.

Cada instancia puede:

- Ejecutar una versión diferente.
- Tener su propia configuración.
- Utilizar diferentes puertos.
- Funcionar de manera completamente independiente.

Este enfoque es muy útil para realizar pruebas, validar migraciones o trabajar con distintas versiones de una aplicación sin afectar el entorno principal.

---

# ¿Por qué ejecutar varias instancias?

En escenarios reales es común necesitar:

- Probar una nueva versión antes de actualizar producción.
- Comparar comportamientos entre versiones.
- Mantener ambientes de desarrollo y pruebas.
- Ejecutar múltiples bases de datos simultáneamente.

Docker permite hacerlo de forma sencilla gracias al aislamiento entre contenedores.

---

# Crear la primera instancia

Crearemos un contenedor llamado **postgres-alpha** utilizando la versión más reciente de PostgreSQL.

```bash
docker container run \
  --name postgres-alpha \
  -e POSTGRES_PASSWORD=mypass1 \
  -d \
  -p 5432:5432 \
  postgres
```

### Explicación

- `--name postgres-alpha` → Nombre del contenedor.
- `POSTGRES_PASSWORD=mypass1` → Contraseña del usuario `postgres`.
- `-d` → Ejecuta el contenedor en segundo plano.
- `-p 5432:5432` → Publica el puerto del contenedor.
- `postgres` → Imagen utilizada (`latest`).

---

# Verificar el contenedor

```bash
docker container ls
```

Salida esperada:

```text
CONTAINER ID   IMAGE      STATUS      PORTS
abc123         postgres   Up          0.0.0.0:5432->5432/tcp
```

---

# Conectarse desde TablePlus

Configuración:

| Campo | Valor |
|--------|-------|
| Host | localhost |
| Puerto | 5432 |
| Usuario | postgres |
| Contraseña | mypass1 |

Si todo está correcto, la conexión será exitosa.

---

# Ejecutar una versión específica

Docker permite utilizar una versión concreta mediante **tags**.

Ejemplo:

```text
postgres:14-alpine3.17
```

Este tag indica:

- PostgreSQL versión 14.
- Basado en Alpine Linux 3.17.

Utilizar versiones específicas evita cambios inesperados cuando aparece una nueva versión de la imagen.

---

# Crear una segunda instancia

Ahora ejecutaremos otra instancia utilizando una versión diferente.

```bash
docker container run \
  --name postgres-beta \
  -e POSTGRES_PASSWORD=mypass1 \
  -d \
  -p 5433:5432 \
  postgres:14-alpine3.17
```

---

# ¿Por qué cambiar el puerto?

Cada puerto del equipo host solo puede utilizarse una vez.

No es posible tener:

```text
5432 → Contenedor A

5432 → Contenedor B ❌
```

Por ello utilizamos:

```text
Host                 Contenedor

5432 ----------->    5432

5433 ----------->    5432
```

Cada contenedor sigue utilizando internamente el puerto **5432**, pero nuestro equipo accede a ellos mediante diferentes puertos.

---

# Resultado esperado

```text
┌─────────────────────────────┐
│ Equipo Host                 │
│                             │
│ localhost:5432 ─────────────┐
│                             │
│ localhost:5433 ──────────┐  │
└──────────────────────────┼──┘
                           │
            ┌──────────────▼──────────────┐
            │ postgres-alpha             │
            │ PostgreSQL latest          │
            │ Puerto 5432                │
            └────────────────────────────┘

            ┌────────────────────────────┐
            │ postgres-beta              │
            │ PostgreSQL 14-alpine3.17   │
            │ Puerto 5432                │
            └────────────────────────────┘
```

---

# Verificar los contenedores

```bash
docker container ls
```

Salida esperada:

```text
CONTAINER ID   IMAGE                     PORTS

abc123         postgres                  0.0.0.0:5432->5432/tcp

def456         postgres:14-alpine3.17    0.0.0.0:5433->5432/tcp
```

---

# Conectar la segunda instancia

Crear una nueva conexión utilizando:

| Campo | Valor |
|--------|-------|
| Host | localhost |
| Puerto | 5433 |
| Usuario | postgres |
| Contraseña | mypass1 |

Ahora ambas bases de datos estarán funcionando simultáneamente.

---

# Errores comunes

## Nombre del contenedor ya existe

Si intentamos crear un contenedor con un nombre existente obtendremos un error como:

```text
Conflict.
The container name is already in use.
```

Solución:

- Utilizar otro nombre.
- Eliminar el contenedor existente.

Ejemplo:

```bash
docker container rm postgres-alpha
```

---

## Puerto ya está en uso

Otro error frecuente es:

```text
Bind for 0.0.0.0:5432 failed:
port is already allocated
```

Esto significa que el puerto del equipo host ya está siendo utilizado.

La solución consiste en utilizar otro puerto.

Ejemplo:

```bash
5433:5432
```

---

# Ver todos los contenedores

Para visualizar incluso los detenidos:

```bash
docker container ls -a
```

---

# Eliminar un contenedor detenido

```bash
docker container rm <id>
```

Ejemplo:

```bash
docker container rm abc123
```

---

# Eliminar varios contenedores

También es posible eliminar múltiples contenedores en un solo comando.

```bash
docker container rm -f <id1> <id2>
```

Ejemplo:

```bash
docker container rm -f abc123 def456
```

El parámetro `-f` fuerza la eliminación incluso si los contenedores están en ejecución.

---

# Flujo de la práctica

```text
Docker Hub
      │
      ▼
Imagen PostgreSQL latest
      │
      ▼
Contenedor Alpha
Puerto 5432
      │

Imagen PostgreSQL 14-alpine3.17
      │
      ▼
Contenedor Beta
Puerto 5433
```

---

# Comandos utilizados

Crear primera instancia:

```bash
docker container run \
  --name postgres-alpha \
  -e POSTGRES_PASSWORD=mypass1 \
  -d \
  -p 5432:5432 \
  postgres
```

Crear segunda instancia:

```bash
docker container run \
  --name postgres-beta \
  -e POSTGRES_PASSWORD=mypass1 \
  -d \
  -p 5433:5432 \
  postgres:14-alpine3.17
```

Ver contenedores:

```bash
docker container ls
```

Ver todos:

```bash
docker container ls -a
```

Eliminar varios contenedores:

```bash
docker container rm -f <id1> <id2>
```

---

# Conclusión

Docker facilita la ejecución simultánea de múltiples versiones de una misma aplicación gracias al aislamiento de los contenedores.

Durante esta práctica aprendimos a:

- Ejecutar dos instancias independientes de PostgreSQL.
- Utilizar diferentes versiones mediante tags.
- Publicar distintos puertos del equipo host.
- Resolver conflictos de nombres y puertos.
- Eliminar múltiples contenedores utilizando un solo comando.

Este tipo de configuración es muy utilizada en ambientes de desarrollo, pruebas y validación de nuevas versiones antes de desplegarlas en producción.