import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener datos del formulario
    const body = await request.json()
    const { full_name, city, postal_code, birth_date } = body

    // Validaciones
    if (!full_name || !full_name.trim()) {
      return NextResponse.json(
        { error: 'El nombre completo es obligatorio' },
        { status: 400 }
      )
    }

    if (!birth_date) {
      return NextResponse.json(
        { error: 'La fecha de nacimiento es obligatoria' },
        { status: 400 }
      )
    }

    if (!city) {
      return NextResponse.json(
        { error: 'La ciudad es obligatoria' },
        { status: 400 }
      )
    }

    if (city !== 'Viveiro' && !postal_code) {
      return NextResponse.json(
        { error: 'El código postal es obligatorio si no eres de Viveiro' },
        { status: 400 }
      )
    }

    // Actualizar o insertar el perfil del usuario (UPSERT)
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        full_name: full_name.trim(),
        birth_date,
        city,
        postal_code: city === 'Viveiro' ? null : postal_code,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error actualizando perfil:', error)
      return NextResponse.json(
        { error: 'Error al actualizar el perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: data,
    })
  } catch (error) {
    console.error('Error en /api/user/complete-profile:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
