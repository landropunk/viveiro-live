# Guía de Configuración - Meteorología Viveiro

Esta guía te ayudará a configurar el proyecto desde cero.

## Paso 1: Requisitos previos

Asegúrate de tener instalado:
- Node.js 18.x o superior
- pnpm (opcional, también funciona con npm)
- Git

## Paso 2: Clonar e instalar

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd nextjs-autonomia

# Instalar dependencias
npm install
# o con pnpm:
pnpm install
```

## Paso 3: Configurar variables de entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus valores:

```env
# Base de datos (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# JWT Secrets (genera nuevos valores seguros para producción)
JWT_SECRET=tu-secreto-super-seguro-aqui
JWT_REFRESH_SECRET=tu-refresh-secret-super-seguro-aqui

# API de MeteoGalicia
METEOGALICIA_API_KEY=tu-api-key-aqui

# Entorno
NODE_ENV=development
```

### Generar secretos seguros

Para generar secretos JWT seguros, usa:
```bash
# En Linux/Mac:
openssl rand -base64 32

# En Windows con PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Obtener API Key de MeteoGalicia

1. Visita: https://www.meteogalicia.gal/web/servizos/
2. Solicita acceso a la API V5
3. Una vez obtenida, añádela a tu `.env.local`

> **Nota**: Mientras esperas tu API key, la aplicación funcionará con datos de ejemplo para demostración.

## Paso 4: Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Crear la base de datos y tablas
npx prisma db push

# (Opcional) Explorar la base de datos con Prisma Studio
npx prisma studio
```

## Paso 5: Iniciar el servidor de desarrollo

```bash
npm run dev
# o con pnpm:
pnpm dev
```

La aplicación estará disponible en: http://localhost:3000

## Paso 6: Crear tu primer usuario

1. Abre http://localhost:3000
2. Haz clic en "Registrarse"
3. Completa el formulario de registro
4. Inicia sesión con tus credenciales
5. Accede al dashboard en `/dashboard`

## Solución de problemas

### Error: No se puede conectar a la base de datos

Si ves este error, asegúrate de que:
- Has ejecutado `npx prisma generate`
- Has ejecutado `npx prisma db push`
- El archivo `dev.db` existe en la raíz del proyecto

```bash
# Reiniciar la base de datos
rm dev.db
npx prisma db push
```

### Error: Puerto 3000 en uso

```bash
# Windows
npm run kill-port 3000

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: Módulos no encontrados

```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de autenticación JWT

Verifica que:
- `JWT_SECRET` y `JWT_REFRESH_SECRET` estén configurados en `.env.local`
- Los valores sean diferentes entre sí
- No contengan espacios ni caracteres especiales problemáticos

## Estructura de la base de datos

El esquema de Prisma define las siguientes tablas:

- **User**: Usuarios de la aplicación
  - id, email, password (hasheada), name, role, createdAt, updatedAt

## API Endpoints

### Públicos
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Protegidos (requieren token JWT)
- `GET /api/protected/weather/current` - Clima actual de Viveiro
- `GET /api/protected/weather/forecast` - Predicción meteorológica
- `GET /api/protected/me` - Información del usuario actual
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/refresh` - Refrescar token

## Próximos pasos

Una vez configurado:

1. Explora el código en `app/dashboard/page.tsx` para ver cómo se consumen los datos
2. Revisa los componentes de gráficos en `components/weather/`
3. Personaliza los estilos en `tailwind.config.ts`
4. Añade más variables meteorológicas según tus necesidades
5. Configura el deploy en Vercel para producción

## Recursos adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Recharts](https://recharts.org/)
- [API de MeteoGalicia](https://www.meteogalicia.gal/web/servizos/)
