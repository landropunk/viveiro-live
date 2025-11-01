'use client'

/**
 * Hook para verificar si el usuario actual es administrador
 */

import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('[useIsAdmin] Error checking admin status:', error)
          setIsAdmin(false)
          setLoading(false)
          return
        }

        setIsAdmin(data?.role === 'admin')
        setLoading(false)
      } catch (err) {
        console.error('[useIsAdmin] Exception checking admin status:', err)
        setIsAdmin(false)
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, supabase])

  return { isAdmin, loading }
}
