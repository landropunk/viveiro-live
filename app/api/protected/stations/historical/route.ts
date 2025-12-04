import { NextRequest, NextResponse } from 'next/server';
import { getHourlyHistoricalData } from '@/lib/meteogalicia-hourly-historical';
import { requireAuth } from '@/lib/supabase/auth-helpers';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    const { searchParams } = new URL(request.url);
    const stationId = searchParams.get('stationId');
    const startDateTime = searchParams.get('startDateTime');
    const numHours = searchParams.get('numHours');

    if (!stationId || !startDateTime || !numHours) {
      return NextResponse.json(
        {
          success: false,
          error: 'Faltan parámetros requeridos: stationId, startDateTime, numHours',
        },
        { status: 400 }
      );
    }

    console.log(`User ${user.email} requested historical data for station ${stationId}`);
    console.log(`Parameters: startDateTime=${startDateTime}, numHours=${numHours}`);

    const data = await getHourlyHistoricalData({
      stationId: parseInt(stationId),
      startDateTime: startDateTime,
      numHours: parseInt(numHours),
    });

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en /api/protected/stations/historical:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener datos históricos',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
