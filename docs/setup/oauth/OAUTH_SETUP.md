# Configuración OAuth Providers - Guía Completa

Esta guía te ayudará a configurar los proveedores OAuth (Google, Facebook, Apple, Microsoft) para que los usuarios puedan registrarse e iniciar sesión en tu aplicación con sus cuentas sociales.

## 📋 Tabla de Contenidos

- [Google OAuth](#-1-google-oauth)
- [Facebook OAuth](#-2-facebook-oauth)
- [Apple OAuth](#-3-apple-oauth)
- [Microsoft OAuth](#-4-microsoft-oauth)
- [Configuración en Supabase](#configuración-en-supabase)
- [URLs de Callback](#urls-de-callback)
- [Testing Local](#testing-local)

---

## 🔴 1. Google OAuth

### Paso 1: Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Nombre del proyecto: `Meteo-Viveiro` (o el que prefieras)

### Paso 2: Habilitar Google+ API

1. En el menú lateral, ve a **APIs y servicios** → **Biblioteca**
2. Busca "Google+ API" o "Google Identity"
3. Haz clic en **Habilitar**

### Paso 3: Configurar OAuth Consent Screen

1. Ve a **APIs y servicios** → **Pantalla de consentimiento de OAuth**
2. Selecciona **Externo** (para cualquier usuario de Google)
3. Rellena el formulario:
   - **Nombre de la aplicación**: `Meteo Viveiro`
   - **Correo de soporte**: tu email
   - **Logo de la aplicación**: (opcional) tu logo
   - **Dominios autorizados**: `tu-proyecto.supabase.co`
   - **Correo de contacto del desarrollador**: tu email
4. En **Scopes** (Alcances):
   - Añade: `.../auth/userinfo.email`
   - Añade: `.../auth/userinfo.profile`
5. Guarda y continúa

### Paso 4: Crear Credenciales OAuth

1. Ve a **APIs y servicios** → **Credenciales**
2. Haz clic en **+ CREAR CREDENCIALES** → **ID de cliente de OAuth 2.0**
3. Tipo de aplicación: **Aplicación web**
4. Nombre: `Meteo Viveiro Web App`
5. **Orígenes autorizados de JavaScript**:
   ```
   http://localhost:3000
   https://tu-proyecto.vercel.app
   ```
6. **URIs de redirección autorizados**:
   ```
   https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```
   ⚠️ **IMPORTANTE**: Cambia `mrkbskofbkkrkxqlyqir` por tu ID de proyecto Supabase

7. Haz clic en **Crear**
8. **GUARDA** el `Client ID` y `Client Secret` que aparecen

### Paso 5: Configurar en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Authentication** → **Providers**
3. Busca **Google** y haz clic en él
4. Activa el toggle **Enable Sign in with Google**
5. Pega:
   - **Client ID**: el que guardaste
   - **Client Secret**: el que guardaste
6. Guarda los cambios

---

## 🔵 2. Facebook OAuth

### Paso 1: Crear App en Facebook Developers

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Haz clic en **Mis aplicaciones** → **Crear aplicación**
3. Selecciona tipo: **Consumidor**
4. Nombre de la aplicación: `Meteo Viveiro`
5. Correo de contacto: tu email
6. Crea la aplicación

### Paso 2: Añadir Producto Facebook Login

1. En el dashboard de tu app, busca **Facebook Login**
2. Haz clic en **Configurar**
3. Selecciona **Web** como plataforma
4. URL del sitio: `https://mrkbskofbkkrkxqlyqir.supabase.co`
   ⚠️ Cambia por tu URL de Supabase

### Paso 3: Configurar OAuth Redirect URIs

1. En el menú lateral, ve a **Facebook Login** → **Configuración**
2. En **URI de redireccionamiento de OAuth válidos**, añade:
   ```
   https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
   ```
   ⚠️ Cambia por tu URL de Supabase
3. Guarda los cambios

### Paso 4: Obtener Credenciales

1. Ve a **Configuración** → **Básica** (en el menú lateral)
2. **GUARDA**:
   - **Identificador de la aplicación** (App ID)
   - **Clave secreta de la aplicación** (App Secret) - haz clic en "Mostrar"

### Paso 5: Configurar Privacidad y Dominio

1. En **Configuración** → **Básica**:
   - **Dominio de la aplicación**: `tu-proyecto.supabase.co`
   - **URL de la política de privacidad**: tu URL de política de privacidad
   - **URL de las condiciones del servicio**: tu URL de términos
2. Guarda

### Paso 6: Pasar a Producción

⚠️ **IMPORTANTE**: Por defecto, la app está en modo "Desarrollo"

1. En la parte superior, verás un toggle de **Desarrollo** → **Activo**
2. Para activarla necesitas:
   - Añadir política de privacidad
   - Añadir icono de la app (1024x1024px)
   - Seleccionar una categoría
3. Cuando esté lista, haz clic en el botón para cambiar a **Activo**

### Paso 7: Configurar en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. **Authentication** → **Providers**
3. Busca **Facebook** y haz clic
4. Activa **Enable Sign in with Facebook**
5. Pega:
   - **Facebook client ID**: tu App ID
   - **Facebook client secret**: tu App Secret
6. Guarda

---

## 🍎 3. Apple OAuth

⚠️ **REQUISITOS**: Necesitas una cuenta de Apple Developer ($99/año)

### Paso 1: Crear App ID

1. Ve a [Apple Developer](https://developer.apple.com/account/)
2. Ve a **Certificates, Identifiers & Profiles**
3. Haz clic en **Identifiers** → **+** (crear nuevo)
4. Selecciona **App IDs** → Continuar
5. Selecciona **App** → Continuar
6. Rellena:
   - **Description**: `Meteo Viveiro`
   - **Bundle ID**: `com.tudominio.meteoviveiro` (elige uno único)
7. En **Capabilities**, activa **Sign in with Apple**
8. Guarda

### Paso 2: Crear Services ID

1. En **Identifiers**, haz clic en **+** de nuevo
2. Selecciona **Services IDs** → Continuar
3. Rellena:
   - **Description**: `Meteo Viveiro Web`
   - **Identifier**: `com.tudominio.meteoviveiro.web`
4. Marca **Sign in with Apple**
5. Haz clic en **Configure** junto a "Sign in with Apple"
6. En **Primary App ID**: selecciona el App ID que creaste antes
7. En **Website URLs**:
   - **Domains**: `tu-proyecto.supabase.co`
   - **Return URLs**: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`
8. Guarda todo

### Paso 3: Crear Key para Sign in with Apple

1. Ve a **Keys** → **+** (crear nueva)
2. **Key Name**: `Meteo Viveiro Sign in Key`
3. Marca **Sign in with Apple**
4. Haz clic en **Configure**
5. Selecciona tu Primary App ID
6. Guarda y continúa
7. **DESCARGA** el archivo `.p8` - solo puedes descargarlo UNA vez
8. **GUARDA** el **Key ID** que aparece

### Paso 4: Obtener Team ID

1. En la esquina superior derecha de Apple Developer
2. Haz clic en tu nombre/organización
3. **GUARDA** tu **Team ID** (10 caracteres)

### Paso 5: Configurar en Supabase

⚠️ **Apple OAuth es más complejo** - Supabase necesita configuración adicional

1. Ve a Supabase Dashboard → **Authentication** → **Providers**
2. Busca **Apple** y haz clic
3. Activa **Enable Sign in with Apple**
4. Necesitarás proporcionar:
   - **Services ID**: tu identifier (`com.tudominio.meteoviveiro.web`)
   - **Team ID**: tu Team ID de 10 caracteres
   - **Key ID**: el Key ID de tu .p8
   - **Private Key**: abre el archivo `.p8` y copia todo el contenido
5. Guarda

---

## 🔷 4. Microsoft OAuth

Microsoft OAuth (Azure AD) es ideal para usuarios que tienen cuentas Microsoft (Outlook, Office 365, Hotmail, etc.).

### Paso 1: Crear Aplicación en Azure Portal

1. Ve a [Azure Portal](https://portal.azure.com/)
2. Busca y selecciona **Azure Active Directory** (o **Microsoft Entra ID**)
3. En el menú lateral, ve a **App registrations** (Registros de aplicaciones)
4. Haz clic en **+ New registration** (Nuevo registro)

### Paso 2: Configurar el Registro de Aplicación

1. Rellena el formulario:
   - **Name**: `Meteo Viveiro`
   - **Supported account types**:
     - Selecciona **Accounts in any organizational directory and personal Microsoft accounts**
     - (Esto permite Outlook, Hotmail, Office 365, etc.)
   - **Redirect URI**:
     - Platform: **Web**
     - URL: `https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback`
     - ⚠️ Cambia por tu URL de Supabase
2. Haz clic en **Register** (Registrar)

### Paso 3: Obtener Application (client) ID

1. Después del registro, verás la página **Overview**
2. **GUARDA** el **Application (client) ID** - lo necesitarás para Supabase
3. **GUARDA** también el **Directory (tenant) ID** (opcional pero útil)

### Paso 4: Crear Client Secret

1. En el menú lateral de tu app, ve a **Certificates & secrets**
2. Haz clic en **+ New client secret**
3. Descripción: `Meteo Viveiro Supabase`
4. Expiration: Elige **24 months** (recomendado)
5. Haz clic en **Add**
6. **GUARDA** el **Value** del secret inmediatamente (solo se muestra una vez!)

### Paso 5: Configurar API Permissions

1. En el menú lateral, ve a **API permissions**
2. Haz clic en **+ Add a permission**
3. Selecciona **Microsoft Graph**
4. Selecciona **Delegated permissions**
5. Busca y añade estos permisos:
   - `email`
   - `openid`
   - `profile`
6. Haz clic en **Add permissions**
7. (Opcional) Haz clic en **Grant admin consent** si tienes permisos

### Paso 6: Configurar en Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. **Authentication** → **Providers**
3. Busca **Azure** (Microsoft usa Azure AD)
4. Activa **Enable Sign in with Azure**
5. Pega las credenciales:
   - **Azure Client ID**: tu Application (client) ID
   - **Azure Secret**: el Value del client secret que guardaste
6. Guarda los cambios

### Notas Importantes

- **Multi-tenant**: La configuración permite cualquier cuenta Microsoft (personal o empresarial)
- **El secret expira**: Recuerda renovar el client secret antes de que expire
- **Testing**: Funciona con Outlook.com, Hotmail.com, Live.com, Office 365, etc.

---

## ⚙️ Configuración en Supabase

### URL de Callback Principal

Tu URL de callback de Supabase es:
```
https://TU-PROYECTO-ID.supabase.co/auth/v1/callback
```

Para encontrar tu proyecto ID:
1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia la **URL** (algo como `https://mrkbskofbkkrkxqlyqir.supabase.co`)

### Redirect URLs Permitidas

En Supabase, también debes configurar las URLs de redirect de tu app:

1. Ve a **Authentication** → **URL Configuration**
2. En **Redirect URLs**, añade:
   ```
   http://localhost:3000/auth/callback
   https://tu-proyecto.vercel.app/auth/callback
   ```

---

## 🧪 Testing Local

### Configuración de /etc/hosts (Opcional)

Si tienes problemas con OAuth en localhost, puedes usar un dominio local:

**Windows**: Edita `C:\Windows\System32\drivers\etc\hosts`
**Mac/Linux**: Edita `/etc/hosts`

Añade:
```
127.0.0.1    local.meteoviveiro.com
```

Luego accede a: `http://local.meteoviveiro.com:3000`

### Probar OAuth Providers

1. Ejecuta tu app local: `pnpm dev`
2. Ve a `http://localhost:3000/auth/login`
3. Haz clic en cada botón de OAuth
4. Verifica que te redirige correctamente
5. Después de autorizar, debes volver a tu app con sesión iniciada

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"
- Verifica que la URL de callback esté EXACTAMENTE igual en el proveedor y en Supabase
- No olvides `https://` al principio
- No añadas `/` al final

### Error: "Access Blocked" en Google
- Asegúrate de haber añadido los scopes correctos en OAuth Consent Screen
- Verifica que el dominio esté autorizado

### Facebook: "URL Blocked"
- Añade el dominio en **Configuración** → **Básica** → **Dominio de la aplicación**
- Verifica que la app esté en modo **Activo** (no Desarrollo)

### Apple: "invalid_client"
- Verifica que el archivo `.p8` esté completo al pegarlo en Supabase
- Asegúrate de que el Services ID coincida EXACTAMENTE

---

## 📝 Checklist Final

Antes de ir a producción, verifica:

- [ ] Google OAuth configurado y probado
- [ ] Facebook OAuth configurado (app en modo Activo)
- [ ] Apple OAuth configurado (si tienes cuenta de developer)
- [ ] Microsoft OAuth configurado
- [ ] Todas las redirect URLs configuradas en Supabase
- [ ] Todas las redirect URLs configuradas en cada proveedor
- [ ] OAuth funciona en localhost
- [ ] OAuth funciona en producción (Vercel)
- [ ] Política de privacidad publicada (requerida por Facebook/Google)
- [ ] Términos de servicio publicados (requerida por algunos proveedores)

---

## 🔗 Enlaces Útiles

- [Google Cloud Console](https://console.cloud.google.com/)
- [Facebook Developers](https://developers.facebook.com/)
- [Apple Developer](https://developer.apple.com/account/)
- [Microsoft Azure Portal](https://portal.azure.com/)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/social-login)

---

**Siguiente paso**: Una vez configurado todo, prueba cada proveedor OAuth desde tu aplicación.
