# Ejecutar Contenedores, Puertos y Gestión del Ciclo de Vida

## Introducción

Hasta este punto hemos aprendido cómo crear imágenes, ejecutar contenedores y realizar limpieza de recursos.

En esta práctica aprenderemos conceptos más importantes para trabajar con aplicaciones reales:

- Ejecutar contenedores en segundo plano.
- Publicar puertos de un contenedor hacia nuestra máquina.
- Entender el aislamiento de Docker.
- Detener y reiniciar contenedores.
- Eliminar contenedores e imágenes.

Para esta práctica utilizaremos la imagen:

```bash
docker/getting-started
```

Esta es una imagen oficial de Docker que contiene una aplicación web utilizada para aprender los conceptos básicos de Docker.

---

# Verificar el puerto local

Antes de comenzar se recomienda abrir un navegador y acceder a:

```
localhost
```

Por defecto, si no existe ninguna aplicación ejecutándose en el puerto 80, veremos un error indicando que no hay ningún servicio disponible.

Esto es importante porque posteriormente vamos a conectar un contenedor Docker con nuestro puerto local.

---

# Ejecutar una imagen Docker

Para iniciar la aplicación utilizamos:

```bash
docker container run docker/getting-started
```

También existe una sintaxis antigua:

```bash
docker run docker/getting-started
```

Ambas funcionan, pero actualmente Docker recomienda utilizar:

```bash
docker container run
```

---

# Descarga de capas de una imagen

Cuando ejecutamos una imagen por primera vez, Docker descarga sus diferentes capas.

Ejemplo:

```
Pulling from docker/getting-started

Layer 1
Layer 2
Layer 3
```

Cada capa tiene un identificador único.

Docker utiliza estas capas para ser más eficiente.

Si volvemos a descargar la misma imagen y las capas ya existen localmente:

- No vuelve a descargarlas.
- Utiliza las capas almacenadas.
- Reduce el tiempo de ejecución.

---

# Ejecución del contenedor

Al ejecutar:

```bash
docker container run docker/getting-started
```

Docker:

1. Descarga la imagen si no existe.
2. Crea un contenedor.
3. Ejecuta la aplicación.
4. Muestra los logs directamente en la terminal.

Ejemplo:

```
Application started
Server running...
```

Estos mensajes corresponden a los logs generados por el contenedor.

---

# Problema: El contenedor está aislado

Aunque el contenedor está ejecutándose, si revisamos:

```
localhost
```

seguiremos sin poder acceder a la aplicación.

¿Por qué?

Porque el contenedor está aislado y ningún puerto está conectado con nuestra máquina.

Es como tener una puerta cerrada:

```
Contenedor Docker

Aplicación corriendo
        |
        |
        X
        |
        |
Equipo local
```

La aplicación existe, pero no tenemos acceso desde fuera.

---

# Ejecutar contenedores en segundo plano

Para evitar que los logs bloqueen nuestra terminal utilizamos:

```bash
-d
```

Este parámetro significa:

```
detached mode
```

o modo separado.

Ejemplo:

```bash
docker container run -d docker/getting-started
```

Ahora Docker:

- Ejecuta el contenedor.
- Lo deja funcionando en segundo plano.
- Devuelve el control de la terminal.

---

# Ver contenedores ejecutándose

Para comprobar que el contenedor está activo:

```bash
docker container ls
```

Ejemplo:

```
CONTAINER ID     IMAGE                     STATUS

abc123           docker/getting-started    Up
```

El estado:

```
Up
```

indica que el contenedor está ejecutándose.

---

# Publicar puertos con Docker

Para acceder a una aplicación dentro de un contenedor necesitamos publicar sus puertos.

Utilizamos:

```bash
-p
```

que significa:

```
publish
```

La sintaxis es:

```bash
-p puerto-local:puerto-contenedor
```

Ejemplo:

```bash
docker container run -d -p 80:80 docker/getting-started
```

Esto significa:

```
Puerto de mi computadora
        |
        ↓
Puerto del contenedor

80  -------------> 80
```

Ahora Docker conecta:

- Puerto 80 de nuestra máquina.
- Puerto 80 donde escucha la aplicación dentro del contenedor.

---

# Acceder a la aplicación

Después de ejecutar:

```bash
docker container run -d -p 80:80 docker/getting-started
```

podemos abrir:

```
http://localhost
```

Ahora veremos la aplicación funcionando.

