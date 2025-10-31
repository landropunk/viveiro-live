# Sistema de Ajustes de la Aplicación

Este documento explica cómo funciona el sistema de configuración dinámica de **viveiro.live**, permitiendo al administrador activar/desactivar secciones y características sin tocar código.

## Descripción General

El sistema de ajustes permite controlar dinámicamente:
- **Secciones del Dashboard**: Qué secciones aparecen en el menú (Meteorología, Históricos, Live/Play, Webcams)
- **Características**: Funcionalidades como blog, registro de usuarios, comentarios
- **Configuración General**: Nombre del sitio, modo mantenimiento, límites de subida

## Acceso al Panel de Ajustes

1. Inicia sesión con tu cuenta de administrador
2. Ve al **Panel Admin** desde el menú lateral
3. Haz clic en la tarjeta **"Ajustes de la Aplicación"** ⚙️
4. O accede directamente a: `/admin/settings`

## Estructura de la Configuración

### 📱 Secciones del Dashboard

Controla qué secciones aparecen en el menú del dashboard:

| Ajuste | Descripción | Valor Inicial |
|--------|-------------|---------------|
| **Meteorología** | Datos meteorológicos en tiempo real | ✅ Activado |
| **Históricos Horarios** | Datos históricos de estaciones (requiere API) | ❌ Desactivado |
| **Live / Play** | Eventos en directo y reproducciones | ✅ Activado |
| **Webcams** | Cámaras web de Viveiro | ✅ Activado |

**Uso**:
- Activa el toggle para mostrar la sección
- Desactiva para ocultar la sección del menú
- Los cambios se aplican inmediatamente

### ✨ Características

Controla funcionalidades específicas de la aplicación:

| Ajuste | Descripción | Valor Inicial |
|--------|-------------|---------------|
| **Blog/Noticias** | Muestra blog en la página principal | ✅ Activado |
| **Registro de Usuarios** | Permite que nuevos usuarios se registren | ✅ Activado |
| **Comentarios** | Sistema de comentarios (funcionalidad futura) | ❌ Desactivado |

**Uso**: Similar a las secciones, usa los toggles para activar/desactivar

### ⚙️ Configuración General

Configuración global de la aplicación:

| Ajuste | Descripción | Tipo | Valor Inicial |
|--------|-------------|------|---------------|
| **Nombre del Sitio** | Nombre de la aplicación web | Texto | viveiro.live |
| **Modo Mantenimiento** | Solo admins pueden acceder (futuro) | Toggle | ❌ Desactivado |
| **Tamaño Máx. Subida (MB)** | Límite para archivos subidos | Número | 5 MB |

**Uso**:
- Para valores de texto: edita el campo y presiona Enter
- Para números: usa el input numérico
- Para toggles: activa/desactiva

## Arquitectura Técnica

### Base de Datos

La configuración se almacena en la tabla `app_settings`:

```sql
CREATE TABLE app_settings (
  id UUID PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,           -- ej: 'section_meteo'
  value JSONB NOT NULL,                -- ej: {"enabled": true}
  category TEXT NOT NULL,              -- 'sections', 'features', 'general'
  label TEXT NOT NULL,                 -- 'Meteorología'
  description TEXT,
  updated_at TIMESTAMPTZ,
  updated_by UUID
);
```

### Seguridad (RLS)

- **Lectura**: Todos los usuarios autenticados pueden leer la configuración
- **Escritura**: Solo administradores pueden modificar ajustes
- Las políticas RLS garantizan que solo usuarios con `role='admin'` puedan actualizar

### APIs

#### GET /api/admin/settings
Obtiene toda la configuración (solo admin)

```typescript
// Respuesta
[
  {
    "id": "uuid",
    "key": "section_meteo",
    "value": {"enabled": true},
    "category": "sections",
    "label": "Meteorología",
    "description": "..."
  },
  ...
]
```

#### PATCH /api/admin/settings
Actualiza un ajuste específico (solo admin)

```typescript
// Request
{
  "key": "section_historicos",
  "value": {"enabled": true}
}

// Respuesta
{
  "success": true,
  "setting": {...}
}
```

#### GET /api/dashboard/config
Obtiene configuración de secciones (todos los usuarios)

```typescript
// Respuesta
{
  "meteo": true,
  "historicos": false,
  "live": true,
  "webcams": true
}
```

### Hooks y Componentes

#### `useDashboardConfig()`
Hook de React para cargar configuración de secciones:

```typescript
const { config, loading } = useDashboardConfig();
// config = { meteo: true, historicos: false, ... }
```

