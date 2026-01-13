# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose le port défini par l'environnement
EXPOSE ${PORT}

# Démarre le serveur en utilisant la variable d'environnement
CMD ["node", "server.js"]
