# 🚀 Habilitar OAuth en Supabase - GUÍA RÁPIDA

## ⚠️ PROBLEMA ACTUAL

**Error**: `{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}`

**Causa**: Los botones OAuth están en tu app, pero los proveedores NO están habilitados en Supabase.

**Solución**: Habilitar cada proveedor en Supabase Dashboard (5 minutos por proveedor).

---

## 🎯 SOLUCIÓN INMEDIATA - Habilitar Proveedores en Supabase

### Paso 1: Acceder a Supabase Dashboard

1. Abre: **https://supabase.com/dashboard**
2. Inicia sesión
3. Selecciona tu proyecto: `mrkbskofbkkrkxqlyqir`

### Paso 2: Ir a Authentication Providers

1. En el menú lateral izquierdo, haz clic en **Authentication** (icono de llave 🔐)
2. Haz clic en la pestaña **Providers**
3. Verás una lista de proveedores OAuth

---

## 📝 OPCIÓN 1: Habilitar SIN Credenciales (Para Testing - 2 minutos)

**Esto permite que la app NO dé error 400, pero los botones aún NO funcionarán realmente.**

### Google
1. Encuentra **Google** en la lista
2. Haz clic en **Google**
3. Activa el toggle: **Enable Sign in with Google**
4. Deja los campos `Client ID` y `Client Secret` vacíos
5. Haz clic en **Save**

### Facebook
1. Encuentra **Facebook**
2. Activa **Enable Sign in with Facebook**
3. Deja campos vacíos
4. **Save**

### Apple
1. Encuentra **Apple**
2. Activa **Enable Sign in with Apple**
3. Deja campos vacíos
4. **Save**

### Microsoft (Azure)
1. Encuentra **Azure** (Microsoft usa este nombre)
2. Activa **Enable Sign in with Azure**
3. Deja campos vacíos
4. **Save**

**Resultado**: El error 400 desaparecerá, pero los botones mostrarán "Provider not configured" cuando los hagas clic.

---

## ✅ OPCIÓN 2: Configurar GOOGLE Completo (Recomendado - 15 minutos)

Google es el más fácil y el más usado. Te recomiendo empezar por este.

### A. Crear Credenciales en Google

1. Ve a: **https://console.cloud.google.com/**
2. Crea un proyecto nuevo o selecciona uno existente
   - Nombre: `Meteo Viveiro`
3. Ve a **APIs y servicios** → **Pantalla de consentimiento de OAuth**
4. Selecciona **Externo**
5. Rellena:
   - Nombre de la aplicación: `Meteo Viveiro`
   - Tu email de soporte
   - Dominios autorizados: `mrkbskofbkkrkxqlyqir.supabase.co`
6. En **Scopes**, añade:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
7. Guardar

8. Ve a **APIs y servicios** → **Credenciales**
9. Haz clic en **+ CREAR CREDENCIALES** → **ID de cliente de OAuth 2.0**
10. Tipo: **Aplicación web**
11. Nombre: `Meteo Viveiro Web`
12. **URIs de redirección autorizados**:
    ```
    https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
    ```
13. Haz clic en **Crear**
14. **COPIA** el `Client ID` y `Client Secret` que aparecen

### B. Configurar en Supabase

1. Ve a Supabase Dashboard → **Authentication** → **Providers**
2. Haz clic en **Google**
3. Activa **Enable Sign in with Google**
4. Pega:
   - **Client ID** (de Google)
   - **Client Secret** (de Google)
5. Haz clic en **Save**

### C. Probar

1. Ve a tu app: `http://localhost:3000/auth/login`
2. Haz clic en "Continuar con Google"
3. Deberías ver la pantalla de Google pidiendo permisos
4. Autoriza
5. Deberías volver a tu app con sesión iniciada

---

## 📋 RECOMENDACIÓN

**Para empezar AHORA:**

1. **Opción 1** (2 min): Habilita todos los proveedores SIN credenciales
   - Resultado: Sin error 400
   - Los botones no funcionarán pero puedes usar email/password

2. **Luego Opción 2** (15 min): Configura Google con credenciales reales
   - Resultado: Google OAuth funciona de verdad
   - Puedes registrarte con tu cuenta de Google

3. **Después**: Configura Facebook, Microsoft, Apple según necesites
   - Sigue [OAUTH_SETUP.md](OAUTH_SETUP.md) para cada uno

---

## 🔗 URLs de Callback

**IMPORTANTE**: Todas las configuraciones OAuth necesitan esta URL:

```
https://mrkbskofbkkrkxqlyqir.supabase.co/auth/v1/callback
```

Esta es tu URL de callback de Supabase. Úsala en:
- Google Cloud Console
- Facebook Developers
- Azure Portal
- Apple Developer

---

## ✅ Checklist

- [ ] Accedí a Supabase Dashboard
- [ ] Fui a Authentication → Providers
- [ ] Habilité Google (mínimo, con toggle activado)
- [ ] Habilité Facebook (mínimo)
- [ ] Habilité Apple (mínimo)
- [ ] Habilité Azure/Microsoft (mínimo)
- [ ] El error 400 desapareció
- [ ] (Opcional) Configuré credenciales de Google
- [ ] (Opcional) Probé login con Google

---

## 🆘 Si Sigues con Problemas

1. **Verifica que los toggles están en ON** (verdes)
2. **Guarda los cambios** en cada proveedor
3. **Recarga tu app** después de habilitar
4. **Verifica la URL de callback** en Supabase:
   - Authentication → URL Configuration → Redirect URLs
   - Debe incluir: `http://localhost:3000/auth/callback`

---

## 📚 Documentación Completa

- [OAUTH_SETUP.md](OAUTH_SETUP.md) - Guía detallada para configurar cada proveedor con credenciales
- [CONFIGURAR_OAUTH_AHORA.md](CONFIGURAR_OAUTH_AHORA.md) - Guía anterior (similar)

---

**Siguiente paso**: Ve a Supabase Dashboard AHORA y habilita los 4 proveedores (solo toggles, sin credenciales). Te tomará 2 minutos.
