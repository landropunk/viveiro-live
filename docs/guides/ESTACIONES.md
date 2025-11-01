# Estaciones Meteorológicas de Viveiro

Nueva funcionalidad integrada en el dashboard para visualizar datos históricos y actuales de las estaciones meteorológicas de Viveiro.

## Características

### Estaciones disponibles

1. **Penedo do Galo (ID: 10104)**
   - Altitud: 545 metros
   - Coordenadas: 43.660763°N, -7.562965°O
   - Ubicación: Zona montañosa de Viveiro

2. **Borreiros (ID: 10162)**
   - Altitud: 59 metros
   - Coordenadas: 43.630886°N, -7.630877°O
   - Ubicación: Zona costera de Viveiro

### Funcionalidades implementadas

#### 1. Selector de estaciones
- Selección múltiple de estaciones para comparar datos
- Botones de "Seleccionar todas" y "Deseleccionar todas"
- Información de altitud y coordenadas de cada estación
- Indicador visual de estaciones seleccionadas

#### 2. Tarjetas de datos actuales
Para cada estación seleccionada se muestra:
- Temperatura actual (°C)
- Humedad relativa (%)
- Velocidad del viento (m/s)
- Precipitación (L/m²)
- Presión atmosférica (hPa)
- Hora de la última actualización
- Vista expandible con todos los parámetros disponibles

#### 3. Gráficos comparativos
- Gráficos de barras interactivos usando Recharts
- Comparación visual entre estaciones
- Variables principales:
  - Temperatura
  - Humedad relativa
  - Velocidad del viento
  - Precipitación
  - Presión atmosférica
  - Dirección del viento
  - Radiación solar
  - Y más de 15 parámetros adicionales

#### 4. Actualización automática
- Los datos se actualizan automáticamente cada 10 minutos
- Botón manual de actualización disponible
- Indicador de carga durante las actualizaciones

## Arquitectura técnica

### Servicios (lib/)

**meteogalicia-stations.ts**
- Gestión de datos de estaciones meteorológicas
- Consumo de API RSS/JSON de MeteoGalicia
- Endpoint: `https://servizos.meteogalicia.gal/rss/observacion/ultimos10minEstacionsMeteo.action`
- Transformación de datos a formato de aplicación
- Funciones de utilidad para formateo y procesamiento

### APIs (app/api/protected/)

**GET /api/protected/stations**
- Obtiene datos de todas las estaciones de Viveiro
- Retorna observaciones y datos de comparación
- Actualización: cada 10 minutos (cache)

**GET /api/protected/stations/[id]**
- Obtiene datos de una estación específica
- Parámetro: ID de estación (10104 o 10162)
- Incluye información de la estación y observación actual

### Componentes (components/stations/)

**StationSelector.tsx**
- Componente de selección de estaciones
- Props:
  - `stations`: Array de estaciones disponibles
  - `selectedStations`: Array de IDs seleccionados
  - `onSelectionChange`: Callback al cambiar selección

**StationDataCard.tsx**
- Tarjeta de datos actuales de una estación
- Muestra parámetros principales con iconos
- Vista expandible con todos los parámetros
- Props:
  - `station`: Información de la estación
  - `observation`: Datos de observación actual

**StationComparisonChart.tsx**
- Gráficos de barras comparativos
- Un gráfico por cada parámetro medido
- Colores distintos por estación:
  - Penedo do Galo: Azul (#3b82f6)
  - Borreiros: Verde (#10b981)
- Props:
  - `comparisonData`: Datos procesados para comparación
  - `selectedStations`: IDs de estaciones a mostrar

**StationsView.tsx**
- Componente principal que integra toda la funcionalidad
- Gestión de estado y fetching de datos
- Coordinación entre selector, tarjetas y gráficos

### Tipos (types/weather.ts)

Nuevos tipos añadidos:
```typescript
interface WeatherStation
interface StationMeasurement
interface StationObservation
interface StationObservationsResponse
interface StationComparisonData
```

## Integración en el Dashboard

El dashboard principal ([app/dashboard/page.tsx](app/dashboard/page.tsx)) ahora incluye dos pestañas:

1. **Predicción**: Vista original con pronóstico meteorológico
2. **Estaciones Meteorológicas**: Nueva vista con datos de estaciones

La navegación entre pestañas es fluida sin recargar la página.

## Uso

1. Inicia sesión en la aplicación
2. Navega al Dashboard
3. Haz clic en la pestaña "Estaciones Meteorológicas"
4. Selecciona las estaciones que deseas visualizar
5. Observa los datos actuales en las tarjetas
6. Desplázate hacia abajo para ver los gráficos comparativos
7. Haz clic en "Actualizar" para obtener los datos más recientes

## API de MeteoGalicia

### Endpoint utilizado
```
https://servizos.meteogalicia.gal/rss/observacion/ultimos10minEstacionsMeteo.action
```

### Frecuencia de actualización
Los datos de las estaciones se actualizan cada 10 minutos en la API de MeteoGalicia.

### Parámetros disponibles
- Temperatura (a diferentes alturas)
- Humedad relativa
- Precipitación
- Velocidad del viento
- Dirección del viento
- Presión atmosférica
- Presión reducida
- Radiación solar
- Radiación UV
- Horas de sol
- Temperatura del suelo
- Temperatura de rocío
- Brillo del cielo nocturno
- Desviación típica de variables
- Y más...

## Desarrollo futuro

Posibles mejoras:
- [ ] Gráficos de series temporales (evolución en el tiempo)
- [ ] Datos históricos por día/mes
- [ ] Exportación de datos a CSV/JSON
- [ ] Gráficos de línea para evolución temporal
- [ ] Alertas basadas en umbrales
- [ ] Comparación con datos de años anteriores
- [ ] Mapa interactivo con ubicación de estaciones
- [ ] Descarga de informes meteorológicos

## Tecnologías utilizadas

- **Next.js 14**: Framework React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Recharts 3.3.0**: Librería de gráficos
- **MeteoGalicia API**: Fuente de datos meteorológicos
