/**
 * Callback de OAuth para Google, Facebook, Apple, etc.
 * Supabase redirige aquí después de autenticación exitosa
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')

  // Usar NEXT_PUBLIC_SITE_URL si está configurado, sino usar origin de la request
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin

  if (code) {
    // Usar la misma función que el resto del server-side para consistencia
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error en OAuth callback:', error)
      return NextResponse.redirect(`${origin}/auth/signin?error=${error.message}`)
    }

    // Si el login fue exitoso, verificar/crear perfil de usuario
    if (data?.user) {
      console.log(`✅ Usuario autenticado: ${data.user.email}`)
      console.log(`📊 Provider: ${data.user.app_metadata?.provider}`)

      // Detectar si es OAuth (Google) o email/password
      const isOAuthProvider = data.user.app_metadata?.provider === 'google'

      // Verificar si el usuario ya tiene perfil
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id, full_name, birth_date, city')
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

        // Usuario nuevo sin perfil = verificación de email
        console.log('📧 Verificación de email completada (usuario nuevo)')
        return NextResponse.redirect(`${origin}/auth/verified`)
      }

      // Verificar si el perfil está completo
      const isProfileComplete = !!(
        existingProfile.full_name &&
        existingProfile.birth_date &&
        existingProfile.city
      )

      console.log(`📋 Perfil completo: ${isProfileComplete}`)

      // Si NO es login de Google Y el perfil NO está completo
      if (!isOAuthProvider && !isProfileComplete) {
        console.log('📧 Verificación de email - redirigiendo a página de éxito')
        return NextResponse.redirect(`${origin}/auth/verified`)
      }

      // Si es OAuth de Google con perfil incompleto, ir directo a completar perfil
      if (isOAuthProvider && !isProfileComplete) {
        console.log('🔐 Login Google - redirigiendo a completar perfil')
        return NextResponse.redirect(`${origin}/complete-profile`)
      }
    }
  }

  // Redirigir al dashboard después del login OAuth de Google
  // El middleware se encargará de redirigir a /complete-profile si falta info
  return NextResponse.redirect(`${origin}/dashboard`)
}
