# Funcionamiento de los Ajustes de la Aplicación

Este documento describe cómo funcionan todos los ajustes configurables desde el panel de administración y dónde se aplican.

## Acceso al Panel de Ajustes

**URL**: `/admin/settings`
**Requisito**: Usuario con rol `admin`

---

## Secciones del Dashboard

Estas secciones controlan qué opciones aparecen en el menú lateral del dashboard.

### 1. Meteorología (`section_meteo`)

**Ubicación en el código**: `app/(protected)/dashboard/layout.tsx`
**Hook usado**: `useDashboardConfig()`

**Comportamiento**:
- ✅ **Activado**: Muestra la opción "Meteorología" en el menú del dashboard
- ❌ **Desactivado**: Oculta la opción del menú (los usuarios no pueden acceder a `/dashboard/meteo`)

**Cómo probar**:
1. Ve a `/admin/settings`
2. Desactiva el toggle "Meteorología"
3. Ve al dashboard y verifica que la opción desaparece del menú

---

### 2. Históricos Horarios (`section_historicos`)

**Ubicación en el código**: `app/(protected)/dashboard/layout.tsx`
**Hook usado**: `useDashboardConfig()`

**Comportamiento**:
- ✅ **Activado**: Muestra la opción "Históricos Horarios" en el menú del dashboard
- ❌ **Desactivado**: Oculta la opción del menú (valor por defecto debido a que la API de MeteoGalicia no está disponible)

**Nota**: Este servicio está deshabilitado por defecto porque la API de datos históricos horarios de MeteoGalicia aún no está publicada públicamente.

**Cómo probar**:
1. Ve a `/admin/settings`
2. Activa el toggle "Históricos Horarios"
3. Ve al dashboard y verifica que aparece la nueva opción en el menú

---

### 3. Live / Play (`section_live`)

**Ubicación en el código**: `app/(protected)/dashboard/layout.tsx`
**Hook usado**: `useDashboardConfig()`

**Comportamiento**:
- ✅ **Activado**: Muestra la opción "Live / Play" en el menú del dashboard
- ❌ **Desactivado**: Oculta la opción del menú (los usuarios no pueden acceder a `/dashboard/eventos`)

**Cómo probar**:
1. Ve a `/admin/settings`
2. Desactiva el toggle "Live / Play"
3. Ve al dashboard y verifica que la opción desaparece del menú

---

### 4. Webcams (`section_webcams`)

**Ubicación en el código**: `app/(protected)/dashboard/layout.tsx`
**Hook usado**: `useDashboardConfig()`

**Comportamiento**:
- ✅ **Activado**: Muestra la opción "Webcams" en el menú del dashboard
- ❌ **Desactivado**: Oculta la opción del menú (los usuarios no pueden acceder a `/dashboard/webcams`)

**Cómo probar**:
1. Ve a `/admin/settings`
2. Desactiva el toggle "Webcams"
3. Ve al dashboard y verifica que la opción desaparece del menú

---

## Características Generales

Estas opciones controlan funcionalidades específicas de la aplicación.

### 5. Blog/Noticias (`feature_blog`)

**Ubicación en el código**: `app/(public)/page.tsx`
**Método**: Consulta directa a `app_settings`

**Comportamiento**:
- ✅ **Activado**: Muestra la sección "Noticias y Novedades" en la página principal
- ❌ **Desactivado**: Oculta completamente la sección de blog/noticias de la página principal

**Cómo probar**:
1. Ve a la página principal (`/`)
2. Verifica que el blog está visible (si hay posts publicados)
3. Ve a `/admin/settings`
4. Desactiva el toggle "Blog/Noticias"
5. Recarga la página principal (F5)
6. Verifica que la sección de noticias desaparece

---

### 6. Registro de Usuarios (`feature_user_registration`)

**Ubicación en el código**: `app/auth/register/page.tsx`
**Método**: Consulta directa a `app_settings` con redirección automática

**Comportamiento**:
- ✅ **Activado**: Permite que nuevos usuarios se registren en la plataforma
- ❌ **Desactivado**: Muestra un mensaje de "Registro Deshabilitado" y redirige automáticamente a `/auth/login` después de 3 segundos

**Cómo probar**:
1. Ve a `/admin/settings`
2. Desactiva el toggle "Registro de Usuarios"
3. Cierra sesión (o abre una ventana de incógnito)
4. Intenta acceder a `/auth/register`
5. Verás el mensaje "Registro Deshabilitado" y serás redirigido al login

---

### 7. Comentarios (`feature_comments`)

**Estado**: Preparado para implementación futura
**Comportamiento actual**: No tiene efecto (funcionalidad pendiente de desarrollar)

**Uso futuro**: Cuando se implemente el sistema de comentarios, este ajuste controlará si los usuarios pueden dejar comentarios en posts del blog, eventos, etc.

---

## Configuración General

Estos ajustes controlan parámetros generales de la aplicación.

### 8. Nombre del Sitio (`general_site_name`)

**Estado**: Preparado para implementación futura
**Tipo**: Campo de texto
**Valor actual**: `"viveiro.live"`

