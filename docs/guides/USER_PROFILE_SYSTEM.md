# Sistema de Perfiles de Usuario - Documentación

## Resumen

Sistema completo de gestión de perfiles de usuario con OAuth, formulario obligatorio de registro, configuración de entorno flexible, y políticas RLS seguras.

## 📋 Características Implementadas

### 1. Formulario Obligatorio de Completar Perfil

**Ubicación:** `/complete-profile`

**Campos obligatorios:**
- Email (readonly, viene de OAuth)
- Nombre completo *
- **Fecha de nacimiento * (NUEVO)**
- Ciudad * (opciones: Viveiro / Otro)
- Código Postal (obligatorio si ciudad ≠ Viveiro)

**Flujo OAuth:**
1. Usuario hace clic en "Continuar con Google/Facebook/Microsoft"
2. OAuth redirige a Supabase para autenticación
3. Supabase redirige a `/auth/callback?code=...`
4. Callback intercambia código por sesión y crea perfil básico (id, email, role='user')
5. Redirige a `/dashboard`
6. Middleware detecta perfil incompleto (`full_name`, `city` o `birth_date` vacíos)
7. Redirige automáticamente a `/complete-profile`
8. Usuario completa formulario
9. Redirige a `/dashboard`

**Archivos:**
- `app/(auth)/complete-profile/page.tsx` - Formulario de cliente
- `app/api/user/complete-profile/route.ts` - API para guardar datos
- `app/auth/callback/route.ts` - Callback OAuth (crea perfil básico)
- `contexts/AuthContext.tsx` - Funciones signInWithGoogle/Facebook/Microsoft

---

### 2. Configuración de Entorno y OAuth (NUEVO)

**Variables de entorno críticas:**

```bash
# URL base de tu aplicación (configura según entorno)
NEXT_PUBLIC_SITE_URL="http://192.168.88.4:3000"  # Red local
# o
NEXT_PUBLIC_SITE_URL="http://localhost:3000"      # Desarrollo local
# o
NEXT_PUBLIC_SITE_URL="https://viveiro.live"       # Producción
```

**⚠️ IMPORTANTE:** Esta variable debe coincidir con el "Site URL" configurado en Supabase Dashboard.

**Archivos de configuración por entorno:**
- `.env.example` - Plantilla con todas las variables
- `.env.local.development` - Para desarrollo local (localhost)
- `.env.local.network` - Para desarrollo en red local (IP)
- `.env.production.template` - Plantilla para producción

**Configuración de OAuth:**
1. **En `contexts/AuthContext.tsx`:**
   - Usa `NEXT_PUBLIC_SITE_URL` para redirectTo
   - Fallback a `window.location.origin` si no está configurado

2. **En `app/auth/callback/route.ts`:**
   - Usa `NEXT_PUBLIC_SITE_URL` para redirecciones finales
   - Asegura que el usuario regrese a la URL correcta

3. **En Supabase Dashboard:**
   - **Site URL:** Debe ser igual a `NEXT_PUBLIC_SITE_URL`
   - **Redirect URLs:** Agregar `{SITE_URL}/auth/callback` y `{SITE_URL}/**`

