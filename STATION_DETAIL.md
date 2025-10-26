# Vista Detallada de Estaciones Meteorológicas

## Descripción

Se ha implementado un nuevo apartado en el dashboard que muestra información detallada de las estaciones meteorológicas de Viveiro, integrando todos los elementos de la página de MeteoGalicia pero con el estilo y diseño de la aplicación.

## Características Implementadas

### 1. Vista Detallada de Estación (`/dashboard/station/[id]`)

#### Componentes Principales:

**StationDetailCard** - Tarjeta de Datos Actuales
- Muestra todos los parámetros meteorológicos en tiempo real
- Diseño con gradiente azul en el encabezado
- Temperatura destacada con tamaño grande
- Cálculo de sensación térmica (wind chill/heat index)
- Información del viento con indicador visual de dirección
- Organización en categorías:
  - Condiciones actuales (temperatura, humedad, precipitación, presión)
  - Viento (velocidad, rachas, dirección con brújula)
  - Información adicional (punto de rocío, radiación solar, UV)

**HistoricalChart** - Gráficas Históricas
- Visualización de datos históricos con Recharts
- Selector de período temporal:
  - Últimas 24 horas (intervalos de 10 minutos)
  - Últimos 7 días (intervalos de 1 hora)
  - Últimos 30 días (intervalos de 3 horas)
- Estadísticas automáticas (min, max, promedio)
- Tooltip personalizado con formato de fecha en español
- Soporte para múltiples variables simultáneas
- Colores diferenciados por variable

**VariableSelector** - Selector de Variables
- Interfaz tipo dropdown con checkbox
- Límite configurable de variables (por defecto 4)
- Indicadores de color para cada variable
- Botones de acción rápida:
  - "Por defecto": Selecciona temperatura, humedad, viento y precipitación
  - "Limpiar todo": Deselecciona todas
- Vista previa de variables seleccionadas
- Información de unidades de medida

### 2. Integración con Dashboard Existente

**StationDataCard Mejorado**
- Botón "Ver detalles" en cada tarjeta de estación
- Navegación directa a la vista detallada
- Mantiene funcionalidad existente de comparación

### 3. Sistema de API para Datos Históricos

#### Nuevo Endpoint:
```
GET /api/protected/stations/[id]/historical
```

**Parámetros de Consulta:**
- `period`: '24h' | '7d' | '30d' (por defecto: '24h')
- `variables`: Lista de códigos de variables separadas por coma

**Ejemplo:**
```
GET /api/protected/stations/10104/historical?period=7d&variables=TA_AVG_1.5m,HR_AVG_1.5m
```

#### Variables Meteorológicas Disponibles:

| Código | Nombre | Unidad | Color |
|--------|--------|--------|-------|
| TA_AVG_1.5m | Temperatura | °C | Rojo |
| HR_AVG_1.5m | Humedad | % | Azul |
| VV_AVG_10m | Velocidad del viento | m/s | Verde |
| VV_RACHA_10m | Racha de viento | m/s | Naranja |
| DV_AVG_10m | Dirección del viento | ° | Púrpura |
| PP_SUM_1.5m | Precipitación | mm | Cian |
| PR_AVG_1.5m | Presión atmosférica | hPa | Rosa |
| RS_AVG_1.5m | Radiación solar | W/m² | Naranja oscuro |
| TO_AVG_1.5m | Temperatura de rocío | °C | Verde azulado |

### 4. Tipos TypeScript

**Nuevos Tipos en `types/weather.ts`:**

```typescript
// Dato histórico individual
interface HistoricalDataPoint {
  timestamp: string;
  value: number;
  validationCode?: number;
}

// Serie temporal de una variable
interface HistoricalTimeSeries {
  parameterCode: string;
  parameterName: string;
  unit: string;
  data: HistoricalDataPoint[];
}

// Datos históricos completos de una estación
interface StationHistoricalData {
  stationId: number;
  stationName: string;
  period: '24h' | '7d' | '30d';
  startDate: string;
  endDate: string;
  variables: HistoricalTimeSeries[];
}

// Tipos de períodos y variables
type HistoricalPeriod = '24h' | '7d' | '30d';
type WeatherVariable = 'TA_AVG_1.5m' | 'HR_AVG_1.5m' | ...
```

### 5. Servicios

