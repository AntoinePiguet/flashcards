FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Build for production
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 10000

# Runtime environment variables will be provided by Render
CMD ["node", "bin/server.js"]