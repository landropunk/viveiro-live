# Guía de Despliegue - Viveiro Live

Esta guía explica cómo configurar la aplicación para diferentes entornos.

## 📋 Tabla de Contenidos

1. [Desarrollo Local (mismo PC)](#desarrollo-local-mismo-pc)
2. [Desarrollo en Red Local](#desarrollo-en-red-local)
3. [Producción](#producción)

---

## 🏠 Desarrollo Local (mismo PC)

### 1. Configurar `.env.local`

```bash
# Copiar configuración de desarrollo local
cp .env.local.development .env.local

# O manualmente agregar:
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 2. Configurar Supabase

Ve a: https://supabase.com/dashboard/project/mrkbskofbkkrkxqlyqir/auth/url-configuration

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs (una por línea):**
```
http://localhost:3000/**
http://localhost:3000/auth/callback
```

### 3. Iniciar servidor

```bash
pnpm dev
```

Accede desde: `http://localhost:3000`

---

## 🌐 Desarrollo en Red Local

### 1. Obtener tu IP local

```bash
ipconfig
```

Busca **Dirección IPv4** (ejemplo: `192.168.88.4`)

### 2. Configurar `.env.local`

```bash
# Copiar configuración de red local
cp .env.local.network .env.local

# O manualmente editar .env.local:
NEXT_PUBLIC_SITE_URL="http://192.168.88.4:3000"  # ⚠️ Usar tu IP real
```

### 3. Configurar Supabase

Ve a: https://supabase.com/dashboard/project/mrkbskofbkkrkxqlyqir/auth/url-configuration

**Site URL:**
```
http://192.168.88.4:3000
```

**Redirect URLs (una por línea):**
```
http://localhost:3000/**
http://192.168.88.4:3000/**
http://localhost:3000/auth/callback
http://192.168.88.4:3000/auth/callback
```

### 4. Iniciar servidor

```bash
pnpm dev
```

**Acceder desde:**
- **Mismo PC:** `http://localhost:3000` o `http://192.168.88.4:3000`
- **Otros PCs en la red:** `http://192.168.88.4:3000`

⚠️ **Nota:** La IP puede cambiar si reinicias el router. Verifica con `ipconfig` si no funciona.

---

## 🚀 Producción

### Opción A: Vercel (Recomendado)

#### 1. Preparar Dominio

1. Comprar dominio `viveiro.live` (o similar)
2. Configurar DNS apuntando a Vercel

#### 2. Desplegar en Vercel

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Desplegar
vercel
```

#### 3. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel (`vercel.com/tu-proyecto/settings/environment-variables`), agregar:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mrkbskofbkkrkxqlyqir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=https://viveiro.live
METEOGALICIA_API_KEY=e5Mx8wq...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...
NODE_ENV=production
```

#### 4. Configurar Supabase para Producción

Ve a: https://supabase.com/dashboard/project/mrkbskofbkkrkxqlyqir/auth/url-configuration

**Site URL:**
```
https://viveiro.live
```

**Redirect URLs (una por línea):**
```
https://viveiro.live/**
https://viveiro.live/auth/callback
https://www.viveiro.live/**
https://www.viveiro.live/auth/callback
https://*.vercel.app/**
```

#### 5. Configurar Dominio Personalizado en Vercel

1. Ve a `vercel.com/tu-proyecto/settings/domains`
2. Agrega `viveiro.live` y `www.viveiro.live`
3. Vercel te dará registros DNS para configurar

#### 6. Desplegar

```bash
vercel --prod
```

---

### Opción B: Servidor Propio (VPS)

#### 1. Servidor con Node.js

```bash
# Instalar dependencias
pnpm install

# Build para producción
pnpm build

# Iniciar servidor
pnpm start
```

#### 2. Configurar Variables de Entorno

Crear `.env.production.local` en el servidor:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mrkbskofbkkrkxqlyqir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=https://viveiro.live
METEOGALICIA_API_KEY=e5Mx8wq...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...
NODE_ENV=production
```

#### 3. Configurar Nginx (ejemplo)

```nginx
server {
    listen 80;
    server_name viveiro.live www.viveiro.live;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. Configurar HTTPS con Let's Encrypt

```bash
sudo certbot --nginx -d viveiro.live -d www.viveiro.live
```

#### 5. Process Manager (PM2)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start pnpm --name "viveiro-live" -- start

# Auto-inicio en reinicio
pm2 startup
pm2 save
```

---

## 🔄 Cambiar entre Entornos

### Desarrollo Local → Red Local

```bash
# 1. Cambiar .env.local
NEXT_PUBLIC_SITE_URL="http://192.168.88.4:3000"

# 2. Reiniciar servidor
# Ctrl+C para detener
pnpm dev

# 3. Actualizar Supabase Site URL a http://192.168.88.4:3000
```

### Red Local → Producción

```bash
# 1. Configurar variables en Vercel
# 2. Actualizar Supabase Site URL a https://viveiro.live
# 3. Desplegar
vercel --prod
```

---

## ✅ Checklist de Despliegue a Producción

- [ ] Dominio configurado y apuntando a Vercel/servidor
- [ ] Variables de entorno configuradas en Vercel/servidor
- [ ] `NEXT_PUBLIC_SITE_URL` apunta a dominio de producción
- [ ] Supabase Site URL actualizada a dominio de producción
- [ ] Supabase Redirect URLs incluyen dominio de producción
- [ ] HTTPS configurado (certificado SSL)
- [ ] OAuth providers configurados con URLs de producción
- [ ] Google Maps API key con restricciones de dominio
- [ ] MeteoGalicia API key válida
- [ ] Build de producción exitoso (`pnpm build`)
- [ ] Tests funcionando
- [ ] Analytics configurado (opcional)

---

## 🆘 Solución de Problemas

### OAuth no funciona después de cambiar URL

1. Verificar que `NEXT_PUBLIC_SITE_URL` coincide con Supabase Site URL
2. Verificar que Redirect URLs incluyen la URL actual
3. Limpiar cache del navegador
4. Reiniciar servidor

### "localhost" aparece en redirección OAuth

- El problema es que `NEXT_PUBLIC_SITE_URL` está configurado como `localhost`
- Cambiar a la IP de red local o dominio de producción
- Actualizar Supabase Site URL para coincidir

### IP local cambia constantemente

- Configurar IP estática en tu router para el PC del servidor
- O usar servicio como ngrok para desarrollo (no recomendado para producción)

---

## 📞 Soporte

Si tienes problemas, revisa:
1. Logs del servidor: `pnpm dev` o `pm2 logs`
2. Console del navegador (F12)
3. Supabase Auth logs: https://supabase.com/dashboard/project/mrkbskofbkkrkxqlyqir/auth/logs
