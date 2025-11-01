import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'El email es obligatorio' },
        { status: 400 }
      )
    }

    // Enviar email de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      console.error('Error enviando email de recuperación:', error)
      // No revelar si el email existe o no por seguridad
      return NextResponse.json({
        success: true,
        message: 'Si el email existe, recibirás un enlace de recuperación',
      })
    }

    console.log(`📧 Email de recuperación enviado a: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Email de recuperación enviado',
    })
  } catch (error) {
    console.error('Error en /api/auth/forgot-password:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
