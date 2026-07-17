# Probando el enlace de directorios
## 📖 Introducción

En esta clase se comprueba el verdadero beneficio de los **Bind Mounts**: la sincronización automática de archivos entre el sistema operativo anfitrión (Host) y el contenedor Docker.

Después de haber instalado previamente todas las dependencias, el proyecto puede iniciarse mucho más rápido y cualquier cambio realizado en el código fuente local se refleja inmediatamente dentro del contenedor, sin necesidad de reconstruir la imagen.

---

# Estado inicial

Después de ejecutar el laboratorio anterior, el proyecto ya contiene:

- `node_modules`
- `dist`
- `yarn.lock`

Estos archivos fueron creados automáticamente desde el contenedor gracias al **Bind Mount**.

La carpeta del proyecto ahora tiene una estructura similar a:

```text
next-graphql/
│
├── dist/
├── node_modules/
├── src/
├── package.json
├── yarn.lock
└── ...
```

---

# ¿Por qué ahora inicia más rápido?

La primera vez que se ejecutó el contenedor fue necesario:

- Descargar la imagen.
- Resolver dependencias.
- Instalar paquetes.
- Generar `node_modules`.

Como ahora todo ya existe, el comando únicamente inicia la aplicación.

---

# Ejecutar nuevamente el contenedor

Se utiliza el mismo comando de la clase anterior:

```bash
docker container run \
--name nest-app \
-w /app \
-p 1080:3000 \
-v "$(pwd):/app" \
node:16-alpine3.16 \
sh -c "yarn install && yarn start:dev"
```

Esta vez el proceso es mucho más rápido porque las dependencias ya están instaladas.

---

# Modo observador (Watch Mode)

La aplicación inicia utilizando:

```bash
yarn start:dev
```

Este comando ejecuta NestJS en **modo observador (Watch Mode)**.

Esto significa que cualquier cambio en el código fuente provoca automáticamente una recompilación y reinicio de la aplicación.

---

# Verificación de la aplicación

Una vez iniciado el contenedor se puede acceder a:

```text
http://localhost:1080/graphql
```

Ejemplo de consulta:

```graphql
{
  hello
}
```

Respuesta inicial:

```text
Hola Mundo
```

---

# Modificar el código local

Se abre el archivo:

```text
src/hello/hello.resolver.ts
```

Se modifica el texto:

```typescript
Hola Mundo
```

por:

```text
Hola Mundo desde mi equipo
```

Se guardan los cambios.

---

# Detección automática de cambios

Inmediatamente después de guardar el archivo, la terminal muestra que NestJS detectó una modificación en el proyecto.

El modo observador realiza automáticamente:

- recompilación,
- reinicio,
- actualización de la aplicación.

No es necesario ejecutar nuevamente el contenedor.

---

# Resultado

Al ejecutar nuevamente la consulta GraphQL:

```graphql
{
  hello
}
```

La respuesta cambia automáticamente a:

```text
Hola Mundo desde mi equipo
```

Esto demuestra que el cambio realizado en el Host fue sincronizado inmediatamente con el contenedor mediante el Bind Mount.

---

# Segunda modificación

Se edita otro archivo del proyecto:

```text
todo.service.ts
```

Se modifica el texto:

```text
Piedra
```

por un nuevo contenido.

Después de guardar:

- NestJS recompila nuevamente.
- El contenedor reinicia automáticamente.
- Los cambios quedan disponibles inmediatamente.

---

# Flujo de sincronización

```text
Editar archivo
        │
        ▼
Visual Studio Code
        │
        ▼
Bind Mount
        │
        ▼
Contenedor Docker
        │
        ▼
NestJS detecta cambios
        │
        ▼
Recompila automáticamente
        │
        ▼
Aplicación actualizada
```

---

# Detener la aplicación

En algunos casos, al ejecutar el proceso directamente desde la terminal, `Ctrl + C` puede no finalizar correctamente el contenedor.

Una alternativa consiste en eliminar el contenedor desde otra terminal.

Listar contenedores:

```bash
docker container ls
```

Eliminar el contenedor:

```bash
docker container rm -f <container_id>
```

Ejemplo:

```bash
docker container rm -f af3
```

Después de eliminarlo, la aplicación deja de responder.

---

# Ejecutar el contenedor nuevamente

Se vuelve a ejecutar exactamente el mismo comando.

Gracias a que:

- la imagen ya existe;
- las dependencias ya están instaladas;

el inicio es prácticamente inmediato.

---

# Consultar los logs

En lugar de ejecutar el contenedor en primer plano, es posible iniciarlo en segundo plano y seguir los registros utilizando:

```bash
docker container logs -f <container_id>
```

Ejemplo:

```bash
docker container logs -f 3a53a5
```

La opción:

```bash
-f
```

permite visualizar los nuevos mensajes del contenedor en tiempo real.

---

# Ventajas del modo Watch

Gracias al modo observador:

- No es necesario reiniciar el contenedor.
- No es necesario reconstruir la imagen.
- Los cambios se aplican automáticamente.
- El desarrollo es mucho más rápido.

---

# Conceptos aprendidos

Durante esta práctica se reforzaron los siguientes conceptos:

- Persistencia de `node_modules`.
- Reutilización de dependencias ya instaladas.
- Funcionamiento del Watch Mode.
- Sincronización automática mediante Bind Mount.
- Recompilación automática de NestJS.
- Eliminación forzada de contenedores.
- Visualización de logs con `docker container logs -f`.