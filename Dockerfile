# ============================================================================
# Dockerfile para Viveiro Live - Aplicación Next.js 14
# ============================================================================
# Este Dockerfile crea una imagen optimizada multi-stage para producción
# ============================================================================

# ============================================================================
# STAGE 1: Dependencies
# ============================================================================
FROM node:20-alpine AS deps

# Instalar dependencias necesarias para compilar módulos nativos
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm
RUN npm install -g pnpm

# Instalar todas las dependencias (incluye devDependencies necesarias para el build)
RUN pnpm install --frozen-lockfile

# ============================================================================
# STAGE 2: Builder
# ============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar dependencias instaladas del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Argumentos de build para variables de entorno
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_SITE_URL
ARG METEOGALICIA_API_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Configurar variables de entorno para el build
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV METEOGALICIA_API_KEY=$METEOGALICIA_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Construir la aplicación Next.js
RUN pnpm build

# ============================================================================
# STAGE 3: Runner
# ============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Crear usuario no-root para mayor seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar archivos compilados de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario no-root
USER nextjs

# Exponer puerto 3000
EXPOSE 3000

# Variables de entorno de producción
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck para verificar que la aplicación está funcionando
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "server.js"]
