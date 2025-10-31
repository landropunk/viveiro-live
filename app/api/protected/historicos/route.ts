import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLastHoursData } from '@/lib/meteogalicia-hourly-historical';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/protected/historicos
 * Obtiene datos horarios históricos de las estaciones de Viveiro
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    console.log(`User ${user.email} requested historical data`);

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams;
    const numHours = parseInt(searchParams.get('hours') || '24', 10);

    // Validar parámetro
    if (numHours < 1 || numHours > 168) {
      return NextResponse.json(
        { error: 'El número de horas debe estar entre 1 y 168 (7 días)' },
        { status: 400 }
      );
    }

    console.log(`📊 Obteniendo datos históricos: ${numHours} horas`);

    // Obtener datos
    const data = await getLastHoursData(numHours);

    // Convertir Map a objeto para serialización JSON
    const result: Record<number, any> = {};
    data.forEach((value, key) => {
      result[key] = value;
    });

    console.log(`✅ Datos históricos obtenidos:`, {
      estaciones: data.size,
      horas: numHours,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error en API de históricos:', error);
    return NextResponse.json(
      {
        error: 'Error al obtener datos históricos',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
