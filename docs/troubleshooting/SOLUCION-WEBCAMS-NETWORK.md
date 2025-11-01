# 🔐 Solución: Acceso a Admin Webcams desde IP de Red

## Problema identificado

Cuando intentas acceder a `http://192.168.88.4:3000/admin/webcams`, te redirige a `/dashboard` porque:

1. ✅ Tu usuario **SÍ tiene `role = 'admin'`** en la base de datos
2. ✅ El código de las APIs **está correcto** (con `await createClient()`)
3. ❌ **NO estás autenticado en `192.168.88.4:3000`**

Los logs muestran:
```
GET /api/webcams 401 in 30ms  ← No autorizado
GET /api/webcams 401 in 27ms  ← No autorizado
```

## ¿Por qué pasa esto?

Las **cookies de sesión** están atadas al hostname:

- Cookies de `localhost:3000` → Solo válidas para `localhost:3000`
- Cookies de `192.168.88.4:3000` → Solo válidas para `192.168.88.4:3000`

Aunque sea el mismo servidor, el navegador los trata como dominios diferentes por seguridad.

## Solución definitiva

### Opción 1: Usar siempre localhost (RECOMENDADO)

Accede siempre desde tu PC usando:
- ✅ `http://localhost:3000/dashboard/webcams`
- ✅ `http://localhost:3000/admin/webcams`

### Opción 2: Iniciar sesión en cada hostname

Si necesitas acceder desde diferentes dispositivos (PC, móvil, tablet):

1. **En tu PC (localhost):**
   - Ve a: http://localhost:3000/auth/login
   - Inicia sesión
   - Accede a: http://localhost:3000/admin/webcams

2. **Desde otro dispositivo en tu red local:**
   - Ve a: http://192.168.88.4:3000/auth/login
   - Inicia sesión con la misma cuenta
   - Accede a: http://192.168.88.4:3000/admin/webcams

### Opción 3: Configurar un dominio local (AVANZADO)

Editar el archivo `C:\Windows\System32\drivers\etc\hosts` (como administrador) y agregar:

```
192.168.88.4    viveiro.local
```

Luego acceder siempre a:
- http://viveiro.local:3000

Esto unifica las cookies bajo un solo dominio.

## Estado actual del sistema ✅

- ✅ Tabla `webcams` creada y funcionando
- ✅ 2 webcams insertadas (Penedo do Galo + Xandíns)
- ✅ API pública `/api/webcams` - 200 OK (si estás autenticado)
- ✅ API admin `/api/admin/webcams` - 200 OK (si eres admin)
- ✅ Página `/dashboard/webcams` funcionando
- ✅ Página `/admin/webcams` funcionando
- ✅ Tu usuario tiene `role = 'admin'`

**El sistema está 100% funcional.** Solo necesitas asegurarte de estar autenticado en el hostname que estés usando.

## Verificación rápida

Para verificar si estás autenticado, abre la consola del navegador (F12) y ejecuta:

```javascript
// Ver todas las cookies
document.cookie

// Buscar cookie de Supabase (debe existir)
document.cookie.includes('sb-')
```

Si NO ves cookies de Supabase (`sb-...`), necesitas iniciar sesión.

---

**Fecha:** 2025-11-01
