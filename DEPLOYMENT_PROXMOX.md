# 🚀 Guía de Deployment en Proxmox

Esta guía explica cómo desplegar la aplicación Viveiro Live en tu servidor Proxmox con Docker.

---

## 📋 Resumen de la Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    SERVIDOR PROXMOX                         │
│                   (TU_IP_SERVIDOR)                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌─────────────────────────┐  │
│  │  NPM Reverse     │  HTTPS  │  Docker Network         │  │
│  │  Proxy Manager   │ ────────┤  viveiro-network        │  │
│  └──────────────────┘         └─────────────────────────┘  │
│           │                              │                  │
│           ├─────────────────────────────┼─────────────────┐│
│           │                              │                 ││
│  ┌────────▼────────┐          ┌─────────▼──────┐         ││
│  │ viveiro.live    │          │ api.viveiro.   │         ││
│  │ → :3000         │          │ live → :8000   │         ││
│  └─────────────────┘          └────────────────┘         ││
│           │                              │                 ││
│  ┌────────▼──────────────────────────────▼──────────────┐ ││
│  │           CONTENEDOR: viveiro-live                   │ ││
│  │  ┌──────────────────────────────────────────────┐    │ ││
│  │  │  Next.js App (Puerto 3000)                   │    │ ││
│  │  │  - Frontend SSR                              │    │ ││
│  │  │  - API Routes                                │    │ ││
│  │  │  - Server Components                         │    │ ││
│  │  └──────────────────────────────────────────────┘    │ ││
│  │                        │                              │ ││
│  │              Comunicación interna                     │ ││
│  │                        │                              │ ││
│  │  ┌──────────────────────▼──────────────────────┐     │ ││
│  │  │  SUPABASE STACK (supabase-kong:8000)       │     │ ││
│  │  │  - PostgreSQL                               │     │ ││
│  │  │  - GoTrue (Auth)                            │     │ ││
│  │  │  - PostgREST (API)                          │     │ ││
│  │  │  - Kong (API Gateway)                       │     │ ││
│  │  └─────────────────────────────────────────────┘     │ ││
│  └───────────────────────────────────────────────────────┘ ││
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Prerequisitos

### En el Servidor Proxmox

✅ Docker y Docker Compose instalados
✅ Stack de Supabase corriendo en red Docker `viveiro-network`
✅ NPM (Nginx Proxy Manager) configurado con:
  - `viveiro.live` → `TU_IP_SERVIDOR:3000` (HTTPS)
  - `api.viveiro.live` → `supabase-kong:8000` (HTTPS)
✅ Certificados SSL configurados para ambos dominios

### En tu Máquina Local

✅ Acceso SSH al servidor: `ssh root@TU_IP_SERVIDOR`
✅ Git configurado con tu repositorio

---

## 📦 Paso 1: Preparar el Código

### 1.1 Crear `.env.production` con tus claves reales

⚠️ **IMPORTANTE**: El archivo `.env.production` NO está en Git por seguridad (contiene claves secretas).

```bash
# En tu máquina local

# Opción A: Copiar desde la plantilla
cp .env.production.example .env.production

# Opción B: Si ya tienes .env.production configurado
# Verifica que tiene las claves correctas
cat .env.production
```

**Edita `.env.production`** y configura tus claves reales:

```bash
# Editar con tu editor favorito
nano .env.production
# o
code .env.production
```

Debe contener (con tus claves reales):
```bash
NEXT_PUBLIC_SITE_URL="https://viveiro.live"  # ← CRÍTICO para OAuth
NEXT_PUBLIC_SUPABASE_URL="https://api.viveiro.live"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_clave_real_aqui"
SUPABASE_URL_INTERNAL="http://supabase-kong:8000"
METEOGALICIA_API_KEY="tu_clave_real_aqui"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu_clave_real_aqui"
NODE_ENV="production"
```

### 1.2 Commit y push de cambios (si hay cambios pendientes)

⚠️ **NO subas `.env.production` a Git** - ya está excluido en `.gitignore`

