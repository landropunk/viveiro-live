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
        const cookies = document.cookie.split(';')
        const cookie = cookies.find(c => c.trim().startsWith(`${name}=`))
        return cookie?.split('=')[1]
      },
      set(name: string, value: string, options: any) {
        document.cookie = `${name}=${value}; path=/; max-age=${options.maxAge}; SameSite=Lax; Secure`
      },
      remove(name: string, options: any) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      },
    },
  })
}
