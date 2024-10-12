# Utiliser l'image officielle de Node.js comme image de base
FROM backend_base:1.0.1

# Définir le répertoire de travail dans le conteneur
ENV NODE_PATH=/app

# Exposer le port sur lequel l'application s'exécute
EXPOSE 9090

# Démarrer l'application
CMD ["npx", "nodemon", "server.js"]

