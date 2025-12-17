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

  // Dejar que Supabase maneje las cookies automáticamente
  // El cliente SSR de Supabase ya tiene gestión de cookies optimizada
  return createBrowserClient(supabaseUrl, supabaseKey)
