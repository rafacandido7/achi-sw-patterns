#!/bin/bash

KONG_ADMIN_URL="http://localhost:8001"

service_exists() {
  local service_name=$1
  response=$(curl -s -o /dev/null -w "%{http_code}" --url "$KONG_ADMIN_URL/services/$service_name")

  if [ "$response" -eq 200 ]; then
    return 0
  else
    return 1
  fi
}

route_exists() {
  local service_name=$1
  local path=$2

  response=$(curl -s --url "$KONG_ADMIN_URL/services/$service_name/routes")

  echo "$response" | grep -q "\"paths\": \[$path\]"

  if [ $? -eq 0 ]; then
    return 0
  else
    return 1
  fi
}

register_service() {
  local service_name=$1
  local service_url=$2

  if service_exists "$service_name"; then
    echo "Serviço '$service_name' já registrado no Kong."
  else
    echo "Registrando o serviço '$service_name' com URL '$service_url' no Kong..."

    curl -i -X POST --url "$KONG_ADMIN_URL/services/" \
      --data "name=$service_name" \
      --data "url=$service_url"

    if [ $? -eq 0 ]; then
      echo "Serviço '$service_name' registrado com sucesso."
    else
      echo "Falha ao registrar o serviço '$service_name'."
    fi
  fi
}

create_route() {
  local service_name=$1
  local path=$2
  local host=$3

  if route_exists "$service_name" "$path"; then
    echo "Rota para o serviço '$service_name' com caminho '$path' já existe."
  else
    curl -i -X POST --url "$KONG_ADMIN_URL/services/$service_name/routes" \
      --data "hosts[]=$host" \
      --data "paths[]=$path"

    if [ $? -eq 0 ]; then
      echo "Rota criada para o serviço '$service_name' com caminho '$path'."
    else
      echo "Falha ao criar a rota para o serviço '$service_name'."
    fi
  fi
}

auto_register_services() {
  services=("publisher-service" "routes-api")

  for service in "${services[@]}"; do
    service_url="http://$service:80"

    register_service "$service" "$service_url"

    service_path=$(echo "$service" | cut -d'-' -f1)

    create_route "$service" "/$service_path" "localhost"
  done
}

auto_register_services
