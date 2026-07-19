# Optimizando la imagen con `.dockerignore`

## Objetivo

Hasta el momento la imagen Docker funciona correctamente, pero sigue siendo más grande de lo necesario.

Esto ocurre porque el comando:

```dockerfile
COPY . .
```

copia **todo el contenido del proyecto** al contenedor, incluyendo archivos y carpetas que no son necesarios para ejecutar la aplicación.

Para solucionar este problema se utiliza el archivo **`.dockerignore`**.

---

# ¿Qué es `.dockerignore`?

El archivo `.dockerignore` funciona de manera muy similar a `.gitignore`.

- **`.gitignore`** indica qué archivos Git no debe versionar.
- **`.dockerignore`** indica qué archivos Docker no debe copiar durante el proceso de construcción de la imagen.

Cada vez que Docker ejecuta:

```dockerfile
COPY . .
```

primero consulta el archivo `.dockerignore` y excluye todos los archivos o carpetas que aparezcan en él.

---

# Problema actual

Actualmente el Dockerfile contiene:

```dockerfile
COPY . .
```

Esto copia absolutamente todo el proyecto:

```text
app.js
tasks/
tests/
node_modules/
Dockerfile
.git/
.gitignore
package.json
package-lock.json
...
```

Sin embargo, varios de estos elementos no deberían formar parte de la imagen.

---

# Crear el archivo `.dockerignore`

Crear un archivo llamado:

```text
.dockerignore
```

Agregar inicialmente:

```text
node_modules
Dockerfile
```

De esta forma Docker ya no copiará:

- `node_modules`
- `Dockerfile`

---

# ¿Por qué ignorar `node_modules`?

Los módulos ya fueron instalados previamente mediante:

```dockerfile
RUN npm install
```

Si luego se ejecuta:

```dockerfile
COPY . .
```

los `node_modules` locales sobrescriben los que Docker acaba de instalar.

Además, esos módulos fueron creados en el sistema operativo del desarrollador:

- Windows
- macOS
- Linux

y pueden contener dependencias específicas para cada plataforma.

Lo correcto es permitir que Docker instale sus propios módulos dentro del contenedor.

---

# ¿Por qué no ignorar `tests`?

Aunque los archivos de pruebas no son necesarios para producción, todavía son necesarios durante el proceso de construcción porque Docker ejecuta:

```dockerfile
RUN npm run test
```

Si se agregara:

```text
tests
```

al `.dockerignore`, Docker no copiaría las pruebas y aparecería nuevamente el error:

```text
No tests found
```

Por ese motivo **todavía no deben excluirse**.

---

# Construcción de la nueva imagen

Construir una nueva versión:

```bash
docker build -t usuario/cron-ticker:tigre .
```

Docker detectará cambios únicamente en la etapa de copia debido al nuevo archivo `.dockerignore`.

---

# Verificar el contenido

Ejecutar la imagen:

```bash
docker container run -dit usuario/cron-ticker:tigre
```

Ingresar al contenedor:

```bash
docker exec -it <container_id> sh
```

Listar los archivos:

```bash
ls
```

Ahora se observa algo similar a:

```text
app.js
node_modules/
package.json
package-lock.json
tasks/
tests/
```

Ya no aparece:

- Dockerfile

---

# Mostrar archivos ocultos

Para visualizar archivos ocultos:

```bash
ls -la
```

Aquí puede verse:

```text
.dockerignore
```

Los archivos cuyo nombre comienza con un punto (`.`) son considerados archivos ocultos en Linux.

---

# Mejorando `.dockerignore`

Además del Dockerfile, también conviene excluir archivos relacionados con Git.

El archivo queda así:

```text
node_modules
Dockerfile
.git
.gitignore
```

Con esto Docker ya no copiará:

- el repositorio Git completo;
- el archivo `.gitignore`;
- el historial del proyecto.

---

# Resultado

La imagen ya es ligeramente más pequeña porque se dejaron de copiar archivos innecesarios como:

- `node_modules` locales;
- `Dockerfile`;
- `.git`;
- `.gitignore`.

Sin embargo, todavía existe un problema importante.

---

# El problema restante

Aunque `node_modules` locales ya no se copian, después del comando:

```dockerfile
RUN npm install
```

Docker instala tanto:

- dependencias de producción;
- dependencias de desarrollo.

Entre ellas:

- Jest
- Babel
- Expect
- y todos los paquetes necesarios para ejecutar los tests.

Estos paquetes siguen ocupando gran parte del espacio de la imagen.