# Docker Multi-Stage Build 

En esta sección se inicia el uso de **Docker Multi-Stage Build**, una técnica que permite dividir la construcción de una imagen en varias etapas independientes.

El objetivo es:

- Reutilizar dependencias.
- Ejecutar pruebas automáticamente.
- Reducir el tamaño de la imagen final.
- Separar claramente el proceso de construcción del proceso de ejecución.

---

# ¿Qué es un Multi-Stage Build?

Un **Multi-Stage Build** consiste en utilizar múltiples instrucciones `FROM` dentro de un mismo `Dockerfile`.

Cada instrucción `FROM` crea una nueva etapa (Stage) completamente independiente.

Cada etapa puede:

- Instalar dependencias.
- Compilar el proyecto.
- Ejecutar pruebas.
- Generar archivos finales.
- Copiar únicamente lo necesario hacia la siguiente etapa.

---

# Primera Etapa: Dependencies

La primera etapa tiene como objetivo instalar únicamente las dependencias del proyecto.

```dockerfile
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm install
```

### ¿Qué ocurre en esta etapa?

1. Se utiliza la imagen oficial de Node.
2. Se crea el directorio `/app`.
3. Se copian únicamente los archivos `package.json` y `package-lock.json`.
4. Se instalan las dependencias del proyecto.

Al finalizar esta etapa únicamente existen:

- Node.js
- Dependencias (`node_modules`)
- Archivos `package.json`

Todavía no existe el código fuente de la aplicación.

---

# ¿Por qué separar las dependencias?

Las dependencias cambian con mucha menos frecuencia que el código fuente.

Gracias a ello Docker puede reutilizar el caché y evitar ejecutar nuevamente:

```bash
npm install
```

Esto reduce considerablemente el tiempo de construcción.

---

# Segunda Etapa: Builder

Ahora comienza una nueva etapa completamente limpia.

```dockerfile
FROM node:22-alpine AS builder
```

Es importante entender que este `FROM` crea una nueva imagen desde cero.

Nada de la etapa anterior existe automáticamente.

---

# Configurar el directorio de trabajo

```dockerfile
WORKDIR /app
```

---

# Reutilizar las dependencias

En lugar de ejecutar nuevamente:

```bash
npm install
```

se reutilizan las dependencias instaladas en la etapa anterior.

```dockerfile
COPY --from=deps /app/node_modules ./node_modules
```

### Explicación

- `--from=deps` indica que los archivos provienen de la etapa llamada **deps**.
- `/app/node_modules` es la ubicación de las dependencias en esa etapa.
- `./node_modules` es el destino en la etapa actual.

Con esto se evita volver a descargar e instalar todas las dependencias.

---

# Copiar el código fuente

Ahora sí se copia el proyecto completo.

```dockerfile
COPY . .
```

Docker copiará todos los archivos excepto aquellos definidos en `.dockerignore`.

Por ejemplo:

```text
node_modules
Dockerfile
README.md
```

No serán copiados si están excluidos.

---

# Ejecutar pruebas

Una vez copiado todo el proyecto, se ejecutan los tests.

```dockerfile
RUN npm run test
```

Si alguna prueba falla:

- La construcción se detiene.
- No se genera la imagen.
- Docker devuelve un error.

Esto garantiza que únicamente se construyan imágenes cuyo código haya pasado correctamente las pruebas.

---

# ¿Dónde iría el Build?

En aplicaciones como:

- Angular
- React
- Vue
- Next.js
- NestJS

es común ejecutar un paso adicional:

```dockerfile
RUN npm run build
```

Este comando genera la versión optimizada para producción.

En este proyecto no existe dicho comando, por lo que la etapa **builder** finaliza después de ejecutar los tests.

---

# Flujo hasta este punto

```text
┌────────────────────┐
│ Stage: deps        │
├────────────────────┤
│ Node               │
│ package.json       │
│ npm install        │
│ node_modules       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Stage: builder     │
├────────────────────┤
│ Nueva imagen Node  │
│ Copia node_modules │
│ Copia código       │
│ Ejecuta tests      │
└────────────────────┘
```

---

# Beneficios

- Evita ejecutar varias veces `npm install`.
- Aprovecha el caché de Docker.
- Reduce el tiempo de construcción.
- Permite ejecutar pruebas antes de crear la imagen final.
- Mantiene una separación clara entre dependencias y código fuente.