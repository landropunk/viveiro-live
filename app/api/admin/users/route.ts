import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAllUserProfiles, updateUserProfile, type UpdateUserProfileData } from '@/lib/admin/users';

/**
 * GET /api/admin/users
 * Obtiene todos los usuarios (solo admins)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const users = await getAllUserProfiles();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error en GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Actualiza un usuario (solo admins)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Verificar que el usuario es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, ...updateData } = body as { userId: string } & UpdateUserProfileData;

    if (!userId) {
      return NextResponse.json(
        { error: 'ID de usuario requerido' },
        { status: 400 }
      );
    }

    // No permitir que el admin se quite a sí mismo el rol de admin
    if (userId === user.id && updateData.role === 'user') {
      return NextResponse.json(
        { error: 'No puedes quitarte a ti mismo el rol de administrador' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUserProfile(userId, updateData);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error en PATCH /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}
