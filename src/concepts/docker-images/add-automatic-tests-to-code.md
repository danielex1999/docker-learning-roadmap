# Testing automático antes de construir imágenes Docker

Hasta este punto hemos aprendido a:

- Crear imágenes Docker.
- Manejar versiones con tags.
- Subir imágenes a Docker Hub.
- Ejecutar imágenes desde un registro remoto.

Ahora vamos a agregar una práctica fundamental en proyectos reales:

> Ejecutar pruebas automáticas antes de construir una imagen Docker.

---

# ¿Por qué hacer testing?

Antes de enviar una aplicación a producción debemos asegurarnos de que funciona correctamente.

El objetivo del testing automático es:

- Validar funcionalidades importantes.
- Detectar errores antes del despliegue.
- Evitar construir imágenes con código defectuoso.
- Mantener calidad del software.

Flujo ideal:

```
Código fuente
      |
      v
Pruebas automáticas
      |
      |
      +---- Fallan
      |        |
      |        v
      |     No construir imagen
      |
      |
      +---- Pasan
               |
               v
        Construir imagen Docker
```

---

# Instalar Jest

Para realizar pruebas utilizaremos:

```
Jest
```

Jest es un framework de testing para JavaScript.

Instalación como dependencia de desarrollo:

```bash
npm install jest --save-dev
```

La opción:

```
--save-dev
```

indica que solamente es necesaria durante desarrollo y pruebas.

---

# Dependencia de desarrollo

Después de instalar veremos en:

```
package.json
```

Algo similar:

```json
{
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

Las dependencias de desarrollo normalmente no deberían formar parte de una imagen final de producción.

---

# Refactorizar la aplicación

Para poder probar nuestra lógica vamos a separar responsabilidades.

Antes:

```
app.js

├── Código de aplicación
├── Sincronización
└── Temporizador
```

Después:

```
Proyecto

├── app.js
│
├── tasks
│     |
│     └── sync-db.js
│
└── tests
      |
      └── tasks
             |
             └── sync-db.test.js
```

---

# Crear función independiente

Archivo:

```
tasks/sync-db.js
```

Ejemplo:

```javascript
const syncDB = () => {

    let times = 0;

    times++;

    return times;
}


module.exports = {
    syncDB
}
```

Esta función ahora puede ser probada de forma independiente.

---

# Importar función en la aplicación

En:

```
app.js
```

Importamos:

```javascript
const { syncDB } = require('./tasks/sync-db');
```

La aplicación sigue funcionando igual.

Ejemplo:

```bash
npm start
```

Resultado:

```
Inicio de aplicación

Tick
Tick
Tick
```

---

# Crear pruebas

Creamos la carpeta:

```
test
```

o:

```
tests
```

Dentro:

```
tests/tasks/sync-db.test.js
```

Jest reconoce archivos con:

```
.test.js
```

---

# Primera prueba

Ejemplo:

```javascript
const { syncDB } = require('../../tasks/sync-db');


test('Debe ejecutar el proceso dos veces', () => {

    const times = syncDB();

    console.log(times);

});
```

Esta prueba ejecuta nuestra función.

---

# Configurar script de testing

En:

```
package.json
```

Agregamos:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

---

# Ejecutar pruebas

Comando:

```bash
npm run test
```

También funciona:

```bash
npm test
```

porque `test` es un comando especial de npm.

---

# Validar resultados con Expect

Jest utiliza:

```javascript
expect()
```

para validar resultados.

Ejemplo:

```javascript
expect(times).toBe(2);
```

Significa:

"Espero que la variable times sea igual a 2".

---

# Ejemplo de prueba fallando

Código:

```javascript
test('Debe ejecutar el proceso dos veces', () => {

    const times = syncDB();

    expect(times).toBe(2);

});
```

Resultado:

```
Expected: 2

Received: 1
```

La prueba falla porque solamente ejecutamos una vez la función.

---

# Corregir la prueba

Ejemplo:

```javascript
test('Debe ejecutar el proceso dos veces', () => {

    syncDB();

    const times = syncDB();

    expect(times).toBe(2);

});
```

Ahora:

```
Expected: 2

Received: 2
```

Resultado:

```
PASS
```

---

# Importancia para Docker

El objetivo final será:

```
Docker Build

      |
      v

Ejecutar Tests

      |
      |
      +---- Error
      |
      |     No crear imagen
      |
      |
      +---- OK
             |
             v
       Crear imagen Docker
```

Si una prueba falla:

```
npm run test
```

devuelve error.

Docker debe detener el proceso.

---

# Ventaja en producción

Sin testing:

```
Código incorrecto
        |
        v
Imagen Docker
        |
        v
Producción
        |
        v
Error
```

Con testing:

```
Código incorrecto
        |
        v
Testing
        |
        v
Detecta error
        |
        v
No se genera imagen
```