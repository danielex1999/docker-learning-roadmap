# Montar Bases de Datos

## Introducción

En esta práctica pondremos en práctica los conocimientos adquiridos sobre Docker mediante la creación de una instancia de **MariaDB** completamente configurada.

El objetivo es crear un contenedor, configurar sus variables de entorno, conectarse a la base de datos desde un cliente SQL e importar un script con información de países y lenguajes.

Al finalizar también comprobaremos una de las principales limitaciones de los contenedores sin volúmenes: **la pérdida de información al eliminar el contenedor**.

---

# Objetivos

Durante esta práctica aprenderemos a:

- Crear un contenedor de MariaDB.
- Asignar un nombre al contenedor.
- Configurar variables de entorno.
- Publicar puertos.
- Conectarnos utilizando un usuario distinto de `root`.
- Ejecutar un script SQL.
- Verificar la información importada.
- Comprender por qué los datos desaparecen al eliminar el contenedor.

---

# Requisitos

- Docker instalado.
- Cliente de base de datos (TablePlus, DBeaver, MySQL Workbench, etc.).
- Script SQL proporcionado con la práctica.

---

# Crear el contenedor

Ejecutar el siguiente comando:

```bash
docker container run \
  -d \
  -p 3306:3306 \
  --name world-db \
  -e MARIADB_USER=example-user \
  -e MARIADB_PASSWORD=user-password \
  -e MARIADB_ROOT_PASSWORD=root-password \
  -e MARIADB_DATABASE=world-db \
  mariadb:jammy
```

---

# Explicación del comando

## Ejecutar en segundo plano

```bash
-d
```

Permite que el contenedor continúe ejecutándose sin mantener ocupada la terminal.

---

## Publicar el puerto

```bash
-p 3306:3306
```

Conecta el puerto del equipo con el puerto utilizado por MariaDB.

```
Equipo Host

3306
   │
   ▼

Contenedor

3306
```

---

## Nombre del contenedor

```bash
--name world-db
```

Asigna un nombre fácil de identificar.

---

## Variables de entorno

Crear usuario:

```bash
MARIADB_USER=example-user
```

Contraseña del usuario:

```bash
MARIADB_PASSWORD=user-password
```

Contraseña del administrador:

```bash
MARIADB_ROOT_PASSWORD=root-password
```

Base de datos inicial:

```bash
MARIADB_DATABASE=world-db
```

---

# Imagen utilizada

```bash
mariadb:jammy
```

Se utiliza una versión específica mediante el tag **jammy**, lo que garantiza que siempre se ejecutará la misma versión de MariaDB.

---

# Verificar el contenedor

```bash
docker container ls
```

Salida esperada:

```text
CONTAINER ID   IMAGE            STATUS

abc123         mariadb:jammy    Up
```

---

# Conectarse desde TablePlus

Crear una nueva conexión utilizando:

| Campo | Valor |
|--------|-------|
| Host | localhost |
| Puerto | 3306 |
| Usuario | example-user |
| Contraseña | user-password |
| Base de datos | world-db |

Si la prueba es correcta podremos acceder a la base de datos.

---

# Importar el script SQL

Abrir el editor SQL del cliente de base de datos.

Pegar el contenido completo del archivo proporcionado.

Ejecutar todas las instrucciones.

En la mayoría de los clientes basta con:

```text
Ctrl + Enter
```

Una vez finalizada la ejecución, recargar la conexión.

---

# Resultado esperado

Después de importar el script deberán aparecer las tablas correspondientes al ejercicio.

Por ejemplo:

```text
world-db

├── country
└── countrylanguage
```

Estas tablas contendrán la información importada desde el archivo SQL.

---

# ¿Qué ocurre al eliminar el contenedor?

Comprobar los contenedores activos:

```bash
docker container ls
```

Eliminar el contenedor:

```bash
docker container rm -f <id>
```

Ejemplo:

```bash
docker container rm -f abc123
```

---

# Crear nuevamente el contenedor

Ejecutar otra vez el mismo comando:

```bash
docker container run \
  -d \
  -p 3306:3306 \
  --name world-db \
  -e MARIADB_USER=example-user \
  -e MARIADB_PASSWORD=user-password \
  -e MARIADB_ROOT_PASSWORD=root-password \
  -e MARIADB_DATABASE=world-db \
  mariadb:jammy
```

---

# ¿Qué sucedió?

Al volver a conectarnos observaremos que:

- La base de datos inicial existe.
- Las tablas importadas desaparecieron.
- Los registros ya no están disponibles.

Esto ocurre porque toda la información estaba almacenada dentro del contenedor.

Al eliminar el contenedor también se eliminaron todos los datos.

---

# Persistencia de datos

Sin utilizar volúmenes, la estructura es la siguiente:

```text
Contenedor

MariaDB
│
├── Base de datos
├── Tablas
├── Registros
└── Archivos
```

Cuando el contenedor desaparece, toda esa información también se elimina.

---

# Próximo paso: Volúmenes

Para evitar la pérdida de información Docker ofrece los **volúmenes**, que permiten almacenar los datos fuera del contenedor.

Con un volumen la arquitectura cambia:

```text
Contenedor
      │
      ▼

Volumen Docker

└── Datos persistentes
```

De esta forma podremos eliminar y volver a crear contenedores sin perder la información almacenada.

---

# Comandos utilizados

Crear el contenedor:

```bash
docker container run \
  -d \
  -p 3306:3306 \
  --name world-db \
  -e MARIADB_USER=example-user \
  -e MARIADB_PASSWORD=user-password \
  -e MARIADB_ROOT_PASSWORD=root-password \
  -e MARIADB_DATABASE=world-db \
  mariadb:jammy
```

Ver contenedores:

```bash
docker container ls
```

Eliminar un contenedor:

```bash
docker container rm -f <id>
```

---

# Conclusión

En esta práctica integramos varios conceptos fundamentales de Docker:

- Creación de contenedores.
- Uso de imágenes oficiales.
- Variables de entorno.
- Publicación de puertos.
- Conexión desde un cliente de base de datos.
- Importación de información mediante un script SQL.

Finalmente comprobamos que, sin utilizar volúmenes, toda la información almacenada dentro de un contenedor se pierde al eliminarlo.