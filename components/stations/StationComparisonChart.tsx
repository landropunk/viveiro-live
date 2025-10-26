'use client';

import { StationComparisonTimeSeries } from '@/types/weather';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getWindDirectionFull } from '@/lib/meteogalicia';
import { VIVEIRO_STATIONS } from '@/lib/meteogalicia-stations';

interface StationComparisonChartProps {
  comparisonData: StationComparisonTimeSeries[];
  selectedStations: number[];
}

const STATION_COLORS: Record<number, string> = {
  10104: '#3b82f6', // Penedo do Galo - Azul
  10162: '#10b981', // Borreiros - Verde
};

const STATION_NAMES: Record<number, string> = {
  10104: 'Penedo do Galo',
  10162: 'Borreiros',
};

/**
 * Determina el dominio apropiado del eje Y según el tipo de parámetro
 */
function getYAxisDomain(parameterName: string, unit: string): [number, number] | ['auto', 'auto'] {
  // Temperatura (°C) - Rango fijo: -15°C a 50°C
  if (unit === '°C' || parameterName.toLowerCase().includes('temperatura')) {
    return [-15, 50];
  }

  // Humedad (%) - Rango completo: 0% a 100%
  if (unit === '%' || parameterName.toLowerCase().includes('humedad')) {
    return [0, 100];
  }

  // Velocidad del viento (km/h, m/s)
  if (unit === 'km/h' || unit === 'm/s' || parameterName.toLowerCase().includes('velocidad')) {
    return [0, 'auto' as any]; // Desde 0 con límite superior automático
  }

  // Precipitación (mm, L/m²) - Rango fijo: 0 a 250 L/m²
  if (unit === 'mm' || unit === 'L/m²' || unit === 'l/m2' || parameterName.toLowerCase().includes('precipitación') || parameterName.toLowerCase().includes('precipitacion')) {
    return [0, 250];
  }

  // Presión (hPa, mb) - Auto
  if (unit === 'hPa' || unit === 'mb' || parameterName.toLowerCase().includes('presión') || parameterName.toLowerCase().includes('presion')) {
    return ['auto', 'auto'];
  }

  // Por defecto: auto
  return ['auto', 'auto'];
}

/**
 * Verifica si un parámetro es dirección del viento
 */
function isWindDirection(parameterCode: string, unit: string): boolean {
  return unit === '°' || parameterCode.includes('DV_');
}

/**
 * Formatea el timestamp para el eje X (solo hora)
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Filtra los ticks del eje X para mostrar solo horas en punto cada 2 horas
 */
function filterTicks(timestamps: string[]): string[] {
  return timestamps.filter((timestamp) => {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const minute = date.getMinutes();
    // Mostrar solo horas en punto (minuto 0) y cada 2 horas (0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22)
    return minute === 0 && hour % 2 === 0;
  });
}

