# Analizando el tamaño de la imagen Docker después de incorporar Testing

# 1. Comparación del tamaño de las imágenes

Antes de incorporar el testing:

- Imagen pequeña.
- Solo contenía lo necesario para ejecutar la aplicación.

Después de incorporar el testing:

- Imagen considerablemente más grande.
- Aproximadamente **70 MB adicionales**.

Esto no significa que los archivos de prueba sean pesados.

El verdadero problema son todas las dependencias que Jest instala para ejecutar los tests.

---

# 2. Ejecutar la imagen

Se inicia el contenedor normalmente:

```bash
docker container run -dit usuario/cron-ticker:mapache
```

- `-d` → Ejecutar en segundo plano.
- `-i` → Mantener la entrada estándar abierta.
- `-t` → Crear una terminal interactiva.

---

# 3. Acceder al contenedor

Para inspeccionar el contenido del contenedor se utiliza:

```bash
docker exec -it <container_id> sh
```

Por ejemplo:

```bash
docker exec -it 1b7 sh
```

Como la imagen está basada en **Alpine Linux**, no existe PowerShell ni Bash por defecto.

Se utiliza:

```bash
sh
```

---

# 4. Revisar el contenido

Una vez dentro del contenedor:

```bash
ls
```

Se observa algo similar a:

```text
Dockerfile
app.js
package.json
package-lock.json
node_modules/
tasks/
tests/
```

Todo esto fue copiado debido al comando:

```dockerfile
COPY . .
```

Es decir, absolutamente todo el proyecto fue incluido dentro de la imagen.

---

# 5. ¿Qué contiene `node_modules`?

Ingresando al directorio:

```bash
cd node_modules

ls
```

Se pueden observar cientos de paquetes.

Muchos pertenecen a Jest y únicamente sirven para ejecutar pruebas.

Ejemplo:

```text
@jest
babel-jest
expect
jest-cli
jest-runtime
...
```

Estas dependencias **no son necesarias** cuando la aplicación ya está en producción.

---

# 6. Revisar la carpeta de pruebas

Entrando al directorio:

```bash
cd tests

ls
```

Se encuentran todos los archivos de testing.

Por ejemplo:

```text
tasks/
```

y dentro:

```text
sync-db.test.js
```

Estos archivos fueron útiles durante la construcción de la imagen, pero **ya no tienen ninguna utilidad** una vez que la aplicación pasó todas las pruebas.

---

# 7. ¿Qué debería contener una imagen de producción?

Idealmente únicamente los archivos necesarios para ejecutar la aplicación.

Por ejemplo:

```text
app.js
package.json
package-lock.json
node_modules (solo dependencias de producción)
tasks/
```

No deberían incluirse elementos como:

```text
tests/
Dockerfile
.git/
.vscode/
```

ni dependencias exclusivas para desarrollo.

---

# 8. ¿Se pueden borrar manualmente?

Sí.

Dentro del contenedor podrían eliminarse directorios utilizando comandos como:

```bash
rm -rf tests
```

o

```bash
rm -rf node_modules
```

Sin embargo, **esto solo afecta al contenedor en ejecución**.

La imagen original permanece exactamente igual.

Cada vez que se cree un nuevo contenedor desde esa imagen, todos esos archivos volverán a existir.