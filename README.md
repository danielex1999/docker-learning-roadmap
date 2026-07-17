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


    ```bash
docker container run \
  --name world-db \
  -dp 3306:3306 \
  --env MARIADB_USER=example-user \
  --env MARIADB_PASSWORD=user-password \
  --env MARIADB_ROOT_PASSWORD=root-password \
  --env MARIADB_DATABASE=world-db \
  --volume world-db:/var/lib/mysql \
  --network world-app \
  mariadb:jammy
```

docker container run \
--name phpmyadmin \
-d \
-e PMA_ARBITRARY=1 \
-p 8080:80 \
--network world-app \
phpmyadmin:5.2.0-apache
