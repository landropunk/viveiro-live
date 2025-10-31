import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllSettings, updateSetting } from '@/lib/admin/settings';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/settings
 * Obtiene toda la configuración de la aplicación
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

    // Verificar que es admin
    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const settings = await getAllSettings();

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error en GET /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Error al obtener configuración' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/settings
 * Actualiza un ajuste específico
 * Body: { key: string, value: any }
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

    // Verificar que es admin
    const isAdmin = user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Se requiere key y value' },
        { status: 400 }
      );
    }

    console.log(`📝 Admin ${user.email} actualizando configuración: ${key}`);

    const updatedSetting = await updateSetting(key, value);

    return NextResponse.json({
      success: true,
      setting: updatedSetting,
    });
  } catch (error) {
    console.error('Error en PATCH /api/admin/settings:', error);
    return NextResponse.json(
      { error: 'Error al actualizar configuración' },
      { status: 500 }
    );
  }
}
