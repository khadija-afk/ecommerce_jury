# Utiliser l'image officielle de Node.js comme image de base
FROM node:22

# Définir le répertoire de travail dans le conteneur
ENV NODE_PATH=/app

# Copier le reste des fichiers de l'application
COPY . .

RUN rm -rf node_modules package-lock.json

# Installer les dépendances de l'application
RUN npm install

# Forcer la reconstruction de bcrypt
RUN npm rebuild bcrypt --build-from-source

WORKDIR /app

# Exposer le port sur lequel l'application s'exécute
EXPOSE 9090

# Démarrer l'application
CMD ["npx", "nodemon", "server.js"]

