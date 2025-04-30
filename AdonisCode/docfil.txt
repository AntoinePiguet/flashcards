FROM node:20-alpine

WORKDIR /app

# Installer netcat pour vérifier la disponibilité de la base de données
RUN apk add --no-cache netcat-openbsd

# Copier d'abord package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Puis copier le reste des fichiers de l'application
COPY . .

# Exposer le port
EXPOSE 3333

# Le point d'entrée sera défini dans docker-compose
CMD ["npm", "run", "dev"]