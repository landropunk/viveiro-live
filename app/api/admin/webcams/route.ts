import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/admin/webcams
 * Obtener todas las webcams (incluyendo inactivas para admins)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener todas las webcams (incluyendo inactivas)
    const { data: webcams, error } = await supabase
      .from('webcams')
      .select('*')
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
    console.error('[API] Error en GET /api/admin/webcams:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/webcams
 * Crear una nueva webcam
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Parsear body
    const body = await request.json();
    const { name, location, url, type, refresh_interval, display_order } = body;

    // Validaciones
    if (!name || !location || !url || !type) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    if (!['image', 'iframe'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo inválido (debe ser "image" o "iframe")' },
        { status: 400 }
      );
    }

    // Insertar webcam
    const { data: webcam, error } = await supabase
      .from('webcams')
      .insert([
        {
          name,
          location,
          url,
          type,
          refresh_interval: type === 'image' ? refresh_interval || 30 : null,
          display_order: display_order || 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[API] Error creando webcam:', error);
      return NextResponse.json(
        { error: 'Error al crear webcam' },
        { status: 500 }
      );
    }

    console.log(`✅ Admin ${user.email} creó webcam: ${name}`);

    return NextResponse.json({ webcam }, { status: 201 });
  } catch (error) {
    console.error('[API] Error en POST /api/admin/webcams:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/webcams
 * Actualizar una webcam existente
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Parsear body
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de webcam requerido' },
        { status: 400 }
      );
    }

    // Actualizar webcam
    const { data: webcam, error } = await supabase
      .from('webcams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API] Error actualizando webcam:', error);
      return NextResponse.json(
        { error: 'Error al actualizar webcam' },
        { status: 500 }
      );
    }

    console.log(`✅ Admin ${user.email} actualizó webcam: ${webcam.name}`);

    return NextResponse.json({ webcam });
  } catch (error) {
    console.error('[API] Error en PATCH /api/admin/webcams:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/webcams
 * Eliminar una webcam
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que sea admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    // Obtener ID desde query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de webcam requerido' },
        { status: 400 }
      );
    }

    // Eliminar webcam
    const { error } = await supabase.from('webcams').delete().eq('id', id);

    if (error) {
      console.error('[API] Error eliminando webcam:', error);
      return NextResponse.json(
        { error: 'Error al eliminar webcam' },
        { status: 500 }
      );
    }

    console.log(`✅ Admin ${user.email} eliminó webcam ID: ${id}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error en DELETE /api/admin/webcams:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
