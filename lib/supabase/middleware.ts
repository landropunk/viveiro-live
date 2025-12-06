/**
 * Supabase Client para uso en Middleware
 * Actualiza la sesión del usuario antes de cada request
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Usar URL interna para comunicación server-side (red Docker)
  const supabaseUrl = process.env.SUPABASE_URL_INTERNAL || process.env.NEXT_PUBLIC_SUPABASE_URL!

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Proteger rutas que requieren autenticación
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Verificar si el usuario autenticado tiene perfil completo
  if (user && !request.nextUrl.pathname.startsWith('/complete-profile') && !request.nextUrl.pathname.startsWith('/api/')) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, city, birth_date')
      .eq('id', user.id)
      .single()

    // Si el perfil no existe o está incompleto, redirigir a complete-profile
    // Campos obligatorios: full_name, city, birth_date
    const isProfileIncomplete = !profile || !profile.full_name || !profile.city || !profile.birth_date

    if (isProfileIncomplete && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/complete-profile'
      return NextResponse.redirect(url)
    }
  }

  // Proteger rutas de administración
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // Verificar que el usuario es admin consultando la tabla user_profiles
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    if (!isAdmin) {
      console.log(`⛔ Usuario ${user.email} intentó acceder a ${request.nextUrl.pathname} sin permisos de admin`)
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirigir usuarios autenticados de páginas de auth
  if (user && (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/register'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}
