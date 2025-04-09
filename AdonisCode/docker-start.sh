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