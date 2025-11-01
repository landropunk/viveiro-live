import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/webcams
 * Obtener webcams activas (acceso público para usuarios autenticados)
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Verificar autenticación (requerido para acceder)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener solo webcams activas, ordenadas por display_order
    const { data: webcams, error } = await supabase
      .from('webcams')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[API] Error obteniendo webcams:', error);
      return NextResponse.json(
        { error: 'Error al obtener webcams' },
        { status: 500 }
      );
    }

    return NextResponse.json({ webcams });
  } catch (error) {
    console.error('[API] Error en GET /api/webcams:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
