# Plan de Migración: Meteo Viveiro → viveiro.live

## Contexto

Transformar el proyecto actual de meteorología en un portal municipal completo con múltiples secciones.

## Decisiones tomadas

### Autenticación
- ✅ Un solo sistema de login/registro para todas las secciones
- ✅ Home pública (sin login) con noticias, anuncios, enlaces
- ✅ Todos los usuarios registrados acceden a todas las secciones
- ⏳ Futuro: Posibilidad de usuarios premium

### Estructura
- ✅ Dashboard con Sidebar + Navbar
- ✅ Navegación lateral entre secciones
- ✅ Sección de meteo será una de varias

### Infraestructura
- ✅ Dominio: viveiro.live (ya adquirido)
- ✅ Mantener mismo proyecto de Supabase (añadir nuevo dominio)
- ✅ Crear nuevo repositorio: `viveiro-live`
- ✅ Repo actual como backup/referencia

## Fases de Migración

### FASE 1: Preparación y Reestructuración (Día 1-2)

#### 1.1. Crear nuevo repositorio
- [ ] Crear repo `landropunk/viveiro-live` en GitHub
- [ ] Copiar código actual como base
- [ ] Actualizar README.md con nueva descripción
- [ ] Mantener `.env.local` con credenciales actuales

#### 1.2. Reestructurar carpetas
```
app/
├── (public)/                    # Rutas públicas (sin layout auth)
│   ├── page.tsx                # Home pública del ayuntamiento
│   ├── noticias/
│   ├── anuncios/
│   └── enlaces/
│
├── auth/                       # Mantener igual
│   ├── login/
│   ├── register/
│   └── callback/
│
└── (protected)/                # Rutas protegidas (con layout auth)
    └── dashboard/
        ├── page.tsx            # Selector de secciones
        ├── layout.tsx          # Layout con Sidebar + Navbar
        │
        ├── meteo/              # Sección meteorología (código actual)
        │   ├── page.tsx
        │   ├── actual/
        │   ├── historicos/
        │   └── estaciones/
        │
        ├── eventos/            # Nueva sección
        │   └── page.tsx
        │
        └── webcams/            # Nueva sección
            └── page.tsx
```

#### 1.3. Actualizar configuración Supabase
- [ ] Añadir `https://viveiro.live/auth/callback` a Redirect URLs
- [ ] Mantener callback actual para desarrollo
- [ ] Actualizar Site URL en Supabase Settings

### FASE 2: Crear Layout Global y Componentes Base (Día 3-4)

#### 2.1. Componentes de navegación
- [ ] `components/layout/DashboardSidebar.tsx` - Sidebar con secciones
- [ ] `components/layout/DashboardNavbar.tsx` - Navbar superior
- [ ] `components/layout/DashboardLayout.tsx` - Layout wrapper
- [ ] `components/layout/PublicNavbar.tsx` - Navbar para home pública

#### 2.2. Sistema de iconos para secciones
```typescript
const sections = [
  { id: 'meteo', name: 'Meteorología', icon: '☁️', path: '/dashboard/meteo' },
  { id: 'eventos', name: 'Eventos', icon: '📅', path: '/dashboard/eventos' },
  { id: 'webcams', name: 'Webcams', icon: '📷', path: '/dashboard/webcams' },
  { id: 'seccion4', name: 'Sección 4', icon: '🔧', path: '/dashboard/seccion4' },
  { id: 'seccion5', name: 'Sección 5', icon: '📊', path: '/dashboard/seccion5' },
]
```

#### 2.3. Home pública
- [ ] Diseño landing page del ayuntamiento
- [ ] Sección de noticias (mock inicial)
- [ ] Sección de anuncios (mock inicial)
- [ ] Enlaces de interés
- [ ] Call-to-action para registro/login

### FASE 3: Migrar Código de Meteo (Día 5)

#### 3.1. Mover rutas existentes
- [ ] Mover `/dashboard` actual a `/dashboard/meteo`
- [ ] Actualizar imports y rutas internas
- [ ] Verificar que API routes sigan funcionando
- [ ] Probar navegación y funcionalidad

#### 3.2. Actualizar componentes
- [ ] Adaptar Header de meteo al nuevo layout
- [ ] Integrar con Sidebar/Navbar global
- [ ] Mantener toda la funcionalidad actual

### FASE 4: Crear Secciones Nuevas (Día 6-7)

#### 4.1. Sección Eventos
- [ ] Página principal `/dashboard/eventos`
- [ ] Diseño UI básico
- [ ] Estructura de datos (Supabase tables)
- [ ] Funcionalidad básica

#### 4.2. Sección Webcams
- [ ] Página principal `/dashboard/webcams`
- [ ] Integración con streams
- [ ] Grid de cámaras
- [ ] Player de video

#### 4.3. Secciones placeholder
- [ ] Crear páginas "Coming Soon" para sección 4 y 5
- [ ] Mantener en Sidebar pero deshabilitadas

### FASE 5: Actualizar OAuth para Producción (Día 8)