```bash
# Solo archivos seguros (sin secretos)
git add .gitignore .env.production.example DEPLOYMENT_PROXMOX.md docker-compose.yml

git commit -m "feat: Configurar deployment para producción en Proxmox

- Agregar .env.production al .gitignore para seguridad
- Crear .env.production.example como plantilla
- Agregar SUPABASE_URL_INTERNAL al docker-compose.yml
- Crear guía completa de deployment (DEPLOYMENT_PROXMOX.md)
- Solucionar redirección OAuth en viveiro.live
"

git push origin main
```

---

## 🚀 Paso 2: Desplegar en Proxmox

### 2.1 Conectar al servidor

```bash
ssh root@TU_IP_SERVIDOR
```

### 2.2 Ir al directorio del proyecto

```bash
cd /root/viveiro-live
```

### 2.3 Actualizar el código

```bash
# Hacer pull de los últimos cambios
git pull origin main

# O si es la primera vez, clonar el repositorio:
# git clone https://github.com/tu-usuario/viveiro-live.git
# cd viveiro-live
```

### 2.4 Copiar variables de entorno

⚠️ **CRÍTICO**: Como `.env.production` NO está en Git, debes copiarlo manualmente al servidor.

**Opción A: Copiar desde tu máquina local (RECOMENDADO)**
```bash
# Desde tu máquina local (NO desde SSH)
# Asegúrate de que .env.production existe y tiene tus claves reales
scp .env.production root@TU_IP_SERVIDOR:/root/viveiro-live/.env.production
```

**Opción B: Crear directamente en el servidor**
```bash
# Desde SSH en el servidor
cd /root/viveiro-live

# Copiar desde la plantilla
cp .env.production.example .env.production

# Editar y poner tus claves reales
nano .env.production

# Configurar:
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (tu clave real)
# - METEOGALICIA_API_KEY (tu clave real)
# - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (tu clave real)

# Guardar: Ctrl+O, Enter, Ctrl+X
```

### 2.5 Verificar variables de entorno

```bash
# Verificar que .env.production tiene las variables correctas
cat .env.production | grep NEXT_PUBLIC_SITE_URL

# Debe mostrar:
# NEXT_PUBLIC_SITE_URL="https://viveiro.live"
```

### 2.6 Detener contenedor antiguo (si existe)

```bash
docker compose down
```

### 2.7 Construir la nueva imagen

```bash
# Build sin caché para asegurar que usa las nuevas variables
docker compose build --no-cache
```

### 2.8 Lanzar el contenedor

```bash
docker compose up -d
```

### 2.9 Verificar que está corriendo

```bash
# Ver estado del contenedor
docker compose ps

# Debería mostrar:
# NAME            STATUS          PORTS
# viveiro-live    Up 10 seconds   0.0.0.0:3000->3000/tcp
```

### 2.10 Ver logs en tiempo real

```bash
docker compose logs -f app

# Presiona Ctrl+C para salir de los logs
```

---

## ✅ Paso 3: Verificar que Funciona

### 3.1 Verificar salud del contenedor

```bash
curl http://localhost:3000/api/health
# Debe devolver: {"status":"ok"}
```

### 3.2 Probar desde el navegador

Abre en tu navegador: **https://viveiro.live**

1. ✅ La página debe cargar correctamente
2. ✅ Click en "Iniciar sesión" o "Registrarse"
3. ✅ Click en "Continuar con Google"
4. ✅ Después de autenticarte con Google, **debe redirigir a https://viveiro.live/dashboard**
5. ✅ **NO debe redirigir a "/" o a localhost**

### 3.3 Verificar variables en el contenedor

```bash
# Ver variables de entorno del contenedor
docker exec viveiro-live env | grep -E '(NEXT_PUBLIC_SITE_URL|NEXT_PUBLIC_SUPABASE_URL)'

# Debe mostrar:
# NEXT_PUBLIC_SITE_URL=https://viveiro.live
# NEXT_PUBLIC_SUPABASE_URL=https://api.viveiro.live
```

---

## 🐛 Troubleshooting

### Error: "OAuth redirige a localhost"

**Síntoma**: Después de login con Google, te lleva a `http://localhost:3000/dashboard`

**Causa**: El contenedor no está usando las variables de `.env.production`

