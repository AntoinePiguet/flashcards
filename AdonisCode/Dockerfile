FROM node:20-alpine

WORKDIR /app

# Installer netcat pour vérifier la disponibilité de la base de données
RUN apk add --no-cache netcat-openbsd

# Copier les fichiers de l'application
COPY . .

# Installer les dépendances
RUN npm install

# Exposer le port
EXPOSE 3333

# Le point d'entrée sera défini dans docker-compose
CMD ["npm", "run", "dev"]