/**
 * API Route: /api/protected/stations/[id]
 * Obtiene datos de una estación específica
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/supabase/auth-helpers';
import { getStationData, getStationInfo } from '@/lib/meteogalicia-stations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;
  const { id } = await params;

  try {
    console.log(`User ${user.email} requested station ${id}`);

    const stationId = parseInt(id, 10);

    if (isNaN(stationId)) {
      return NextResponse.json(
        { error: 'ID de estación inválido' },
        { status: 400 }
      );
    }

    const stationInfo = getStationInfo(stationId);
    if (!stationInfo) {
      return NextResponse.json(
        { error: 'Estación no encontrada' },
        { status: 404 }
      );
    }

    const observation = await getStationData(stationId);

    if (!observation) {
      return NextResponse.json(
        { error: 'No hay datos disponibles para esta estación' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      station: stationInfo,
      observation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error en /api/protected/stations/${id}:`, error);
    return NextResponse.json(
      { error: 'Error obteniendo datos de la estación' },
      { status: 500 }
    );
  }
}
