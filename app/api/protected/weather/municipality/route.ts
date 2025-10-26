import { NextRequest, NextResponse } from 'next/server';
import { getMunicipalityForecast } from '@/lib/meteogalicia';
import { requireAuth } from '@/lib/supabase/auth-helpers';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested municipality data`);

    const municipalityData = await getMunicipalityForecast();

    return NextResponse.json({
      success: true,
      data: municipalityData,
    });
  } catch (error) {
    console.error('Error en /api/protected/weather/municipality:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener datos municipales',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
