**Directives To Start The Website In Dev Mode**

if you have docker desktop installed on your computer (if not, install docker desktop)

0. clone https://github.com/AntoinePiguet/flashcards
1. open a BASH terminal with a path going to /AdonisCode
2. run command: ./docker-start.sh
   it will create the containers, install the dependencies, do the migrations and start the server on localhost:${RandomPort}
3. Copy the localhost adress and paste it in your browser and bim you're on the website

# Step-by-Step Guide: Dockerizing flashcards

Starting with just an Adonis application and a Docker setup for the database, we'll build a complete containerized development environment.

## Prerequisites

- Docker Desktop installed on your pc
- The zip file from my git: https://github.com/AntoinePiguet/flashcards

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

- Generated an APP*KEY (this one is an exemple, to get an app_key, run this command: \_node ace generate:key*)
- Updated the DB_PORT to match the exposed MySQL port (6033)
- Updated the DB_DATABASE to your specific database name (db_flashcards)

## Step 4: Update the docker-compose.yml File

Update your `docker-compose.yml` to include the Adonis application:

```yaml
version: "3.8"

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# Step-by-Step Guide: Deploying an Adonis.js Application to fly.io

This guide explain the process of deploying a dockerized Adonis.js application to fly.io, including setting up a separate MySQL database instance on fly.io. Starting with an already dockerized application, we'll configure it for production deployment.

## Prerequisites

- An Adonis.js application already dockerized for development (flashcards)
  - you can download the dockerized app with my first realase at : https://github.com/AntoinePiguet/flashcards
- fly.io CLI installed and authenticated
- Basic knowledge of Docker and containerization

## Step 1: Install and Set Up the fly.io CLI

Before you can deploy to fly.io, you need to install and set up the fly.io CLI tool:

### For macOS:

```bash
# Using Homebrew
brew install flyctl

# Or using curl
curl -L https://fly.io/install.sh | sh
```

### For Windows:

```bash
# Using PowerShell
iwr https://fly.io/install.ps1 -useb | iex
```

### For Linux:

```bash
# Using curl
curl -L https://fly.io/install.sh | sh
```

After installation, add the fly binary to your PATH if the installer didn't do it automatically.

### Sign Up or Log In to fly.io:

```bash
# Sign up if you're new to fly.io
fly auth signup

# Or log in if you already have an account
fly auth login
```

## Step 2: Prepare Your Application for Production

Before deploying to fly.io, ensure your application is ready for production:

1. Update your `.env` file with production settings:

   - Set `NODE_ENV=production`
   - Make sure `APP_KEY` is securely generated
     - you can generate one with this command: _node ace generate:key_
   - Update database credentials for production
     ```
     DB_HOST=fly-db-hostname # Will be set to internal fly.io address later
     DB_PORT=3306 # Default MySQL port
     DB_USER=admin # As defined in your fly.toml for the database
     DB_PASSWORD=your_secure_password # Will be set as a secret
     DB_DATABASE=db-flashcards # As defined in your fly.toml for the database
     ```

2. Ensure your `package.json` includes dependencies for database connectivity:

   ```json
   {
     "dependencies": {
       "mysql": "^2.18.1"
     }
   }
   ```

3. Create or update scripts in `package.json` for production:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "build": "node ace build --production"
     }
   }
   ```

## Step 3: Deploy MySQL Database to fly.io

First, let's deploy the MySQL database as a separate application on fly.io.

1. Create a directory for your database deployment:

```bash
mkdir db-mysql && cd db-mysql
```

2. Create a `fly.toml` file for the MySQL database:

```toml
# fly.toml for database
app = 'db-flashcards'
primary_region = 'cdg'

[build]
  image = 'mysql:8.0.3'

[[vm]]
  memory = '2gb'
  cpu_kind = 'shared'
  cpus = 1

[processes]
  app = """--datadir /data/mysql \
   --default-authentication-plugin mysql_native_password"""

[mounts]
  source = "mysqldata"
  destination = "/data"

[env]
  MYSQL_DATABASE = "db-flashcards"
  MYSQL_USER = "admin"
```

3. Create a volume for persistent MySQL data:

```bash
fly volumes create mysqldata --region cdg --size 1
```

4. Set database secrets using fly.io secrets:

```bash
fly secrets set MYSQL_ROOT_PASSWORD=your_secure_password MYSQL_PASSWORD=your_user_password
```

5. Deploy the MySQL database:

```bash
fly deploy
```

## Step 4: Configure Your Adonis Application for fly.io

1. Return to your Adonis application directory:

```bash
cd ..
cd AdonisCode
```

2. Create a `fly.toml` file for your Adonis application:

```toml
app = 'flashcards-psep1g'
primary_region = 'fra'

[build]

[http_service]
  internal_port = 3333
  force_https = true
  auto_stop_machines = 'stop'
  auto_start_machines = true
  min_machines_running = 0
  processes = ['app']

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
  memory_mb = 1024
```

The important settings here are:

- `internal_port`: Must match the port your Adonis app listens on (3333)
- `auto_stop_machines`: Set to 'stop' to save costs when not in use
- `memory`: 1GB RAM for the application
- `primary_region`: Set close to your target audience (in this case 'fra' for Frankfurt)

