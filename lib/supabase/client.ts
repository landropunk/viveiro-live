/**
 * Supabase Client para uso en componentes del lado del cliente
 * Se usa en componentes con 'use client'
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Debug: verificar que las variables estén definidas
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing!')
    console.error('URL:', supabaseUrl ? '✅ Defined' : '❌ Missing')
    console.error('Key:', supabaseKey ? '✅ Defined' : '❌ Missing')
    throw new Error('Missing Supabase environment variables')
  }

  console.log('✅ Supabase client initialized')
  console.log('URL:', supabaseUrl)

  return createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return getCookie(name)
      },
      set(name: string, value: string, options: any) {
        setCookie(name, value, options)
      },
      remove(name: string, options: any) {
        setCookie(name, '', { ...options, maxAge: 0 })
      },
    },
  })
}

// Helper para leer cookies en el cliente
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

// Helper para escribir cookies en el cliente
function setCookie(name: string, value: string, options: any = {}) {
  if (typeof document === 'undefined') return

  const expires = options.maxAge
    ? new Date(Date.now() + options.maxAge * 1000).toUTCString()
    : options.expires
    ? new Date(options.expires).toUTCString()
    : ''

  const secure = options.secure !== false ? 'Secure;' : ''
  const sameSite = options.sameSite || 'Lax'
  const path = options.path || '/'
  const domain = options.domain || ''

  document.cookie = `${name}=${value}; expires=${expires}; ${secure} SameSite=${sameSite}; Path=${path}${domain ? `; Domain=${domain}` : ''}`
}
