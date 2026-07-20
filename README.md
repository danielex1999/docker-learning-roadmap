![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Personal Roadmap Docker

Step by step guide to becoming a Docker developer

- Bases de Docker
    - [Qué es Docker](src/concepts/bases-docker/docker.md)
    - [Hola Mundo Docker](src/concepts/bases-docker/hola-mundo.md)
    - [Borrar contenedores e imágenes](src/concepts/bases-docker/borrar-contenedores-e-imagenes.md)
    - [Publish and Detached modes](src/concepts/bases-docker/publish-and-detached-modes.md)
    - [Variables de entorno](src/concepts/bases-docker/environment-variables.md)
    - [Usar la imagen de Postgres](src/concepts/bases-docker/using-postgres-image.md)
    - [Multiples instancias de Postgres](src/concepts/bases-docker/multiple-postgres-instances.md)
    - [Logs](src/concepts/bases-docker/logs.md)

- Volumenes y Redes
    - [Montar Bases de Datos](src/concepts/volumen-redes/mounting-databases.md)
    - [Tipos de volúmenes](src/concepts/volumen-redes/types-of-volumes.md)
    - [PHPMyAdmin](src/concepts/volumen-redes/phpmyadmin.md)
    - [Redes de contenedores](src/concepts/volumen-redes/container-networks.md)
    - [Asignar la red desde la inicialización](src/concepts/volumen-redes/assign-network-from-initialization.md)
    - [Bind Volumes](src/concepts/volumen-redes/bind-volumes.md)
    - [Ejemplo de Bind Volumes](src/concepts/volumen-redes/bind-volumes-example.md)
    - [Probar el enlace de directorios](src/concepts/volumen-redes/test-directory-link.md)
    - [Terminal interactiva -it](src/concepts/volumen-redes/interactive-terminal.md)

- Docker Compose
    - [Multi Container Apps](src/concepts/docker-compose/multi-container-apps.md)
    - [Correr, limpiar y otras consideraciones](src/concepts/docker-compose/run-clean-and-other-considerations.md)
    - [Limpiar el docker compose y conectar volumen externo](src/concepts/docker-compose/clean-docker-compose-and-connect-external-volume.md)
    - [Bind Volumes](src/concepts/docker-compose/bind-volumes.md)
    - [Multi-container app - Base de datos](src/concepts/docker-compose/multi-container-app.md)
    - [Variables de entorno](src/concepts/docker-compose/environment-variables.md)
    - [Multi-container app - Visor de Base de datos](src/concepts/docker-compose/multi-container-app-database-viewer.md)
    - [Multi-container app - Aplicación de NestJS](src/concepts/docker-compose/multi-container-app-nestjs.md)

- Docker - Creación de imágenes
    - [Cron-Ticker - Aplicación simple](src/concepts/docker-images/cron-ticker-simple-app.md)
    - [Dockerfile](src/concepts/docker-images/dockerfile-first.md)
    - [Construir la imagen](src/concepts/docker-images/building-image.md)
    - [Reconstruir la imagen](src/concepts/docker-images/rebuild-image.md)
    - [Subir la imagen a Docker Hub](src/concepts/docker-images/push-image-to-docker-hub.md)
    - [Consumir nuestra imagen de DockerHub](src/concepts/docker-images/consume-image-from-docker-hub.md)
    - [Añadir pruebas automáticas al código](src/concepts/docker-images/add-automatic-tests-to-code.md)
    - [Incorporar testing en la construcción](src/concepts/docker-images/incorporate-testing-in-construction.md)
    - [Examinar la imagen creada](src/concepts/docker-images/examine-created-image.md)
    - [Dockerignore](src/concepts/docker-images/dockerignore.md)
    - [Remover archivos y carpetas de la imagen](src/concepts/docker-images/remove-files-and-folders-from-image.md)
    - [Forzar una plataforma en la construcción](src/concepts/docker-images/force-platform-in-build.md)
    - [Buildx](src/concepts/docker-images/buildx.md)
    - [Buildx - Construcción en multiples arquitecturas](src/concepts/docker-images/buildx-multi-arch.md)

- Multi-State Build
    - [Multi-State Build](src/concepts/multi-state-build/multi-state-build.md)
    - [Docker compose - Target State](src/concepts/multi-state-build/docker-compose-target-state.md)
    - [Ejecutar partes específicas del Dockerfile](src/concepts/multi-state-build/run-specific-parts-of-dockerfile.md)
    - [Probar el BindVolume desde el compose](src/concepts/multi-state-build/test-bindvolume-from-compose.md)
    - [Generar production build](src/concepts/multi-state-build/generate-production-build.md)

<br>
<br>
<div align="center">
<img src="src/img/tumblr_4dbb7ab219f9d7cc20423925205b23f6_0472dbbb_500.webp/" width="150px" alt="Docker" />
</div>