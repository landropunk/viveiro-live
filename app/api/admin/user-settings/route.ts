import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/user-settings
 * Obtiene la configuración de permisos de usuarios
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    // Obtener configuración de usuarios de app_settings
    const { data: settingsData, error } = await supabase
      .from('app_settings')
      .select('key, value, description')
      .eq('category', 'users')

    if (error) {
      console.error('Error obteniendo configuración:', error)
      return NextResponse.json(
        { error: 'Error al obtener configuración' },
        { status: 500 }
      )
    }

    // Transformar a formato más amigable para el frontend
    const settings = settingsData?.map((s) => ({
      key: s.key,
      value: s.value,
      label: getSettingLabel(s.key),
      description: s.description || '',
    })) || []

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error en GET /api/admin/user-settings:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/user-settings
 * Actualiza un ajuste de usuario
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que es admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
    }

    const body = await request.json()
    const { key, value } = body

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: 'Se requiere key y value' },
        { status: 400 }
      )
    }

    console.log(`📝 Admin ${user.email} actualizando configuración de usuarios: ${key} = ${value}`)

    // Actualizar en app_settings
    const { error } = await supabase
      .from('app_settings')
      .update({ value })
      .eq('key', key)

    if (error) {
      console.error('Error actualizando configuración:', error)
      return NextResponse.json(
        { error: 'Error al actualizar configuración' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      key,
      value,
    })
  } catch (error) {
    console.error('Error en PATCH /api/admin/user-settings:', error)
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}

// Helper para obtener etiquetas amigables
function getSettingLabel(key: string): string {
  const labels: Record<string, string> = {
    users_can_edit_profile: 'Los usuarios pueden editar su perfil',
    users_can_change_email: 'Los usuarios pueden cambiar su email',
    default_user_role: 'Rol por defecto para nuevos usuarios',
  }

  return labels[key] || key
}
