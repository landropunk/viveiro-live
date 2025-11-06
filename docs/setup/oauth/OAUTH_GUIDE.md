# 🔐 Guía Completa de Configuración OAuth

Esta guía unifica toda la información necesaria para configurar OAuth en viveiro.live con Google, Facebook y Microsoft.

---

## 📋 Resumen

OAuth ya está **completamente configurado y funcionando** en viveiro.live. Este documento sirve como referencia.

**Proveedores Activos:**
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ Microsoft OAuth

---

## 🎯 Estado Actual

### ✅ OAuth Funcional

La autenticación OAuth está implementada y funcionando en:
- **Login:** `/auth/login`
- **Register:** `/auth/register`
- **Callback:** `/auth/callback`

### 🔧 Configuración en Supabase

Los 3 proveedores OAuth están habilitados en el proyecto de Supabase:
- **Google:** Configurado con Client ID y Secret
- **Facebook:** Configurado con App ID y Secret
- **Microsoft:** Configurado con Application ID y Secret

---

## 📚 Configuración por Proveedor

### 🔵 Google OAuth

#### Credenciales Actuales:
```
Client ID: 1064663806859-76e9vdq9r2u9d09o2hi9bttnq1ec3npu.apps.googleusercontent.com
Client Secret: [Configurado en Supabase]
```

#### Redirect URI:
```
https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
```

#### Pasos para Actualizar (si necesario):

1. **Google Cloud Console**
   - URL: https://console.cloud.google.com
   - Proyecto: viveiro-live

2. **Configurar OAuth Consent Screen**
   - Tipo: Externo
   - Nombre: viveiro.live
   - Email de soporte: tu-email@dominio.com

3. **Crear Credenciales**
   - APIs & Services → Credentials
   - Create Credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: Añadir URL de Supabase

4. **Copiar Credenciales a Supabase**
   - Authentication → Providers → Google
   - Pegar Client ID y Client Secret

---

### 🔷 Facebook OAuth

#### Credenciales Actuales:
```
App ID: [Configurado en Supabase]
App Secret: [Configurado en Supabase]
```

#### Redirect URI:
```
https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
```

#### Pasos para Actualizar (si necesario):

1. **Facebook Developers**
   - URL: https://developers.facebook.com
   - App: viveiro-live

2. **Configurar Facebook Login**
   - Products → Facebook Login → Settings
   - Valid OAuth Redirect URIs: Añadir URL de Supabase

3. **Copiar Credenciales**
   - Settings → Basic
   - Copiar App ID y App Secret

4. **Configurar en Supabase**
   - Authentication → Providers → Facebook
   - Pegar App ID y App Secret

---

### 🔶 Microsoft OAuth

#### Credenciales Actuales:
```
Application (client) ID: [Configurado en Supabase]
Client Secret: [Configurado en Supabase]
```

#### Redirect URI:
```
https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
```

#### Pasos para Actualizar (si necesario):

1. **Azure Portal**
   - URL: https://portal.azure.com
   - Azure Active Directory → App registrations

2. **Registrar Aplicación**
   - New registration
   - Name: viveiro-live
   - Supported account types: Multitenant

3. **Configurar Redirect URI**
   - Authentication → Platform configurations → Web
   - Redirect URIs: Añadir URL de Supabase

4. **Crear Client Secret**
   - Certificates & secrets → New client secret
   - Copiar el value (solo se muestra una vez)

5. **Configurar en Supabase**
   - Authentication → Providers → Azure (Microsoft)
   - Pegar Application ID y Client Secret

---

## 🔒 Variables de Entorno

No se necesitan variables adicionales. La configuración OAuth se gestiona completamente desde Supabase Dashboard.

**Solo necesitas:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://mrkbskofbkkrkxqlyqir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 💻 Implementación en el Código

### AuthContext.tsx

```typescript
// Funciones OAuth disponibles
signInWithGoogle()
signInWithFacebook()
signInWithMicrosoft()
```

### Páginas de Auth

- **Login:** `app/auth/login/page.tsx`
- **Register:** `app/auth/register/page.tsx`
- **Callback:** `app/auth/callback/route.ts`

### Flujo OAuth

1. Usuario hace clic en botón OAuth
2. Se redirige al proveedor (Google/Facebook/Microsoft)
3. Usuario autoriza la aplicación
4. Proveedor redirige a `/auth/callback`
5. Supabase procesa el token
6. Usuario redirigido a `/complete-profile` o `/dashboard`

---

## 🧪 Testing OAuth

### En Desarrollo (localhost:3000):

1. Asegúrate de que el servidor dev esté corriendo
2. Ve a http://localhost:3000/auth/login
3. Haz clic en cualquier botón OAuth
4. Completa el flujo de autorización
5. Deberías ser redirigido al dashboard

### En Producción:

Añade el dominio de producción a:
1. **Google Cloud Console** → Authorized JavaScript origins y Redirect URIs
2. **Facebook Developers** → Valid OAuth Redirect URIs
3. **Azure Portal** → Redirect URIs

---

## ⚠️ Troubleshooting

### Error: "Redirect URI mismatch"

**Solución:** Verifica que la URI en el proveedor OAuth coincida exactamente con:
```
https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
```

### Error: "OAuth provider not enabled"

**Solución:**
1. Ve a Supabase Dashboard
2. Authentication → Providers
3. Habilita el proveedor
4. Guarda los cambios

### Error: "Invalid client credentials"

**Solución:**
1. Verifica Client ID/Secret en Supabase
2. Regenera las credenciales en el proveedor
3. Actualiza en Supabase

---

## 📝 Notas Importantes

1. **Client Secrets**: Nunca expongas los secrets en el código frontend
2. **Redirect URIs**: Deben coincidir exactamente (incluye protocolo https://)
3. **Dominios de Producción**: Añade todos los dominios donde se usará OAuth
4. **Rate Limits**: Los proveedores tienen límites de requests (Google: 10 req/seg)

---

## 🔄 Mantenimiento

### Renovar Client Secrets:

Se recomienda rotar los secrets cada 6-12 meses:

1. Generar nuevo secret en el proveedor
2. Actualizar en Supabase
3. Verificar que OAuth sigue funcionando
4. Eliminar el secret antiguo

### Monitoreo:

Supabase Dashboard → Authentication → Logs te muestra:
- Intentos de login exitosos
- Fallos de autenticación
- Proveedores más usados

---

## ✅ Checklist de Verificación

- [ ] Google OAuth habilitado en Supabase
- [ ] Facebook OAuth habilitado en Supabase
- [ ] Microsoft OAuth habilitado en Supabase
- [ ] Redirect URIs configuradas en todos los proveedores
- [ ] Botones OAuth funcionan en /auth/login
- [ ] Botones OAuth funcionan en /auth/register
- [ ] Callback procesa correctamente la autenticación
- [ ] Usuario redirigido a /complete-profile si falta info
- [ ] Usuario redirigido a /dashboard si perfil completo

---

**Última actualización:** 6 de Noviembre de 2025
**Estado:** ✅ OAuth Completamente Funcional
