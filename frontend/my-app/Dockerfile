# Utiliser l'image officielle de Node.js comme image de base
FROM node:21

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

RUN rm -rf node_modules package-lock.json

# Copier les fichiers package.json et package-lock.json
COPY package*.json /app

# # Copier le reste des fichiers de l'application
COPY . .

# Installer les dépendances de l'application
RUN npm i

# Exposer le port sur lequel l'application s'exécute
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "run", "dev"]
