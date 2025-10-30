'use client'

/**
 * Hook para verificar si el usuario actual es administrador
 */

import { useAuth } from '@/contexts/AuthContext'

export function useIsAdmin(): boolean {
  const { user } = useAuth()

  if (!user) return false

  return user.user_metadata?.role === 'admin'
}