#### Layout del Dashboard
El layout lee automáticamente la configuración y ajusta el menú:

```typescript
const sections = useMemo(() => {
  return baseSections.map((section) => ({
    ...section,
    enabled: config[section.id] ?? section.enabled,
  }));
}, [config]);
```

## Casos de Uso Comunes

### 1. Activar Sección de Históricos

Cuando MeteoGalicia publique su API de datos horarios históricos:

1. Ve a `/admin/settings`
2. En la sección **"Secciones del Dashboard"**
3. Activa el toggle de **"Históricos Horarios"** ✅
4. La sección aparecerá inmediatamente en el menú del dashboard

### 2. Desactivar Registro de Usuarios

Si necesitas cerrar temporalmente el registro:

1. Ve a `/admin/settings`
2. En la sección **"Características"**
3. Desactiva **"Registro de Usuarios"** ❌
4. Los usuarios ya no podrán crear cuentas nuevas

### 3. Cambiar Nombre del Sitio

Para actualizar el nombre de la aplicación:

1. Ve a `/admin/settings`
2. En **"Configuración General"**
3. Edita el campo **"Nombre del Sitio"**
4. El cambio se aplica inmediatamente

### 4. Activar Modo Mantenimiento (Futuro)

Cuando esté implementado:

1. Activa **"Modo Mantenimiento"**
2. Solo administradores podrán acceder al sitio
3. Los usuarios verán un mensaje de mantenimiento

## Añadir Nuevos Ajustes

Para añadir una nueva configuración:

### 1. Insertar en Base de Datos

```sql
INSERT INTO app_settings (key, value, category, label, description)
VALUES (
  'feature_nueva',
  '{"enabled": false}',
  'features',
  'Nueva Característica',
  'Descripción de la característica'
);
```

### 2. Actualizar Interfaz (Opcional)

La página de ajustes lee automáticamente la base de datos, pero si necesitas lógica custom:

```typescript
// En lib/admin/settings.ts
export async function isNuevaFeatureEnabled(): Promise<boolean> {
  const setting = await getSetting('feature_nueva');
  return setting?.value?.enabled === true;
}
```

### 3. Usar en la Aplicación

```typescript
import { isFeatureEnabled } from '@/lib/admin/settings';

const enabled = await isFeatureEnabled('nueva');
if (enabled) {
  // Mostrar característica
}
```

## Respaldo y Migración

### Exportar Configuración

```sql
-- Exportar a JSON
COPY (SELECT * FROM app_settings ORDER BY category, key)
TO '/tmp/app_settings_backup.json' (FORMAT json);
```

### Importar Configuración

```sql
-- Desde backup
COPY app_settings (id, key, value, category, label, description)
FROM '/tmp/app_settings_backup.json' (FORMAT json);
```

### Reset a Valores por Defecto

```sql
-- Ejecutar el script de migración original
\i supabase/migrations/20250130_app_settings.sql
```

## Solución de Problemas

### La configuración no se actualiza

**Problema**: Cambios en ajustes no se reflejan en el dashboard

**Soluciones**:
1. Recarga la página (F5) para forzar actualización
2. Verifica que eres administrador: `SELECT raw_user_meta_data FROM auth.users WHERE email = 'tu@email.com'`
3. Comprueba logs del navegador (F12) para errores de API

### No puedo acceder a /admin/settings

**Problema**: Error 403 o redirección

**Soluciones**:
1. Verifica que tu cuenta tiene rol admin:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'::jsonb),
     '{role}',
     '"admin"'
   )
   WHERE email = 'tu@email.com';
   ```
2. Cierra sesión y vuelve a iniciar sesión

### Sección sigue apareciendo aunque está desactivada

**Problema**: Caché del navegador o React

**Soluciones**:
1. Limpia caché del navegador (Ctrl+Shift+Del)
2. Reinicia el servidor de desarrollo (Ctrl+C y `pnpm dev`)

## Futuras Mejoras

- [ ] Sistema de versiones para configuración
- [ ] Historial de cambios (quién cambió qué y cuándo)
- [ ] Importar/Exportar configuración desde la interfaz
- [ ] Modo mantenimiento completamente funcional
- [ ] Configuración de temas (colores, logos)
- [ ] Notificaciones cuando cambia la configuración

## Soporte

Si tienes problemas con el sistema de ajustes:

1. Revisa este documento
2. Consulta los logs del servidor
3. Verifica permisos de administrador
4. Contacta con el equipo de desarrollo

---

**Última actualización**: 30 de enero de 2025
**Versión**: 1.0.0
