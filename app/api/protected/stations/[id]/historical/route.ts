/**
 * API Route: /api/protected/stations/[id]/historical
 * Endpoint para obtener datos históricos de una estación meteorológica
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-helpers';
import {
  getStationHistoricalData,
  getHistoricalDataForVariables,
  HISTORICAL_VARIABLES,
} from '@/lib/meteogalicia-historical-real';
import type { HistoricalPeriod, WeatherVariable } from '@/types/weather';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Verificar autenticación
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested historical data for station ${params.id}`);

    // Parsear parámetros
    const stationId = parseInt(params.id);
    if (isNaN(stationId)) {
      return NextResponse.json(
        { error: 'ID de estación inválido' },
        { status: 400 }
      );
    }

    // Obtener parámetros de búsqueda
    const searchParams = request.nextUrl.searchParams;
    const period = (searchParams.get('period') || '24h') as HistoricalPeriod;
    const variablesParam = searchParams.get('variables');

    // Validar período
    if (!['24h', '48h', '72h'].includes(period)) {
      return NextResponse.json(
        { error: 'Período inválido. Use: 24h, 48h, o 72h (MeteoGalicia solo proporciona hasta 72h de históricos)' },
        { status: 400 }
      );
    }

    // Si se especifican variables, filtrar
    if (variablesParam) {
      const variables = variablesParam.split(',') as WeatherVariable[];

      // Validar que las variables sean válidas
      const invalidVars = variables.filter(v => !(v in HISTORICAL_VARIABLES));
      if (invalidVars.length > 0) {
        return NextResponse.json(
          {
            error: 'Variables inválidas',
            invalidVariables: invalidVars,
            validVariables: Object.keys(HISTORICAL_VARIABLES),
          },
          { status: 400 }
        );
      }

      const data = await getHistoricalDataForVariables(stationId, variables, period);

      return NextResponse.json({
        stationId,
        period,
        variables: data,
      });
    }

    // Obtener todos los datos históricos
    const data = await getStationHistoricalData(stationId, period);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en /api/protected/stations/[id]/historical:', error);
    return NextResponse.json(
      { error: 'Error obteniendo datos históricos' },
      { status: 500 }
    );
  }
}
