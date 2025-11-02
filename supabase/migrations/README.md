# Migraciones de Base de Datos - Viveiro Live

Este directorio contiene todas las migraciones SQL necesarias para configurar la base de datos de Supabase.

---

## 📂 Estructura de Archivos

```
supabase/migrations/
├── 00_INIT_viveiro_live.sql          ⭐ MIGRACIÓN PRINCIPAL (usar esta)
├── 20250131_user_system_complete.sql  [LEGACY] Sistema de usuarios
├── 20250131_app_settings.sql          [LEGACY] Configuración de la app
├── 20250131_add_locked_field.sql      [LEGACY] Campo locked
├── 20250131_add_sections_4_5.sql      [LEGACY] Secciones 4 y 5
├── 20250131_rename_sections_5_6.sql   [LEGACY] Renombrar secciones
├── 20250131_security_definer_solution.sql [LEGACY] Solución RLS
└── 20250201_webcams.sql               [LEGACY] Sistema de webcams
```

---

## ⭐ ¿Qué Migración Usar?

### Para Nuevos Proyectos (RECOMENDADO)

**Usa solo:** `00_INIT_viveiro_live.sql`

Este archivo contiene **TODO** lo necesario para arrancar el proyecto:
- ✅ Sistema de usuarios con perfiles y roles
- ✅ Configuración de la aplicación (app_settings)
- ✅ Sistema de webcams
- ✅ Políticas RLS (Row Level Security)
- ✅ Funciones y triggers
- ✅ Datos de ejemplo

**Instrucciones:**
1. Crea un nuevo proyecto en Supabase
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `00_INIT_viveiro_live.sql`
4. Ejecuta (botón "Run")
5. ¡Listo! Tu base de datos está configurada

### Para Proyectos Existentes

Si ya tienes datos y solo quieres actualizar:

1. **NO uses** `00_INIT_viveiro_live.sql` (sobrescribiría todo)
2. Aplica solo las migraciones incrementales que necesites:
   - `20250131_add_locked_field.sql` - Agregar campo `locked` a settings
   - `20250131_rename_sections_5_6.sql` - Actualizar secciones
   - `20250201_webcams.sql` - Agregar sistema de webcams

---

## 📋 Contenido de la Migración Principal

### 1. Sistema de Usuarios (`user_profiles`)

Tabla para perfiles extendidos con información personal:

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  city TEXT DEFAULT 'Viveiro',
  ...
);
```

**Roles:**
- `user` - Usuario normal (solo ve su perfil)
- `admin` - Administrador (ve todos los perfiles y gestiona contenido)

### 2. Configuración de la App (`app_settings`)

Almacena configuraciones dinámicas sin tocar código:

```sql
CREATE TABLE app_settings (
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT,
  locked BOOLEAN DEFAULT false,
  ...
);
```

**Categorías:**
- `users` - Permisos de usuarios
- `auth` - Autenticación
- `sections` - Secciones del dashboard
- `general` - Configuración general

### 3. Sistema de Webcams (`webcams`)

Gestión de cámaras en tiempo real:

```sql
CREATE TABLE webcams (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT CHECK (type IN ('image', 'iframe')),
  is_active BOOLEAN DEFAULT true,
  ...
);
```

**Tipos:**
- `image` - Imagen estática que se refresca
- `iframe` - Stream continuo embebido

### 4. Row Level Security (RLS)

Todas las tablas tienen políticas de seguridad:

- ✅ Los usuarios solo ven su propio perfil
- ✅ Los admins ven todos los perfiles
- ✅ Solo admins pueden modificar settings y webcams
- ✅ Todos pueden ver webcams activas

### 5. Funciones y Triggers

- `is_admin(user_id)` - Verifica si un usuario es admin (evita recursión RLS)
- `update_user_profile_updated_at()` - Actualiza `updated_at` automáticamente
- `update_app_settings_updated_at()` - Actualiza `updated_at` de settings
- `update_updated_at_column()` - Trigger genérico para webcams

---

## 🚀 Guía Paso a Paso

### Opción 1: Supabase Cloud (Recomendado para desarrollo)

1. **Crear proyecto:**
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Anota la URL y las API keys

2. **Ejecutar migración:**
   ```sql
   -- En Supabase SQL Editor, ejecuta:
   -- Copia y pega 00_INIT_viveiro_live.sql
   ```

3. **Configurar .env.local:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. **Crear usuario admin:**
   ```sql
   -- Primero regístrate en la app, luego ejecuta:
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'tu-email@ejemplo.com';
   ```

5. **Verificar:**
   ```bash
   pnpm dev
   # Ve a http://localhost:3000/admin
   ```

**Documentación completa:** [docs/setup/SUPABASE_INTEGRATION_GUIDE.md](../../docs/setup/SUPABASE_INTEGRATION_GUIDE.md)

### Opción 2: Supabase Self-Hosted (Para producción o privacidad)

Si quieres hospedar Supabase en tu propio servidor:

1. **Requisitos:**
   - Servidor con 4GB RAM mínimo
   - Docker y Docker Compose instalados
   - Ubuntu 22.04 LTS (recomendado)

2. **Instalación:**
   ```bash
   git clone https://github.com/supabase/supabase
   cd supabase/docker
   cp .env.example .env
   # Edita .env con tus configuraciones
   docker-compose up -d
   ```

3. **Ejecutar migración:**
   - Accede a `http://tu-servidor:3000` (Supabase Studio)
   - Ve a SQL Editor
   - Ejecuta `00_INIT_viveiro_live.sql`

