import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getDashboardSectionsConfig } from '@/lib/admin/settings';

export const dynamic = 'force-dynamic';

/**
 * GET /api/dashboard/config
 * Obtiene la configuración de las secciones del dashboard
 * Accesible por todos los usuarios autenticados
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const config = await getDashboardSectionsConfig();

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error en GET /api/dashboard/config:', error);

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
