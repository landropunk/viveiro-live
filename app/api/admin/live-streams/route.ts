import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getAllStreams,
  createStream,
  updateStream,
  deleteStream,
} from '@/lib/admin/live-streams';
import type { LiveStreamInput } from '@/types/live-stream';

/**
 * GET /api/admin/live-streams
 * Obtiene todos los streams (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const streams = await getAllStreams();

    return NextResponse.json({
      success: true,
      data: streams,
    });
  } catch (error) {
    console.error('Error en GET /api/admin/live-streams:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener streams',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/live-streams
 * Crea un nuevo stream
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body: LiveStreamInput = await request.json();
    const stream = await createStream(body);

    return NextResponse.json({
      success: true,
      data: stream,
    });
  } catch (error) {
    console.error('Error en POST /api/admin/live-streams:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear stream',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/live-streams
 * Actualiza un stream existente
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const stream = await updateStream(id, data);

    return NextResponse.json({
      success: true,
      data: stream,
    });
  } catch (error) {
    console.error('Error en PATCH /api/admin/live-streams:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar stream',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/live-streams
 * Elimina un stream
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await deleteStream(id);

    return NextResponse.json({
      success: true,
      message: 'Stream eliminado correctamente',
    });
  } catch (error) {
    console.error('Error en DELETE /api/admin/live-streams:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar stream',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