4. **Configurar .env.local:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://tu-servidor:8000
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_generada
   ```

**Documentación completa:** [docs/setup/SUPABASE_SELFHOSTED.md](../../docs/setup/SUPABASE_SELFHOSTED.md)

---

## 🔄 Historial de Migraciones (Legacy)

Estas migraciones fueron usadas durante el desarrollo incremental del proyecto. **NO las uses en nuevos proyectos** (ya están consolidadas en `00_INIT_viveiro_live.sql`).

| Archivo | Fecha | Descripción | Estado |
|---------|-------|-------------|--------|
| `20250131_user_system_complete.sql` | 2025-01-31 | Sistema inicial de usuarios | ✅ Consolidado |
| `20250131_app_settings.sql` | 2025-01-31 | Configuración de la app | ✅ Consolidado |
| `20250131_add_locked_field.sql` | 2025-01-31 | Campo `locked` en settings | ✅ Consolidado |
| `20250131_add_sections_4_5.sql` | 2025-01-31 | Secciones 4 y 5 | ⚠️ Obsoleto (reemplazado) |
| `20250131_rename_sections_5_6.sql` | 2025-01-31 | Renombrar a 5 y 6 | ✅ Consolidado |
| `20250131_security_definer_solution.sql` | 2025-01-31 | Fix RLS recursión | ✅ Consolidado |
| `20250201_webcams.sql` | 2025-02-01 | Sistema de webcams | ✅ Consolidado |

---

## 🛠️ Troubleshooting

### Error: "relation already exists"

**Causa:** Ya ejecutaste la migración antes o hay tablas con el mismo nombre.

**Solución:**
1. Verifica qué tablas ya existen:
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public';
   ```
2. Si es un proyecto nuevo, borra y recrea el proyecto en Supabase
3. Si quieres mantener datos, usa migraciones incrementales

### Error: "permission denied for table"

**Causa:** RLS está activado y tu usuario no tiene permisos.

**Solución:**
1. Verifica que estás autenticado
2. Si eres admin, verifica tu rol:
   ```sql
   SELECT role FROM user_profiles WHERE id = auth.uid();
   ```
3. Si es null o 'user', actualiza a 'admin':
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE id = auth.uid();
   ```

### Las políticas RLS no funcionan

**Causa:** La función `is_admin()` no existe o hay recursión.

**Solución:**
1. Verifica que la función existe:
   ```sql
   SELECT proname FROM pg_proc WHERE proname = 'is_admin';
   ```
2. Si no existe, ejecuta la parte de funciones de `00_INIT_viveiro_live.sql`
3. Verifica que tiene `SECURITY DEFINER` para evitar recursión RLS

### No puedo insertar datos de ejemplo

**Causa:** Ya existen registros con las mismas claves.

**Solución:**
El script usa `ON CONFLICT DO NOTHING`, así que no debería haber error. Si lo hay:
```sql
-- Limpia datos de ejemplo (solo en desarrollo)
DELETE FROM webcams WHERE name IN ('Penedo do Galo', 'Xandíns Noriega Varela');
DELETE FROM app_settings WHERE category = 'sections';
```

---

## 📚 Recursos Adicionales

- [Documentación de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Guía de Migraciones en Supabase](https://supabase.com/docs/guides/getting-started/local-development#database-migrations)
- [Troubleshooting de PostgreSQL](https://supabase.com/docs/guides/database/debugging)

---

## ✅ Checklist de Verificación Post-Migración

Después de ejecutar la migración, verifica:

- [ ] Tabla `user_profiles` creada con políticas RLS
- [ ] Tabla `app_settings` con 14+ registros de configuración
- [ ] Tabla `webcams` con 2 cámaras de ejemplo
- [ ] Función `is_admin()` creada con `SECURITY DEFINER`
- [ ] Triggers de `updated_at` funcionando
- [ ] Puedes registrarte en la app
- [ ] Puedes convertir un usuario en admin
- [ ] Puedes acceder a `/admin` como admin
- [ ] RLS bloquea acceso no autorizado

---

**Última actualización:** 2025-02-01
**Mantenedor:** @landropunk
