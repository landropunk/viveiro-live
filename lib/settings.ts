/**
 * Configuración de la aplicación - Funciones de utilidad
 * Este archivo reexporta funciones principales de lib/admin/settings.ts
 * y agrega funciones helper específicas para permisos de usuarios
 */

import { getSetting, getAllSettings, getSettingsByCategory, updateSetting } from '@/lib/admin/settings'

// Reexportar funciones principales
export { getSetting, getAllSettings, getSettingsByCategory, updateSetting }

// Alias para compatibilidad
export { getAllSettings as getSettings }

/**
 * Verifica si los usuarios pueden editar su perfil
 */
export async function canUsersEditProfile(): Promise<boolean> {
  const setting = await getSetting('users_can_edit_profile')
  if (!setting) return false
  // El formato es {"enabled": true/false}
  return setting.value?.enabled === true
}

/**
 * Verifica si está habilitado el restablecimiento de contraseña
 */
export async function isPasswordResetEnabled(): Promise<boolean> {
  const setting = await getSetting('password_reset_enabled')
  if (!setting) return false
  // El formato es {"enabled": true/false}
  return setting.value?.enabled === true
}
