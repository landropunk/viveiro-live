# OAuth Configurado en Meteo Viveiro

## Estado Actual

✅ **3 proveedores OAuth completamente configurados y funcionando:**

- **Google OAuth** - Usuarios pueden registrarse/iniciar sesión con Gmail
- **Microsoft OAuth (Azure AD)** - Usuarios pueden registrarse/iniciar sesión con Outlook/Hotmail
- **Facebook OAuth** - Usuarios pueden registrarse/iniciar sesión con Facebook

❌ **Apple OAuth** - Eliminado (requiere Apple Developer Program $99/año)

## Diferencia entre Login y Registro

### Página de Login (`/auth/login`)
- Si el usuario ya tiene sesión activa en el proveedor → Inicia sesión automáticamente
- Comportamiento rápido para usuarios recurrentes

### Página de Registro (`/auth/register`)
- **Siempre** muestra el selector de cuenta
- Permite elegir otra cuenta o crear una nueva
- Parámetro `forceAccountSelection=true` fuerza la selección de cuenta

## Credenciales Configuradas

### Google OAuth
- **Google Cloud Console**: https://console.cloud.google.com/
- **Proyecto**: `Meteo Viveiro`
- **Client ID**: `372968217265-qjve4adem811543tpjsm4fbz5q85mnf5.apps.googleusercontent.com`
- **Callback URL**: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`
- **Estado**: ✅ Funcionando en modo desarrollo

### Microsoft OAuth (Azure AD)
- **Azure Portal**: https://portal.azure.com/
- **Aplicación**: `Meteo Viveiro`
- **Application (client) ID**: `918b881f-20c4-419f-bd35-c78243326013`
- **Tenant**: `consumers` (cuentas personales de Microsoft)
- **Permisos**: email, openid, profile, User.Read
- **Callback URL**: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`
- **Estado**: ✅ Funcionando

### Facebook OAuth
- **Facebook Developers**: https://developers.facebook.com/
- **App**: `Meteo Viveiro`
- **App ID**: `4164923437097187`
- **Permisos**: email, public_profile
- **Callback URL**: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`
- **Estado**: ✅ Funcionando en modo desarrollo

## Implementación Técnica

### AuthContext (`contexts/AuthContext.tsx`)

Las funciones OAuth aceptan un parámetro opcional `forceAccountSelection`:

```typescript
signInWithGoogle(forceAccountSelection?: boolean)
signInWithFacebook(forceAccountSelection?: boolean)
signInWithMicrosoft(forceAccountSelection?: boolean)
```

- `false` o no especificado: Comportamiento normal (inicia sesión si ya hay sesión activa)
- `true`: Fuerza selección de cuenta con parámetros específicos:
  - **Google**: `prompt: 'select_account'`
  - **Microsoft**: `prompt: 'select_account'`
  - **Facebook**: `auth_type: 'reauthenticate'`

### Uso en Login vs Registro

**Login** (`app/auth/login/page.tsx`):
```typescript
onClick={signInWithGoogle}  // Sin parámetro = comportamiento normal
```

**Registro** (`app/auth/register/page.tsx`):
```typescript
onClick={() => signInWithGoogle(true)}  // Con true = fuerza selección
```

## Configuración en Supabase

Todos los proveedores están configurados en:
- **Supabase Dashboard** → **Authentication** → **Providers**
- Proyecto: `mrkbskofbkkrkxqlyqir`

Cada proveedor tiene:
- Toggle habilitado
- Client ID configurado
- Client Secret configurado
- Callback URL: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`

## Flujo de Autenticación OAuth

1. Usuario hace clic en botón "Continuar con [Proveedor]"
2. Se llama a `supabase.auth.signInWithOAuth()`
3. Supabase redirige al proveedor (Google/Microsoft/Facebook)
4. Usuario autoriza la aplicación
5. Proveedor redirige a: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`
6. Supabase procesa el callback y redirige a: `http://localhost:3000/auth/callback` (desarrollo)
7. Middleware verifica la sesión y redirige a `/dashboard`

## Modo Desarrollo vs Producción

### Modo Desarrollo (Actual)
- Google: Modo testing con OAuth consent screen
- Microsoft: Endpoint `consumers` para cuentas personales
- Facebook: Modo desarrollo, solo testers pueden usar

### Para Producción (Futuro)
- **Google**: Enviar app a verificación de Google
- **Microsoft**: Ya funciona con cualquier cuenta personal
- **Facebook**: Completar requisitos de publicación:
  - Icono de la app (1024x1024)
  - Política de privacidad
  - URL de eliminación de datos de usuario
  - Revisión de la app

## Dominios Personalizados (Opcional - Futuro)

Actualmente el mensaje de OAuth muestra:
> "Iniciar sesión en mrkbskofbkkrkxqlyqir.supabase.co"

Para cambiar a un dominio personalizado (ej: `meteoviveiro.com`):
1. Comprar dominio
2. Configurar Custom Domain en Supabase (requiere plan Pro ~$25/mes)
3. Actualizar URLs en Google/Microsoft/Facebook
4. Configurar DNS

## Seguridad

- ✅ Autenticación manejada por Supabase (servidor)
- ✅ Tokens almacenados en cookies HttpOnly
- ✅ CSRF protection con state tokens
- ✅ Callback URLs validadas por Supabase
- ✅ Secretos nunca expuestos al cliente
- ✅ Middleware protege rutas autenticadas

## Testing

Para probar OAuth en desarrollo:
1. Ir a `http://localhost:3000/auth/register`
2. Hacer clic en cualquier botón OAuth
3. Iniciar sesión con cuenta del proveedor
4. Verificar redirección correcta a `/dashboard`
5. Verificar que el usuario aparece en Supabase → Authentication → Users

## Mantenimiento

### Renovar Secrets
- **Microsoft**: Client Secret expira en 24 meses (octubre 2027)
- **Google**: No expira
- **Facebook**: No expira

### Actualizar Callback URLs
Si cambias de dominio, actualizar en:
1. Google Cloud Console → Credentials → OAuth 2.0 Client IDs
2. Azure Portal → App registrations → Authentication
3. Facebook Developers → Settings → Basic → Valid OAuth Redirect URIs
4. Supabase Dashboard → Authentication → URL Configuration

## Documentación Adicional

- [OAUTH_SETUP.md](./OAUTH_SETUP.md) - Guía completa de configuración paso a paso
- [HABILITAR_OAUTH_SUPABASE.md](./HABILITAR_OAUTH_SUPABASE.md) - Cómo habilitar proveedores en Supabase
- [MIGRATION_SUPABASE.md](./MIGRATION_SUPABASE.md) - Migración de JWT a Supabase Auth

## Soporte

Si tienes problemas con OAuth:
1. Verificar que los proveedores estén habilitados en Supabase
2. Verificar que las callback URLs sean correctas
3. Revisar logs en Supabase Dashboard → Logs
4. Verificar que el Client ID y Secret sean correctos
5. Verificar que la app esté en modo desarrollo (para testing)
