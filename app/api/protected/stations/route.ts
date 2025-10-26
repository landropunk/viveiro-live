import { NextRequest, NextResponse } from 'next/server';
import { getViveiroStationsData } from '@/lib/meteogalicia-stations';
import { requireAuth } from '@/lib/supabase/auth-helpers';

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested stations`);

    const stations = await getViveiroStationsData();

    return NextResponse.json({
      success: true,
      observations: stations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en /api/protected/stations:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estaciones',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
