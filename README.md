# 📦 Nodepop

**Nodepop** es una aplicación web construida con **Node.js**, **Express** y **MongoDB**, diseñada como un servidor de anuncios clasificados.

---

## 🗂️ Clonar y preparar el proyecto

```bash
git clone <url_del_repositorio>
cd nodepop
code .
npm install
```

---

## 🗄️ Instalar y ejecutar MongoDB

### 🔗 Instalar MongoDB

- Descarga MongoDB desde la [página oficial](https://www.mongodb.com/try/download/community).

### 🍏 Instalar con Homebrew (macOS)

```bash
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
```

### ▶️ Ejecutar MongoDB

**macOS o Linux:**

```bash
brew services start mongodb-community@8.0
# o manual
./bin/mongod --dbpath ./data

# Detener servicio
brew services stop mongodb-community@8.0
```

**Con Docker:**

```bash
docker run --name mongodb -d -p 27017:27017 -v ~/data/db:/data/db mongo:8.0
```

---

## 🚀 Primer despliegue de Nodepop

1. Renombra `env_tmp` a `.env` y configura tus variables de entorno.

2. Inicializa la base de datos:

   ```bash
   npm run initDB
   ```

3. Ejecuta el servidor:

   ```bash
   npm run dev # desarrollo
   npm start   # producción
   ```

---

## ⚙️ Scripts disponibles

- `npm run initDB` → Inicializa la base de datos.
- `npm run dev` → Modo desarrollo con nodemon.
- `npm start` → Modo producción.

---

## 💡 Dependencias principales

express, mongoose, ejs, express-session, connect-mongo, bcrypt, jsonwebtoken, express-validator, multer, nodemailer, socket.io, i18n, cors, dotenv, swagger-jsdoc, swagger-ui-express, chance, morgan, debug, http-errors, cookie-parser, nodemon.

---

## 📄 Configuración del entorno

Renombra `.env.example` a `.env`:

```env
PORT=3000
NODEPOP_ENV=development
SECRET_SESSION=tu_cadena_secreta
TIME_LIFE_SESSION=duracion_en_ms
MONGO_URI=mongodb://localhost:27017/nodepop
JWT_SECRET=tu_jwt_secreto

# Email con Ethereal
EMAIL_SERVICE_HOST=smtp.ethereal.email
EMAIL_SERVICE_PORT=587
EMAIL_SERVICE_SECURE=false
EMAIL_SERVICE_USER=<usuario_ethereal>
EMAIL_SERVICE_PASSWORD=<contraseña_ethereal>
EMAIL_SERVICE_FROM=user@nodepop.com
```

> Crea cuenta de pruebas en [Ethereal Email](https://ethereal.email/create).

---

## 📖 Documentación de la API

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 📝 Licencia

Uso privado y educativo.\
¡Disfruta programando con Nodepop! 🚀

