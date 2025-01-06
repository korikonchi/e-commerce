#!/bin/bash

COMMANDS=(
  "kubectl port-forward svc/mysql-service 3306:3306"
  "kubectl port-forward svc/redis-service 6380:6379"
)

GIT_BASH_PATH="C:/Program Files/Git/git-bash.exe"

for COMMAND in "${COMMANDS[@]}"; do
  "$GIT_BASH_PATH" -c "$COMMAND & exec bash" &
  sleep 1
done
echo "executing npm run dev..."
npm run dev