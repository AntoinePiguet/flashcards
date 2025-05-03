FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /AdonisCode

# Copier les fichiers de configuration pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Build pour la production
RUN npm run build

# Supprimer les devDependencies après le build
RUN npm prune --production

# Exposer le port
EXPOSE 10000

# Définir les variables d'environnement pour la production
ENV HOST=0.0.0.0
ENV PORT=10000
ENV NODE_ENV=production

# Le point d'entrée
CMD ["node", "bin/server.js"]