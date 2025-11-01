import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { canUsersEditProfile } from '@/lib/settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/user/permissions
 * Obtiene los permisos del usuario actual
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

    // Obtener permisos desde app_settings
    const canEditProfile = await canUsersEditProfile()

    return NextResponse.json({
      canEditProfile,
    })
  } catch (error) {
    console.error('Error en GET /api/user/permissions:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
