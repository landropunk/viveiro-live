/**
 * Middleware de Next.js con Supabase
 * Protege rutas y actualiza sesiones automáticamente
 */

import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /404, /500 (error pages)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|404|500|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
