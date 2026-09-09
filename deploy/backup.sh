#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_PATH:?DEPLOY_PATH is required}"
[[ "$DEPLOY_PATH" == /home/mwk/apps/portfolio ]] || { echo 'Unexpected deploy path'; exit 1; }
umask 077
if [[ "${1:-release}" == sqlite ]]; then
  : "${BACKUP_DIR:?BACKUP_DIR is required}"
  if [[ -f "$BACKUP_DIR/container-id" ]]; then
    container_id=$(<"$BACKUP_DIR/container-id")
    docker stop "$container_id"
    mkdir "$BACKUP_DIR/sqlite"
    docker cp "$container_id:/data/." "$BACKUP_DIR/sqlite/"
  fi
  exit 0
fi
backup_dir=$(mktemp -d "$DEPLOY_PATH/backups/release-XXXXXXXX")
echo "BACKUP_DIR=$backup_dir" >> "${GITHUB_ENV:?GITHUB_ENV is required}"
for name in docker-compose.prod.yml .env.production .deploy.env; do
  if [[ -f "$DEPLOY_PATH/$name" ]]; then
    cp "$DEPLOY_PATH/$name" "$backup_dir/$name"
  fi
done
if [[ -f "$DEPLOY_PATH/.deploy.env" && -f "$DEPLOY_PATH/docker-compose.prod.yml" ]]; then
  cd "$DEPLOY_PATH"
  compose=(docker compose --env-file .deploy.env -f docker-compose.prod.yml)
  container_id=$("${compose[@]}" ps -a -q app)
  if [[ -n "$container_id" ]]; then
    volume=$(docker inspect --format '{{range .Mounts}}{{if eq .Destination "/data"}}{{.Name}}{{end}}{{end}}' "$container_id")
    if [[ -n "$volume" ]]; then
      # Save the identity now; stop writers only after the new image is downloaded.
      printf '%s\n' "$container_id" > "$backup_dir/container-id"
    fi
  fi
fi
echo "Backup saved: $backup_dir"
