#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Variables
CONTAINER_NAME="mysql_container"
SQL_FILE="$SCRIPT_DIR/schema.sql"
SEED_FILE="$SCRIPT_DIR/seed.sql"
DB_NAME="test"
DB_USER="user"
DB_PASSWORD="password"

# Function to check if container is running
is_container_running() {
  docker ps | grep $CONTAINER_NAME >/dev/null
  return $?
}

reset_database() {
  docker exec -i $CONTAINER_NAME mysql -u $DB_USER -p$DB_PASSWORD -e "DROP DATABASE IF EXISTS $DB_NAME;"
  docker exec -i $CONTAINER_NAME mysql -u $DB_USER -p$DB_PASSWORD -e "CREATE DATABASE $DB_NAME;"
}

# Copy SQL and seed files to the container
docker cp $SQL_FILE $CONTAINER_NAME:/tmp/
docker cp $SEED_FILE $CONTAINER_NAME:/tmp/

# Execute the SQL and seed files inside the container
if is_container_running; then
  echo "Resetting the database..."
  reset_database
  echo "Database reset completed."

  docker exec -i $CONTAINER_NAME mysql -u $DB_USER -p$DB_PASSWORD -e "source /tmp/$(basename $SQL_FILE);" $DB_NAME
  echo "Database import completed successfully."

  docker exec -i $CONTAINER_NAME mysql -u $DB_USER -p$DB_PASSWORD -e "source /tmp/$(basename $SEED_FILE);" $DB_NAME
  echo "Seed file executed successfully."
else
  echo "Container $CONTAINER_NAME is not running. Please start the container and try again."
fi