/**
 * Formatea el tooltip con información detallada
 */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {new Date(label).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 dark:text-gray-300">
            {entry.name}: <strong>{entry.value.toFixed(1)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Agrupa variables de viento que son similares pero a diferentes alturas
 */
function groupWindVariables(comparisonData: StationComparisonTimeSeries[]): StationComparisonTimeSeries[] {
  const windGustVariables = comparisonData.filter(v =>
    v.parameterCode === 'VV_RACHA_10m' || v.parameterCode === 'VV_RACHA_2m'
  );

  const windDirectionVariables = comparisonData.filter(v =>
    v.parameterCode === 'DV_AVG_10m' || v.parameterCode === 'DV_AVG_2m'
  );

  const otherVariables = comparisonData.filter(v =>
    v.parameterCode !== 'VV_RACHA_10m' && v.parameterCode !== 'VV_RACHA_2m' &&
    v.parameterCode !== 'DV_AVG_10m' && v.parameterCode !== 'DV_AVG_2m'
  );

  const grouped: StationComparisonTimeSeries[] = [...otherVariables];

  // Agrupar rachas de viento
  if (windGustVariables.length > 0) {
    const mergedStations: any = {};
    windGustVariables.forEach(v => {
      Object.entries(v.stations).forEach(([stationId, data]) => {
        mergedStations[stationId] = data;
      });
    });

    grouped.push({
      parameterCode: 'VV_RACHA', // Código combinado
      parameterName: 'Rachas de viento',
      unit: 'km/h',
      stations: mergedStations,
    });
  }

  // Agrupar dirección del viento
  if (windDirectionVariables.length > 0) {
    const mergedStations: any = {};
    windDirectionVariables.forEach(v => {
      Object.entries(v.stations).forEach(([stationId, data]) => {
        mergedStations[stationId] = data;
      });
    });

    grouped.push({
      parameterCode: 'DV_AVG', // Código combinado
      parameterName: 'Dirección del viento',
      unit: '°',
      stations: mergedStations,
    });
  }

  return grouped;
}

export default function StationComparisonChart({
  comparisonData,
  selectedStations,
}: StationComparisonChartProps) {
  if (comparisonData.length === 0 || selectedStations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <p className="text-center text-gray-500 dark:text-gray-400">
          Selecciona al menos una estación para ver los datos
        </p>
      </div>
    );
  }

  // Agrupar variables de viento por tipo (independiente de altura)
  const groupedData = groupWindVariables(comparisonData);

  return (
    <div className="space-y-6">
      {groupedData.map((variable, index) => {
        // Filtrar solo estaciones seleccionadas
        const selectedStationData = Object.entries(variable.stations)
          .filter(([stationId]) => selectedStations.includes(parseInt(stationId)));

        if (selectedStationData.length === 0) return null;

        const isWindDir = isWindDirection(variable.parameterCode, variable.unit);

        // Si es dirección del viento, mostrar como texto
        if (isWindDir) {
          return (
            <div
              key={`${variable.parameterCode}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {variable.parameterName} - Últimas 24 horas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedStationData.map(([stationId, series]) => {
                  const latestData = series.data[series.data.length - 1];
                  const cardinalDirection = latestData ? getWindDirectionFull(latestData.value) : '-';
                  const degrees = latestData?.value;

                  const color = STATION_COLORS[parseInt(stationId)] || '#6b7280';

                  return (
                    <div
                      key={stationId}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {STATION_NAMES[parseInt(stationId)] || stationId}
                          {/* Añadir altura para variables de viento */}
                          {(variable.parameterCode === 'DV_AVG' || variable.parameterCode === 'VV_RACHA') && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              ({parseInt(stationId) === 10104 ? '10m' : parseInt(stationId) === 10162 ? '2m' : ''})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          {cardinalDirection}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {degrees?.toFixed(0)}°
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                Valor actual (los gráficos de dirección del viento en el tiempo son poco informativos)
              </p>
            </div>
          );
        }

        // Preparar datos para el gráfico de líneas
        // Obtener todos los timestamps únicos
        const timestampSet = new Set<string>();
        selectedStationData.forEach(([, series]) => {
          series.data.forEach(point => timestampSet.add(point.timestamp));
        });

        const timestamps = Array.from(timestampSet).sort();

        // Crear datos para el gráfico
        const chartData = timestamps.map(timestamp => {
          const dataPoint: any = { timestamp };

          selectedStationData.forEach(([stationId, series]) => {
            const point = series.data.find(p => p.timestamp === timestamp);
            dataPoint[stationId] = point?.value ?? null;
          });

          return dataPoint;
        });

        // Filtrar ticks para mostrar solo cada 2 horas en punto
        const filteredTicks = filterTicks(timestamps);

        const [yMin, yMax] = getYAxisDomain(variable.parameterName, variable.unit);

        return (
          <div
            key={`${variable.parameterCode}-${index}`}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {variable.parameterName} ({variable.unit}) - Últimas 24 horas
            </h3>

            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis
                  dataKey="timestamp"
                  ticks={filteredTicks}
                  tickFormatter={formatTimestamp}
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  domain={yMin && yMax ? [yMin, yMax] : undefined}
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  className="text-gray-600 dark:text-gray-400"
                  label={{
                    value: variable.unit,
                    angle: -90,
                    position: 'insideLeft',
                    style: { fill: 'currentColor', fontSize: 12 }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                  formatter={(value, entry: any) => {
                    const stationId = parseInt(value);
                    const stationName = STATION_NAMES[stationId] || value;

                    // Si es variable de viento, añadir altura del anemómetro
                    if (variable.parameterCode === 'VV_RACHA' || variable.parameterCode === 'DV_AVG') {
                      // Penedo do Galo: 10m, Borreiros: 2m
                      const height = stationId === 10104 ? '10m' : stationId === 10162 ? '2m' : '';
                      return height ? `${stationName} (${height})` : stationName;
                    }

                    return stationName;
                  }}
                />
                {selectedStationData.map(([stationId]) => (
                  <Line
                    key={stationId}
                    type="monotone"
                    dataKey={stationId}
                    name={STATION_NAMES[parseInt(stationId)] || stationId}
                    stroke={STATION_COLORS[parseInt(stationId)] || '#6b7280'}
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
