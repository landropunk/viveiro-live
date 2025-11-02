import { NextRequest, NextResponse } from 'next/server';
import { getViveiroWeatherForecast } from '@/lib/meteogalicia';
import { requireAuth } from '@/lib/supabase/auth-helpers';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested forecast`);

    const forecast = await getViveiroWeatherForecast();

    // Si no hay datos, retornar respuesta exitosa con datos vacíos
    if (!forecast.data || forecast.data.length === 0) {
      return NextResponse.json({
        success: true,
        data: forecast,
        warning: 'Datos de pronóstico no disponibles temporalmente',
      });
    }

    return NextResponse.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    console.error('Error en /api/protected/weather/forecast:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener la predicción',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
