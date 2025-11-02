# 🚀 Guía de Integración de Supabase - Viveiro Live

Esta guía te ayudará a integrar Supabase en el proyecto **Viveiro Live** desde cero, ya sea rescatándolo del repositorio o creando un nuevo proyecto.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Crear Proyecto en Supabase Cloud](#crear-proyecto-en-supabase-cloud)
3. [Ejecutar Migración Inicial](#ejecutar-migración-inicial)
4. [Configurar Variables de Entorno](#configurar-variables-de-entorno)
5. [Crear Usuario Administrador](#crear-usuario-administrador)
6. [Configurar OAuth (Opcional)](#configurar-oauth-opcional)
7. [Verificar Integración](#verificar-integración)
8. [Troubleshooting](#troubleshooting)

---

## 1. Requisitos Previos

### Software Necesario
- Node.js 18+ instalado
- pnpm 10+ instalado
- Navegador web moderno
- Cuenta de GitHub (para OAuth, opcional)

### Conocimientos Recomendados
- SQL básico
- Variables de entorno en Next.js
- Conceptos de autenticación

---

## 2. Crear Proyecto en Supabase Cloud

### Paso 1: Crear Cuenta
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"**
3. Regístrate con GitHub, Google o email

### Paso 2: Crear Nuevo Proyecto
1. En el Dashboard, haz clic en **"New Project"**
2. Rellena los datos:
   ```
   Organization: Tu organización (crea una si no tienes)
   Name: viveiro-live
   Database Password: [Genera una contraseña segura y guárdala]
   Region: Europe (Frankfurt) - el más cercano a España
   Pricing Plan: Free (para desarrollo)
   ```
3. Haz clic en **"Create new project"**
4. **Espera 2-3 minutos** mientras se provisiona la base de datos

### Paso 3: Obtener Credenciales
Una vez creado el proyecto:

1. Ve a **Settings** → **API**
2. Copia estos valores (los necesitarás más adelante):
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGc...
   service_role key: eyJhbGc... (¡NUNCA EXPONGAS ESTA CLAVE!)
   ```

---

## 3. Ejecutar Migración Inicial

### Opción A: Usando SQL Editor (Recomendado para principiantes)

1. En Supabase Dashboard, ve a **SQL Editor**
2. Haz clic en **"New query"**
3. Abre el archivo `supabase/migrations/00_INIT_viveiro_live.sql` de este proyecto
4. **Copia todo el contenido** del archivo
5. **Pégalo** en el SQL Editor de Supabase
6. Haz clic en **"Run"** (abajo a la derecha)
7. Verás un mensaje de éxito y una tabla con el resumen:
   ```
   tabla           | registros
   ----------------|----------
   user_profiles   | 0
   app_settings    | 14
   webcams         | 2
   ```

### Opción B: Usando Supabase CLI (Avanzado)

Si prefieres usar la CLI:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar sesión
supabase login

# Enlazar proyecto
supabase link --project-ref xxxxxxxxxxxxx

# Ejecutar migración
supabase db push
```

---

## 4. Configurar Variables de Entorno

### Paso 1: Crear archivo `.env.local`

En la raíz del proyecto, crea el archivo `.env.local`:

```bash
# Windows (PowerShell)
New-Item .env.local

# Linux/Mac
touch .env.local
```

### Paso 2: Agregar credenciales

Abre `.env.local` y agrega:

```env
# Supabase (OBLIGATORIO)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...tu_anon_key_aqui...

# MeteoGalicia (OPCIONAL - solo si quieres más cuota de API)
METEOGALICIA_API_KEY=tu_api_key_si_la_tienes
```

⚠️ **IMPORTANTE:**
- Reemplaza `xxxxxxxxxxxxx` con tu Project URL
- Reemplaza `eyJhbGc...` con tu `anon public` key
- **NUNCA** uses la `service_role` key en el frontend
- **NUNCA** subas este archivo a GitHub (ya está en .gitignore)

### Paso 3: Verificar variables

```bash
# Mostrar variables (sin valores sensibles)
pnpm run env:check  # Si tienes este script

# O manualmente:
echo $NEXT_PUBLIC_SUPABASE_URL
```

---

## 5. Crear Usuario Administrador

### Opción A: Registro desde la App (Recomendado)

1. Inicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

2. Abre [http://localhost:3000](http://localhost:3000)

3. Ve a **Registrarse** y crea tu cuenta:
   ```
   Email: tu-email@ejemplo.com
   Contraseña: [mínimo 8 caracteres]
   Nombre completo: Tu Nombre
   Ciudad: Viveiro
   Fecha de nacimiento: [tu fecha]
   ```

4. **Verifica tu email** (si está activado `require_email_verification`)

5. Una vez registrado, **convierte tu usuario en admin**:
   - Ve a Supabase Dashboard → **SQL Editor**
   - Ejecuta esta query (reemplaza el email):
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'tu-email@ejemplo.com';
   ```

6. **Recarga la página** en tu navegador (F5)

7. Ahora podrás acceder a [http://localhost:3000/admin](http://localhost:3000/admin)

### Opción B: Crear Admin Directamente en SQL

Si prefieres crear el admin sin pasar por registro:

```sql
-- 1. Insertar usuario en auth.users (usa Supabase Dashboard → Authentication → Add user)
-- O ejecuta esto si tienes acceso directo:

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@viveiro.live',
  crypt('password123', gen_salt('bf')),  -- Cambia 'password123'
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"role": "admin"}',
  false,
  '',
  ''
);

-- 2. Crear perfil en user_profiles
INSERT INTO user_profiles (id, email, full_name, role, city)
SELECT
  id,
  email,
  'Administrador',
  'admin',
  'Viveiro'
FROM auth.users
WHERE email = 'admin@viveiro.live';
```

⚠️ **Nota:** Es más fácil usar el método A (registro normal + UPDATE role).

---

## 6. Configurar OAuth (Opcional)

Si quieres permitir login con GitHub, Google, etc:

### GitHub OAuth

1. Ve a Supabase Dashboard → **Authentication** → **Providers**
2. Activa **GitHub**
3. Sigue la guía: [docs/setup/oauth/OAUTH_SETUP.md](oauth/OAUTH_SETUP.md)

### Otros Providers

Consulta la documentación oficial:
- [Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Facebook OAuth](https://supabase.com/docs/guides/auth/social-login/auth-facebook)
- [Twitter OAuth](https://supabase.com/docs/guides/auth/social-login/auth-twitter)

---

## 7. Verificar Integración

### Test 1: Conexión a Supabase

Crea un archivo de prueba `test-connection.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ Error de conexión:', error)
  } else {
    console.log('✅ Conexión exitosa:', data)
  }
}

testConnection()
```

Ejecuta:
```bash
node test-connection.js
```

### Test 2: Autenticación

1. Ve a [http://localhost:3000/auth/login](http://localhost:3000/auth/login)
2. Inicia sesión con tu usuario
3. Deberías ver el dashboard

### Test 3: Permisos de Admin

1. Ve a [http://localhost:3000/admin](http://localhost:3000/admin)
2. Si eres admin, verás el panel
3. Si no, serás redirigido a `/dashboard`

### Test 4: RLS (Row Level Security)

Verifica que las políticas funcionan:

```sql
-- En Supabase SQL Editor, ejecuta esto como usuario normal (no service_role):
SELECT * FROM user_profiles;
-- Deberías ver SOLO tu perfil

-- Ejecuta esto como admin:
SELECT * FROM user_profiles;
-- Deberías ver TODOS los perfiles
```

---

## 8. Troubleshooting

### Error: "Invalid API key"

**Causa:** Las variables de entorno no están configuradas correctamente.

**Solución:**
1. Verifica que `.env.local` existe y tiene las credenciales correctas
2. Reinicia el servidor de desarrollo (`pnpm dev`)
3. Asegúrate de usar `NEXT_PUBLIC_` en el nombre de las variables

### Error: "Row Level Security policy violation"

**Causa:** Las políticas RLS están bloqueando el acceso.

**Solución:**
1. Verifica que el usuario está autenticado (`auth.uid()` no es null)
2. Si eres admin, verifica que tu rol es `'admin'`:
   ```sql
   SELECT id, email, role FROM user_profiles WHERE email = 'tu-email@ejemplo.com';
   ```
3. Si el rol es `'user'`, cámbialo a `'admin'`:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
   ```

### Error: "Migration failed"

**Causa:** La migración tiene errores SQL o hay conflictos con datos existentes.

**Solución:**
1. Borra el proyecto de Supabase y créalo de nuevo (solo en desarrollo)
2. O ejecuta las migraciones una por una para identificar el error:
   ```sql
   -- Ejecuta sección por sección del archivo 00_INIT_viveiro_live.sql
   ```

### Error: "Cannot read properties of null (reading 'id')"

**Causa:** El usuario no está autenticado o la sesión expiró.

**Solución:**
1. Cierra sesión y vuelve a iniciar sesión
2. Limpia las cookies del navegador
3. Verifica que el middleware de autenticación está funcionando

### Las webcams no se muestran

**Causa:** No hay webcams en la base de datos o están inactivas.

**Solución:**
1. Verifica que hay webcams:
   ```sql
   SELECT * FROM public.webcams;
   ```
2. Inserta webcams de ejemplo si no hay:
   ```sql
   -- El script 00_INIT_viveiro_live.sql ya las inserta
   ```

### El panel de admin muestra "No autorizado"

**Causa:** Tu usuario no tiene rol `'admin'`.

**Solución:**
1. Verifica tu rol:
   ```sql
   SELECT role FROM user_profiles WHERE email = 'tu-email@ejemplo.com';
   ```
2. Actualízalo a admin:
   ```sql
   UPDATE user_profiles SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
   ```
3. Recarga la página (F5)

---

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [API de Next.js con Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [OAuth Setup Completo](oauth/OAUTH_SETUP.md) - En este repositorio

---

## ✅ Checklist Final

Antes de continuar, asegúrate de que:

- [ ] Proyecto de Supabase creado
- [ ] Migración `00_INIT_viveiro_live.sql` ejecutada sin errores
- [ ] Variables de entorno en `.env.local` configuradas
- [ ] Usuario administrador creado y rol verificado
- [ ] Puedes acceder a `/admin` sin problemas
- [ ] RLS está habilitado y funcionando correctamente
- [ ] OAuth configurado (si lo necesitas)

**¡Listo!** Tu proyecto Viveiro Live está integrado con Supabase. Ahora puedes:

1. Desarrollar nuevas funcionalidades
2. Agregar más tablas según necesites
3. Configurar webhooks y funciones serverless
4. Desplegar a producción en Vercel

---

**Siguiente paso:** [Instalación de Supabase Self-Hosted](SUPABASE_SELFHOSTED.md) (para no depender de Supabase Cloud)
