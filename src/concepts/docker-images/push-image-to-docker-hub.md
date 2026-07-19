# Subir imágenes Docker a Docker Hub

Hasta este punto tenemos nuestra imagen creada localmente:

```bash
docker image ls
```

Ejemplo:

```
REPOSITORY      TAG
cron-ticker     latest
cron-ticker     1.0.0
cron-ticker     buffalo
cron-ticker     castor
```

Ahora vamos a subir nuestra imagen a un registro (*registry*).

---

# ¿Qué es un Docker Registry?

Un registro es un repositorio donde podemos almacenar imágenes Docker.

Ejemplos:

- Docker Hub.
- Azure Container Registry.
- Amazon Elastic Container Registry.
- Google Container Registry.

Funcionan como un almacenamiento remoto para nuestras imágenes.

---

# Docker Hub

Docker Hub permite:

- Crear repositorios públicos.
- Crear repositorios privados.
- Descargar imágenes.
- Compartir imágenes.
- Automatizar procesos.

Ejemplo:

```
Docker Hub
    |
    |
    +-- cron-ticker
            |
            +-- latest
            +-- 1.0.0
            +-- castor
```

---

# Crear un repositorio

Primero debemos crear un repositorio en Docker Hub.

Ejemplo:

Nombre:

```
cron-ticker
```

Resultado:

```
usuario/cron-ticker
```

Este nombre será utilizado para subir nuestra imagen.

---

# Preparar una imagen para subirla

Actualmente tenemos:

```
cron-ticker:castor
```

Pero Docker Hub necesita una referencia con nuestro usuario:

Formato:

```
usuario/repositorio:tag
```

Ejemplo:

```
danielex1999/cron-ticker:latest
```

---

# Cambiar el nombre de una imagen usando tag

Utilizamos:

```bash
docker image tag
```

Sintaxis:

```bash
docker image tag imagen_origen imagen_destino
```

Ejemplo:

```bash
docker image tag cron-ticker:castor usuario/cron-ticker:latest
```

Esto no crea una nueva imagen.

Solamente crea una nueva referencia.

---

# Ver nuevas referencias

Ejecutamos:

```bash
docker image ls
```

Resultado:

```
REPOSITORY                 TAG

cron-ticker                castor

usuario/cron-ticker        latest
```

Ambas apuntan al mismo `IMAGE ID`.

---

# Autenticación en Docker Hub

Antes de hacer un push necesitamos autenticarnos.

Comando:

```bash
docker login
```

Docker solicitará:

```
Username:
Password:
```

Después de autenticarnos veremos:

```
Login succeeded
```

---

# Subir una imagen (Push)

Para subir una imagen usamos:

```bash
docker push
```

Ejemplo:

```bash
docker push usuario/cron-ticker:latest
```

Docker comienza a subir las capas:

```
Pushing layers

Layer 1 ✔
Layer 2 ✔
Layer 3 ✔
Layer 4 ✔
```

Las capas que ya existen no se vuelven a subir.

---

# Funcionamiento del Push

Docker compara los identificadores de las capas.

Si una capa ya existe:

```
Layer already exists
```

No vuelve a enviarla.

Esto permite:

- Subidas rápidas.
- Menor consumo de red.
- Reutilización de imágenes.

---

# Ver la imagen en Docker Hub

Después del push tendremos:

```
usuario/cron-ticker
```

con sus tags:

```
latest

castor

1.0.0
```

Cada tag apunta a una versión específica.

---

# Escaneo de vulnerabilidades

Docker Hub permite escanear imágenes.

El análisis revisa:

- Dependencias vulnerables.
- Librerías con problemas conocidos.
- Riesgos de seguridad.

Herramientas utilizadas:

```
Snyk
```

Esto ayuda a detectar problemas antes de desplegar aplicaciones.

---

# Arquitecturas de procesador

Una imagen Docker puede depender de la arquitectura.

Ejemplos:

```
ARM64
AMD64
```

Ejemplo:

Procesadores Apple M1/M2:

```
ARM64
```

Muchos servidores tradicionales:

```
AMD64
```

Docker maneja estas diferencias utilizando imágenes compatibles.

---

# Crear nuevos tags para una misma imagen

Una imagen puede tener múltiples nombres:

Ejemplo:

```
usuario/cron-ticker:latest

usuario/cron-ticker:castor

usuario/cron-ticker:1.0.0
```

Para crear otro tag:

```bash
docker image tag
```

Ejemplo:

```bash
docker image tag usuario/cron-ticker:latest usuario/cron-ticker:castor
```

---

# Subir otro tag

Ahora podemos subir:

```bash
docker push usuario/cron-ticker:castor
```

Docker detectará:

```
Layer already exists
```

porque la imagen ya fue subida.

Solamente crea la nueva referencia.

---

# Último tag (latest)

Por convención:

```
latest
```

representa la versión más reciente.

Ejemplo:

```
cron-ticker:latest
```

Normalmente apunta al último build realizado.

Sin embargo, Docker no obliga a utilizarlo.

Podemos manejar nuestros propios nombres:

```
cron-ticker:castor

cron-ticker:buffalo

cron-ticker:release-1
```

---

# Flujo completo

El proceso completo es:

```
Crear imagen
      |
      v
docker build

      |
      v

Crear tag

docker image tag

      |
      v

Autenticarse

docker login

      |
      v

Subir imagen

docker push

      |
      v

Imagen disponible en Docker Hub
```

---

# Descargar una imagen desde Docker Hub

Cualquier equipo puede obtener la imagen:

```bash
docker pull usuario/cron-ticker:latest
```

Luego ejecutarla:

```bash
docker run usuario/cron-ticker:latest
```

Sin necesidad de tener:

- Node.js instalado.
- Dependencias configuradas.
- Código fuente local.