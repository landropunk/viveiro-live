# Configuración de Base de Datos con Prisma

Guía rápida para configurar PostgreSQL con Prisma en el proyecto.

## Opción 1: PostgreSQL con Docker (Recomendado para desarrollo)

### 1. Crear `docker-compose.yml`

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: nextjs_autonomia_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: nextjs_autonomia
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Iniciar la base de datos

```bash
docker-compose up -d
```

### 3. Configurar variable de entorno

Crear `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs_autonomia?schema=public"
```

### 4. Ejecutar migraciones

```bash
# Generar cliente de Prisma
npx prisma generate

# Crear y aplicar migración
npx prisma migrate dev --name init

# Ver base de datos en el navegador
npx prisma studio
```

## Opción 2: Servicios en la Nube

### Supabase (Recomendado)

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Ir a Settings > Database
4. Copiar "Connection string" en modo "Transaction"
5. Añadir a `.env.local`:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### Neon

1. Crear cuenta en [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar connection string
4. Añadir a `.env.local`

### Railway

1. Crear cuenta en [railway.app](https://railway.app)
2. Crear nuevo proyecto
3. Añadir PostgreSQL desde el marketplace
4. Copiar DATABASE_URL de variables
5. Añadir a `.env.local`

## Comandos Útiles de Prisma

```bash
# Generar cliente
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (desarrollo)
npx prisma migrate reset

# Ver base de datos en el navegador
npx prisma studio

# Formatear schema
npx prisma format

# Validar schema
npx prisma validate
```

## Verificar Conexión

```typescript
// Crear test-db.ts
import prisma from './lib/prisma';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✓ Base de datos conectada');

    const userCount = await prisma.user.count();
    console.log(`✓ Usuarios en DB: ${userCount}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('✗ Error de conexión:', error);
  }
}

testConnection();
```

```bash
npx tsx test-db.ts
```

## Estructura de Tablas

El schema incluye:

- **users** - Usuarios con autenticación
- **sessions** - Sesiones activas
- **refresh_tokens** - Tokens de refresco
- **rate_limit_entries** - Control de rate limiting

## Próximos Pasos

Después de configurar la base de datos:

1. Reemplazar `lib/db.ts` con implementación de Prisma
2. Actualizar API routes para usar Prisma
3. Ejecutar tests
4. Implementar features avanzadas (ver `ADVANCED_AUTH_GUIDE.md`)

## Troubleshooting

### Error: "Can't reach database server"

- Verificar que PostgreSQL está corriendo: `docker ps` o check cloud dashboard
- Verificar connection string en `.env.local`
- Verificar firewall/network si es base de datos remota

### Error: "Environment variable not found: DATABASE_URL"

- Asegurarse de que `.env.local` existe en la raíz del proyecto
- Reiniciar el servidor de desarrollo

### Error en migraciones

```bash
# Resetear y empezar de nuevo
npx prisma migrate reset
npx prisma generate
npx prisma migrate dev --name init
```

## Recursos

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
