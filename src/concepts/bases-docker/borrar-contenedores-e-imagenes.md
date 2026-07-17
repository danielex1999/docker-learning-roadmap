# Limpieza de Contenedores e Imágenes

## Introducción

Cuando trabajamos con Docker es normal crear muchos contenedores e imágenes durante nuestras pruebas.

La ventaja de Docker es que todo puede limpiarse fácilmente, permitiendo eliminar recursos que ya no utilizamos y mantener nuestro ambiente organizado.

En esta práctica aprenderemos:

- Cómo listar contenedores.
- Diferencia entre contenedores activos y detenidos.
- Cómo eliminar contenedores.
- Cómo eliminar múltiples contenedores.
- Cómo limpiar contenedores detenidos.
- Cómo eliminar imágenes Docker.

---

# Ciclo de vida de un contenedor

Cuando ejecutamos:

```bash
docker container run hello-world
```

Docker realiza el siguiente proceso:

1. Utiliza la imagen existente.
2. Crea un nuevo contenedor.
3. Ejecuta las instrucciones definidas en la imagen.
4. Finaliza el proceso.
5. El contenedor queda detenido.

Ejemplo:

```
Imagen hello-world
        |
        ↓
Crear contenedor
        |
        ↓
Ejecutar proceso
        |
        ↓
Contenedor finalizado
```

Aunque el contenedor ya terminó, Docker lo mantiene registrado.

Por eso, si ejecutamos varias veces:

```bash
docker container run hello-world
```

podemos terminar con muchos contenedores detenidos.

---

# Ver contenedores existentes

Docker permite administrar los contenedores mediante:

```bash
docker container
```

Para conocer todos los comandos disponibles:

```bash
docker container --help
```

---

# Listar contenedores activos

El comando:

```bash
docker container ls
```

muestra solamente los contenedores que actualmente están ejecutándose.

Ejemplo:

```
CONTAINER ID     IMAGE          STATUS

abc123           nginx          Up
```

---

También existe el comando antiguo:

```bash
docker ps
```

Este comando sigue funcionando por compatibilidad, pero actualmente la forma recomendada es:

```bash
docker container ls
```

---

# Listar todos los contenedores

Por defecto Docker solamente muestra contenedores activos.

Para mostrar todos los contenedores, incluyendo los detenidos, utilizamos:

```bash
docker container ls -a
```

Ejemplo:

```
CONTAINER ID     IMAGE          STATUS

abc123           hello-world    Exited
def456           hello-world    Exited
```

El estado:

```
Exited
```

significa que el contenedor terminó su ejecución.

---

# Eliminar contenedores

Para eliminar un contenedor utilizamos:

```bash
docker container rm <container-id>
```

Ejemplo:

```bash
docker container rm abc123
```

También podemos utilizar:

- El ID completo.
- Los primeros caracteres del ID.
- El nombre del contenedor.

Ejemplo:

```bash
docker container rm abc
```

Docker permite utilizar una abreviación siempre que sea suficiente para identificar un único contenedor.

---

# Eliminar múltiples contenedores

Podemos eliminar varios contenedores en un solo comando:

```bash
docker container rm id1 id2 id3
```

Ejemplo:

```bash
docker container rm abc def ghi
```

Esto eliminará todos los contenedores indicados.

---

# Eliminar todos los contenedores detenidos

Docker también tiene una opción para limpiar automáticamente todos los contenedores que ya finalizaron.

Comando:

```bash
docker container prune
```

Docker mostrará una advertencia:

```
WARNING! This will remove all stopped containers.
```

Al confirmar, eliminará todos los contenedores detenidos.

Esto es útil cuando tenemos muchos contenedores creados durante pruebas.

---

# Diferencia entre comandos de eliminación

## Detener un contenedor

```bash
docker container stop <id>
```

Detiene un contenedor que actualmente está ejecutándose.

---

## Matar un contenedor

```bash
docker container kill <id>
```

Finaliza inmediatamente un contenedor activo.

---

## Eliminar un contenedor

```bash
docker container rm <id>
```

Elimina un contenedor que ya no necesitamos.

---

# Limpieza de imágenes Docker

Aunque eliminemos los contenedores, las imágenes permanecen almacenadas localmente.

Ejemplo:

```
Containers:
(vacío)

Images:

hello-world
```

La imagen continúa ocupando espacio en nuestro equipo.

---

# Listar imágenes

Para ver las imágenes disponibles:

```bash
docker image ls
```

También podemos utilizar:

```bash
docker images
```

Ejemplo:

```
REPOSITORY       TAG        SIZE

hello-world      latest     9.9MB
```

---

# Eliminar una imagen

Para eliminar una imagen utilizamos:

```bash
docker image rm <imagen>
```

Ejemplo:

```bash
docker image rm hello-world
```

También podemos utilizar:

- Nombre de la imagen.
- ID completo.
- Primeros caracteres del ID.

Ejemplo:

```bash
docker image rm hello
```

---

# Ver ayuda de comandos

Docker incluye documentación integrada.

Para imágenes:

```bash
docker image --help
```

Para contenedores:

```bash
docker container --help
```

Esto permite conocer:

- Comandos disponibles.
- Parámetros.
- Opciones adicionales.

---

# Flujo de limpieza completo

El proceso realizado en esta práctica fue:

```
Crear contenedores
        |
        ↓
Ejecutar pruebas
        |
        ↓
Contenedores detenidos
        |
        ↓
docker container rm
        |
        ↓
Eliminar contenedores
        |
        ↓
docker image rm
        |
        ↓
Eliminar imágenes
```

---

# Comandos utilizados

## Ver contenedores activos

```bash
docker container ls
```

## Ver todos los contenedores

```bash
docker container ls -a
```

## Eliminar un contenedor

```bash
docker container rm <id>
```

## Eliminar varios contenedores

```bash
docker container rm <id1> <id2>
```

## Eliminar contenedores detenidos

```bash
docker container prune
```

## Ver imágenes

```bash
docker image ls
```

## Eliminar una imagen

```bash
docker image rm <imagen>
```

---

# Conclusión

En esta práctica aprendimos cómo mantener limpio nuestro ambiente Docker.

Los contenedores son recursos temporales que podemos crear y eliminar fácilmente, mientras que las imágenes permanecen almacenadas hasta que decidimos eliminarlas.

Una buena administración de contenedores e imágenes permite:

- Liberar espacio en el equipo.
- Mantener organizado Docker.
- Evitar acumulación de recursos innecesarios.
- Trabajar de manera más eficiente.