# Utiliser l'image officielle de Node.js comme image de base
FROM node:21

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

RUN rm -rf node_modules package-lock.json

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Forcer la reconstruction de bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port sur lequel l'application s'exécute
EXPOSE 9090

# Démarrer l'application
CMD ["npm", "start"]
