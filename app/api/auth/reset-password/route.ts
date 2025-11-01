import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'La contraseña es obligatoria' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Actualizar la contraseña
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.error('Error actualizando contraseña:', error)
      return NextResponse.json(
        { error: 'Error al restablecer la contraseña' },
        { status: 500 }
      )
    }

    console.log('✅ Contraseña restablecida correctamente')

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    })
  } catch (error) {
    console.error('Error en /api/auth/reset-password:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
