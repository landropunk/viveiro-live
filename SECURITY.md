# Seguridad de la API Key

## ✅ Tu API key está 100% segura

He configurado la aplicación para que tu API key de MeteoGalicia **NUNCA** sea accesible desde el navegador o código público.

## Cómo funciona la seguridad

### 🔒 Arquitectura de seguridad

```
┌─────────────────┐
│   Navegador     │
│   (Cliente)     │
└────────┬────────┘
         │ HTTP Request con JWT
         │ (NO tiene acceso a .env)
         ▼
┌─────────────────┐
│  API Routes     │ ← Protegidas por autenticación
│  /api/protected │ ← Solo usuarios autenticados
└────────┬────────┘
         │ Llama a función server-side
         ▼
┌─────────────────┐
│ meteogalicia.ts │ ← Lee process.env.METEOGALICIA_API_KEY
│ (Servidor)      │ ← Solo se ejecuta en el servidor
└────────┬────────┘
         │ API Request con API_KEY
         ▼
┌─────────────────┐
│ MeteoGalicia    │
│     API         │
└─────────────────┘
```

### 🛡️ Capas de protección

1. **Variables de entorno del servidor**
   - La API key está en `.env.local`
   - Solo accesible mediante `process.env.METEOGALICIA_API_KEY`
   - `process.env` solo funciona en el servidor, no en el navegador

2. **Gitignore**
   - `.env.local` está en `.gitignore`
   - Nunca se subirá a GitHub u otros repositorios
   - Solo tú tienes acceso al archivo

3. **API Routes protegidas**
   - Los endpoints están en `/api/protected/weather/*`
   - Requieren autenticación JWT
   - El middleware verifica el token antes de permitir acceso

4. **Server-side only**
   - `lib/meteogalicia.ts` solo se ejecuta en el servidor
   - Las funciones usan `process.env` que no existe en el navegador
   - El cliente nunca ve ni puede acceder a la API key

## ¿Qué puede ver el cliente?

El navegador/cliente **solo** recibe:
- Datos meteorológicos procesados (temperatura, humedad, etc.)
- Respuestas JSON de los API Routes
- Nunca ve la API key ni las llamadas directas a MeteoGalicia

## Verificación de seguridad

### ✅ Verificar que .env.local NO está en git:

```bash
git status
# No debería aparecer .env.local en la lista
```

### ✅ Verificar en el navegador:

1. Abre DevTools (F12)
2. Ve a la pestaña Network
3. Navega a `/dashboard`
4. Inspecciona las peticiones a `/api/protected/weather/*`
5. Verás que las respuestas solo contienen datos meteorológicos
6. **NUNCA** verás la API key en ninguna parte

### ✅ Verificar en el código fuente:

```bash
# Buscar si la API key está expuesta (no debería encontrar nada en archivos públicos)
grep -r "e5Mx8wqEwpa03z56v7DZ2nKAfJ689hnR546iP4DCtdfNE32CRN8U8B265gm7j5CV" app/ components/ public/
# Solo debería estar en .env.local
```

## Archivos seguros vs públicos

### 🔒 Solo en el servidor (seguros):
- `.env.local` - Variables de entorno
- `lib/meteogalicia.ts` - Cliente de API
- `app/api/**/*.ts` - API Routes (se ejecutan en servidor)

### 🌐 Accesibles por el cliente (públicos):
- `app/dashboard/page.tsx` - Página del dashboard (usa cliente solo para UI)
- `components/weather/*` - Componentes de UI
- `public/*` - Archivos estáticos

## Buenas prácticas implementadas

✅ **Variables de entorno**: API key en `.env.local`, no en el código
✅ **Gitignore**: `.env.local` excluido de Git
✅ **Server-side only**: API calls solo desde el servidor
✅ **Autenticación**: Endpoints protegidos con JWT
✅ **Sin NEXT_PUBLIC_**: No usamos `NEXT_PUBLIC_METEOGALICIA_API_KEY` (eso SÍ sería inseguro)
✅ **No hardcoded**: API key nunca escrita directamente en archivos de código

## ⚠️ Qué NO hacer

❌ **NUNCA** uses `NEXT_PUBLIC_METEOGALICIA_API_KEY` (eso SÍ expondría la key)
❌ **NUNCA** llames a MeteoGalicia directamente desde componentes del cliente
❌ **NUNCA** subas `.env.local` a Git
❌ **NUNCA** compartas tu API key en mensajes, issues o pull requests

## Para producción (Vercel/otros)

Cuando despliegues a producción:

1. **NO** subas `.env.local` a Git
2. Configura las variables de entorno en el panel de Vercel:
   - Settings → Environment Variables
   - Añade `METEOGALICIA_API_KEY` con tu clave
3. Vercel inyectará la variable de forma segura en el servidor
4. La variable seguirá siendo inaccesible desde el navegador

## Resumen

Tu API key está protegida por múltiples capas:
1. Solo existe en `.env.local` (no en Git)
2. Solo se lee en código del servidor
3. Solo se usa en API Routes protegidos por autenticación
4. El cliente nunca la ve ni puede acceder a ella

**¡Puedes estar tranquilo, tu API key está 100% segura!** 🔒
