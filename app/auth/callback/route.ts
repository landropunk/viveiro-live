/**
 * Callback de OAuth para Google, Facebook, Apple, etc.
 * Supabase redirige aquí después de autenticación exitosa
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  if (code) {
    const cookieStore = await cookies()

    // Crear cliente Supabase con manejo explícito de cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            // Establecer todas las cookies sin try-catch para que fallen si hay error
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error en OAuth callback:', error)
      return NextResponse.redirect(`${origin}/auth/login?error=${error.message}`)
    }

    // Si el login fue exitoso, verificar/crear perfil de usuario
    if (data?.user) {
      console.log(`✅ Usuario OAuth autenticado: ${data.user.email}`)

      // Verificar si el usuario ya tiene perfil
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      // Si no tiene perfil, crearlo ahora
      if (!existingProfile) {
        console.log(`📝 Creando perfil para nuevo usuario: ${data.user.email}`)

        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            role: 'user',
          })

        if (insertError) {
          console.error('❌ Error creando perfil:', insertError)
        } else {
          console.log(`✅ Perfil creado exitosamente para ${data.user.email}`)
        }
      } else {
        console.log(`✓ Usuario ${data.user.email} ya tiene perfil`)
      }
    }
  }

  // Redirigir al dashboard después del login
  // El middleware se encargará de redirigir a /complete-profile si falta info
  return NextResponse.redirect(`${origin}/dashboard`)
}
