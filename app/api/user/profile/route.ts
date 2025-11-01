import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { canUsersEditProfile } from '@/lib/settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/profile
 * Obtiene el perfil del usuario actual
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error obteniendo perfil:', profileError)
      return NextResponse.json(
        { error: 'Error al obtener perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error en GET /api/user/profile:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user/profile
 * Actualiza el perfil del usuario actual
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar si los usuarios pueden editar su perfil
    const canEdit = await canUsersEditProfile()

    if (!canEdit) {
      return NextResponse.json(
        { error: 'La edición de perfiles está deshabilitada' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { full_name, phone, address, city, postal_code, birth_date, bio, avatar_url } = body

    // Validaciones
    if (!full_name || !full_name.trim()) {
      return NextResponse.json(
        { error: 'El nombre completo es obligatorio' },
        { status: 400 }
      )
    }

    if (!city) {
      return NextResponse.json(
        { error: 'La ciudad es obligatoria' },
        { status: 400 }
      )
    }

    // Preparar datos para actualizar
    const updateData: any = {
      full_name: full_name.trim(),
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      city,
      postal_code: city === 'Viveiro' ? null : (postal_code?.trim() || null),
      birth_date: birth_date || null,
      bio: bio?.trim() || null,
      avatar_url: avatar_url?.trim() || null,
      updated_at: new Date().toISOString(),
    }

    // Actualizar el perfil
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error actualizando perfil:', error)
      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 500 }
      )
    }

    console.log(`✅ Usuario ${user.email} actualizó su perfil`)

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error('Error en PATCH /api/user/profile:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