**meteogalicia-historical.ts**
- Generación de datos históricos sintéticos (temporal)
- Patrones meteorológicos realistas
- Intervalos de muestreo adaptativos según período
- Funciones de utilidad:
  - `getStationHistoricalData()`: Obtiene datos completos
  - `getHistoricalDataForVariables()`: Filtra variables específicas
  - `getVariableStats()`: Calcula estadísticas
  - `formatPeriodName()`: Formatea nombres de período

## Estructura de Archivos

```
├── app/
│   ├── dashboard/
│   │   └── station/
│   │       └── [id]/
│   │           └── page.tsx          # Página principal de detalle
│   └── api/
│       └── protected/
│           └── stations/
│               └── [id]/
│                   └── historical/
│                       └── route.ts  # API endpoint históricos
├── components/
│   └── stations/
│       ├── StationDetailCard.tsx     # Tarjeta de datos actuales
│       ├── HistoricalChart.tsx       # Gráfico histórico
│       ├── VariableSelector.tsx      # Selector de variables
│       └── StationDataCard.tsx       # Mejorado con enlace
├── lib/
│   └── meteogalicia-historical.ts    # Servicio de datos históricos
└── types/
    └── weather.ts                     # Tipos extendidos
```

## Estilos y Diseño

### Paleta de Colores:
- **Primario**: Gradiente azul-cian (`from-blue-600 to-cyan-600`)
- **Fondos**: Blanco / Gris oscuro (modo oscuro)
- **Acentos**: Azul para interacciones
- **Estados**: Verde (activo), Amarillo (advertencia), Rojo (error)

### Componentes UI:
- Cards con sombra y hover
- Gradientes sutiles en fondos
- Iconos de Heroicons
- Diseño responsive (grid adaptativo)
- Animaciones suaves (transitions)
- Modo oscuro completo

### Tipografía:
- Títulos: Bold, tamaños grandes (2xl-3xl)
- Valores: Bold, destacados
- Etiquetas: Gris, tamaño pequeño
- Fuente: System default (sans-serif)

## Flujo de Usuario

1. Usuario accede al Dashboard
2. Ve lista de estaciones en tab "Estaciones Meteorológicas"
3. Hace clic en "Ver detalles" en una estación
4. Navega a `/dashboard/station/10104` (o 10162)
5. Ve datos actuales completos en la parte superior
6. Selecciona variables a visualizar (máx. 4)
7. Cambia período de tiempo (24h, 7d, 30d)
8. Visualiza gráficas históricas interactivas
9. Ve estadísticas (min, max, promedio)
10. Puede volver al dashboard con botón "Volver"

## Navegación

- **Desde Dashboard**: Botón "Ver detalles" en cada estación
- **Hacia Dashboard**: Botón con icono de flecha "Volver al Dashboard"
- **URL directa**: `/dashboard/station/10104` o `/dashboard/station/10162`

## Datos en Tiempo Real

- **Actualización automática**: Cada 10 minutos
- **Indicador visual**: Punto verde pulsante "Datos en tiempo real"
- **Timestamp**: Muestra última actualización en formato local
- **Cache**: 10 minutos para observaciones actuales

## Características Futuras (Recomendadas)

1. **Integración con API Real de MeteoGalicia**
   - Endpoint de históricos real (actualmente datos sintéticos)
   - Archivos de descarga de datos históricos

2. **Exportación de Datos**
   - Descarga CSV/JSON
   - Generación de informes PDF

3. **Alertas Meteorológicas**
   - Notificaciones de condiciones extremas
   - Umbrales configurables

4. **Comparación Multi-Estación**
   - Gráficas comparativas históri cas
   - Vista split-screen

5. **Predicciones**
   - Integrar predicción en vista de estación
   - Comparar datos reales vs predichos

6. **Mapa Interactivo**
   - Visualización geográfica de estaciones
   - Selección mediante mapa

## Notas Técnicas

### Autenticación
- Requiere token JWT válido
- Verificación en cada request a API
- Redirección automática a login si no autenticado

### Performance
- Server-side rendering (SSR) para SEO
- Client-side fetching para interactividad
- Caching de datos para reducir llamadas API
- Lazy loading de componentes pesados

### Compatibilidad
- Next.js 14
- React 18
- TypeScript 5
- Tailwind CSS 3
- Recharts 3
- Heroicons 2

### Accesibilidad
- Botones con labels descriptivos
- Colores con contraste adecuado
- Tooltips informativos
- Navegación por teclado

## Créditos

- **Datos**: MeteoGalicia (Xunta de Galicia)
- **API**: MeteoGalicia API V5 y RSS
- **Estaciones**:
  - Penedo do Galo (10104) - 545m
  - Borreiros (10162) - 59m
