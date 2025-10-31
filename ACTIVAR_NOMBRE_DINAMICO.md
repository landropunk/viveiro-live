# Cómo Activar el Nombre Dinámico del Sitio

El sistema de nombre dinámico está **preparado pero desactivado** por defecto. Este documento explica cómo activarlo.

## Estado Actual

✅ **Preparado:**
- Hook `useSiteName()` creado en `hooks/useSiteName.ts`
- Campo `locked` añadido a la tabla `app_settings`
- UI del admin muestra candado 🔒 en "Nombre del Sitio"
- Valor almacenado en base de datos: `viveiro.live`

❌ **Desactivado:**
- El hook no se usa en ningún componente
- Todos los componentes usan "viveiro.live" hardcodeado
- El ajuste aparece bloqueado en `/admin/settings`

## Ubicaciones donde aparece "viveiro.live"

El nombre del sitio aparece hardcodeado en 7 lugares:

1. **`app/(public)/page.tsx`** (línea 138) - Título principal
2. **`app/(public)/page.tsx`** (línea 384) - Texto del CTA
3. **`app/(protected)/dashboard/layout.tsx`** (línea 156) - Logo del dashboard
4. **`app/(protected)/dashboard/layout.tsx`** (línea 370) - Logo móvil del dashboard
5. **`app/(admin)/admin/layout.tsx`** (línea 118) - Logo del panel admin
6. **`app/(admin)/admin/layout.tsx`** (línea 299) - Logo móvil del admin
7. **`app/(admin)/admin/page.tsx`** (línea 63) - Mensaje de bienvenida

---

## Pasos para Activar

### 1. Desbloquear el ajuste en la base de datos

Ejecuta este SQL en Supabase:

```sql
-- Desbloquear general_site_name
UPDATE app_settings SET locked = false WHERE key = 'general_site_name';
```

### 2. Actualizar componentes para usar el hook

Para cada componente, sigue este patrón:

#### Ejemplo: `app/(public)/page.tsx`

**ANTES (hardcodeado):**
```typescript
export default function Home() {
  const { user } = useAuth();
  // ...

  return (
    <>
      <main>
        <h1>viveiro.live</h1>
        <p>Regístrate ahora y accede a todas las secciones de viveiro.live.</p>
      </main>
    </>
  );
}
```

**DESPUÉS (dinámico):**
```typescript
import { useSiteName } from '@/hooks/useSiteName';

export default function Home() {
  const { user } = useAuth();
  const { siteName } = useSiteName(); // ⬅️ Agregar hook
  // ...

  return (
    <>
      <main>
        <h1>{siteName}</h1> {/* ⬅️ Usar variable */}
        <p>Regístrate ahora y accede a todas las secciones de {siteName}.</p>
      </main>
    </>
  );
}
```

### 3. Aplicar el cambio en todos los archivos

Repite el proceso para los 7 archivos listados arriba:

1. Importar el hook: `import { useSiteName } from '@/hooks/useSiteName';`
2. Usar el hook: `const { siteName } = useSiteName();`
3. Reemplazar `"viveiro.live"` por `{siteName}`

---

## Script de Activación Rápida

Si prefieres activarlo todo de una vez, aquí están los cambios exactos:

### app/(public)/page.tsx

```diff
+ import { useSiteName } from '@/hooks/useSiteName';

  export default function Home() {
    const { user } = useAuth();
+   const { siteName } = useSiteName();
    // ...

    return (
      <>
        <main>
-         <h1>viveiro.live</h1>
+         <h1>{siteName}</h1>

-         <p>Regístrate ahora y accede a todas las secciones de viveiro.live.</p>
+         <p>Regístrate ahora y accede a todas las secciones de {siteName}.</p>
        </main>
      </>
    );
  }
```

### app/(protected)/dashboard/layout.tsx

```diff
+ import { useSiteName } from '@/hooks/useSiteName';

  export default function DashboardLayout({ children }) {
    // ... existing hooks
+   const { siteName } = useSiteName();

    return (
      <>
        {/* Logo desktop */}
-       <span>viveiro.live</span>
+       <span>{siteName}</span>

        {/* Logo mobile */}
-       <span>viveiro.live</span>
+       <span>{siteName}</span>
      </>
    );
  }
```

### app/(admin)/admin/layout.tsx

```diff
+ import { useSiteName } from '@/hooks/useSiteName';

  export default function AdminLayout({ children }) {
    // ... existing hooks
+   const { siteName } = useSiteName();

    return (
      <>
        {/* Logo desktop */}
-       <span>viveiro.live</span>
+       <span>{siteName}</span>

        {/* Logo mobile */}
-       <span>viveiro.live</span>
+       <span>{siteName}</span>
      </>
    );
  }
```

### app/(admin)/admin/page.tsx

```diff
+ import { useSiteName } from '@/hooks/useSiteName';

  export default function AdminDashboard() {
    const { user } = useAuth();
+   const { siteName } = useSiteName();

    return (
      <>
-       <p>Bienvenido, {user?.email}. Gestiona todos los aspectos de viveiro.live desde aquí.</p>
+       <p>Bienvenido, {user?.email}. Gestiona todos los aspectos de {siteName} desde aquí.</p>
      </>
    );
  }
```

---

## Verificación

Después de activar:

1. ✅ Ve a `/admin/settings`
2. ✅ Verifica que "Nombre del Sitio" ya NO tiene el candado 🔒
3. ✅ Cambia el valor a cualquier cosa (ej: "Portal de Viveiro")
4. ✅ Recarga la página principal `/`
5. ✅ Verifica que el título cambió

---

## Revertir Cambios

Si quieres volver a hardcodeado:

1. Ejecuta el SQL para bloquear:
```sql
UPDATE app_settings SET locked = true WHERE key = 'general_site_name';
```

2. Elimina las importaciones y uso del hook de todos los componentes

3. Vuelve a poner `"viveiro.live"` hardcodeado

---

## Notas Importantes

- ⚠️ El hook hace una llamada a la base de datos cada vez que se monta el componente
- ⚠️ Considera usar un Context Provider si quieres optimizar (una sola llamada para toda la app)
- ⚠️ El valor por defecto siempre es `"viveiro.live"` si falla la carga
- ✅ No requiere reiniciar el servidor, es dinámico
- ✅ Los cambios son inmediatos (el usuario verá el nuevo nombre al recargar)

---

**Fecha de creación**: 31 de octubre de 2025
**Estado**: Preparado, pendiente de activación
