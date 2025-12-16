# 📊 ANÁLISIS EXHAUSTIVO DEL PROYECTO VIVEIRO-LIVE

**Fecha**: 15 de Diciembre de 2025
**Versión actual**: Next.js 14.2.33 + React 18.3.1
**Objetivo**: Refactorización completa de autenticación y limpieza profunda

---

## 🎯 RESUMEN EJECUTIVO

### Estado Actual
- **107 directorios** en el proyecto
- **110 archivos** de código (TS/TSX/JS/JSX)
- **21 componentes** reutilizables
- **4 hooks** personalizados
- **1 context** (AuthContext)
- **~50 páginas/rutas** entre públicas, protegidas y admin

###  Problemas Críticos Identificados
1. ❌ **Errores persistentes de "Server Action"** en Next.js 15
2. ❌ **OAuth Google no funcional** (502 Bad Gateway)
3. ❌ **Login con email/password tampoco funciona**
4. ❌ **Sistema de autenticación mezclado y complejo**
5. ⚠️ **Dependencia obsoleta**: `@supabase/auth-helpers-nextjs` (NO se usa en código pero está en package.json)
6. ⚠️ **Rutas de debug/test** sin eliminar
7. ⚠️ **Secciones placeholder** (seccion5, seccion6) sin contenido

---

## 📁 ESTRUCTURA COMPLETA DEL PROYECTO