El navegador se comunica con nuestro equipo y Docker redirige la solicitud hacia el contenedor.

---

# Usar diferentes puertos

Si el puerto 80 de nuestra máquina ya está ocupado, podemos utilizar otro puerto.

Ejemplo:

```bash
docker container run -d -p 8080:80 docker/getting-started
```

La conexión sería:

```
Equipo local       Contenedor

8080       --->       80
```

Ahora accedemos mediante:

```
http://localhost:8080
```

Esto permite tener múltiples instancias de una misma imagen ejecutándose en diferentes puertos.

---

# Detener un contenedor

Para detener un contenedor usamos:

```bash
docker container stop <id>
```

Ejemplo:

```bash
docker container stop abc123
```

También podemos utilizar:

- ID completo.
- Primeros caracteres del ID.
- Nombre del contenedor.

---

# Iniciar nuevamente un contenedor

Cuando detenemos un contenedor, este no se elimina.

Podemos iniciarlo nuevamente con:

```bash
docker container start <id>
```

Ejemplo:

```bash
docker container start abc123
```

El contenedor conservará:

- Su configuración.
- Sus puertos publicados.
- Su información.

---

# Diferencia entre Stop y Remove

## Stop

```bash
docker container stop <id>
```

Detiene el contenedor.

El contenedor sigue existiendo.

---

## Remove

```bash
docker container rm <id>
```

Elimina completamente el contenedor.

---

# Eliminar un contenedor activo

Si intentamos eliminar un contenedor que está ejecutándose:

```bash
docker container rm abc123
```

Docker mostrará un error:

```
Cannot remove a running container
```

Primero debemos detenerlo:

```bash
docker container stop abc123
```

Luego:

```bash
docker container rm abc123
```

---

# Eliminación forzada

También podemos eliminar un contenedor activo utilizando:

```bash
docker container rm -f <id>
```

El parámetro:

```
-f
```

significa:

```
force
```

Docker detendrá y eliminará el contenedor automáticamente.

Ejemplo:

```bash
docker container rm -f abc123
```

---

# Eliminar imágenes Docker

Aunque eliminemos los contenedores, las imágenes permanecen almacenadas.

Para listar imágenes:

```bash
docker image ls
```

Ejemplo:

```
REPOSITORY              TAG

docker/getting-started  latest
```

---

# Eliminar una imagen

Para eliminar una imagen:

```bash
docker image rm <imagen>
```

Ejemplo:

```bash
docker image rm docker/getting-started
```

Docker eliminará:

- La imagen.
- Sus capas asociadas.
- Los archivos almacenados localmente.

---

# Flujo completo aprendido

```
Imagen Docker
      |
      ↓
docker container run
      |
      ↓
Crear contenedor
      |
      ↓
-d (modo background)
      |
      ↓
-p (publicar puerto)
      |
      ↓
Acceder desde localhost
      |
      ↓
docker container stop
      |
      ↓
docker container start
      |
      ↓
docker container rm
      |
      ↓
docker image rm
```

---

# Comandos utilizados

## Ejecutar contenedor

```bash
docker container run <imagen>
```

## Ejecutar en segundo plano

```bash
docker container run -d <imagen>
```

## Publicar puerto

```bash
docker container run -d -p 80:80 <imagen>
```

## Ver contenedores activos

```bash
docker container ls
```

## Detener contenedor

```bash
docker container stop <id>
```

## Iniciar contenedor

```bash
docker container start <id>
```

## Eliminar contenedor

```bash
docker container rm <id>
```

## Eliminar forzadamente

```bash
docker container rm -f <id>
```

## Listar imágenes

```bash
docker image ls
```

## Eliminar imagen

```bash
docker image rm <imagen>
```

---

# Conclusión

En esta práctica aprendimos cómo ejecutar aplicaciones reales dentro de Docker.

Los conceptos más importantes fueron:

- Un contenedor puede estar ejecutándose sin ser accesible desde fuera.
- Los puertos deben publicarse explícitamente con `-p`.
- El modo `-d` permite ejecutar contenedores en segundo plano.
- Los contenedores pueden detenerse y reiniciarse sin perder su configuración.
- Las imágenes y contenedores pueden eliminarse fácilmente para mantener limpio nuestro ambiente.

Estos conceptos son fundamentales para trabajar con aplicaciones web, APIs y ambientes de desarrollo utilizando Docker.