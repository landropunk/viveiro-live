'use client'

/**
 * Contexto de autenticación con Supabase
 * Proporciona el estado del usuario y funciones de auth a toda la app
 */

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  signInWithGoogle: (forceAccountSelection?: boolean) => Promise<void>
  signInWithFacebook: (forceAccountSelection?: boolean) => Promise<void>
  signInWithMicrosoft: (forceAccountSelection?: boolean) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Obtener usuario inicial
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      router.push('/dashboard')
      router.refresh()
    }
    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (!error) {
      // Redirigir a complete-profile para que el usuario complete su información
      router.push('/complete-profile')
      router.refresh()
    }
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    // Usar window.location para forzar navegación completa a inicio
    window.location.href = '/'
  }

  const signInWithGoogle = async (forceAccountSelection = false) => {
    // Usar NEXT_PUBLIC_SITE_URL si está configurado, sino usar window.location.origin
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`,
        skipBrowserRedirect: false,
        queryParams: forceAccountSelection ? {
          prompt: 'select_account',
        } : undefined,
      },
    })
  }

  const signInWithFacebook = async (forceAccountSelection = false) => {
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`,
        queryParams: forceAccountSelection ? {
          auth_type: 'reauthenticate',
        } : undefined,
      },
    })
  }

  const signInWithMicrosoft = async (forceAccountSelection = false) => {
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`,
        scopes: 'email',
        queryParams: forceAccountSelection ? {
          prompt: 'select_account',
        } : undefined,
      },
    })
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithFacebook,
    signInWithMicrosoft,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
