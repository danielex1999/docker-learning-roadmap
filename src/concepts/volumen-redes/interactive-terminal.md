# Terminal interactiva -it
## 📌 Objetivos

En esta práctica aprenderás a:

- Ingresar a un contenedor en ejecución.
- Explorar el sistema de archivos interno de Linux.
- Navegar entre directorios.
- Visualizar archivos desde la terminal.
- Editar archivos directamente dentro del contenedor.
- Ver cómo los cambios realizados en el contenedor se reflejan automáticamente en el host gracias a los **Bind Volumes**.

---

# ¿Qué es `docker exec`?

`docker exec` permite ejecutar comandos dentro de un contenedor que ya se encuentra en ejecución.

Es una de las herramientas más utilizadas para:

- Depuración.
- Revisar archivos.
- Ejecutar comandos.
- Ver variables de entorno.
- Acceder a una terminal Linux.

---

## Ver los contenedores activos

```bash
docker container ls
```

Ejemplo:

```
CONTAINER ID
3a5...
```

---

# Entrar al contenedor

Ejecutar una terminal interactiva:

```bash
docker exec -it 3a5 /bin/sh
```

Donde:

- `exec` → ejecuta un comando dentro del contenedor.
- `-i` → modo interactivo.
- `-t` → crea una terminal.
- `/bin/sh` → abre una Shell de Linux.

Ahora estaremos trabajando directamente dentro del contenedor.

---

# Explorar el sistema de archivos

Ver la carpeta actual:

```bash
pwd
```

Listar archivos:

```bash
ls
```

Ver el sistema raíz:

```bash
cd /
ls
```

Ejemplo:

```
app
bin
dev
etc
home
lib
proc
usr
var
```

---

# Navegar entre directorios

Entrar a la carpeta `bin`:

```bash
cd bin
```

Ver contenido:

```bash
ls
```

Volver al directorio raíz:

```bash
cd /
```

---

# Ir al proyecto

Como durante el `docker run` se configuró:

```bash
-w /app
```

El proyecto se encuentra en:

```bash
cd app
```

Ver archivos:

```bash
ls
```

Resultado esperado:

```
dist
node_modules
package.json
src
tsconfig.json
```

Es exactamente el mismo contenido que existe en el proyecto local gracias al **Bind Volume**.

---

# Entrar al código fuente

```bash
cd src
```

Ver archivos:

```bash
ls
```

---

# Visualizar un archivo

Con `cat` podemos imprimir el contenido de un archivo.

Ejemplo:

```bash
cat hello-world.resolver.ts
```

---

# Editar archivos desde Linux

En Alpine Linux normalmente está disponible **vi**.

Abrir un archivo:

```bash
vi hello-world.resolver.ts
```

---

## Modo edición

Presionar:

```
i
```

Entraremos en modo inserción.

Modificar el texto, por ejemplo:

```ts
return "Hola Mundo desde mi contenedor";
```

---

## Guardar cambios

Presionar:

```
Esc
```

Luego escribir:

```
:wq
```

Finalmente:

```
Enter
```

---

# Verificar cambios

Visualizar nuevamente el archivo:

```bash
cat hello-world.resolver.ts
```

---

# Cambios automáticos gracias al Bind Volume

Como el directorio está enlazado:

```
Host
│
├── Proyecto NestJS
│
▼
Bind Volume
│
▼
Contenedor Linux (/app)
```

Todo cambio realizado dentro del contenedor también aparece inmediatamente en Visual Studio Code.

Asimismo, cualquier modificación realizada desde Visual Studio Code se refleja dentro del contenedor.

---

# Hot Reload

La aplicación está ejecutándose en modo observador.

Cuando un archivo cambia:

```
Archivo modificado
        │
        ▼
Nest detecta el cambio
        │
        ▼
Compila nuevamente
        │
        ▼
Aplicación actualizada
```

No es necesario reiniciar el contenedor.

---

# Editar otro archivo

Entrar a la carpeta correspondiente:

```bash
cd todo
```

Editar:

```bash
vi todo.service.ts
```

Realizar cambios.

Guardar:

```
Esc
:wq
```

---

# Comandos utilizados

| Comando | Descripción |
|----------|-------------|
| `docker exec -it <id> /bin/sh` | Abrir una terminal dentro del contenedor. |
| `pwd` | Mostrar directorio actual. |
| `ls` | Listar archivos. |
| `cd` | Cambiar de directorio. |
| `cat archivo` | Mostrar contenido del archivo. |
| `vi archivo` | Editar archivo desde la terminal. |

---

# Flujo de trabajo

```
Visual Studio Code
        │
Modificar archivo
        │
        ▼
Bind Volume
        │
        ▼
Contenedor Linux
        │
        ▼
NestJS detecta cambios
        │
        ▼
Compila automáticamente
        │
        ▼
Aplicación actualizada
```

También funciona en sentido contrario:

```
Contenedor Linux
        │
Editar archivo con vi
        │
        ▼
Bind Volume
        │
        ▼
Visual Studio Code
```

---

# Conclusiones

- `docker exec` permite ingresar a un contenedor en ejecución.
- Un contenedor Docker posee su propio sistema de archivos Linux.
- Los **Bind Volumes** sincronizan archivos entre el host y el contenedor.
- Los cambios pueden realizarse tanto desde el host como desde el contenedor.
- Esta técnica es muy útil para desarrollo, depuración y mantenimiento de aplicaciones.