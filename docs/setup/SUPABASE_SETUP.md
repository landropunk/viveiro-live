# Configuración de Supabase

Esta guía te ayudará a configurar Supabase para tu aplicación de Meteorología Viveiro.

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa los datos:
   - **Name**: `meteo-viveiro` (o el nombre que prefieras)
   - **Database Password**: Guarda esta contraseña en un lugar seguro
   - **Region**: Elige la más cercana (Europa Oeste recomendado para España)
   - **Pricing Plan**: Free (suficiente para empezar)

## 2. Obtener las Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** (⚙️) → **API**
2. Copia las siguientes credenciales:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Empieza con `eyJhbG...`

## 3. Configurar Variables de Entorno

Actualiza tu archivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbG..."

# MeteoGalicia API (mantener)
METEOGALICIA_API_KEY="e5Mx8wqEwpa03z56v7DZ2nKAfJ689hnR546iP4DCtdfNE32CRN8U8B265gm7j5CV"

# Node Environment
NODE_ENV="development"
```

## 4. Configurar OAuth Providers

### Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**
4. Ve a **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configura:
   - **Application type**: Web application
   - **Name**: Meteo Viveiro
   - **Authorized redirect URIs**:
     ```
     https://tu-proyecto.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback (para desarrollo)
     ```
6. Copia **Client ID** y **Client Secret**

7. En Supabase:
   - Ve a **Authentication** → **Providers**
   - Activa **Google**
   - Pega **Client ID** y **Client Secret**
   - Guarda cambios

### Facebook OAuth

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una nueva app
3. Añade el producto **Facebook Login**
4. Configura:
   - **Valid OAuth Redirect URIs**:
     ```
     https://tu-proyecto.supabase.co/auth/v1/callback
     ```
5. Copia **App ID** y **App Secret**

6. En Supabase:
   - Ve a **Authentication** → **Providers**
   - Activa **Facebook**
   - Pega **App ID** y **App Secret**
   - Guarda cambios

### Apple Sign In

1. Ve a [Apple Developer](https://developer.apple.com/)
2. Registra un nuevo **Services ID**
3. Configura:
   - **Return URLs**:
     ```
     https://tu-proyecto.supabase.co/auth/v1/callback
     ```
4. Copia **Services ID** y **Key ID**

5. En Supabase:
   - Ve a **Authentication** → **Providers**
   - Activa **Apple**
   - Pega **Services ID** y **Key ID**
   - Guarda cambios

## 5. Configurar Email Templates (Opcional)

Para personalizar emails de verificación y recuperación:

1. Ve a **Authentication** → **Email Templates**
2. Personaliza los templates:
   - **Confirm signup**: Email de verificación
   - **Reset password**: Email de recuperación de contraseña
   - **Magic Link**: Login sin contraseña

Ejemplo de personalización:

```html
<h2>Bienvenido a Meteorología Viveiro</h2>
<p>Haz clic en el enlace para confirmar tu cuenta:</p>
<a href="{{ .ConfirmationURL }}">Confirmar Email</a>
```

## 6. Configurar Políticas de Seguridad (Row Level Security)

Supabase usa PostgreSQL con Row Level Security (RLS) para proteger datos.

### Habilitar RLS en la tabla de usuarios:

```sql
-- La tabla auth.users ya está protegida por defecto
-- Si creas tablas personalizadas, habilita RLS así:

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Permitir que los usuarios solo vean/editen su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

## 7. Configurar Redirect URLs

Para que OAuth funcione correctamente:

1. Ve a **Authentication** → **URL Configuration**
2. Añade las siguientes URLs:

**Site URL (producción):**
```
https://tu-dominio.com
```

**Redirect URLs (desarrollo y producción):**
```
http://localhost:3000/auth/callback
https://tu-dominio.com/auth/callback
https://tu-dominio.vercel.app/auth/callback
```

## 8. Verificar Configuración

Para verificar que todo funciona:

1. Inicia tu aplicación: `pnpm dev`
2. Ve a [http://localhost:3000/auth/register](http://localhost:3000/auth/register)
3. Prueba:
   - Registro con email/contraseña
   - Login con Google
   - Login con Facebook
   - Login con Apple

## 9. Deploy a Vercel

Cuando despliegues a Vercel:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Añade:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `METEOGALICIA_API_KEY`

4. Actualiza las **Redirect URLs** en Supabase con tu dominio de Vercel

## 10. Monitoreo y Límites

**Plan Free de Supabase incluye:**
- 500 MB de base de datos
- 1 GB de almacenamiento
- 2 GB de transferencia
- 50,000 usuarios activos mensuales
- Unlimited API requests

**Monitorear uso:**
- Dashboard de Supabase → **Reports**
- Ver usuarios activos, storage usado, requests API

## Troubleshooting

### Error: "Invalid API key"
- Verifica que las variables de entorno estén correctas
- Asegúrate de reiniciar el servidor después de cambiar `.env.local`

### OAuth no funciona
- Verifica las **Redirect URLs** en cada provider
- Asegúrate de que coincidan exactamente (http vs https)

### "Email not confirmed"
- Por defecto, Supabase requiere confirmación de email
- Desactívalo en **Authentication** → **Providers** → **Email** → desmarcar "Confirm email"

### Rate limiting
- Supabase tiene rate limits por defecto
- Plan free: 10 requests/segundo
- Configurable en **Authentication** → **Rate Limits**

## Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de Auth con Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Soporte

Si tienes problemas:
1. Revisa los logs en el dashboard de Supabase
2. Consulta la [documentación oficial](https://supabase.com/docs)
3. Pregunta en [GitHub Discussions](https://github.com/supabase/supabase/discussions)
