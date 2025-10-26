/**
 * Helpers de autenticación para API Routes con Supabase
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Verifica la autenticación del usuario en una API route
 * Retorna el usuario si está autenticado, o null si no lo está
 */
export async function getAuthenticatedUser(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Error verifying auth:', error)
    return null
  }
}

/**
 * Middleware helper para proteger API routes
 * Retorna NextResponse con error 401 si no está autenticado
 */
export async function requireAuth(request: NextRequest) {
  const user = await getAuthenticatedUser(request)

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: 'No autorizado',
        message: 'Debes iniciar sesión para acceder a este recurso',
      },
      { status: 401 }
    )
  }

  return { user }
}
