# Integración de Testing en la Construcción de una Imagen Docker

En esta clase incorporaremos las pruebas automáticas como parte del proceso de construcción de nuestra imagen Docker.

El objetivo es que **si las pruebas fallan, la imagen no se genere**.

---

# ¿Por qué ejecutar pruebas durante el Build?

Hasta ahora nuestro flujo era:

```
docker build
      |
      v
npm install
      |
      v
Crear imagen
```

Ahora agregaremos un paso intermedio:

```
docker build
      |
      v
npm install
      |
      v
npm run test
      |
      |
      +---- Falla
      |       |
      |       v
      |   No construir imagen
      |
      +---- Pasa
              |
              v
        Construir imagen
```

De esta forma evitamos generar imágenes con errores.

---

# Un error común: "No tests found"

Jest detecta automáticamente los archivos de prueba mediante nombres específicos.

Por ejemplo:

```
sync-db.test.js
```

Si cambiamos el nombre por:

```
sync-db.js
```

o cualquier otro nombre que no incluya `.test.js`, al ejecutar:

```bash
npm run test
```

obtendremos un error similar a:

```
No tests found
```

Esto sucede porque Jest no encuentra archivos que coincidan con su patrón de búsqueda.

La solución es mantener nombres como:

```
archivo.test.js
```

o

```
archivo.spec.js
```

---

# Agregar el testing al Dockerfile

Nuestro Dockerfile era similar a:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY app.js .

CMD ["node","app.js"]
```

Ahora incorporamos las pruebas:

```dockerfile
FROM node:19.2-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY app.js .

RUN npm run test

CMD ["node","app.js"]
```

El comando:

```dockerfile
RUN npm run test
```

se ejecutará durante la construcción de la imagen.

---

# Primer problema

Al intentar construir:

```bash
docker build -t cron-ticker:mapache .
```

Docker genera un error:

```
No tests found
```

Aunque el proyecto sí tiene pruebas.

¿Por qué ocurre?

---

# ¿Qué archivos está copiando Docker?

Hasta ahora solamente copiábamos:

```
package.json

app.js
```

Sin embargo, nuestra aplicación fue reorganizada.

Ahora también existen:

```
tasks/

tests/
```

Estas carpetas no fueron copiadas al contenedor.

Por lo tanto, cuando Docker ejecuta:

```bash
npm run test
```

no encuentra los archivos de prueba.

---

# Copiar todo el proyecto

Una solución sencilla es copiar todos los archivos:

```dockerfile
COPY . .
```

Esto significa:

- Copiar todo el contenido del proyecto.
- Pegar todo dentro del directorio de trabajo (`/app`).

Ahora Docker tendrá:

```
app.js

package.json

tasks/

tests/

Dockerfile

...
```

Las pruebas podrán ejecutarse correctamente.

---

# Nueva construcción

Ejecutamos nuevamente:

```bash
docker build -t cron-ticker:mapache .
```

Ahora Docker realiza:

```
FROM

WORKDIR

COPY

RUN npm install

COPY

RUN npm run test

CMD
```

Si todas las pruebas pasan:

```
PASS

Successfully built
```

La imagen es creada correctamente.

---

# ¿Qué sucede si una prueba falla?

Supongamos que modificamos nuestra prueba para que falle.

Ejemplo:

```javascript
expect(times).toBe(2);
```

pero solamente ejecutamos:

```javascript
syncDB();
```

El resultado será:

```
Expected: 2

Received: 1
```

Al ejecutar nuevamente:

```bash
docker build
```

Docker detendrá el proceso:

```
RUN npm run test

FAIL

Exit code: 1
```

Y la imagen **no será creada**.

---

# Beneficio del proceso

Gracias a este flujo evitamos publicar imágenes defectuosas.

Antes:

```
Código con errores
        |
        v
docker build
        |
        v
Imagen creada
```

Ahora:

```
Código con errores
        |
        v
docker build
        |
        v
npm run test
        |
        v
FAIL
        |
        v
No existe imagen
```

---

# Caché de Docker

Observa que, aunque las pruebas fallen, Docker sigue aprovechando el caché.

Ejemplo:

```
FROM             ✔ Cache

WORKDIR          ✔ Cache

COPY             ✔ Cache

RUN npm install  ✔ Cache

RUN npm run test ❌ Error
```

Solo se vuelve a ejecutar la parte necesaria.

Esto hace que el proceso siga siendo rápido.

---

# Un nuevo inconveniente

Después de utilizar:

```dockerfile
COPY . .
```

la imagen aumenta considerablemente de tamaño.

¿Por qué?

Porque Docker ahora copia absolutamente todo el proyecto, incluyendo elementos que no deberían formar parte de una imagen de producción.

Por ejemplo:

```
node_modules/

tests/

.git/

Dockerfile

logs/

...
```

Esto provoca:

- Imágenes más pesadas.
- Mayor tiempo de construcción.
- Mayor tiempo de descarga.
- Espacio innecesario.