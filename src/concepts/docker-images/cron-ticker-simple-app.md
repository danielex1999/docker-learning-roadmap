# Cron Ticker

Aplicación desarrollada con Node.js que será utilizada como base para aprender el proceso de creación de imágenes Docker.

El objetivo de este proyecto es comprender cómo una aplicación puede ser preparada para posteriormente ser empaquetada dentro de una imagen Docker y ejecutada mediante un contenedor.

## Introducción

Una imagen Docker es una plantilla que contiene todo lo necesario para ejecutar una aplicación, incluyendo el código fuente, dependencias, configuraciones y comandos de inicio.

El proceso de creación de una imagen se realiza mediante un archivo llamado `Dockerfile`.

El `Dockerfile` es un archivo de texto que contiene instrucciones que Docker utiliza para construir una imagen. Estas instrucciones permiten definir desde la imagen base que será utilizada hasta la forma en la que la aplicación será ejecutada dentro del contenedor.

Cada instrucción dentro del `Dockerfile` genera una capa (*layer*) dentro de la imagen. Estas capas permiten reutilizar componentes existentes entre diferentes imágenes, optimizando el almacenamiento y acelerando los procesos de construcción.

Ejemplos de instrucciones que pueden formar parte de un `Dockerfile`:

- Definir una imagen base.
- Copiar archivos del proyecto.
- Instalar dependencias.
- Configurar variables de entorno.
- Exponer puertos.
- Definir volúmenes.
- Establecer el comando de inicio de la aplicación.

---

## Creación del proyecto

El proyecto utiliza Node.js para crear una aplicación sencilla que ejecutará tareas programadas.

Primero creamos la carpeta del proyecto:

```bash
mkdir cron-ticker

cd cron-ticker
```

Inicializamos el proyecto utilizando npm:

```bash
npm init
```

Este comando genera el archivo `package.json`, donde se almacena la configuración principal de la aplicación, incluyendo nombre del proyecto, versión, scripts y dependencias.

La estructura inicial del proyecto será:

```text
cron-ticker
│
├── package.json
└── app.js
```

---

## Aplicación inicial

Creamos el archivo `app.js`:

```javascript
console.log("Hola mundo");
```

Para ejecutar la aplicación utilizamos Node.js:

```bash
node app.js
```

Resultado:

```text
Hola mundo
```

---

## Configuración del script de inicio

Dentro del archivo `package.json` agregamos un script para iniciar la aplicación:

```json
{
  "scripts": {
    "start": "node app.js"
  }
}
```

Ahora podemos ejecutar la aplicación utilizando:

```bash
npm start
```

Este comando ejecuta automáticamente el archivo definido dentro del script `start`.

---

## Instalación de node-cron

Para crear una tarea programada utilizaremos la librería `node-cron`.

Instalamos la dependencia:

```bash
npm install node-cron
```

Esto genera la carpeta `node_modules` y agrega la dependencia dentro de `package.json`.

La estructura del proyecto queda:

```text
cron-ticker
│
├── node_modules/
├── package-lock.json
├── package.json
└── app.js
```

---

## Implementación del Cron Ticker

La aplicación utilizará `node-cron` para ejecutar una tarea automáticamente en determinados intervalos de tiempo.

Código de ejemplo:

```javascript
const cron = require("node-cron");

let times = 0;

cron.schedule("* * * * * *", () => {
    times++;

    console.log(`Tick número: ${times}`);
});
```

La expresión Cron define la frecuencia de ejecución de la tarea:

```text
* * * * * *
│ │ │ │ │ │
│ │ │ │ │ └── Día de la semana
│ │ │ │ └──── Mes
│ │ │ └────── Día del mes
│ │ └──────── Hora
│ └────────── Minuto
└──────────── Segundo
```

La expresión:

```text
* * * * * *
```

indica que la tarea se ejecutará cada segundo.

---

## Ejecución de la aplicación

La aplicación puede iniciarse utilizando:

```bash
npm start
```

Ejemplo de salida:

```text
Tick número: 1
Tick número: 2
Tick número: 3
Tick número: 4
```

Para detener la ejecución del proceso:

```bash
CTRL + C
```

---

## Programaciones con Cron

Las expresiones Cron permiten definir diferentes intervalos de ejecución.

Algunos ejemplos:

Ejecutar cada segundo:

```text
* * * * * *
```

Ejecutar cada 5 segundos:

```text
*/5 * * * * *
```

Ejecutar cada minuto:

```text
0 * * * * *
```

Este tipo de procesos son utilizados frecuentemente para ejecutar tareas automáticas como:

- Sincronización de datos.
- Procesos de mantenimiento.
- Generación de reportes.
- Actualización de información.
- Ejecución de tareas periódicas.