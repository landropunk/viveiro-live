/**
 * API Route: /api/protected/stations/comparison
 * Endpoint para obtener datos históricos de comparación entre estaciones
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-helpers';
import { getComparisonData } from '@/lib/meteogalicia-historical-real';
import type { HistoricalPeriod, StationComparisonTimeSeries } from '@/types/weather';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verificar autenticación
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested stations comparison`);

    // Obtener parámetros
    const searchParams = request.nextUrl.searchParams;
    const stationsParam = searchParams.get('stations');
    const period = (searchParams.get('period') || '24h') as HistoricalPeriod;

    if (!stationsParam) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro stations (ej: stations=10104,10162)' },
        { status: 400 }
      );
    }

    // Parsear IDs de estaciones
    const stationIds = stationsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (stationIds.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron IDs de estación válidos' },
        { status: 400 }
      );
    }

    // Validar período
    if (!['24h', '48h', '72h'].includes(period)) {
      return NextResponse.json(
        { error: 'Período inválido. Use: 24h, 48h, o 72h (MeteoGalicia solo proporciona hasta 72h de históricos)' },
        { status: 400 }
      );
    }

    console.log(`📊 Obteniendo datos de comparación: estaciones [${stationIds.join(', ')}], período: ${period}`);

    // Obtener datos de comparación
    const comparisonMap = await getComparisonData(stationIds, period);

    // Transformar a formato de comparación para gráficos
    const comparisonData = transformToComparisonFormat(comparisonMap);

    console.log(`✅ Datos de comparación obtenidos: ${comparisonData.length} variables`);

    return NextResponse.json({
      stations: stationIds,
      period,
      data: comparisonData,
    });
  } catch (error) {
    console.error('Error en /api/protected/stations/comparison:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de comparación' },
      { status: 500 }
    );
  }
}

/**
 * Transforma los datos de múltiples estaciones al formato de comparación
 */
function transformToComparisonFormat(
  comparisonMap: Map<number, any>
): StationComparisonTimeSeries[] {
  if (comparisonMap.size === 0) return [];

  // Obtener todos los códigos de parámetros disponibles
  const parameterCodes = new Set<string>();
  comparisonMap.forEach((stationData) => {
    stationData.variables.forEach((variable: any) => {
      parameterCodes.add(variable.parameterCode);
    });
  });

  // Para cada parámetro, crear una serie de comparación
  const comparisonData: StationComparisonTimeSeries[] = [];

  parameterCodes.forEach((paramCode) => {
    const stations: Record<number, any> = {};

    comparisonMap.forEach((stationData, stationId) => {
      const variable = stationData.variables.find(
        (v: any) => v.parameterCode === paramCode
      );

      if (variable) {
        stations[stationId] = variable;
      }
    });

    // Solo incluir si al menos una estación tiene este parámetro
    if (Object.keys(stations).length > 0) {
      const firstVariable = Object.values(stations)[0];

      comparisonData.push({
        parameterCode: paramCode,
        parameterName: firstVariable.parameterName,
        unit: firstVariable.unit,
        stations,
      });
    }
  });

  return comparisonData;
}