**Solución**:
```bash
# 1. Verificar que .env.production existe
ls -la /root/viveiro-live/.env.production

# 2. Verificar contenido
cat /root/viveiro-live/.env.production | grep NEXT_PUBLIC_SITE_URL

# 3. Si está mal, corregir y reconstruir:
nano /root/viveiro-live/.env.production
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Error: "Cannot connect to Supabase"

**Síntoma**: Errores 500 o "Failed to fetch" en el navegador

**Causa**: El contenedor no puede comunicarse con Supabase

**Solución**:
```bash
# 1. Verificar que Supabase está corriendo
docker ps | grep supabase

# 2. Verificar que están en la misma red Docker
docker network inspect viveiro-network

# Debería mostrar tanto viveiro-live como supabase-kong

# 3. Probar conexión interna desde el contenedor
docker exec viveiro-live wget -q -O - http://supabase-kong:8000/auth/v1/health
```

### Error: "502 Bad Gateway" en viveiro.live

**Síntoma**: NPM muestra error 502

**Causa**: El contenedor viveiro-live no está corriendo o no responde en :3000

**Solución**:
```bash
# 1. Verificar estado del contenedor
docker compose ps

# 2. Ver logs para encontrar el error
docker compose logs --tail=50 app

# 3. Reiniciar contenedor
docker compose restart

# 4. Si sigue fallando, reconstruir
docker compose down
docker compose up -d
```

### Ver logs detallados del contenedor

```bash
# Últimas 100 líneas
docker compose logs --tail=100 app

# Seguir logs en tiempo real
docker compose logs -f app

# Ver logs de un período específico
docker compose logs --since 30m app
```

---

## 🔄 Actualizaciones Futuras

Cuando hagas cambios en el código:

```bash
# En tu máquina local
git add .
git commit -m "Descripción del cambio"
git push origin main

# En el servidor Proxmox
ssh root@TU_IP_SERVIDOR
cd /root/viveiro-live
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d

# Verificar que funciona
docker compose logs -f app
```

---

## 📝 Comandos Útiles

```bash
# Ver contenedores corriendo
docker compose ps

# Reiniciar sin reconstruir
docker compose restart

# Detener contenedor
docker compose down

# Detener y eliminar volúmenes
docker compose down -v

# Ver uso de recursos
docker stats viveiro-live

# Acceder a shell del contenedor
docker exec -it viveiro-live sh

# Ver redes Docker
docker network ls

# Inspeccionar red viveiro-network
docker network inspect viveiro-network
```

---

## 🔐 Configuración de OAuth en Google

Para que OAuth funcione correctamente, verifica en **Google Cloud Console**:

1. Ve a: https://console.cloud.google.com/apis/credentials
2. Selecciona tu OAuth 2.0 Client ID
3. En **Authorized JavaScript origins**, debe estar:
   ```
   https://viveiro.live
   ```
4. En **Authorized redirect URIs**, debe estar:
   ```
   https://api.viveiro.live/auth/v1/callback
   ```

Y en **Supabase Dashboard** (https://api.viveiro.live):

1. Ve a: Authentication → URL Configuration
2. **Site URL** debe ser:
   ```
   https://viveiro.live
   ```
3. **Redirect URLs** debe incluir:
   ```
   https://viveiro.live/**
   ```

---

## ✅ Checklist de Deployment

- [ ] `.env.production` creado con variables correctas
- [ ] `NEXT_PUBLIC_SITE_URL="https://viveiro.live"` configurado
- [ ] Código commiteado y pusheado a Git
- [ ] SSH al servidor Proxmox exitoso
- [ ] `git pull` ejecutado en `/root/viveiro-live`
- [ ] `.env.production` copiado al servidor
- [ ] `docker compose build --no-cache` completado sin errores
- [ ] `docker compose up -d` ejecutado
- [ ] Contenedor `viveiro-live` corriendo (check con `docker compose ps`)
- [ ] `https://viveiro.live` carga correctamente
- [ ] OAuth con Google redirige a `https://viveiro.live/dashboard` ✅
- [ ] No hay redirección a localhost ✅

---

**🎉 Si todos los checks están ✅, el deployment fue exitoso!**
