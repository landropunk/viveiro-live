#!/bin/bash

# ============================================================================
# Script de Despliegue - viveiro-live (Opción 2: Red Docker Compartida)
# ============================================================================
# Este script automatiza el despliegue del frontend en producción
# conectándolo a Supabase mediante red Docker compartida
# ============================================================================

set -e  # Salir si hay algún error

echo "============================================================================"
echo "🚀 DESPLIEGUE DE VIVEIRO-LIVE FRONTEND"
echo "============================================================================"
echo ""

# ==============================================================================
# PASO 1: Verificar que estamos en el servidor correcto
# ==============================================================================
echo "📋 Paso 1: Verificando servidor..."
if ! grep -q "185.223.31.88" /etc/hosts && ! ip addr | grep -q "185.223.31.88"; then
    echo "⚠️  ADVERTENCIA: No parece que estés en el servidor 185.223.31.88"
    read -p "¿Deseas continuar de todas formas? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "❌ Despliegue cancelado"
        exit 1
    fi
fi
echo "✅ Servidor verificado"
echo ""

# ==============================================================================
# PASO 2: Verificar archivo .env.production
# ==============================================================================
echo "📋 Paso 2: Verificando archivo .env.production..."
if [ ! -f ".env.production" ]; then
    echo "❌ ERROR: No se encuentra .env.production"
    echo "   Por favor, copia el archivo desde tu máquina local:"
    echo "   scp .env.production root@185.223.31.88:/root/viveiro-live/"
    exit 1
fi
echo "✅ Archivo .env.production encontrado"
echo ""

# ==============================================================================
# PASO 3: Crear red Docker compartida (si no existe)
# ==============================================================================
echo "📋 Paso 3: Configurando red Docker compartida..."
if docker network inspect viveiro-network &> /dev/null; then
    echo "✅ La red viveiro-network ya existe"
else
    echo "🔧 Creando red viveiro-network..."
    docker network create viveiro-network
    echo "✅ Red viveiro-network creada"
fi
echo ""

# ==============================================================================
# PASO 4: Conectar Kong a la red compartida (si no está conectado)
# ==============================================================================
echo "📋 Paso 4: Conectando Supabase Kong a la red compartida..."
if docker network inspect viveiro-network | grep -q "supabase-kong"; then
    echo "✅ Kong ya está conectado a viveiro-network"
else
    echo "🔧 Conectando supabase-kong a viveiro-network..."
    docker network connect viveiro-network supabase-kong
    echo "✅ Kong conectado a viveiro-network"
fi
echo ""

# ==============================================================================
# PASO 5: Verificar conectividad desde Kong
# ==============================================================================
echo "📋 Paso 5: Verificando conectividad de Kong..."
if docker exec supabase-kong ping -c 1 supabase-kong &> /dev/null; then
    echo "✅ Kong responde correctamente en la red"
else
    echo "⚠️  Advertencia: No se pudo verificar conectividad de Kong"
fi
echo ""

# ==============================================================================
# PASO 6: Detener contenedor anterior (si existe)
# ==============================================================================
echo "📋 Paso 6: Limpiando contenedor anterior..."
if docker ps -a | grep -q "viveiro-live"; then
    echo "🔧 Deteniendo y eliminando contenedor anterior..."
    docker compose down
    echo "✅ Contenedor anterior eliminado"
else
    echo "✅ No hay contenedor anterior"
fi
echo ""

# ==============================================================================
# PASO 7: Build de la imagen Docker
# ==============================================================================
echo "📋 Paso 7: Construyendo imagen Docker..."
echo "⏳ Este proceso puede tardar varios minutos..."
docker compose build --no-cache
echo "✅ Imagen construida exitosamente"
echo ""

# ==============================================================================
# PASO 8: Iniciar contenedor
# ==============================================================================
echo "📋 Paso 8: Iniciando contenedor..."
docker compose up -d
echo "✅ Contenedor iniciado"
echo ""

# ==============================================================================
# PASO 9: Esperar a que el contenedor esté saludable
# ==============================================================================
echo "📋 Paso 9: Esperando a que el contenedor esté listo..."
echo "⏳ Esperando 40 segundos (start_period del healthcheck)..."
sleep 40

for i in {1..10}; do
    if docker inspect viveiro-live | grep -q '"Status": "healthy"'; then
        echo "✅ Contenedor saludable y listo"
        break
    elif docker inspect viveiro-live | grep -q '"Status": "unhealthy"'; then
        echo "❌ ERROR: El contenedor no pasó el healthcheck"
        echo "📋 Logs del contenedor:"
        docker compose logs --tail=50
        exit 1
    else
        echo "⏳ Esperando... (intento $i/10)"
        sleep 10
    fi
done
echo ""

# ==============================================================================
# PASO 10: Verificar conectividad entre contenedores
# ==============================================================================
echo "📋 Paso 10: Verificando conectividad entre contenedores..."
if docker exec viveiro-live wget -q -O - http://supabase-kong:8000/auth/v1/health 2>&1 | grep -q "ok"; then
    echo "✅ Conectividad exitosa: viveiro-live → supabase-kong"
else
    echo "⚠️  Advertencia: No se pudo verificar conectividad con Kong"
    echo "   Esto es normal si Kong no tiene un endpoint /auth/v1/health público"
fi
echo ""

# ==============================================================================
# PASO 11: Mostrar estado de los contenedores
# ==============================================================================
echo "📋 Paso 11: Estado final de los contenedores..."
docker compose ps
echo ""

# ==============================================================================
# PASO 12: Mostrar información de la red
# ==============================================================================
echo "📋 Paso 12: Contenedores en viveiro-network..."
docker network inspect viveiro-network | grep -A 1 "Containers" || true
echo ""

# ==============================================================================
# RESUMEN FINAL
# ==============================================================================
echo "============================================================================"
echo "✅ DESPLIEGUE COMPLETADO"
echo "============================================================================"
echo ""
echo "📌 Frontend accesible en:"
echo "   - Contenedor: http://localhost:3000"
echo "   - Público (a través de NPM): https://viveiro.live"
echo ""
echo "📌 Verificar logs:"
echo "   docker compose logs -f"
echo ""
echo "📌 SIGUIENTE PASO MANUAL:"
echo "   Actualizar NPM (Nginx Proxy Manager) para que viveiro.live"
echo "   apunte a http://localhost:3000 (o http://185.223.31.88:3000)"
echo ""
echo "📌 Arquitectura de conexión:"
echo "   🌐 Cliente (navegador) → https://api.viveiro.live (NPM → Kong)"
echo "   🖥️  Servidor (Next.js) → http://supabase-kong:8000 (Red Docker)"
echo ""
echo "============================================================================"
