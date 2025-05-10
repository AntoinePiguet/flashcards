if you have docker desktop installed on your computer, 
1) open a BASH terminal with a path going to /AdonisCode
2) run command: ./docker-start.sh
it will create the containers, install the dependencies, do the migrations and start the server on localhost:3333


# Step-by-Step Guide: Dockerizing flashcards

Starting with just an Adonis application and a Docker setup for the database, we'll build a complete containerized development environment.

## Prerequisites

* Docker Desktop installed on your pc
* The zip file from my git: https://github.com/AntoinePiguet/flashcards

## Step 1: Analyze the Current Setup

Initially, you have:
- An Adonis.js application running locally
- A `docker-compose.yml` file that only sets up MySQL and phpMyAdmin

The original `docker-compose.yml` only manages the database infrastructure, not the application itself.
At the en of this step-by-step guide, you'll be able to start completely your application only by starting a script

## Step 2: Create a Dockerfile for the Adonis Application

Create a `Dockerfile` in the root of your project:
(here the root directory isn't /flashcards, but /flashcards/AdonisCode because that's the root directory for the code, not the project itself.)

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install netcat to check database availability
RUN apk add --no-cache netcat-openbsd

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Expose the port
EXPOSE 3333

# Entry point will be defined in docker-compose
CMD ["npm", "run", "dev"]
```

This Dockerfile:
- Uses Node.js 20 with Alpine Linux
- Sets up the "root" directory where we will do all our commands (visualize it as opening a terminal in a directory)
- Installs netcat (used to check if the database is ready before starting the app)
- Copies all application files
- Installs dependencies
- Exposes port 3333 (default Adonis port)
- Sets the default command to run the development server

## Step 3: Update Environment Configuration

1. Create a proper `.env` file based on the `.env.example` (it's in /AdonisCode):

```
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=uvaH65NR4ODuX4xzBdEb8DNlcNmfNQQX 
NODE_ENV=development
SESSION_DRIVER=cookie
DB_HOST=127.0.0.1
DB_PORT=6033
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=db_flashcards
```

Key changes from the example:
- Generated an APP_KEY (this one is an exemple, to get an app_key, run this command: "node ace generate:key")
- Updated the DB_PORT to match the exposed MySQL port (6033)
- Updated the DB_DATABASE to your specific database name (db_flashcards)

## Step 4: Update the docker-compose.yml File

Update your `docker-compose.yml` to include the Adonis application:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0.30
    container_name: db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: db_flashcards
    ports:
      - "6033:3306"
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - app-network

  phpmyadmin:
    image: phpmyadmin:5.2.0
    container_name: pma
    depends_on:
      - db
    environment:
      PMA_HOST: db
      PMA_PORT: 3306
      PMA_ARBITRARY: 1
    ports:
      - 8081:80
    networks:
      - app-network

  app:
    build: .
    container_name: adonis-app
    depends_on:
      - db
    ports:
      - "3333:3333"
    environment:
      TZ: UTC
      HOST: 0.0.0.0
      PORT: 3333
      NODE_ENV: development
      APP_KEY: 1emDYkK9Xzrj1eWyXFUiytAXl8Wvdfv4
      DB_CONNECTION: mysql
      DB_HOST: db
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: root
      DB_DATABASE: db_flashcards
    volumes:
      - ./:/app
      - /app/node_modules
    networks:
      - app-network
    command: >
      sh -c "
        echo 'Waiting for MySQL...'
        until nc -z db 3306; do
          sleep 1
        done
        echo 'MySQL is ready!'
        node ace migration:run --force
        node ace db:seed --force || echo 'Seeds may have failed, but continuing...'
        npm run dev
      "

networks:
  app-network:

volumes:
  dbdata:
```

Key changes:
- Updated to version '3.8' for newer Docker Compose features
- Added a network to connect all services
- Added the `app` service for the Adonis application
- Environment variables directly in the docker-compose file
- Changed the database configuration to point to the container name instead of localhost
- Added a startup command that:
  - Waits for the database to be available
  - Runs migrations
  - Seeds the database (with error handling)
  - Starts the development server
- Added volume mounts for live code reloading
- Updated the database settings to create the correct database

## Step 5: Create a Helper Script for Docker Operations

Create a `docker-start.sh` script for easier Docker management:
(it let you start everything with only one command)
```bash
#!/bin/bash

case "$1" in
  "clean")
    echo "Stopping and removing all containers and volumes..."
    docker-compose down -v
    ;;
  *)
    echo "Stopping any running containers..."
    docker-compose down

    echo "Building and starting containers..."
    docker-compose up --build -d

    echo "Showing logs (press Ctrl+C to exit logs but keep containers running)..."
    docker-compose logs -f app
    ;;
esac
```

Make it executable:
(to be able to start it the first time you have to give permission with this command)
```bash
chmod +x docker-start.sh
```

This script:
- Has a default mode to build and start containers
- Has a "clean" mode to remove all containers and volumes
- Shows application logs after starting

## Step 6: Test the Dockerized Application Locally

1. Start the Docker environment:

```bash
./docker-start.sh
```
2. Access the application at http://localhost:3333

3. Access phpMyAdmin at http://localhost:8081



## Conclusion

You've now successfully dockerized flashcards for local development. 

The complete dockerized setup includes:
- A MySQL database container
- A phpMyAdmin container for database management
- the Adonis.js application container with live code reloading (flashcards)
