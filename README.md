# 🌍 Quiz de Banderas

Aplicación web interactiva desarrollada como proyecto de **Desarrollo de Aplicaciones Web (DAW)**. El objetivo es poner a prueba los conocimientos sobre banderas mediante un juego de preguntas con temporizador y un sistema de puntuación.

## 📋 Descripción

El proyecto consiste en un juego de preguntas de opción múltiple en el que el usuario debe responder correctamente a preguntas relacionadas con banderas.

Las preguntas se almacenan en una base de datos MySQL y se gestionan mediante un panel de administración que permite crear, consultar, modificar y eliminar preguntas.

## ✨ Funcionalidades

### 🎮 Juego
- Introducción del nombre del jugador.
- Selección aleatoria de hasta 10 preguntas por partida.
- Cuatro opciones de respuesta por pregunta.
- Visualización de imágenes de las banderas.
- Navegación entre preguntas.
- Temporizador de partida.
- Corrección de las respuestas y visualización de la puntuación final.

### ⚙️ Panel de administración
- Consulta de las preguntas almacenadas.
- Creación de nuevas preguntas.
- Edición de preguntas existentes.
- Eliminación de preguntas.
- Subida de imágenes para las preguntas.

## 🛠️ Tecnologías utilizadas

- **HTML5**: estructura de las páginas.
- **CSS3**: diseño y estilos de la aplicación.
- **JavaScript**: lógica del juego e interacción con el usuario.
- **Bootstrap 5**: diseño del panel de administración.
- **Node.js**: entorno de ejecución del servidor.
- **Express**: servidor web y API.
- **MySQL**: almacenamiento de las preguntas.
- **mysql2**: conexión con la base de datos.
- **Multer**: gestión de la subida de imágenes.
- **UUID**: generación de identificadores de partida.

## 📁 Estructura del proyecto

```text
quiz/
├── app.js
├── database.js
├── data.json
├── migracio.js
├── package.json
├── package-lock.json
└── public/
    ├── admin/
    │   ├── index.html
    │   └── script.js
    ├── funcions.js
    ├── img/
    │   ├── cronometro.png
    │   └── preguntes/
    ├── index.html
    ├── init.sql
    └── style.css
```

- `app.js`: servidor Express y rutas de la API.
- `database.js`: configuración de la conexión con MySQL.
- `data.json`: archivo de datos del proyecto.
- `migracio.js`: script relacionado con la migración de datos.
- `package.json`: dependencias y configuración de Node.js.
- `public/index.html`: página principal del juego.
- `public/funcions.js`: lógica del juego en el navegador.
- `public/style.css`: estilos de la aplicación.
- `public/init.sql`: script SQL para crear la tabla de preguntas.
- `public/admin/`: interfaz y JavaScript del panel de administración.
- `public/img/`: imágenes utilizadas en el juego.

## 🚀 Instalación y ejecución

### 1. Requisitos previos

Es necesario tener instalados:

- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) o un servidor MySQL accesible.
- [Git](https://git-scm.com/), opcionalmente, para clonar el repositorio.

### 2. Descargar el proyecto

Clona el repositorio y entra en su carpeta:

```bash
git clone https://github.com/a25guerodmar/quiz.git
cd quiz
```

### 3. Instalar las dependencias

Ejecuta el siguiente comando:

```bash
npm install
```

### 4. Configurar la base de datos

Crea una base de datos MySQL y ejecuta el script `public/init.sql` para crear la tabla `preguntes`.

Después, configura los datos de conexión en `database.js` para utilizar tu propia base de datos:

- Host del servidor MySQL.
- Usuario de la base de datos.
- Contraseña.
- Nombre de la base de datos.

**Importante:** no publiques contraseñas ni otras credenciales en el repositorio. Utiliza variables de entorno o un archivo local de configuración excluido de Git.

### 5. Iniciar el servidor

Desde la carpeta raíz del proyecto, ejecuta:

```bash
node app.js
```

Por defecto, el servidor utiliza el puerto `40300`.

### 6. Acceder a la aplicación

Una vez iniciado el servidor, abre el navegador y accede a:

- **Juego:** `http://localhost:40300/`
- **Panel de administración:** `http://localhost:40300/admin/`

Si has configurado otro puerto, sustituye `40300` por el puerto correspondiente.

## 🔌 API del proyecto

El servidor proporciona las siguientes rutas para gestionar las preguntas y las partidas:

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/json1` | Obtener las preguntas de una partida. |
| GET | `/preguntes` | Consultar todas las preguntas. |
| POST | `/preguntes` | Crear una pregunta. |
| PUT | `/preguntes/:id` | Modificar una pregunta. |
| DELETE | `/preguntes/:id` | Eliminar una pregunta. |
| POST | `/resultats` | Comprobar las respuestas y calcular la puntuación. |

## 🎯 Objetivo del proyecto

Este proyecto permite aplicar los conocimientos adquiridos en DAW sobre desarrollo web, programación con JavaScript, creación de servidores con Node.js y Express, conexión con bases de datos relacionales y desarrollo de operaciones CRUD mediante una API.

---

**Proyecto académico de Desarrollo de Aplicaciones Web (DAW).**