**Uso futuro**: Puede usarse para mostrar el nombre del sitio en:
- Meta tags de SEO
- Título de la página
- Footer
- Emails enviados por el sistema

---

### 9. Modo Mantenimiento (`general_maintenance_mode`)

**Estado**: Preparado para implementación futura
**Tipo**: Toggle (activar/desactivar)

**Uso futuro**: Cuando esté implementado:
- ✅ **Activado**: Solo los administradores pueden acceder al sitio, el resto de usuarios ven una página de "Mantenimiento en curso"
- ❌ **Desactivado**: Todos los usuarios pueden acceder normalmente

---

### 10. Tamaño Máx. Subida (MB) (`general_max_upload_size`)

**Estado**: Preparado para implementación futura
**Tipo**: Campo numérico
**Valor actual**: `5` MB

**Uso futuro**: Limitar el tamaño de archivos subidos:
- Imágenes de portada de blog
- Avatares de usuario
- Archivos adjuntos en comentarios

---

## Arquitectura Técnica

### Estructura de la Base de Datos

**Tabla**: `app_settings`

```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL, -- 'sections', 'features', 'general'
  label TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);
```

### Políticas de Seguridad (RLS)

- **Lectura**: Cualquier usuario autenticado puede leer la configuración
- **Escritura**: Solo usuarios con `role: 'admin'` pueden modificar configuración

### APIs Disponibles

1. **`GET /api/admin/settings`** (Solo admin)
   - Obtiene toda la configuración
   - Usado por el panel de ajustes

2. **`PATCH /api/admin/settings`** (Solo admin)
   - Actualiza un ajuste específico
   - Body: `{ key: string, value: any }`

3. **`GET /api/dashboard/config`** (Cualquier usuario autenticado)
   - Obtiene configuración de secciones del dashboard
   - Retorna: `{ meteo: boolean, historicos: boolean, live: boolean, webcams: boolean }`

### Hooks de React

**`useDashboardConfig()`**
Ubicación: `hooks/useDashboardConfig.ts`

```typescript
const { config, loading } = useDashboardConfig();
// config = { meteo: true, historicos: false, live: true, webcams: true }
```

### Servicio Backend

**`lib/admin/settings.ts`**

Funciones disponibles:
- `getAllSettings()`: Obtiene toda la configuración
- `getSettingsByCategory(category)`: Obtiene configuración por categoría
- `getSetting(key)`: Obtiene un ajuste específico
- `updateSetting(key, value)`: Actualiza un ajuste
- `isSectionEnabled(sectionKey)`: Verifica si una sección está habilitada
- `isFeatureEnabled(featureKey)`: Verifica si una característica está habilitada
- `getDashboardSectionsConfig()`: Obtiene configuración de secciones del dashboard

---

## Resumen de Implementación

### ✅ Ajustes Completamente Funcionales

1. **`section_meteo`** - Muestra/oculta Meteorología en el dashboard
2. **`section_historicos`** - Muestra/oculta Históricos en el dashboard
3. **`section_live`** - Muestra/oculta Live/Play en el dashboard
4. **`section_webcams`** - Muestra/oculta Webcams en el dashboard
5. **`feature_blog`** - Muestra/oculta blog en la página principal
6. **`feature_user_registration`** - Habilita/deshabilita registro de usuarios

### 🔄 Ajustes Preparados para Futura Implementación

7. **`feature_comments`** - Sistema de comentarios (pendiente)
8. **`general_site_name`** - Nombre del sitio (pendiente uso en meta tags/SEO)
9. **`general_maintenance_mode`** - Modo mantenimiento (pendiente)
10. **`general_max_upload_size`** - Límite de subida (pendiente)

---

## Cómo Agregar Nuevos Ajustes

Si necesitas agregar un nuevo ajuste:

1. **Insertar en la base de datos**:
```sql
INSERT INTO app_settings (key, value, category, label, description) VALUES
  ('feature_mi_nueva_funcion', '{"enabled": true}', 'features', 'Mi Nueva Función', 'Descripción de la función');
```

2. **Usar en el código**:
```typescript
// Opción 1: Consulta directa
const supabase = createClient();
const { data } = await supabase
  .from('app_settings')
  .select('value')
  .eq('key', 'feature_mi_nueva_funcion')
  .single();

const enabled = data?.value?.enabled === true;

// Opción 2: Usar el servicio
import { isFeatureEnabled } from '@/lib/admin/settings';
const enabled = await isFeatureEnabled('mi_nueva_funcion');
```

3. **Aplicar lógica condicional**:
```typescript
{enabled && (
  <div>Mi nueva función</div>
)}
```

---

## Notas Importantes

- Los ajustes se cargan dinámicamente desde la base de datos
- Los cambios son inmediatos (no requiere reiniciar el servidor)
- El usuario puede necesitar recargar la página para ver los cambios (F5)
- Todos los ajustes están protegidos por RLS (solo admins pueden modificar)
- Los valores por defecto están definidos en el código por si la configuración falla

---

**Fecha de creación**: 31 de octubre de 2025
**Última actualización**: 31 de octubre de 2025
