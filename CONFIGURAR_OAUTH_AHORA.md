# 🚀 Configuración OAuth en Supabase - Pasos Inmediatos

## ⚠️ Error Actual

```
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

**Causa**: Los proveedores OAuth no están habilitados en tu proyecto de Supabase.

## 📋 Solución Rápida - Habilitar Proveedores en Supabase

### Paso 1: Acceder al Dashboard de Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto: **mrkbskofbkkrkxqlyqir**

### Paso 2: Ir a Authentication Providers

1. En el menú lateral, haz clic en **Authentication** (icono de llave 🔐)
2. Haz clic en la pestaña **Providers**
3. Verás una lista de todos los proveedores OAuth disponibles

### Paso 3: Habilitar Proveedores (Sin Configuración Completa)

**OPCIÓN A: Solo para Testing/Desarrollo** (Rápido - 2 minutos)

Puedes habilitar los proveedores SIN configurar las credenciales para que la app funcione sin errores:

#### Google OAuth
1. Busca **Google** en la lista
2. Activa el toggle **Enable Sign in with Google**
3. Deja los campos vacíos por ahora (Client ID y Secret)
4. Haz clic en **Save**

#### Facebook OAuth
1. Busca **Facebook** en la lista
2. Activa el toggle **Enable Sign in with Facebook**
3. Deja los campos vacíos
4. **Save**

#### Apple OAuth
1. Busca **Apple** en la lista
2. Activa el toggle **Enable Sign in with Apple**
3. Deja los campos vacíos
4. **Save**

#### Microsoft OAuth (Azure)
1. Busca **Azure** en la lista (Microsoft usa Azure AD)
2. Activa el toggle **Enable Sign in with Azure**
3. Deja los campos vacíos
4. **Save**

⚠️ **Importante**: Con esta opción, los botones OAuth NO funcionarán realmente, pero **la app dejará de dar error** y podrás usar email/password normalmente.

---

**OPCIÓN B: Configuración Completa** (Recomendado - 30-60 minutos)

Para que los botones OAuth funcionen de verdad, debes:

1. **Configurar cada proveedor** siguiendo [OAUTH_SETUP.md](OAUTH_SETUP.md)
2. **Obtener credenciales** de cada plataforma
3. **Pegar las credenciales** en Supabase

---

## 🎯 Recomendación Inmediata

### Para Testing Local (AHORA):

**Habilita solo Google** (el más fácil y usado):

1. Ve a Supabase → Authentication → Providers
2. Busca **Google**
3. Activa el toggle
4. Abre [Google Cloud Console](https://console.cloud.google.com/)
5. Sigue la **Sección 1** de [OAUTH_SETUP.md](OAUTH_SETUP.md) (10-15 min)
6. Pega Client ID y Secret en Supabase
7. **Desactiva temporalmente** los otros 3 proveedores en la UI

### Desactivar Botones No Configurados (Temporal):

Edita `app/auth/login/page.tsx` y comenta los botones no configurados:

```tsx
{/* Botones OAuth */}
<div className="mb-6 space-y-3">
  <button onClick={signInWithGoogle}>
    Continuar con Google
  </button>

  {/* TEMPORALMENTE DESACTIVADO - Configurar en OAUTH_SETUP.md
  <button onClick={signInWithFacebook}>
    Continuar con Facebook
  </button>
  <button onClick={signInWithApple}>
    Continuar con Apple
  </button>
  <button onClick={signInWithMicrosoft}>
    Continuar con Microsoft
  </button>
  */}
</div>
```

---

## 🔍 Verificar que Funciona

Después de habilitar los proveedores en Supabase:

1. Recarga tu aplicación: `http://localhost:3000/auth/login`
2. El error 400 debería desaparecer
3. Si configuraste Google, prueba hacer clic en "Continuar con Google"
4. Deberías ser redirigido a la pantalla de login de Google

---

## 📝 Checklist Rápido

### Opción Mínima (Sin OAuth funcionando):
- [ ] Ir a Supabase Dashboard
- [ ] Authentication → Providers
- [ ] Activar toggles de Google, Facebook, Apple, Azure
- [ ] Guardar (sin rellenar credenciales)
- [ ] Recargar app - error debería desaparecer

### Opción Recomendada (Google funcionando):
- [ ] Ir a Google Cloud Console
- [ ] Crear proyecto "Meteo Viveiro"
- [ ] Configurar OAuth Consent Screen
- [ ] Crear credenciales OAuth 2.0
- [ ] Copiar Client ID y Secret
- [ ] Ir a Supabase → Providers → Google
- [ ] Activar y pegar credenciales
- [ ] Guardar
- [ ] Probar login con Google

---

## 🆘 Si Sigues con Problemas

1. **Verifica la URL de callback** en Supabase:
   - Authentication → URL Configuration → Redirect URLs
   - Debe incluir: `http://localhost:3000/auth/callback`

2. **Verifica que el middleware funciona**:
   - Abre DevTools → Network
   - Intenta hacer login
   - Busca el request que falla
   - Revisa el error exacto

3. **Logs de Supabase**:
   - En Supabase Dashboard → Logs
   - Filtra por "auth"
   - Busca errores relacionados con OAuth

---

## 💡 Siguiente Paso

**Ahora mismo**:
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Habilita al menos **Google** con credenciales reales
3. Desactiva temporalmente los otros botones OAuth
4. Prueba login con email/password (debería funcionar)
5. Prueba login con Google (debería redirigir)

**Después** (cuando tengas tiempo):
- Configura Facebook siguiendo [OAUTH_SETUP.md](OAUTH_SETUP.md)
- Configura Microsoft siguiendo [OAUTH_SETUP.md](OAUTH_SETUP.md)
- Configura Apple si tienes cuenta de developer