```
viveiro-live/
├── app/                                    # Next.js App Router
│   ├── (public)/                          # Rutas públicas
│   │   ├── page.tsx                       # Landing page ✅
│   │   └── blog/[slug]/page.tsx           # Blog posts ✅
│   │
│   ├── (protected)/dashboard/             # Rutas protegidas
│   │   ├── page.tsx                       # Dashboard principal ✅
│   │   ├── eventos/page.tsx               # Live/Play streams ✅
│   │   ├── historicos/page.tsx            # Datos históricos ✅
│   │   ├── meteo/
│   │   │   ├── page.tsx                   # Meteorología ✅
│   │   │   └── station/[id]/page.tsx     # Estación específica ✅
│   │   ├── profile/page.tsx               # Perfil usuario ✅
│   │   ├── webcams/page.tsx               # Webcams ✅
│   │   ├── seccion5/page.tsx              # ❌ ELIMINAR (placeholder)
│   │   └── seccion6/page.tsx              # ❌ ELIMINAR (placeholder)
│   │
│   ├── (admin)/admin/                     # Panel administración
│   │   ├── page.tsx                       # Dashboard admin ✅
│   │   ├── blog/                          # Gestión blog ✅
│   │   ├── live-streams/                  # Gestión streams ✅
│   │   ├── settings/                      # Configuración ✅
│   │   ├── users/                         # Gestión usuarios ✅
│   │   ├── webcams/page.tsx               # Gestión webcams ✅
│   │   └── debug/                         # ❌ ELIMINAR (debug tools)
│   │       ├── test-auth/page.tsx
│   │       └── test-supabase/page.tsx
│   │
│   ├── (auth)/                            # Autenticación
│   │   ├── auth/
│   │   │   ├── forgot-password/page.tsx   # ❌ ELIMINAR
│   │   │   └── reset-password/page.tsx    # ❌ ELIMINAR
│   │   └── complete-profile/page.tsx      # ✅ MANTENER
│   │
│   ├── auth/                              # Sistema auth actual
│   │   ├── login/page.tsx                 # ❌ ELIMINAR Y RECREAR
│   │   ├── register/page.tsx              # ❌ ELIMINAR
│   │   └── callback/route.ts              # 🔧 REFACTORIZAR
│   │
│   ├── api/                               # API Routes
│   │   ├── admin/                         # APIs admin ✅
│   │   ├── auth/
│   │   │   ├── forgot-password/route.ts   # ❌ ELIMINAR
│   │   │   └── reset-password/route.ts    # ❌ ELIMINAR
│   │   ├── dashboard/                     # APIs dashboard ✅
│   │   ├── protected/                     # APIs protegidas ✅
│   │   │   ├── historicos/
│   │   │   ├── me/
│   │   │   ├── stations/
│   │   │   └── weather/
│   │   ├── user/                          # APIs usuario ✅
│   │   ├── webcams/                       # APIs webcams ✅
│   │   └── health/route.ts                # Health check ✅
│   │
│   ├── about/page.tsx                     # Página about ✅
│   └── layout.tsx                         # Layout principal ✅
│
├── components/                            # Componentes reutilizables
│   ├── admin/                             # Componentes admin ✅
│   │   ├── BlogPostForm.tsx
│   │   └── LiveStreamForm.tsx
│   ├── cookies/                           # Gestión cookies ✅
│   │   ├── CookieBanner.tsx
│   │   ├── CookieSettings.tsx
│   │   └── CookieConsentManager.tsx
│   ├── stations/                          # Componentes estaciones ✅
│   │   ├── HistoricalChart.tsx
│   │   ├── HistoricalDataSection.tsx
│   │   ├── StationComparisonChart.tsx
│   │   ├── StationDataCard.tsx
│   │   ├── StationDetailCard.tsx
│   │   ├── StationSelector.tsx
│   │   ├── StationsMap.tsx
│   │   ├── StationsView.tsx
│   │   └── VariableSelector.tsx
│   ├── weather/                           # Componentes clima ✅
│   │   ├── CurrentWeatherCard.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── HourlyForecast.tsx
│   │   └── UVWidget.tsx
│   ├── webcams/                           # Componentes webcams ✅
│   │   └── WebcamCard.tsx
│   ├── AnimatedSection.tsx                # Animaciones ✅
│   └── Header.tsx                         # Header ✅
│
├── contexts/                              # Contextos React
│   └── AuthContext.tsx                    # 🔧 SIMPLIFICAR (eliminar email/password)
│
├── hooks/                                 # Hooks personalizados
│   ├── useCookieConsent.ts                # ✅ Gestión cookies
│   ├── useDashboardConfig.ts              # ✅ Config dashboard
│   ├── useIsAdmin.ts                      # ✅ Verificar admin
│   └── useSiteName.ts                     # ✅ Nombre sitio
│
├── lib/                                   # Librerías y utilidades
│   ├── admin/                             # Utils admin ✅
│   ├── supabase/                          # 🔧 REFACTORIZAR TODO
│   │   ├── client.ts                      # Cliente browser
│   │   ├── server.ts                      # Cliente server
│   │   └── middleware.ts                  # Helper middleware
│   ├── cookies.ts                         # Gestión cookies ✅
│   ├── meteogalicia.ts                    # API MeteoGalicia ✅
│   ├── meteogalicia-historical-real.ts    # Históricos real ✅
│   ├── meteogalicia-hourly-historical.ts  # Históricos horarios ✅
│   ├── meteogalicia-stations.ts           # Estaciones ✅
│   ├── settings.ts                        # Settings ✅
│   └── utils.ts                           # Utilidades ✅
│
├── public/                                # Archivos estáticos ✅
├── supabase/migrations/                   # Migraciones DB ✅
├── __tests__/                             # Tests ✅
│
├── .env.local                             # Variables locales
├── .env.production                        # Variables producción
├── docker-compose.yml                     # Docker config
├── Dockerfile                             # Docker build
├── middleware.ts                          # 🔧 SIMPLIFICAR
├── next.config.mjs                        # ⚠️ Falta eslint config
├── package.json                           # ⚠️ Tiene dependencia obsoleta
├── tailwind.config.ts                     # ✅ OK
├── tsconfig.json                          # ✅ OK
└── eslint.config.mjs                      # ✅ OK
```

---

## 🗑️ ARCHIVOS A ELIMINAR (15 archivos)

### 1. Sistema de autenticación email/password (6 archivos)
```
❌ app/auth/login/page.tsx
❌ app/auth/register/page.tsx
❌ app/(auth)/auth/forgot-password/page.tsx
❌ app/(auth)/auth/reset-password/page.tsx
❌ app/api/auth/forgot-password/route.ts
❌ app/api/auth/reset-password/route.ts
```

### 2. Páginas de debug/test (3 archivos)
```
❌ app/(admin)/admin/debug/test-auth/page.tsx
❌ app/(admin)/admin/debug/test-supabase/page.tsx
❌ app/(admin)/admin/debug/api/ (directorio completo)
```

