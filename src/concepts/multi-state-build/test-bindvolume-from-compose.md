# Docker Compose - Desarrollo con Volúmenes y Hot Reload

## Introducción

En esta etapa vamos a validar que nuestra aplicación funcione correctamente en un ambiente de desarrollo utilizando Docker Compose.

Antes de avanzar hacia la configuración de producción, primero vamos a comprobar:

- Que los contenedores levanten correctamente.
- Que los servicios funcionen correctamente.
- Que los cambios realizados en el código se reflejen automáticamente.
- Que los volúmenes estén configurados de manera correcta.

---

# Reiniciar los servicios Docker

Antes de iniciar las pruebas debemos asegurarnos de que no exista ningún contenedor ejecutándose.

Ejecutamos:

```bash
docker compose down
```

Esto detiene y elimina los contenedores creados por Docker Compose.

Luego levantamos nuevamente los servicios:

```bash
docker compose up
```

Docker realizará nuevamente:

- Creación de contenedores.
- Configuración de redes.
- Montaje de volúmenes.
- Inicio de la aplicación.

---

# Bind Volumes en Docker

Durante el levantamiento del proyecto veremos que Docker realiza el montaje de los volúmenes.

Un **Bind Volume** permite conectar una carpeta de nuestro equipo con una carpeta dentro del contenedor.

Ejemplo:

```yaml
volumes:
  - ./src:/app/src
```

Esto significa:

```
Máquina local
      |
      |
      v
   ./src
      |
      |
      v
Contenedor Docker
      |
      |
      v
   /app/src
```

Cualquier cambio realizado en nuestro código local será reflejado automáticamente dentro del contenedor.

---

# Prueba de la aplicación

Con los servicios ejecutándose podemos acceder nuevamente a nuestra aplicación.

Ejemplo:

```
http://localhost
```

o a la documentación de la API:

```
http://localhost/api
```

En Swagger podemos probar nuestros endpoints.

Pasos:

1. Abrir el endpoint.
2. Presionar:

```
Try out
```

3. Ejecutar:

```
Execute
```

Si todo funciona correctamente veremos una respuesta:

```
200 OK
```

Esto confirma que la aplicación está levantada correctamente.

---

# Validación de cambios en tiempo real

Una de las ventajas de trabajar con Docker en modo desarrollo es poder modificar nuestro código sin reconstruir la imagen.

Ejemplo:

Ubicamos nuestro archivo:

```
src/
 └── services/
```

Buscamos una función como:

```
seed execute
```

Realizamos un cambio sencillo:

Antes:

```typescript
seed execute
```

Después:

```typescript
seed execute!!!
```

Guardamos el archivo.

---

# Hot Reload dentro del contenedor

Al guardar los cambios podemos observar la consola del contenedor.

Docker detectará la modificación:

```
File changed
Reloading application
```

Esto significa que:

- El volumen está funcionando.
- El contenedor recibe los cambios.
- La aplicación se reinicia automáticamente.

Luego regresamos al navegador y actualizamos:

```
F5
```

El cambio realizado debe aparecer reflejado.

---

# Problemas con módulos de Node

Durante esta prueba pueden aparecer errores relacionados con módulos:

```
Cannot find module
```

o problemas con:

```
node_modules
```

Esto sucede porque estamos compartiendo el código fuente con el contenedor mediante volúmenes, pero las dependencias instaladas pertenecen al ambiente donde fueron creadas.

Para evitar conflictos usamos diferentes estrategias.

---

# Volumen anónimo para node_modules

Una configuración común en desarrollo es:

```yaml
services:
  app:
    volumes:
      - .:/app
      - /app/node_modules
```

La segunda línea:

```yaml
- /app/node_modules
```

crea un volumen anónimo.

---

# ¿Qué es un volumen anónimo?

Un volumen anónimo permite mantener una carpeta específica dentro del contenedor sin reemplazarla con el contenido del host.

Ejemplo:

```
Host

Proyecto
 |
 ├── src
 └── package.json


Contenedor

/app
 |
 ├── src
 ├── package.json
 └── node_modules
```

El host no necesita tener los módulos instalados.

Docker mantiene:

```
/app/node_modules
```

dentro del contenedor.

---

# Estrategias para manejar node_modules

Existen diferentes formas de trabajar con dependencias.

## 1. Volumen anónimo

Ejemplo:

```yaml
volumes:
  - .:/app
  - /app/node_modules
```

Ventajas:

- Fácil de configurar.
- Ideal para desarrollo.
- Evita conflictos entre sistemas operativos.

---

## 2. Volumen nombrado

También podemos crear un volumen específico:

```yaml
volumes:
  node_modules:
```

Luego utilizarlo:

```yaml
services:
  app:
    volumes:
      - .:/app
      - node_modules:/app/node_modules
```

Ventajas:

- Mayor control.
- Persistencia independiente.
- Reutilización del volumen.

---

## 3. Instalación separada de dependencias

Otra alternativa es separar la instalación de dependencias mediante Dockerfile:

```
Dockerfile

1. Instalar dependencias
2. Copiar código
3. Ejecutar aplicación
```

Esta estrategia es utilizada principalmente en ambientes productivos.

---

# Desarrollo vs Producción

## Ambiente de desarrollo

Normalmente utilizamos:

- Bind Volumes.
- Hot Reload.
- Código sincronizado.
- Cambios rápidos.

Ejemplo:

```
Código local
      |
      v
Docker Container
      |
      v
Aplicación actualizada
```

---

## Ambiente de producción

En producción normalmente:

- No utilizamos Bind Volumes.
- No modificamos código dentro del contenedor.
- Construimos imágenes finales.
- Ejecutamos versiones estables.

Ejemplo:

```
Código fuente
      |
      v
Docker Build
      |
      v
Imagen final
      |
      v
Contenedor producción
```

---

# Limpieza completa del entorno

Antes de continuar con la siguiente etapa realizamos una limpieza completa.

Detener servicios:

```bash
docker compose down
```

Eliminar contenedores y volúmenes:

```bash
docker compose down -v
```

La opción:

```
-v
```

elimina:

- Volúmenes creados.
- Datos persistentes.
- Información almacenada temporalmente.

Esto permite iniciar nuevamente desde cero.