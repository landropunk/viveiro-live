#!/bin/bash
set -e

echo "🔧 Cargando variables de entorno desde .env.production..."
source /root/viveiro-live/.env.production

echo "✅ Variables cargadas:"
echo "  NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL"
echo "  NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL"
echo ""

echo "🐳 Iniciando build de Docker con variables explícitas..."
cd /root/viveiro-live

docker compose build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" \
  --build-arg METEOGALICIA_API_KEY="$METEOGALICIA_API_KEY" \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"

echo "✅ Build completado"
