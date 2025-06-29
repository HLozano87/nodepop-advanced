# Nodepop

Nodepop es una aplicación web construida con Node.js, Express y MongoDB, diseñada como un servidor de anuncios clasificados.

### After cloning the repository:

Access the project in windows with:

```sh
cd /project_path/nodepop
```

Once inside the path run the command ```code .``` this will open the vscode to the **"nodepop ”** folder and from the windows console run the following command for install dependencies with:

```sh
npm install

or

npm i
```

This will install all the dependencies needed to start the project.

#### Install [MongoDB](!https://www.mongodb.com) from official page.

### Install MongoDB with Homebrew

```zsh
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
```

### Run MongoDB on MacOS or Linux:

Start Services mongodb

```sh
brew services start mongodb-community@8.0
```

Stop Services mongodb

```sh
brew services stop mongodb-community@8.0
```

```sh
./bin/mongod --dbpath ./data
```

### Run services using Docker

```sh
docker run --name mongodb -d -p 27017:27017 -v ~/data/db:/data/db mongo:8.0
```

## First deployment app Nodepop

First rename file env_tmp to .env and follow instructions this file.

On first deploy you can use the next command to initialize the database:

### ⚙️ Scripts disponibles

```sh
npm run initDB → Inicializa la base de datos con datos de ejemplo.
```

```sh
npm run dev → Inicia el servidor en modo desarrollo con nodemon.
```

```sh
npm run start → Inicia el servidor en modo producción.
```



### 🚀 Tecnologías y dependencias principales

- express, mongoose, ejs, express-session, connect-mongo, bcrypt, jsonwebtoken, express-validator, multer, nodemailer, socket.io, i18n, cors, dotenv, swagger-jsdoc, swagger-ui-express, chance, morgan, debug, http-errors, cookie-parser, nodemon.


# 📄 Environment configuration

> Rename the .env.example to .env and fill in the configuration fields with your configuration data:

- PORT=PORT example -> 3000
- NODEPOP_ENV=development
- SECRET_SESSION=Here secret string
- TIME_LIFE_SESSION=Here time in ms
- MONGO_URI=Here path to mongodb
- JWT_SECRET=Here Secret string

## Etherial configuration email development
- EMAIL_SERVICE_HOST=smtp.ethereal.email
- EMAIL_SERVICE_PORT=587
- EMAIL_SERVICE_SECURE=false
- EMAIL_SERVICE_USER=create one from https://ethereal.email/create
- EMAIL_SERVICE_PASSWORD=create one from https://ethereal.email/create
- EMAIL_SERVICE_FROM=user@nodepop.com




### 📖 Documentation

Available in http://localhost:3000/api-docs

### 📝 License

> This project is private and for educational or personal use.

> Enjoy programming with Nodepop! 🚀

