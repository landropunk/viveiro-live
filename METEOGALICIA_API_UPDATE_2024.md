# Actualización API MeteoGalicia 2024

## Resumen de Cambios Integrados

### 1. ✅ Catálogo Ampliado de Iconos del Estado del Cielo

Se ha actualizado el catálogo de iconos en los servicios de predicción (ayuntamientos, playas y marítima).

#### Iconos Añadidos (8 nuevos):
1. **WEAK_SNOW / 12** - Nieve débil
2. **SNOW_SHOWERS** - Chubascos de nieve
3. **SLEET / 12** - Aguanieve
4. **HAIL / 13** - Granizo
5. **THUNDERSTORM / 14** - Tormenta eléctrica
6. **FREEZING_RAIN / 15** - Lluvia engelante
7. **SANDSTORM** - Tormenta de arena
8. **DUST** - Polvo en suspensión

**Archivo actualizado**: `lib/meteogalicia.ts` - función `getSkyStateName()`

**Nota**: Los identificadores existentes NO han cambiado, solo se ampliaron con nuevas opciones.

---

### 2. ✅ Nuevo Servicio: Datos Horarios Históricos

Nuevo endpoint para consultar datos históricos horarios de estaciones meteorológicas.

#### Endpoint:
```
https://servizos.meteogalicia.gal/mgrss/observacion/datosHorariosEstacions.action
```

#### Parámetros:
- **dataIni**: Fecha y hora inicial (formato: `DD/MM/YYYY HH:MM`)
- **numHoras**: Número de horas a consultar
- **idEst**: ID de la estación meteorológica

#### Ejemplo de Uso:
```
?dataIni=02/10/2023%2004:00&numHoras=4&idEst=10124
```

#### Archivo Creado:
`lib/meteogalicia-hourly-historical.ts`

#### Funciones Principales:

##### `getHourlyHistoricalData(params)`
Obtiene datos horarios históricos de una estación específica.

```typescript
const data = await getHourlyHistoricalData({
  startDateTime: '30/10/2024 08:00',
  numHours: 24,
  stationId: 10104
});
```

##### `getLastHoursData(numHours)`
Obtiene datos de las últimas N horas desde ahora para todas las estaciones de Viveiro.

```typescript
const data = await getLastHoursData(24); // Últimas 24 horas
```

##### `getViveiroHourlyHistoricalData(startDateTime, numHours)`
Obtiene datos históricos de todas las estaciones de Viveiro.

```typescript
const data = await getViveiroHourlyHistoricalData('30/10/2024 00:00', 48);
```

#### Datos Disponibles:
- Temperatura (`temperature`)
- Humedad relativa (`humidity`)
- Precipitación (`precipitation`)
- Velocidad del viento (`windSpeed`) - convertido a km/h
- Dirección del viento (`windDirection`)
- Presión atmosférica (`pressure`)
- Radiación solar (`solarRadiation`)
- Y otros parámetros adicionales

---

## Estaciones de Viveiro Configuradas

### 1. Penedo do Galo
- **ID**: 10104
- **Altitud**: 545m
- **Coordenadas**: 43.660763, -7.562965

### 2. Borreiros
- **ID**: 10162
- **Altitud**: 59m
- **Coordenadas**: 43.630886, -7.630877

---

## Próximos Pasos

### Pendiente de Implementar:

1. **Interfaz de Visualización de Datos Históricos**
   - Gráficos de evolución horaria
   - Comparación entre estaciones
   - Exportación de datos

2. **Integración en Dashboard**
   - Nueva sección "Históricos Horarios"
   - Selector de rango de fechas
   - Visualización de tendencias

3. **Caché y Optimización**
   - Implementar caché para datos históricos
   - Reducir llamadas a la API

---

## Documentación Oficial

- **Servicio Históricos**: https://meteo-estaticos.xunta.gal/datosred/infoweb/meteo/docs/rss/JSON_EstacionHorariosHistoricos_es.pdf
- **Parámetros**: https://www.meteogalicia.gal/web/observacion/parametros
- **RSS/JSON**: https://www.meteogalicia.gal/web/rss-georss-json

---

## Changelog

### 2024-10-30
- ✅ Actualizado catálogo de iconos con 8 nuevas opciones
- ✅ Creado servicio de datos horarios históricos
- ✅ Integradas funciones para estaciones de Viveiro
- ⏳ Pendiente: Interfaz de visualización

---

## Testing

Para probar el nuevo servicio:

```typescript
import { getLastHoursData } from '@/lib/meteogalicia-hourly-historical';

// Obtener datos de las últimas 24 horas
const data = await getLastHoursData(24);

// Datos por estación
data.forEach((stationData, stationId) => {
  console.log(`Estación ${stationId}:`, stationData.length, 'registros');
});
```

---

**Última actualización**: 30 de octubre de 2024
