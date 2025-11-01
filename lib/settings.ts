import { createClient } from '@/lib/supabase/server'

/**
 * Obtiene el valor de una configuración específica
 */
export async function getSetting(key: string): Promise<any> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error || !data) {
    console.error(`Error obteniendo configuración ${key}:`, error)
    return null
  }

  return data.value
}

/**
 * Obtiene múltiples configuraciones
 */
export async function getSettings(keys: string[]): Promise<Record<string, any>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value')
    .in('key', keys)

  if (error || !data) {
    console.error('Error obteniendo configuraciones:', error)
    return {}
  }

  return data.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, any>)
}

/**
 * Obtiene todas las configuraciones de una categoría
 */
export async function getSettingsByCategory(category: string): Promise<Record<string, any>> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value')
    .eq('category', category)

  if (error || !data) {
    console.error(`Error obteniendo configuraciones de categoría ${category}:`, error)
    return {}
  }

  return data.reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, any>)
}

/**
 * Actualiza el valor de una configuración (solo para admins)
 */
export async function updateSetting(key: string, value: any): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('app_settings')
    .update({ value })
    .eq('key', key)

  if (error) {
    console.error(`Error actualizando configuración ${key}:`, error)
    return false
  }

  return true
}

/**
 * Verifica si los usuarios pueden editar su perfil
 */
export async function canUsersEditProfile(): Promise<boolean> {
  const value = await getSetting('users_can_edit_profile')
  return value === true || value === 'true'
}

/**
 * Verifica si está habilitado el restablecimiento de contraseña
 */
export async function isPasswordResetEnabled(): Promise<boolean> {
  const value = await getSetting('password_reset_enabled')
  return value === true || value === 'true'
}
