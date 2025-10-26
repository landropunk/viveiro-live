# Migración a Supabase - Completada ✅

Este documento resume la migración del sistema de autenticación custom (JWT + archivo JSON) a Supabase con OAuth.

## Cambios Realizados

### 1. Dependencias Añadidas
```bash
pnpm add @supabase/supabase-js @supabase/ssr
```

### 2. Archivos Nuevos Creados

#### Configuración de Supabase
- `lib/supabase/client.ts` - Cliente de Supabase para componentes del cliente
- `lib/supabase/server.ts` - Cliente de Supabase para Server Components y API Routes
- `lib/supabase/middleware.ts` - Utilidad para middleware de autenticación

#### Context de Autenticación
- `contexts/AuthContext.tsx` - Contexto React con hooks de autenticación
  - `useAuth()` - Hook para acceder al usuario y funciones de auth
  - Funciones incluidas:
    - `signIn(email, password)` - Login con email/contraseña
    - `signUp(email, password, metadata)` - Registro de usuario
    - `signOut()` - Cerrar sesión
    - `signInWithGoogle()` - Login con Google OAuth
    - `signInWithFacebook()` - Login con Facebook OAuth
    - `signInWithApple()` - Login con Apple Sign In

#### Rutas y Callbacks
- `app/auth/callback/route.ts` - Callback para OAuth (Google, Facebook, Apple)

### 3. Archivos Modificados

#### Middleware
- `middleware.ts` - Actualizado para usar Supabase Auth
  - Protege rutas automáticamente
  - Actualiza sesiones en cada request
  - Redirige usuarios no autenticados

#### Layout Principal
- `app/layout.tsx` - Envuelto con `AuthProvider`
  - Ahora todos los componentes tienen acceso a `useAuth()`

#### Páginas de Autenticación
- `app/auth/login/page.tsx` - Añadidos botones OAuth (Google, Facebook, Apple)
- `app/auth/register/page.tsx` - Añadidos botones OAuth (Google, Facebook, Apple)

#### Variables de Entorno
- `.env.local` - Actualizado con credenciales de Supabase
  ```bash
  NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."
  ```

### 4. Archivos a Eliminar (Obsoletos)

**⚠️ IMPORTANTE: No elimines estos archivos todavía hasta configurar Supabase**

Una vez que configures Supabase y verifiques que funciona, puedes eliminar:

- `lib/db.ts` - Base de datos en memoria (JSON)
- `lib/auth.ts` - Sistema JWT custom
- `lib/prisma.ts` - Cliente de Prisma (ya no necesario)
- `prisma/schema.prisma` - Schema de Prisma
- `app/api/auth/login/route.ts` - Login API route custom
- `app/api/auth/register/route.ts` - Register API route custom
- `app/api/auth/logout/route.ts` - Logout API route custom
- `app/api/auth/refresh/route.ts` - Refresh token API route custom

### 5. Documentación Añadida
- `SUPABASE_SETUP.md` - Guía completa de configuración de Supabase
- `MIGRATION_SUPABASE.md` - Este archivo

## Próximos Pasos

### 1. Configurar Supabase (REQUERIDO)

Sigue la guía en [SUPABASE_SETUP.md](SUPABASE_SETUP.md):

1. Crear proyecto en Supabase
2. Obtener credenciales (URL y ANON_KEY)
3. Actualizar `.env.local` con credenciales reales
4. Configurar OAuth providers (Google, Facebook, Apple)

### 2. Probar Localmente

```bash
# Reiniciar el servidor
pnpm dev

# Probar en http://localhost:3000
# 1. Registro con email/contraseña
# 2. Login con Google
# 3. Login con Facebook
# 4. Login con Apple
```

### 3. Actualizar Componentes que Usan Auth

Si tienes componentes que usan el sistema de auth antiguo, actualízalos:

**Antes (JWT custom):**
```tsx
const token = localStorage.getItem('accessToken');
const response = await fetch('/api/protected/me', {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Después (Supabase):**
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MiComponente() {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>No autenticado</div>;

  return <div>Hola {user.email}</div>;
}
```

### 4. Migrar API Routes Protegidas

**Antes:**
```ts
// app/api/protected/me/route.ts
import { verifyAccessToken } from '@/lib/auth';

export async function GET(request: Request) {
  const token = extractTokenFromHeader(request.headers.get('Authorization'));
  const result = await verifyAccessToken(token);
  // ...
}
```

**Después:**
```ts
// app/api/protected/me/route.ts
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ...
}
```

### 5. Deploy a Vercel

Cuando todo funcione localmente:

1. Haz commit de los cambios:
   ```bash
   git add .
   git commit -m "feat: Migrar a Supabase con OAuth (Google, Facebook, Apple)"
   git push
   ```

2. En Vercel, añade las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `METEOGALICIA_API_KEY`

3. Actualiza las Redirect URLs en Supabase con tu dominio de Vercel

## Ventajas de la Migración

### Antes (JWT Custom + JSON)
- ❌ Base de datos en memoria (se pierde al reiniciar)
- ❌ Solo email/contraseña
- ❌ Sin verificación de email
- ❌ Sin recuperación de contraseña
- ❌ Sin OAuth
- ❌ Mantenimiento manual de tokens
- ❌ Sin 2FA

### Después (Supabase)
- ✅ Base de datos PostgreSQL persistente
- ✅ Email/contraseña + OAuth (Google, Facebook, Apple)
- ✅ Verificación de email incluida
- ✅ Recuperación de contraseña incluida
- ✅ OAuth listo en 5 minutos
- ✅ Gestión automática de sesiones
- ✅ 2FA disponible
- ✅ Row Level Security
- ✅ Realtime (opcional)
- ✅ Storage de archivos (opcional)

## Compatibilidad con Proxmox

Cuando quieras migrar a Proxmox:

1. **Opción A - Mantener Supabase** (Recomendado):
   - App en Proxmox
   - Auth/DB en Supabase Cloud
   - Solo conectar via API

2. **Opción B - Supabase Self-Hosted**:
   - Docker Compose en Proxmox
   - Requiere más recursos (PostgreSQL, GoTrue, Kong, etc.)
   - Guía: https://supabase.com/docs/guides/self-hosting

## Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Next.js + Supabase Auth](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Soporte

Si tienes problemas durante la migración:

1. Revisa [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
2. Verifica los logs en el dashboard de Supabase
3. Consulta la documentación oficial
4. Pregunta en el Discord de Supabase

---

**Estado de la Migración:** ✅ Código migrado - Pendiente configuración de Supabase