### 3. Secciones placeholder no utilizadas (2 archivos)
```
❌ app/(protected)/dashboard/seccion5/page.tsx
❌ app/(protected)/dashboard/seccion6/page.tsx
```

### 4. Archivos de configuración obsoletos
```
❌ lib/supabase/auth-helpers.ts (si existe)
```

### 5. Archivos temporales y basura
```
❌ nul (archivo vacío)
❌ tsconfig.tsbuildinfo
❌ package-lock.json (usar solo pnpm-lock.yaml)
```

---

## 🔧 ARCHIVOS A REFACTORIZAR (8 archivos críticos)

### 1. Sistema de autenticación Supabase
```typescript
// lib/supabase/client.ts
🔧 Simplificar y quitar console.logs

// lib/supabase/server.ts
🔧 Eliminar lógica de SUPABASE_URL_INTERNAL
🔧 Usar solo NEXT_PUBLIC_SUPABASE_URL

// lib/supabase/middleware.ts
🔧 Ya modificado, pero simplificar más
🔧 Eliminar verificación de complete-profile si no se usa

// middleware.ts
🔧 Simplificar matcher
🔧 Optimizar para evitar errores de Server Action
```

### 2. Context y hooks
```typescript
// contexts/AuthContext.tsx
🔧 Eliminar signIn, signUp (email/password)
🔧 Mantener solo signInWithGoogle
🔧 Eliminar signInWithFacebook, signInWithMicrosoft (no configurados)
```

### 3. OAuth callback
```typescript
// app/auth/callback/route.ts
🔧 Simplificar al máximo
🔧 Evitar NextResponse.redirect (usar redirect() de next/navigation)
🔧 O mejor: usar client-side redirect con HTML+JavaScript
```

### 4. Página de login
```typescript
// app/auth/signin/page.tsx (NUEVA)
🔧 Crear desde cero
🔧 Solo botón de Google OAuth
🔧 Sin formularios de email/password
```

---

## 📦 DEPENDENCIAS

### Actuales (package.json)
```json
{
  "dependencies": {
    "@heroicons/react": "^2.2.0",
    "@supabase/auth-helpers-nextjs": "^0.10.0",  // ⚠️ OBSOLETA - ELIMINAR
    "@supabase/ssr": "^0.7.0",                   // ✅ OK
    "@supabase/supabase-js": "^2.76.1",          // ⚠️ Actualizar a ^2.47.10
    "chart.js": "^4.5.1",                        // ✅ OK
    "chartjs-adapter-date-fns": "^3.0.0",        // ✅ OK
    "date-fns": "^4.1.0",                        // ✅ OK
    "framer-motion": "^12.23.24",                // ✅ OK
    "leaflet": "1.9.4",                          // ✅ OK
    "lucide-react": "^0.552.0",                  // ✅ OK
    "next": "^14.2.33",                          // 🔧 ACTUALIZAR a 15.1.0
    "react": "^18.3.1",                          // 🔧 ACTUALIZAR a ^19.0.0
    "react-chartjs-2": "^5.3.1",                 // ✅ OK
    "react-dom": "^18.3.1",                      // 🔧 ACTUALIZAR a ^19.0.0
    "react-leaflet": "4.2.1",                    // ✅ OK
    "recharts": "^3.3.0"                         // ✅ OK
  },
  "devDependencies": {
    "eslint-config-next": "^15.5.6",             // 🔧 Bajar a 15.1.0
    "@types/react": "^18.3.26",                  // 🔧 ACTUALIZAR a ^19.0.0
    "@types/react-dom": "^18.3.7"                // 🔧 ACTUALIZAR a ^19.0.0
  }
}
```

### Dependencias a actualizar
```bash
# Core
next: 14.2.33 → 15.1.0
react: 18.3.1 → 19.0.0
react-dom: 18.3.1 → 19.0.0

# Types
@types/react: 18.3.26 → 19.0.0
@types/react-dom: 18.3.7 → 19.0.0

# ESLint
eslint-config-next: 15.5.6 → 15.1.0
```