3. Update your Dockerfile for production use:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application files
COPY . .

# Build for production if needed (for TypeScript)
RUN npm run build

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 3333

# Start the server
CMD ["npm", "start"]
```

## Step 5: Configure Database Connection for Production

Update your Adonis database configuration to use environment variables that will be set through fly.io:

1. Modify your `.env` file to use environment variables:

```
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_DATABASE=${DB_DATABASE}
```

2. Set database secrets on your application:

```bash
fly secrets set \
  DB_HOST=fdaa:0:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx \
  DB_PORT=3306 \
  DB_USER=admin \
  DB_PASSWORD=your_user_password \
  DB_DATABASE=db-flashcards \
  APP_KEY=your_secure_app_key
```

Replace `fdaa:0:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx` with the actual internal IPv6 address of your database VM.
(you can obtain it by running this command: _fly ips private -a db-flashcards_ db-flashcards is my db's name, obtain yours by runnig: _fly apps list_)

## Step 6: Deploy Your Adonis Application to fly.io

1. Initialize your application with fly.io:

```bash
fly launch --no-deploy
```

Select the appropriate options during the initialization process:

- Choose the same region as your database or nearby (e.g., 'fra')
- Skip automatic deployment when asked

2. Modify any generated configuration files if needed

3. Deploy your application:

```bash
fly deploy
```

4. Verify deployment:

```bash
fly status
```

5. Open your application in the browser:

```bash
fly open
```

## Step 7: Run Migrations and Seeds (if necessary)

After deployment, you might need to run database migrations:

```bash
fly ssh console -C "cd /app && node ace migration:run --force"
```

If you need to seed the database:

```bash
fly ssh console -C "cd /app && node ace db:seed --force"
```

## Step 8: Monitor Your Application

1. Check logs:

```bash
fly logs
```

2. Monitor resources:

```bash
fly status -a flashcards-psep1g
```

3. Scale your application if needed:

```bash
fly scale memory 2048 -a flashcards-psep1g
```

## Conclusion

You've now successfully deployed your Adonis.js application to fly.io with a separate MySQL database instance. This configuration provides:

- A scalable application that can be automatically stopped when not in use to save costs
- A persistent MySQL database with dedicated storage
- HTTPS enabled by default
- Centralized configuration through environment variables and secrets

This setup separates your database from your application, providing better scalability and making it easier to manage your database independently from your application code.

## Maintenance Tips

- **Database Backups**: Set up regular backups of your database volume
- **Monitoring**: Use `fly logs` and `fly status` to keep an eye on your application
- **Scaling**: Adjust the VM size based on your application's needs

## Useful documentation

the official fly.io documentation : https://fly.io/docs/
a good video about how to deploy an app for production using fly.io : https://www.youtube.com/watch?v=HGKO4FC_C70
the official documentation about dockerfiles : https://docs.docker.com/reference/dockerfile/

AI's are also useful if you encounter a problem or an error that you dont understand
i strongly recommand using Claude.ai or ChatGPT if you want an AI to help you build your project

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

# Staging Environment – FlashCards

## What is the staging environment?

The staging environment is a controlled replica of the FlashCards production environment, used to test new features before they go live.

It is intended for developers, testers, or product managers to:

- Verify that everything works correctly
- Identify potential bugs
- Approve changes before release

## What is its purpose in FlashCards?

- Test new features such as learning mode or flashcard management
- Validate database changes (migrations)
- Preview the user interface before production release
- Ensure backend ↔ frontend integration works smoothly
- Perform security or performance testing

## How to set up a staging environment

Here is the link to the production environment setup:

**👉 View the full procedure**

## Test Table for Staging

| Feature                      | Test Objective                               | Expected Result                           |
| ---------------------------- | -------------------------------------------- | ----------------------------------------- |
| User account creation        | Verify that registration works               | Redirect to the login page                |
| User login                   | Test with valid/invalid credentials          | Access denied if password is incorrect    |
| Deck creation                | Ensure a new deck can be created             | Deck appears on the homepage              |
| Deck modification            | Change a deck's name or description          | Information is updated                    |
| Deck deletion                | Delete an existing deck                      | Deck is removed                           |
| Adding flashcards            | Create a card with a question and answer     | Card appears in the deck                  |
| Learning mode                | Start a session and navigate through cards   | Proper display, progression is tracked    |
| Learning statistics          | Review multiple cards and finish the session | Correct display of final stats            |
| Error display                | Trigger an unauthorized or invalid action    | Clear error message                       |
| Responsive behavior (mobile) | Test UI on various screen sizes              | Smooth display without overflow           |
| Database migration           | Add a new column to a model                  | No errors, column is correctly added      |
| MySQL database connection    | Test access with the defined credentials     | Connection succeeds without Access Denied |
| Homepage loading             | Check load times                             | Less than 2 seconds                       |

## Conclusion

The staging environment plays a crucial role in the lifecycle of the FlashCards application. It allows testing of features in conditions close to production without impacting end users.

Thanks to this intermediate environment, you can:

- Identify bugs early
- Validate changes with the team or stakeholders
- Build confidence before every production deployment

By following best practices (isolated variables, dedicated database, systematic testing), the staging environment becomes a true safety net before going live.
