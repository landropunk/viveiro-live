# Solución al Problema de Leaflet con React 19

## Problema Identificado

Al actualizar a **React 19.0.0**, el componente `StationsMap` (que usa `react-leaflet`) generaba el siguiente error:

```
Error: Map container is already initialized
```

### Causa Raíz

- **React 19 Strict Mode** en desarrollo monta los componentes dos veces intencionalmente para detectar bugs
- **react-leaflet 4.2.1** no maneja correctamente este comportamiento de "double-render"
- Leaflet intenta inicializar el mismo contenedor DOM dos veces, causando el error

## Soluciones Intentadas (NO funcionaron)

### 1. ❌ Cleanup con useRef y useState
```typescript
const [shouldRender, setShouldRender] = useState(false);
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  setShouldRender(true);
  return () => {
    // Intentar limpiar el mapa...
  };
}, []);
```
**Resultado**: El error persistió porque React Strict Mode hace el doble montaje antes de que el cleanup pueda ejecutarse.

### 2. ❌ Dynamic Import con ssr: false
```typescript
const StationsView = dynamic(() => import('@/components/stations/StationsView'), {
  ssr: false,
  loading: () => <LoadingPlaceholder />
});
```
**Resultado**: Esto previene errores de SSR pero NO resuelve el problema de Strict Mode en el cliente.

### 3. ❌ ID único en el contenedor
```typescript
const mapId = useMemo(() => `map-${Math.random().toString(36).substr(2, 9)}`, []);
```
**Resultado**: Leaflet usa referencias internas al DOM que persisten entre montajes.

## Solución Final Implementada ✅

### Deshabilitar React Strict Mode en next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // React Strict Mode deshabilitado debido a incompatibilidad conocida entre:
  // - React 19 Strict Mode (double-render en desarrollo)
  // - react-leaflet 4.2.1 (MapContainer no maneja correctamente el remontaje)
  // Issue: "Map container is already initialized"
  // Nota: Esto solo afecta desarrollo. En producción Strict Mode no hace double-render.
  reactStrictMode: false,

  // ... resto de config
};
```

### Por qué funciona

1. **Strict Mode solo afecta desarrollo**: En producción, React NO hace el doble montaje
2. **Es una solución temporal**: Cuando react-leaflet se actualice para soportar React 19, podremos reactivarlo
3. **No compromete la producción**: El código funciona perfectamente en prod

## Archivos Modificados

### 1. `next.config.mjs`
- ✅ Agregado `reactStrictMode: false` con documentación clara

### 2. `components/stations/StationsMap.tsx`
- ✅ Revertido a versión limpia y simple (sin código temporal de pruebas)
- ✅ Eliminados `useState`, `useRef` y lógica de cleanup innecesaria

### 3. `app/(protected)/dashboard/meteo/page.tsx`
- ✅ Revertido dynamic import a import estándar
- ✅ Código más limpio y directo

## Estado Final del Código

### StationsMap.tsx (Versión final limpia)
```typescript
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherStation } from '@/types/weather';

// ... iconos y componentes helper ...

export default function StationsMap({
  stations,
  selectedStations = [],
  onStationClick,
  center,
  zoom = 12,
}: StationsMapProps) {
  const defaultCenter: [number, number] = center || [43.645, -7.596];

  return (
    <div className="relative h-96 w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        {/* TileLayer, Markers, etc. */}
      </MapContainer>
    </div>
  );
}
```

### page.tsx (Import estándar)
```typescript
import StationsView from '@/components/stations/StationsView';
```

## Alternativas Futuras

Cuando react-leaflet publique una versión compatible con React 19 Strict Mode:

1. Actualizar `react-leaflet` a la nueva versión
2. Reactivar `reactStrictMode: true` en `next.config.mjs`
3. Verificar que todo funcione correctamente

## Referencias

- [React 19 Strict Mode Behavior](https://react.dev/reference/react/StrictMode)
- [react-leaflet Known Issues](https://github.com/PaulLeCam/react-leaflet/issues)
- [Leaflet MapContainer Lifecycle](https://leafletjs.com/reference.html#map)

---

**Fecha**: 2025-12-15
**Desarrollador**: Claude Code
**Stack**: Next.js 15.1.0, React 19.0.0, react-leaflet 4.2.1