**Ver guía completa:** [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

---

### 3. Middleware de Verificación de Perfil

**Archivo modificado:** `lib/supabase/middleware.ts`

**Funcionalidad:**
- Verifica si el usuario tiene perfil completo antes de acceder a `/dashboard` o `/admin`
- Redirige a `/complete-profile` si falta `full_name` o `city`
- No bloquea rutas de API ni la página de completar perfil

---

### 3. Sistema de Configuración (Settings)

**Tabla:** `app_settings`

**Migración SQL:** `supabase/migrations/20250131_app_settings.sql`

**Configuraciones disponibles:**

| Key | Label | Valor por defecto | Descripción |
|-----|-------|-------------------|-------------|
| `users_can_edit_profile` | Los usuarios pueden editar su perfil | `true` | Permite/deshabilita edición de perfiles por usuarios |
| `users_can_change_email` | Los usuarios pueden cambiar su email | `false` | Permite cambio de email (no implementado aún) |
| `require_email_verification` | Requiere verificación de email | `true` | Email verification requerida |
| `allow_user_registration` | Permitir registro de nuevos usuarios | `true` | Habilita/deshabilita registro |
| `default_user_role` | Rol por defecto | `"user"` | Rol asignado a nuevos usuarios |
| `password_reset_enabled` | Permitir restablecimiento de contraseña | `true` | Habilita recuperación de contraseña |

**Funciones helper:** `lib/settings.ts`
- `getSetting(key)` - Obtener un setting
- `getSettings(keys[])` - Obtener múltiples settings
- `getSettingsByCategory(category)` - Obtener por categoría
- `updateSetting(key, value)` - Actualizar setting
- `canUsersEditProfile()` - Verificar si usuarios pueden editar
- `isPasswordResetEnabled()` - Verificar si recuperación habilitada

---

### 4. Panel de Configuración de Usuarios (Admin)

**Ubicación:** `/admin/settings/users`

**Funcionalidad:**
- Lista de toggles para permisos de usuarios
- Cambios se aplican inmediatamente
- Solo accesible por administradores

**Archivos:**
- `app/(admin)/admin/settings/users/page.tsx`
- `app/api/admin/user-settings/route.ts`

---

### 5. Página de Perfil de Usuario

**Ubicación:** `/dashboard/profile`

**Secciones:**

**Información Básica:**
- Email (readonly)
- Nombre completo *
- Teléfono
- Biografía

**Ubicación:**
- Dirección
- Ciudad * (Viveiro / Otro)
- Código Postal (condicional)

**Información Adicional:**
- Fecha de nacimiento
- Avatar URL

**Características:**
- Verifica permisos antes de permitir edición
- Muestra mensaje si edición está deshabilitada por admin
- Validaciones en frontend y backend
- Botones Cancelar / Guardar cambios

**Archivos:**
- `app/(dashboard)/dashboard/profile/page.tsx`
- `app/api/user/profile/route.ts` (GET, PATCH)
- `app/api/user/permissions/route.ts` (GET)

---

### 6. Recuperación de Contraseña

**Flujo completo:**

1. **Solicitar recuperación:** `/auth/forgot-password`
   - Usuario introduce email
   - Sistema envía enlace por email
   - No revela si el email existe (seguridad)

2. **Restablecer contraseña:** `/auth/reset-password`
   - Usuario accede desde enlace en email
   - Introduce nueva contraseña (mínimo 8 caracteres)
   - Confirma contraseña
   - Redirige a login

**Archivos:**
- `app/(auth)/auth/forgot-password/page.tsx`
- `app/(auth)/auth/reset-password/page.tsx`
- `app/api/auth/forgot-password/route.ts`
- `app/api/auth/reset-password/route.ts`

**Nota:** El enlace "¿Olvidaste tu contraseña?" ya existía en `/auth/login`

---

## 🗄️ Estructura de Base de Datos

### Tabla: `user_profiles`

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Viveiro',
  postal_code TEXT,
  birth_date DATE,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: `app_settings`

```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Políticas RLS (Row Level Security)

**user_profiles:** Políticas con SECURITY DEFINER para evitar recursión

```sql
-- Función que evita recursión RLS
CREATE FUNCTION is_admin(user_id UUID) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;
```

**Políticas implementadas:**
- ✅ `select_own_profile`: Ver tu propio perfil (`auth.uid() = id`)
- ✅ `admin_select_all`: Admins ven todos los perfiles (`is_admin(auth.uid())`)
- ✅ `insert_own_profile`: Insertar tu propio perfil (para OAuth callback)
- ✅ `update_own_profile`: Actualizar tu propio perfil
- ✅ `admin_update_all`: Admins pueden actualizar cualquier perfil

**¿Por qué SECURITY DEFINER?**
- Evita recursión infinita al verificar roles
- Ejecuta la verificación con privilegios elevados, sin activar RLS
- Solución segura que cumple con GDPR (usuarios solo ven su propio perfil)

**app_settings:**
- Usuarios autenticados pueden leer configuración
- Solo service_role puede modificar configuración

**Migración consolidada:** `supabase/migrations/20250131_user_system_complete.sql`

---

## 🚀 Instrucciones de Uso

### Para Administradores

1. **Ejecutar migración SQL de settings:**
   ```sql
   -- Copiar contenido de supabase/migrations/20250131_app_settings.sql
   -- y ejecutar en Supabase SQL Editor
   ```

2. **Configurar permisos de usuarios:**
   - Ir a: `/admin/settings/users`
   - Activar/desactivar permisos con toggles

3. **Gestionar usuarios:**
   - Ir a: `/admin/users`
   - Ver listado de usuarios registrados
   - Editar perfiles, roles y estado activo

### Para Usuarios

1. **Primer login (OAuth):**
   - Registrarse con Google/Facebook/Microsoft
   - Completar formulario obligatorio
   - Acceder al dashboard

2. **Editar perfil:**
   - Ir a: `/dashboard/profile`
   - Actualizar información personal
   - Guardar cambios (si el admin lo permite)

3. **Recuperar contraseña:**
   - En login, clic en "¿Olvidaste tu contraseña?"
   - Introducir email
   - Revisar bandeja de entrada
   - Seguir enlace y establecer nueva contraseña

---

## 🔒 Seguridad

### Medidas Implementadas

1. **Row Level Security (RLS)** en todas las tablas
2. **Middleware** verifica autenticación y permisos
3. **Validaciones** en frontend y backend
4. **No se revela** si un email existe al solicitar recuperación
5. **Protección contra auto-demotion** (admin no puede quitarse permisos)
6. **Contraseñas mínimo 8 caracteres**

---

## 📝 Tareas Pendientes (Opcionales)

### Funcionalidades Futuras

- [ ] Permitir cambio de email (requiere re-verificación)
- [ ] Subida de avatar a storage de Supabase
- [ ] Historial de cambios de perfil
- [ ] 2FA (autenticación de dos factores)
- [ ] Configuración de notificaciones
- [ ] Exportar datos personales (GDPR)
- [ ] Eliminar cuenta

### Mejoras

- [ ] Tests unitarios y de integración
- [ ] Validación de teléfono con regex
- [ ] Autocompletado de dirección
- [ ] Preview de avatar antes de guardar
- [ ] Límite de intentos de recuperación de contraseña
- [ ] Rate limiting en APIs

---

## 🐛 Resolución de Problemas

### Usuario no puede acceder a /admin

**Problema:** Middleware redirige al dashboard

**Solución:**
1. Verificar que `user_profiles.role = 'admin'`
2. Ejecutar SQL:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'tu@email.com';
   ```

### Error: "infinite recursion detected in policy for relation user_profiles"

**Problema:** Políticas RLS intentan consultar `user_profiles` mientras verifican permisos, causando recursión

**Solución:**
1. Eliminar políticas RLS existentes
2. Ejecutar migración consolidada:
   ```sql
   -- Ejecutar: supabase/migrations/20250131_security_definer_solution.sql
   -- O mejor: supabase/migrations/20250131_user_system_complete.sql
   ```
3. Esto crea políticas con función `is_admin(UUID)` que usa `SECURITY DEFINER` para evitar recursión

### OAuth redirige a localhost en vez de IP de red local

**Problema:** Cuando accedes desde otro PC, OAuth redirige a `localhost:3000` en vez de `192.168.88.4:3000`

**Solución:**
1. **Configurar `.env.local`:**
   ```bash
   NEXT_PUBLIC_SITE_URL="http://192.168.88.4:3000"
   ```

2. **Configurar Supabase Dashboard:**
   - Ve a: Authentication → URL Configuration
   - **Site URL:** `http://192.168.88.4:3000`
   - **Redirect URLs:** Agregar:
     ```
     http://localhost:3000/**
     http://192.168.88.4:3000/**
     http://localhost:3000/auth/callback
     http://192.168.88.4:3000/auth/callback
     ```

3. **Reiniciar servidor:**
   ```bash
   # Detener con Ctrl+C
   pnpm dev
   ```

4. **Limpiar caché del navegador** y esperar 2-3 minutos para que Supabase aplique cambios

### OAuth falla con "Database error saving new user"

**Problema:** El trigger de base de datos falla al intentar crear perfiles con campos NOT NULL vacíos

**Solución:**
1. El trigger ya fue eliminado
2. El callback en `app/auth/callback/route.ts` ahora crea perfiles manualmente
3. Si persiste, verificar que las columnas permiten NULL:
   ```sql
   ALTER TABLE user_profiles
     ALTER COLUMN full_name DROP NOT NULL,
     ALTER COLUMN city DROP NOT NULL,
     ALTER COLUMN birth_date DROP NOT NULL;
   ```

### Perfil aparece vacío

**Problema:** Políticas RLS bloquean lectura

**Solución:**
1. Verificar que políticas RLS existen
2. Re-ejecutar migración `20250131_user_system_complete.sql`

### Recuperación de contraseña no funciona

**Problema:** Email no llega

**Solución:**
1. Verificar configuración SMTP en Supabase
2. Verificar `NEXT_PUBLIC_SITE_URL` en `.env.local`
3. Revisar spam/correo no deseado

### Admin aparece redirigido a /complete-profile

**Problema:** Admin tiene campos obligatorios vacíos (ej: `birth_date`)

**Solución:**
```sql
UPDATE user_profiles
SET birth_date = '1980-01-01'  -- Cambiar por fecha real
WHERE email = 'admin@example.com';
```

---

## 📚 Referencias

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

Generado automáticamente por Claude Code
