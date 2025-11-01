# 📹 Sistema de Webcams - Estado Actual

## ✅ Lo que ESTÁ funcionando

1. **APIs creadas correctamente:**
   - ✅ `/api/webcams` - API pública (usuarios autenticados)
   - ✅ `/api/admin/webcams` - API de administración (CRUD completo)
   - Ambas APIs están devolviendo código 200 según los logs

2. **Páginas creadas:**
   - ✅ `/dashboard/webcams` - Página pública para usuarios
   - ✅ `/admin/webcams` - Panel de administración

3. **Componente:**
   - ✅ `WebcamCard.tsx` - Componente reutilizable para mostrar webcams

4. **Migración SQL preparada:**
   - ✅ Archivo: `supabase/migrations/20250201_webcams.sql`
   - Tabla `webcams` con todos los campos necesarios
   - RLS configurado correctamente
   - Datos de ejemplo incluidos (2 webcams)

## ⚠️ Problema actual

**La tabla `webcams` NO existe en Supabase** porque la migración SQL no se ha ejecutado.

## 🔧 Solución

### PASO 1: Ejecutar la migración SQL en Supabase

1. Abre este archivo HTML: `ejecutar-migracion-webcams.html` (ya está creado)
2. Sigue las instrucciones para copiar el SQL
3. Pégalo en el SQL Editor de Supabase
4. Ejecuta el script (botón RUN o Ctrl+Enter)

### PASO 2: Verificar que la tabla se creó

Ejecuta este SQL en Supabase para verificar:

```sql
SELECT * FROM public.webcams;
```

Deberías ver 2 webcams:
- Penedo do Galo (MeteoGalicia)
- Xandíns Noriega Varela (AngelCam)

### PASO 3: Acceder a las páginas

Una vez ejecutada la migración:

- **Página pública:** http://localhost:3000/dashboard/webcams
  - Muestra solo webcams activas
  - Accesible por cualquier usuario autenticado

- **Panel de administración:** http://localhost:3000/admin/webcams
  - Muestra todas las webcams (activas e inactivas)
  - Solo accesible para administradores
  - Permite crear, editar y eliminar webcams

## 📁 Archivos creados/modificados

### Nuevos archivos:
- `app/api/webcams/route.ts` - API pública
- `app/api/admin/webcams/route.ts` - API de administración
- `app/(admin)/admin/webcams/page.tsx` - Panel de administración
- `supabase/migrations/20250201_webcams.sql` - Migración de base de datos

### Archivos modificados:
- `app/(protected)/dashboard/webcams/page.tsx` - Migrado de hardcoded a BD
- `components/webcams/WebcamCard.tsx` - Sin cambios (ya compatible)

## 🗄️ Estructura de la tabla `webcams`

```sql
CREATE TABLE public.webcams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'iframe')),
  refresh_interval INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

## 🔐 Políticas RLS

- **SELECT**: Todos los usuarios autenticados pueden ver webcams activas
- **INSERT**: Solo administradores
- **UPDATE**: Solo administradores
- **DELETE**: Solo administradores

## 🎯 Próximos pasos (después de ejecutar la migración)

1. ✅ Accede a `/admin/webcams` para gestionar webcams
2. ✅ Agrega nuevas webcams desde el panel de administración
3. ✅ Los usuarios verán las webcams en `/dashboard/webcams`
4. ✅ Todo funciona sin necesidad de modificar código

## 🐛 Si sigues teniendo problemas

1. **Verifica que ejecutaste la migración SQL**
   - Ve a Supabase → SQL Editor
   - Ejecuta: `SELECT COUNT(*) FROM public.webcams;`
   - Debería devolver 2

2. **Verifica que eres administrador**
   - Ejecuta: `SELECT role FROM user_profiles WHERE id = auth.uid();`
   - Debería devolver 'admin'

3. **Limpia la caché del navegador**
   - Presiona Ctrl+Shift+Delete
   - Limpia caché y cookies
   - Recarga con Ctrl+F5

4. **Revisa la consola del navegador (F12)**
   - Ve a la pestaña Console
   - Busca errores en rojo
   - Compártelos si hay alguno

---

**Creado:** 2025-11-01
**Última actualización:** 2025-11-01