### Dependencias a eliminar
```bash
@supabase/auth-helpers-nextjs  # OBSOLETA - No se usa en código
```

---

## 🚀 PLAN DE REFACTORIZACIÓN

### Fase 1: Limpieza (30 min)
1. ✅ Crear backup completo
2. ❌ Eliminar 15 archivos obsoletos
3. ❌ Eliminar dependencia `@supabase/auth-helpers-nextjs`
4. ❌ Limpiar archivos temporales (nul, tsbuildinfo, package-lock.json)

### Fase 2: Actualización de dependencias (15 min)
1. ❌ Actualizar package.json a Next.js 15 + React 19
2. ❌ Ejecutar `pnpm install`
3. ❌ Resolver conflictos de dependencias

### Fase 3: Refactorización de autenticación (2 horas)
1. ❌ Simplificar `lib/supabase/client.ts`
2. ❌ Refactorizar `lib/supabase/server.ts` (eliminar INTERNAL URL)
3. ❌ Simplificar `lib/supabase/middleware.ts`
4. ❌ Refactorizar `contexts/AuthContext.tsx` (solo Google OAuth)
5. ❌ Recrear `app/auth/signin/page.tsx` (nueva, simple)
6. ❌ Refactorizar `app/auth/callback/route.ts`
7. ❌ Simplificar `middleware.ts`

### Fase 4: Actualización a Next.js 15 (1 hora)
1. ❌ Revisar rutas dinámicas con `params`
2. ❌ Actualizar `React.ReactElement` donde sea necesario
3. ❌ Configurar `next.config.mjs` correctamente
4. ❌ Testing de build local

### Fase 5: Deploy y testing (1 hora)
1. ❌ Build de producción en Docker
2. ❌ Deploy a Proxmox
3. ❌ Testing de OAuth Google
4. ❌ Testing de todas las rutas protegidas

---

## ⚠️ PROBLEMAS CONOCIDOS

### 1. Error "Server Action" en Next.js 15
**Causa**: Incompatibilidad entre middleware, redirects y cookies en Next.js 15
**Solución**: Usar client-side redirects en callback, simplificar middleware

### 2. OAuth 502 Bad Gateway
**Causa**: Múltiples redirects del servidor + middleware interfiriendo
**Solución**: Implementar redirect con HTML+JavaScript en callback

### 3. Login email/password no funciona
**Causa**: Mismos errores de "Server Action"
**Solución**: ELIMINAR completamente, usar solo OAuth

---

## 📊 MÉTRICAS DEL PROYECTO

### Líneas de código (estimado)
- **Componentes**: ~2,500 líneas
- **Páginas**: ~4,000 líneas
- **API Routes**: ~1,500 líneas
- **Lib/Utils**: ~1,200 líneas
- **Contexts/Hooks**: ~350 líneas
- **TOTAL**: ~9,550 líneas de código

### Complejidad
- **Baja**: Header, Footer, componentes simples
- **Media**: Dashboard, meteorología, webcams
- **Alta**: Sistema de autenticación (actual)
- **Muy Alta**: Middleware + OAuth + Server Actions

---

## ✅ CONCLUSIONES

### Puntos fuertes del proyecto
1. ✅ Buena estructura de directorios (App Router)
2. ✅ Componentes bien organizados y reutilizables
3. ✅ APIs bien diseñadas y separadas por dominio
4. ✅ Testing configurado con Vitest
5. ✅ Docker configurado correctamente

### Puntos débiles actuales
1. ❌ Sistema de autenticación demasiado complejo
2. ❌ Errores persistentes de Next.js 15 incompatibilidad
3. ❌ Dependencias obsoletas sin limpiar
4. ❌ Código de debug sin eliminar
5. ❌ Middleware demasiado complejo

### Prioridades
1. 🔴 **CRÍTICO**: Refactorizar autenticación completa
2. 🟠 **ALTO**: Actualizar a Next.js 15 + React 19 correctamente
3. 🟡 **MEDIO**: Limpiar archivos obsoletos
4. 🟢 **BAJO**: Optimizar componentes y performance

---

**FIN DEL ANÁLISIS EXHAUSTIVO**
