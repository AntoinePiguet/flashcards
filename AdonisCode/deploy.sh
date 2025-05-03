#!/bin/bash

# Installer les dépendances
npm install

# Installer PostgreSQL
npm install pg

# Construire l'application pour la production
npm run build

# Exécuter les migrations (à commenter si vous préférez les exécuter manuellement)
node bin/server.js ace migration:run --force

# Démarrer l'application
node bin/server.js