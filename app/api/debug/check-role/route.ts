import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Obtener el usuario actual
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        error: 'No autenticado',
        authError: authError?.message,
      }, { status: 401 })
    }

    // Obtener el perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      profile,
      profileError: profileError?.message,
      isAdmin: profile?.role === 'admin',
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Error del servidor',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