#### 5.1. Google Cloud Console
- [ ] Añadir `https://viveiro.live/auth/callback` a Authorized redirect URIs
- [ ] Actualizar JavaScript origins si necesario
- [ ] Probar flujo OAuth

#### 5.2. Azure Portal (Microsoft)
- [ ] Añadir `https://viveiro.live/auth/callback` a Redirect URIs
- [ ] Verificar configuración
- [ ] Probar flujo OAuth

#### 5.3. Facebook Developers
- [ ] Añadir `https://viveiro.live/auth/callback` a Valid OAuth Redirect URIs
- [ ] Completar requisitos de publicación:
  - Subir icono 1024x1024
  - Añadir política de privacidad
  - Añadir URL eliminación de datos
- [ ] Enviar app a revisión

### FASE 6: Testing y Deploy (Día 9-10)

#### 6.1. Testing local
- [ ] Probar todas las rutas
- [ ] Verificar autenticación
- [ ] Probar navegación entre secciones
- [ ] Verificar responsive design

#### 6.2. Deploy en Vercel
- [ ] Conectar repo `viveiro-live` a Vercel
- [ ] Configurar variables de entorno
- [ ] Configurar dominio `viveiro.live`
- [ ] Deploy a producción

#### 6.3. Configurar dominio
- [ ] DNS apuntando a Vercel
- [ ] Verificar SSL/HTTPS
- [ ] Probar OAuth en producción
- [ ] Verificar todos los endpoints

## Estructura de Datos (Supabase)

### Tablas actuales (mantener)
- `users` (via Supabase Auth)
- Tablas de meteorología existentes

### Nuevas tablas necesarias
```sql
-- Noticias para home pública
CREATE TABLE noticias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  imagen_url TEXT,
  fecha_publicacion TIMESTAMPTZ DEFAULT NOW(),
  autor_id UUID REFERENCES auth.users(id),
  destacada BOOLEAN DEFAULT FALSE
);

-- Anuncios para home pública
CREATE TABLE anuncios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  fecha_inicio TIMESTAMPTZ,
  fecha_fin TIMESTAMPTZ,
  activo BOOLEAN DEFAULT TRUE
);

-- Eventos
CREATE TABLE eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha_evento TIMESTAMPTZ NOT NULL,
  ubicacion TEXT,
  imagen_url TEXT,
  stream_url TEXT,
  creado_por UUID REFERENCES auth.users(id)
);

-- Webcams
CREATE TABLE webcams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  ubicacion TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  imagen_preview TEXT,
  activa BOOLEAN DEFAULT TRUE,
  orden INTEGER
);
```

## Tecnologías a usar

### Existentes (mantener)
- ✅ Next.js 14 (App Router)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Supabase (Auth + Database)
- ✅ React Context (AuthContext)

### Nuevas a considerar
- **Shadcn/ui** - Componentes UI modernos para Sidebar/Navbar
- **Lucide Icons** - Iconos consistentes
- **React Query** - Cache de datos (opcional)
- **Zustand** - Estado global si Context se complica (opcional)

## Consideraciones de Seguridad

### Row Level Security (RLS) en Supabase
```sql
-- Usuarios autenticados pueden ver todo
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuarios autenticados pueden ver noticias"
  ON noticias FOR SELECT
  TO authenticated
  USING (true);

-- Solo admins pueden crear/editar (futuro)
CREATE POLICY "Solo admins pueden crear noticias"
  ON noticias FOR INSERT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

## Estimación de Tiempo

- **Fase 1**: 2 días (preparación)
- **Fase 2**: 2 días (UI/UX base)
- **Fase 3**: 1 día (migración meteo)
- **Fase 4**: 2 días (nuevas secciones)
- **Fase 5**: 1 día (OAuth producción)
- **Fase 6**: 2 días (testing/deploy)

**Total estimado**: 10 días de desarrollo

## Riesgos y Mitigaciones

### Riesgo 1: Romper funcionalidad actual de meteo
**Mitigación**:
- Hacer toda la migración en rama `feature/viveiro-live`
- Mantener repo actual funcionando hasta validar nuevo
- Testing exhaustivo antes de merge

### Riesgo 2: Problemas con OAuth en producción
**Mitigación**:
- Probar OAuth en Vercel preview antes de producción
- Mantener callbacks de desarrollo funcionando
- Documentar proceso de rollback

### Riesgo 3: Complejidad del Sidebar/Navbar
**Mitigación**:
- Usar librería probada (Shadcn/ui)
- Implementación incremental
- Fallback a diseño simple si hay problemas

## Próximos Pasos Inmediatos

1. ✅ Aprobar este plan
2. ⏳ Crear nuevo repo `viveiro-live`
3. ⏳ Copiar código actual
4. ⏳ Empezar Fase 1.2 (reestructurar carpetas)

---

**Fecha del plan**: 2025-10-26
**Proyecto**: viveiro.live
**Desarrollador**: César Iglesias con asistencia de Claude
