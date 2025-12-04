# ============================================================================
# Script de Despliegue desde Windows - viveiro-live
# ============================================================================
# Este script copia los archivos del proyecto al servidor y ejecuta el deploy
# ============================================================================

Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "🚀 DESPLIEGUE DE VIVEIRO-LIVE DESDE WINDOWS" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

$SERVER = "root@185.223.31.88"
$REMOTE_PATH = "/root/viveiro-live"
$LOCAL_PATH = $PSScriptRoot

# ==============================================================================
# PASO 1: Verificar que estamos en el directorio correcto
# ==============================================================================
Write-Host "📋 Paso 1: Verificando directorio local..." -ForegroundColor Yellow
if (-not (Test-Path "$LOCAL_PATH\package.json")) {
    Write-Host "❌ ERROR: No se encuentra package.json en $LOCAL_PATH" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Directorio verificado" -ForegroundColor Green
Write-Host ""

# ==============================================================================
# PASO 2: Crear tarball con los archivos necesarios
# ==============================================================================
Write-Host "📋 Paso 2: Creando tarball del proyecto..." -ForegroundColor Yellow
Write-Host "⏳ Excluyendo node_modules, .next, .git..." -ForegroundColor Gray

# Crear lista de archivos a excluir
$excludePatterns = @(
    "node_modules",
    ".next",
    ".git",
    ".env",
    ".env.local",
    ".env.development",
    "*.log",
    ".DS_Store",
    ".vscode",
    ".idea",
    "coverage",
    "dist",
    "build",
    "tmp",
    "temp",
    ".cache"
)

# Crear tarball temporal
$tarballName = "viveiro-live-deploy.tar.gz"
Write-Host "🔧 Creando $tarballName..." -ForegroundColor Gray

# Usar tar de Windows (disponible en Windows 10+)
tar -czf $tarballName `
    --exclude=node_modules `
    --exclude=.next `
    --exclude=.git `
    --exclude=.env `
    --exclude=.env.local `
    --exclude=.env.development `
    --exclude=*.log `
    --exclude=.vscode `
    --exclude=.idea `
    --exclude=coverage `
    --exclude=dist `
    --exclude=build `
    *

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: No se pudo crear el tarball" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tarball creado: $tarballName" -ForegroundColor Green
Write-Host ""

# ==============================================================================
# PASO 3: Copiar tarball al servidor
# ==============================================================================
Write-Host "📋 Paso 3: Copiando archivos al servidor..." -ForegroundColor Yellow
Write-Host "⏳ Servidor: $SERVER" -ForegroundColor Gray

scp $tarballName "${SERVER}:${REMOTE_PATH}/"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: No se pudo copiar el tarball al servidor" -ForegroundColor Red
    Remove-Item $tarballName -Force
    exit 1
}

Write-Host "✅ Archivos copiados al servidor" -ForegroundColor Green
Write-Host ""

# ==============================================================================
# PASO 4: Extraer archivos en el servidor
# ==============================================================================
Write-Host "📋 Paso 4: Extrayendo archivos en el servidor..." -ForegroundColor Yellow

ssh $SERVER "cd $REMOTE_PATH && tar -xzf $tarballName && rm $tarballName"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: No se pudieron extraer los archivos" -ForegroundColor Red
    Remove-Item $tarballName -Force
    exit 1
}

Write-Host "✅ Archivos extraídos correctamente" -ForegroundColor Green
Write-Host ""

# Limpiar tarball local
Remove-Item $tarballName -Force
Write-Host "🧹 Tarball local eliminado" -ForegroundColor Gray
Write-Host ""

# ==============================================================================
# PASO 5: Ejecutar script de despliegue en el servidor
# ==============================================================================
Write-Host "📋 Paso 5: Ejecutando deploy en el servidor..." -ForegroundColor Yellow
Write-Host "⏳ Este proceso puede tardar varios minutos..." -ForegroundColor Gray
Write-Host ""

ssh $SERVER "cd $REMOTE_PATH && chmod +x deploy.sh && ./deploy.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ERROR: Falló el despliegue en el servidor" -ForegroundColor Red
    Write-Host "   Revisa los logs con: ssh $SERVER 'cd $REMOTE_PATH && docker compose logs'" -ForegroundColor Yellow
    exit 1
}

# ==============================================================================
# RESUMEN FINAL
# ==============================================================================
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "✅ DESPLIEGUE COMPLETADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Frontend desplegado en: http://185.223.31.88:3000" -ForegroundColor White
Write-Host "📌 Próximo paso: Actualizar NPM para apuntar viveiro.live al puerto 3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "📌 Comandos útiles:" -ForegroundColor White
Write-Host "   Ver logs:   ssh $SERVER 'cd $REMOTE_PATH && docker compose logs -f'" -ForegroundColor Gray
Write-Host "   Estado:     ssh $SERVER 'cd $REMOTE_PATH && docker compose ps'" -ForegroundColor Gray
Write-Host "   Reiniciar:  ssh $SERVER 'cd $REMOTE_PATH && docker compose restart'" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
