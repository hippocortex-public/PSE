# Dockerfile pour le frontend React
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Exposer le port de l'application
EXPOSE 5173

# Commande pour démarrer l'application en mode développement avec host exposé
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
