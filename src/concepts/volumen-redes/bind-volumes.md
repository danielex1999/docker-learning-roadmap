# Bind Volumes

## 📖 Introducción

En esta clase se introduce el tercer tipo de almacenamiento persistente en Docker: los **Bind Mounts (Bind Volumes)**.

A diferencia de los **Named Volumes**, donde Docker administra el almacenamiento, los **Bind Mounts** permiten enlazar una carpeta de tu computadora (Host) directamente con una carpeta dentro del contenedor.

Esto es especialmente útil durante el desarrollo, ya que cualquier cambio realizado en el código fuente se refleja inmediatamente dentro del contenedor, sin necesidad de reconstruir imágenes.

---

# ¿Qué es un Bind Mount?

Un **Bind Mount** conecta una carpeta del sistema operativo anfitrión (Host) con una carpeta específica dentro del contenedor.

```text
Host (Tu computadora)
┌───────────────────────────┐
│ Proyecto Node.js          │
│                           │
│ app.js                    │
│ package.json              │
│ node_modules              │
└────────────┬──────────────┘
             │
             │ Bind Mount
             ▼
Contenedor Docker
┌───────────────────────────┐
│ /app                      │
│                           │
│ app.js                    │
│ package.json              │
│ node_modules              │
└───────────────────────────┘
```

Ambos sistemas comparten exactamente los mismos archivos.

---

# ¿Para qué sirve?

Los Bind Mounts son ideales cuando:

- Desarrollas aplicaciones localmente.
- Quieres editar archivos con VS Code mientras la aplicación corre en Docker.
- Necesitas probar aplicaciones en Linux sin instalar Linux directamente.
- Deseas evitar reconstruir imágenes cada vez que modificas el código.

---

# Caso práctico explicado

El instructor comenta un caso real:

Tenía una aplicación que:

- Funcionaba correctamente en Windows.
- Funcionaba correctamente en macOS.
- Presentaba errores únicamente en Linux.

En lugar de:

- instalar una máquina virtual,
- configurar autenticación,
- instalar dependencias,
- preparar todo un ambiente Linux,

simplemente ejecutó un contenedor Linux mediante Docker y montó el proyecto utilizando un **Bind Mount**.

De esta manera pudo trabajar sobre el mismo código desde Windows mientras la aplicación realmente se ejecutaba en Linux.

---

# Funcionamiento

Supongamos que tu proyecto está en:

```text
C:\Proyectos\MiApp
```

Y deseas que dentro del contenedor aparezca como:

```text
/app
```

Docker enlaza ambos directorios.

Todo cambio realizado en cualquiera de los dos lados aparece inmediatamente en el otro.

---

# Flujo de trabajo

```text
Editar archivo
        │
        ▼
 VS Code (Host)
        │
        ▼
 Bind Mount
        │
        ▼
 Docker Container
        │
        ▼
 Aplicación ejecutándose
```

No es necesario copiar archivos manualmente.

---

# Instalación de dependencias

Una ventaja importante es que las dependencias pueden instalarse directamente desde el contenedor.

Por ejemplo:

```bash
npm install
```

Aunque el comando se ejecuta dentro del contenedor Linux, la carpeta:

```text
node_modules
```

aparecerá también en tu proyecto local porque ambos comparten exactamente el mismo sistema de archivos.

---

# Beneficios

- Desarrollo mucho más cómodo.
- Cambios instantáneos.
- No reconstruir imágenes constantemente.
- Ambiente idéntico al servidor.
- Excelente para proyectos Node.js.
- Muy utilizado con React, Angular, Vue, NestJS, Laravel, etc.

---

# Terminal interactiva

Otra ventaja importante es que Docker permite ingresar directamente al contenedor.

Esto resulta útil para:

- revisar archivos;
- verificar variables de entorno;
- inspeccionar directorios;
- ejecutar comandos Linux;
- depurar aplicaciones;
- instalar dependencias;
- analizar el comportamiento interno del contenedor.

Es como si estuvieras utilizando una terminal de Linux real.

---

# ¿Tiene desventajas?

Sí.

Los Bind Mounts consumen un poco más de recursos que ejecutar la aplicación directamente en el sistema operativo.

Existe una sincronización constante entre:

- Host
- Docker
- Contenedor

Por ello:

- Para desarrollo son excelentes.
- Para producción normalmente no se utilizan.

---

# Comparación con otros tipos de volúmenes

| Tipo | Persistencia | Administrado por Docker | Uso principal |
|-------|--------------|-------------------------|---------------|
| Anonymous Volume | Sí | Sí | Datos temporales |
| Named Volume | Sí | Sí | Bases de datos y almacenamiento persistente |
| Bind Mount | Sí | No | Desarrollo y sincronización de código |

---

# Ventajas

- Sincronización inmediata de archivos.
- No requiere copiar código al contenedor.
- Permite editar desde cualquier editor.
- Facilita trabajar con Linux desde Windows o macOS.
- Muy útil para desarrollo.

---

# Desventajas

- Menor rendimiento que ejecutar la aplicación localmente.
- Depende de la estructura de carpetas del Host.
- No suele utilizarse en ambientes de producción.

---

# Resumen

En esta clase se explicó:

- Qué son los **Bind Mounts**.
- Cómo conectan el sistema de archivos del Host con el del contenedor.
- Su utilidad durante el desarrollo.
- Cómo permiten instalar dependencias directamente dentro del contenedor.
- La posibilidad de ingresar al contenedor mediante una terminal interactiva.
- Sus ventajas y limitaciones frente a otros tipos de volúmenes.

En las siguientes clases se realizarán ejercicios prácticos utilizando **Bind Mounts**, donde se conectará una aplicación local con un contenedor Linux para trabajar sobre el mismo código en tiempo real.