# Migración de API Routes a Supabase Auth

Este documento muestra cómo actualizar las API routes para usar Supabase Auth.

## Cambios Necesarios

### 1. Helper de Auth (✅ Ya creado)

Ya se creó `lib/supabase/auth-helpers.ts` con las funciones:
- `getAuthenticatedUser(request)` - Obtiene el usuario autenticado
- `requireAuth(request)` - Middleware que requiere autenticación

### 2. Actualizar cada API Route

**ANTES (con JWT custom):**
```typescript
export async function GET(request: NextRequest) {
  try {
    const data = await fetchSomeData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // ...
  }
}
```

**DESPUÉS (con Supabase):**
```typescript
import { requireAuth } from '@/lib/supabase/auth-helpers';

export async function GET(request: NextRequest) {
  // 1. Verificar autenticación
  const authResult = await requireAuth(request);
  if (authResult instanceof NextResponse) {
    return authResult; // Retorna 401
  }

  const { user } = authResult;

  try {
    // 2. Log opcional para analytics
    console.log(`User ${user.email} requested...`);

    // 3. Tu lógica normal
    const data = await fetchSomeData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // ...
  }
}
```

## Archivos a Actualizar

### ✅ Principales (Dashboard)

1. `/api/protected/weather/current/route.ts`
2. `/api/protected/weather/forecast/route.ts`
3. `/api/protected/weather/municipality/route.ts`
4. `/api/protected/stations/route.ts`

### Secundarios (Opcional)

5. `/api/protected/stations/[id]/route.ts`
6. `/api/protected/stations/[id]/historical/route.ts`
7. `/api/protected/stations/comparison/route.ts`
8. `/api/protected/me/route.ts` - Puede eliminarse (Supabase tiene su propio user endpoint)

## Actualización del Dashboard

El dashboard necesita obtener el token de Supabase en lugar de localStorage:

**ANTES:**
```typescript
const token = localStorage.getItem('accessToken');

const response = await fetch('/api/protected/weather/current', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**DESPUÉS:**
```typescript
// No necesitas pasar token manualmente
// Las cookies de Supabase se envían automáticamente

const response = await fetch('/api/protected/weather/current', {
  credentials: 'include', // Asegura que las cookies se envíen
});
```

O mejor aún, usa el contexto de Auth:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  // Si user es null, el middleware redirige
  // Si user existe, las API routes funcionarán automáticamente
}
```

## Beneficios de este Cambio

1. **Analytics**: Logs de `user.email` en cada consulta
2. **Rate Limiting**: Puedes contar consultas por usuario
3. **Personalización**: Guardar preferencias por usuario
4. **Seguridad**: Row Level Security en Supabase
5. **Métricas**: Ver qué usuarios usan qué features

## Próximos Pasos

1. Actualizar las 4 API routes principales (weather + stations)
2. Actualizar el dashboard para no usar localStorage
3. Probar que todo funcione
4. (Opcional) Añadir logging a una tabla de Supabase para analytics
