import { NextResponse } from 'next/server';
import { getDashboardSectionsConfig } from '@/lib/admin/settings';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dashboard/config
 * Obtiene la configuración de las secciones del dashboard
 * Accesible por todos los usuarios autenticados
 */
export async function GET() {
  try {
    // Este endpoint es público - no requiere autenticación
    // Necesario para mostrar correctamente la página de inicio
    const config = await getDashboardSectionsConfig();

    return NextResponse.json(config);
  } catch (error) {
    logger.error('Error en GET /api/dashboard/config:', error);

    // Devolver configuración por defecto en caso de error
    return NextResponse.json({
      meteo: true,
      historicos: true,
      eventos: true,
      webcams: true,
      seccion5: false,
      seccion6: false,
    });
  }
}
