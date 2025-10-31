# 🌊 ViveiroLive

**Portal Digital de Viveiro** - Meteorología, Eventos, Webcams, Blog y más servicios para los vecinos de Viveiro (Lugo, España).

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)](https://supabase.com/)

---

## 🎯 Descripción

ViveiroLive es un portal web moderno que centraliza información meteorológica, eventos en directo, webcams, noticias y servicios para la comunidad de Viveiro. Integra datos en tiempo real de **MeteoGalicia API V5** y ofrece una experiencia responsive y accesible.

---

## ✨ Características

### 🌤️ Meteorología
- **Predicción en tiempo real** con API V5 de MeteoGalicia (precisión de 1km)
- **Datos de estaciones locales** (Penedo do Galo 545m, Borreiros 59m)
- **Históricos de 72 horas** con gráficos comparativos
- **Históricos horarios** ⭐ NUEVO - Consulta datos históricos con gráficos interactivos
- Temperatura, humedad, viento, precipitación, índice UV
- Sensación térmica calculada (Wind Chill / Heat Index)

### 📊 Históricos Horarios ⭐ NUEVO 2024
- Consulta datos históricos de las últimas 6, 12, 24, 48 o 72 horas
- Gráficos interactivos con **Recharts**
- Visualización de temperatura, humedad, viento y precipitación
- Datos directos de las estaciones meteorológicas de MeteoGalicia
- Comparación entre estaciones de Viveiro

### 📝 Blog / Noticias
- Sistema de gestión de contenido (CMS) completo
- Editor con soporte **Markdown**
- Categorías y etiquetas
- Sistema de publicación/despublicación
- SEO-friendly con slugs automáticos
- Contador de visitas
- Imágenes de portada

### 📺 Live / Play
- Contenido en directo y grabaciones de eventos
- Integración con YouTube (en desarrollo)
- Calendario de eventos programados

### 📷 Webcams
- Visualización de cámaras en tiempo real
- Vista en cuadrícula y pantalla completa
- Gestión administrativa de cámaras (en desarrollo)

### ⚙️ Panel de Administración ⭐ MEJORADO
- **Sistema de Ajustes Dinámicos** ✅ NUEVO - Configuración sin tocar código
  - Activar/desactivar secciones del dashboard
  - Control de registro de usuarios
  - Mostrar/ocultar blog en página principal
  - Funciones bloqueables con candado 🔒 (requieren activación en código)
- **Gestión completa de blog/noticias** ✅
- **Gestión de webcams** (próximamente)
- **Gestión de contenido Live/Play** (próximamente)
- **Gestión de usuarios** (próximamente)
- Sistema de roles (admin/user)
- Protección con middleware y RLS de Supabase
- **Documentación completa**: [AJUSTES_FUNCIONAMIENTO.md](AJUSTES_FUNCIONAMIENTO.md)

---

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - App Router, Server Components
- **TypeScript 5.9** - Tipado estático
- **Tailwind CSS 3.4** - Diseño utility-first
- **Framer Motion 12** - Animaciones fluidas
- **Recharts 3.3** - Gráficos interactivos
- **React Leaflet 4.2** - Mapas interactivos

### Backend & Database
- **Supabase** - Auth, Database (PostgreSQL), Row Level Security (RLS)
- **Next.js API Routes** - Endpoints personalizados

### APIs Externas
- **MeteoGalicia API V5** - Predicción meteorológica (grid 1km)
- **MeteoGalicia RSS/JSON** - Observaciones de estaciones
- **MeteoGalicia Históricos Horarios** ⭐ NUEVO - Datos horarios históricos

### Desarrollo & Testing
- **Vitest 3.2** - Testing unitario
- **React Testing Library** - Testing de componentes
- **ESLint** - Linting
- **pnpm 10** - Gestor de paquetes

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+
- pnpm 10+
- Cuenta de Supabase

### 1. Clonar el Repositorio
```bash
git clone https://github.com/landropunk/viveiro-live.git
cd viveiro-live
```

### 2. Instalar Dependencias
```bash
pnpm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# MeteoGalicia (opcional - para mayor cuota de llamadas)
METEOGALICIA_API_KEY=tu_api_key
```

### 4. Configurar Base de Datos

#### a) Ejecutar Migraciones del Sistema Admin
En Supabase SQL Editor, ejecuta:
```sql
-- Contenido de: supabase/migrations/admin_system.sql
```

#### b) Convertir tu Usuario en Admin
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'tu-email@ejemplo.com';
```

Ver [`ADMIN_SETUP.md`](./ADMIN_SETUP.md) para detalles completos.

### 5. Iniciar Servidor de Desarrollo
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 📁 Estructura del Proyecto

```
viveiro-live/
├── app/
│   ├── (admin)/              # Rutas de administración
│   │   └── admin/
│   │       ├── blog/         # ✅ Gestión de blog
│   │       ├── webcams/      # Gestión de webcams
│   │       ├── live-content/ # Gestión Live/Play
│   │       └── users/        # Gestión de usuarios
│   ├── (protected)/          # Rutas protegidas (requieren login)
│   │   └── dashboard/
│   │       ├── meteo/        # Meteorología
│   │       ├── historicos/   # ⭐ NUEVO: Históricos horarios
│   │       ├── eventos/      # Live/Play
│   │       └── webcams/      # Cámaras
│   ├── (public)/             # Rutas públicas
│   │   ├── page.tsx          # Inicio
│   │   └── blog/             # Posts públicos
│   ├── auth/                 # Autenticación
│   ├── layout.tsx            # Layout raíz
│   └── globals.css           # Estilos globales
├── components/
│   ├── admin/                # Componentes admin
│   │   └── BlogPostForm.tsx  # Formulario de posts
│   ├── AnimatedSection.tsx   # Animaciones scroll
│   ├── Header.tsx            # Cabecera
│   └── ...
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticación
├── lib/
│   ├── supabase/             # Cliente Supabase
│   ├── admin/                # Lógica admin
│   │   └── blog.ts           # ✅ CRUD de blog
│   ├── meteogalicia.ts                    # API V5 predicción
│   ├── meteogalicia-stations.ts           # Estaciones
│   ├── meteogalicia-historical-real.ts    # Históricos 72h
│   ├── meteogalicia-hourly-historical.ts  # ⭐ NUEVO: Históricos horarios
│   └── utils.ts              # Utilidades
├── hooks/
│   └── useIsAdmin.ts         # Hook verificación admin
├── types/
│   └── weather.ts            # Tipos meteorología
├── supabase/
│   └── migrations/           # Migraciones SQL
├── public/                   # Recursos estáticos
│   ├── Escudo_de_Viveiro.png # Logo oficial
│   └── banderaViveiro.jpg    # Bandera
├── ADMIN_SETUP.md            # ✅ Guía configuración admin
├── METEOGALICIA_API_UPDATE_2024.md  # ⭐ Actualización API
└── CLAUDE.md                 # Instrucciones del proyecto
```

---

## 🚀 Funcionalidades

### ✅ Implementadas
- [x] Autenticación con Supabase
- [x] Meteorología en tiempo real (API V5)
- [x] Datos de estaciones locales
- [x] Históricos de 72 horas
- [x] **Históricos horarios con gráficos** ⭐ NUEVO
- [x] **Sistema de blog completo (CMS)** ⭐
- [x] **Panel de administración** ⭐
- [x] Página de inicio animada
- [x] Diseño responsive
- [x] Modo oscuro

### 🔄 En Desarrollo
- [ ] Webcams en tiempo real
- [ ] Gestión de contenido Live/Play
- [ ] Gestión de usuarios desde admin
- [ ] Notificaciones de alertas
- [ ] Exportación de datos históricos

### 📋 Planificado
- [ ] PWA (Aplicación web progresiva)
- [ ] Modo offline con Service Workers
- [ ] API pública para terceros
- [ ] Sistema de notificaciones push
- [ ] Widget embebible para otras webs

---

## 📡 Actualización API MeteoGalicia 2024 ⭐

### Novedades Integradas

#### 1. Catálogo Ampliado de Iconos del Estado del Cielo
Se han añadido **8 nuevos iconos**:
- Nieve débil
- Chubascos de nieve
- Aguanieve
- Granizo
- Tormenta eléctrica
- Lluvia engelante
- Tormenta de arena
- Polvo en suspensión

#### 2. Servicio de Datos Horarios Históricos
Nuevo endpoint para consultar datos históricos:

**Endpoint**:
```
https://servizos.meteogalicia.gal/mgrss/observacion/datosHorariosEstacions.action
```

**Ejemplo de uso**:
```typescript
import { getLastHoursData } from '@/lib/meteogalicia-hourly-historical';

// Obtener datos de las últimas 24 horas
const data = await getLastHoursData(24);

// Datos por estación
data.forEach((stationData, stationId) => {
  console.log(`Estación ${stationId}:`, stationData);
});
```

Ver [`METEOGALICIA_API_UPDATE_2024.md`](./METEOGALICIA_API_UPDATE_2024.md) para documentación completa.

---

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests con interfaz visual
pnpm test:ui

# Cobertura de código
pnpm test:coverage
```

---

## 🏗️ Build y Deploy

### Build Local
```bash
# Build de producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Deploy en Vercel (Recomendado)

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno
3. Deploy automático en cada push a `main`

#### Variables de Entorno en Producción
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
METEOGALICIA_API_KEY=...
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo (localhost:3000) |
| `pnpm dev:clean` | Dev + limpieza de puerto 3000 |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | Linting con ESLint |
| `pnpm test` | Tests con Vitest |
| `pnpm test:ui` | Tests con interfaz |
| `pnpm test:coverage` | Coverage de tests |
| `pnpm kill-port` | Libera puerto 3000 |

---

## 🔐 Seguridad

- **Row Level Security (RLS)** en todas las tablas de Supabase
- **Middleware de autenticación** en rutas protegidas
- **Sistema de roles** (admin/user) con verificación
- **Sanitización de inputs** en formularios
- **HTTPS obligatorio** en producción
- **Cookies HttpOnly** para tokens seguros

---

## 👥 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Convención de Commits
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato/estilo (sin cambios de lógica)
- `refactor:` Refactorización de código
- `test:` Añadir/modificar tests
- `chore:` Tareas de mantenimiento (build, CI, etc.)

---

## 📄 Licencia

Este proyecto es privado y pertenece a la comunidad de Viveiro.

---

## 📞 Contacto

- **GitHub**: [@landropunk](https://github.com/landropunk)
- **Email**: landropunk@hotmail.com
- **Proyecto**: [viveiro-live](https://github.com/landropunk/viveiro-live)

---

## 🙏 Agradecimientos

- **MeteoGalicia** - Por proporcionar APIs públicas de calidad
- **Supabase** - Backend as a Service excepcional
- **Vercel** - Hosting y deployment seamless
- **Next.js Team** - Framework increíble
- **Comunidad de Viveiro** - Por el apoyo y feedback constante

---

## 📚 Documentación Adicional

- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Guía completa de configuración del panel admin
- **[METEOGALICIA_API_UPDATE_2024.md](./METEOGALICIA_API_UPDATE_2024.md)** - Actualización API MeteoGalicia
- **[CLAUDE.md](./CLAUDE.md)** - Instrucciones para desarrollo con Claude Code

---

## 🔗 Enlaces Útiles

- **Portal**: https://viveiro.live (próximamente)
- **Repositorio**: https://github.com/landropunk/viveiro-live
- **MeteoGalicia API**: https://www.meteogalicia.gal/web/API/api.action
- **Supabase**: https://supabase.com
- **Next.js**: https://nextjs.org

---

## 📈 Changelog

### v1.1.0 - Octubre 2024 ⭐
- **NUEVO**: Históricos horarios con gráficos interactivos
- **NUEVO**: Sistema de blog/noticias completo
- **NUEVO**: Panel de administración
- Actualizado catálogo de iconos MeteoGalicia (8 nuevos)
- Integración API de históricos horarios de MeteoGalicia
- Mejoras en diseño responsive
- Correcciones de estilo en modo móvil

### v1.0.0 - Septiembre 2024
- Lanzamiento inicial
- Meteorología en tiempo real
- Integración con MeteoGalicia API V5
- Sistema de autenticación
- Diseño responsive con Tailwind

---

**Desarrollado con ❤️ para Viveiro**

🤖 *Construido con asistencia de [Claude Code](https://claude.com/claude-code)*

---

**Última actualización**: 30 de octubre de 2024
