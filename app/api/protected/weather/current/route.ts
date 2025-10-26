import { NextRequest, NextResponse } from 'next/server';
import { getCurrentWeather } from '@/lib/meteogalicia';
import { requireAuth } from '@/lib/supabase/auth-helpers';

/**
 * GET /api/protected/weather/current
 * Obtiene el clima actual para Viveiro
 * Requiere autenticación con Supabase
 */
export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested current weather`);

    const currentWeather = await getCurrentWeather();

    return NextResponse.json({
      success: true,
      data: currentWeather,
    });
  } catch (error) {
    console.error('Error en /api/protected/weather/current:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener el clima actual',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
