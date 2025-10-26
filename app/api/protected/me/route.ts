import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/auth-helpers";

// Marcar ruta como dinámica
export const dynamic = "force-dynamic";

/**
 * GET /api/protected/me
 * Obtiene información del usuario autenticado
 * Esta ruta está protegida por Supabase Auth
 */
export async function GET(request: NextRequest) {
  // Verificar autenticación
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  try {
    console.log(`User ${user.email} requested their profile`);

    // Retornar información del usuario de Supabase
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        // Metadata adicional de Supabase si existe
        ...user.user_metadata,
      },
    });
  } catch (error) {
    console.error("Error en /api/protected/me:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
