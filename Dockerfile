# Usa una imagen oficial de Node.js
FROM node:22-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias primero para aprovechar la cache de Docker
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto de tu código al contenedor
COPY . .

# Expone el puerto en el que corre tu app (ajústalo si tu server usa otro)
EXPOSE 3000

# Comando para arrancar tu app
CMD ["npm", "start"]
