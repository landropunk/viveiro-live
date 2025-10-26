# viveiro.live 🏛️

Portal municipal integral de Viveiro (Lugo, España) - Plataforma multi-seccional para ciudadanos con meteorología, eventos en directo, webcams y más.

## 🌟 Secciones del Portal

### 🏠 Home Pública (sin login)
- Información del Ayuntamiento de Viveiro
- Noticias y anuncios municipales
- Enlaces de interés
- Acceso a registro/login

### ☁️ Meteorología
- Datos meteorológicos en tiempo real de MeteoGalicia API V5
- 2 Estaciones de Viveiro: Penedo do Galo (545m) y Borreiros (59m)
- Históricos de hasta 72 horas con gráficos comparativos
- Pronósticos horarios y diarios
- Índice UV y alertas meteorológicas

### 📅 Eventos en Directo
- Calendario de eventos municipales
- Streaming en directo de eventos
- Información detallada de cada evento

### 📷 Webcams
- Visualización en directo de cámaras en Viveiro
- Grid de múltiples cámaras
- Vista fullscreen

### 🔧 Secciones Adicionales (en desarrollo)
- Sección 4: Por definir
- Sección 5: Por definir

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript 5.9
- **Estilos**: Tailwind CSS 3.4
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + OAuth (Google, Microsoft, Facebook)
- **Gráficos**: Recharts 3.3
- **Testing**: Vitest 3.2 + React Testing Library
- **Deploy**: Vercel
- **Gestión**: pnpm

## 📁 Estructura del Proyecto

```
viveiro-live/
├── app/
│   ├── (public)/              # Rutas públicas (home, noticias, anuncios)
│   ├── auth/                  # Login, registro, callback OAuth
│   └── (protected)/dashboard/ # Rutas protegidas con sidebar
│       ├── meteo/             # Sección meteorología
│       ├── eventos/           # Sección eventos
│       ├── webcams/           # Sección webcams
│       └── ...                # Secciones futuras
├── components/
│   ├── layout/                # Sidebar, Navbar, Layout
│   ├── weather/               # Componentes meteorológicos
│   └── stations/              # Componentes de estaciones
├── contexts/
│   └── AuthContext.tsx        # Contexto de autenticación global
├── lib/
│   ├── supabase/              # Cliente y helpers de Supabase
│   └── meteogalicia.ts        # Cliente API MeteoGalicia
└── middleware.ts              # Protección de rutas

```

## 🔑 Autenticación

Sistema centralizado para todas las secciones:

### OAuth Providers
- ✅ Google (Gmail)
- ✅ Microsoft (Outlook/Hotmail)
- ✅ Facebook

### Características
- Un solo login para todo el portal
- Todos los usuarios registrados acceden a todas las secciones
- Posibilidad futura de usuarios premium
- Cookies HttpOnly seguras
- Row Level Security en Supabase

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/landropunk/viveiro-live.git
cd viveiro-live

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Desarrollo
pnpm dev

# Build producción
pnpm build

# Iniciar producción
pnpm start
```

## 🌐 Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# MeteoGalicia (opcional, API pública)
METEOGALICIA_API_KEY=tu_api_key
```

## 🛠️ Scripts

```bash
pnpm dev              # Servidor desarrollo (localhost:3000)
pnpm build            # Build producción
pnpm start            # Servidor producción
pnpm lint             # ESLint
pnpm test             # Tests con Vitest
pnpm test:ui          # Tests con UI
pnpm test:coverage    # Cobertura de tests
```

## 📚 Documentación

- [PLAN_MIGRACION_VIVEIRO_LIVE.md](./PLAN_MIGRACION_VIVEIRO_LIVE.md) - Plan completo de migración
- [OAUTH_CONFIGURADO.md](./OAUTH_CONFIGURADO.md) - Configuración OAuth completa
- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Guía paso a paso OAuth
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuración Supabase
- [CHANGELOG.md](./CHANGELOG.md) - Historial de cambios

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

- `users` - Usuarios (via Supabase Auth)
- `noticias` - Noticias del ayuntamiento
- `anuncios` - Anuncios y avisos municipales
- `eventos` - Eventos con streaming
- `webcams` - Configuración de cámaras

Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para SQL completo.

## 🌐 Deploy en Vercel

1. Conectar repo en Vercel
2. Configurar variables de entorno
3. Configurar dominio: `viveiro.live`
4. Deploy automático en push a `main`

### Actualizar OAuth para producción

Añadir redirect URLs en:
- Google Cloud Console
- Azure Portal (Microsoft)
- Facebook Developers
- Supabase Settings

De: `http://localhost:3000/auth/callback`
A: `https://viveiro.live/auth/callback`

## 🔒 Seguridad

- Supabase Auth con OAuth 2.0
- Cookies HttpOnly (tokens seguros)
- Row Level Security (RLS) en PostgreSQL
- Middleware de protección de rutas
- Variables de entorno fuera del código
- HTTPS en producción

## 🧪 Testing

```bash
pnpm test             # Ejecutar todos los tests
pnpm test:ui          # Tests con interfaz visual
pnpm test:coverage    # Ver cobertura de código
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama: `git checkout -b feature/nueva-caracteristica`
3. Commit: `git commit -m 'feat: Añadir nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Abrir Pull Request

### Convención de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva característica
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato (sin cambio de código)
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Build, CI, etc.

## 📄 Licencia

Este proyecto es de código abierto para uso municipal.

## 👥 Equipo

- **César Iglesias** ([@landropunk](https://github.com/landropunk)) - Desarrollo principal
- **Ayuntamiento de Viveiro** - Cliente y sponsor

## 🔗 Enlaces

- **Portal**: https://viveiro.live
- **Repositorio**: https://github.com/landropunk/viveiro-live
- **Proyecto anterior**: [Meteo-Historicos-Viveiro](https://github.com/landropunk/Meteo-Historicos-Viveiro)
- **MeteoGalicia API**: https://www.meteogalicia.gal/web/API/api.action

## 📧 Contacto

- Email: cesar.iglesiasDocal@gmail.com
- GitHub: [@landropunk](https://github.com/landropunk)

---

**v1.0.0** - Portal Municipal viveiro.live
Migrado desde Meteo-Historicos-Viveiro - Octubre 2025
🤖 Desarrollado con asistencia de [Claude Code](https://claude.com/claude-code)
