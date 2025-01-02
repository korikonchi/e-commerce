#!/bin/sh
until nc -z mysql-service 3306; do
  echo "Waiting for MySQL..."
  sleep 1
done
echo "MySQL is up!"