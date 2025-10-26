# Meteo Históricos Viveiro 🌤️📊

Aplicación meteorológica completa para Viveiro (Lugo, Galicia) con integración de la API V5 de MeteoGalicia. Ofrece datos meteorológicos en tiempo real, predicciones y **datos históricos de estaciones de observación** con gráficos comparativos interactivos.

## 🌟 Características

### Predicción Meteorológica
- **Clima actual en tiempo real** - Temperatura, humedad, viento, precipitación
- **Sensación térmica precisa** - Cálculo con fórmulas Wind Chill y Heat Index
- **Pronóstico por horas** - Predicción para las próximas 12 horas con iconos
- **Pronóstico diario** - Vista de 4 días con franjas horarias (mañana, tarde, noche)
- **Índice UV** - Niveles de radiación ultravioleta con recomendaciones de protección

### 🆕 Estaciones Meteorológicas (Datos Históricos Reales)
- **2 Estaciones de Viveiro** - Penedo do Galo (545m) y Borreiros (59m)
- **Datos en tiempo real** - Actualización automática cada 15 minutos + botón manual
- **Datos 100% reales** - Integración directa con endpoint oficial de MeteoGalicia
- **Históricos de hasta 72 horas** - Períodos de 24h, 48h (2 días), 72h (3 días)
- **Selector de estaciones** - Comparación múltiple con selección interactiva
- **Parámetros principales** - Temperatura, humedad, viento (media + rachas), precipitación, presión
- **Gráficos comparativos temporales** - Evolución de parámetros con datos reales horarios
- **Tarjetas detalladas** - Información completa con última hora de actualización
- **Sin caché** - Datos siempre frescos al abrir el dashboard

### General
- **Datos reales de MeteoGalicia** - Integración con API V5 y RSS/JSON para observaciones
- **Sistema de autenticación** - Supabase Auth con OAuth (Google, Facebook, Apple)
- **Diseño responsivo** - Optimizado para móvil, tablet y escritorio
- **Modo oscuro** - Soporte completo para tema claro/oscuro
- **Iconos meteorológicos oficiales** - Usando los iconos de MeteoGalicia

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript 5.9
- **Estilos**: Tailwind CSS 3.4
- **Gráficos**: Recharts 3.3.0
- **Autenticación**: Supabase Auth (@supabase/ssr) con OAuth
- **Base de datos**: PostgreSQL (Supabase) con Row Level Security
- **API**: MeteoGalicia API V5 + RSS/JSON para observaciones
- **Testing**: Vitest 3.2 + React Testing Library
- **Linter**: ESLint 9

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/landropunk/Meteo-Historicos-Viveiro.git
cd Meteo-Historicos-Viveiro
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar Supabase**

Sigue la guía completa en [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para:
- Crear un proyecto en Supabase
- Configurar OAuth providers (Google, Facebook, Apple)
- Configurar políticas de Row Level Security (RLS)

4. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` y añade tus credenciales:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# MeteoGalicia API
METEOGALICIA_API_KEY=tu_api_key_aqui
```

5. **Ejecutar en desarrollo**
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔑 Obtener API Key de MeteoGalicia

1. Visita [MeteoGalicia](https://www.meteogalicia.gal/)
2. Solicita una API key para desarrolladores
3. Añádela a tu archivo `.env.local`

## 📖 Uso

1. **Registro**: Crea una cuenta en `/auth/register`
2. **Login**: Inicia sesión en `/auth/login`
3. **Dashboard**: Accede al panel meteorológico en `/dashboard`

## 🌐 Datos Meteorológicos

La aplicación obtiene datos de dos fuentes de MeteoGalicia:

### API V5 - Datos Horarios
- Temperatura (°C)
- Precipitación (mm)
- Viento (velocidad y dirección)
- Estado del cielo (con iconos oficiales)
- Humedad relativa (%)

### RSS/JSON - Datos Municipales
- Temperaturas máximas y mínimas diarias
- Índice UV máximo
- Nivel de avisos meteorológicos
- Probabilidad de lluvia por franjas horarias

## 🛠️ Scripts Disponibles

```bash
pnpm dev         # Servidor de desarrollo
pnpm build       # Build de producción
pnpm start       # Servidor de producción
pnpm lint        # Linter
pnpm test        # Ejecutar tests
```

## 🗂️ Estructura del Proyecto

```
├── app/
│   ├── api/
│   │   └── protected/
│   │       ├── weather/             # Endpoints de predicción
│   │       ├── stations/            # Endpoints de estaciones
│   │       └── me/                  # Endpoint de usuario
│   ├── auth/
│   │   ├── login/                   # Página de login
│   │   ├── register/                # Página de registro
│   │   └── callback/                # OAuth callback handler
│   └── dashboard/                   # Dashboard con pestañas
├── components/
│   ├── weather/                     # Componentes de predicción
│   │   ├── CurrentWeatherCard.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── DailyForecast.tsx
│   │   └── UVWidget.tsx
│   └── stations/                    # Componentes de estaciones
│       ├── StationsView.tsx
│       ├── StationSelector.tsx
│       ├── StationDataCard.tsx
│       └── HistoricalChart.tsx
├── contexts/
│   └── AuthContext.tsx              # React Context para autenticación
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Cliente Supabase browser
│   │   ├── server.ts                # Cliente Supabase server
│   │   ├── middleware.ts            # Gestión de sesiones
│   │   └── auth-helpers.ts          # Helper requireAuth
│   ├── meteogalicia.ts              # Cliente API predicción
│   └── meteogalicia-stations.ts     # Cliente API estaciones
├── types/
│   ├── auth.ts                      # Tipos de autenticación
│   └── weather.ts                   # Tipos meteorológicos + estaciones
└── middleware.ts                    # Middleware de Next.js
```

## Testing

Los tests están configurados con Vitest y React Testing Library:

```bash
# Ejecutar tests
pnpm test

# Ejecutar tests en modo watch
pnpm test -- --watch

# Ver cobertura
pnpm test:coverage
```

## Deploy en Vercel

### Opción 1: Deploy desde GitHub

1. Sube tu código a un repositorio de GitHub
2. Importa el proyecto en [Vercel](https://vercel.com/new)
3. Vercel detectará automáticamente Next.js y configurará el build
4. Configura las variables de entorno necesarias
5. Haz deploy

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Hacer deploy
vercel
```

### Variables de entorno en Vercel

Configura tus variables de entorno en el dashboard de Vercel:
- Ve a tu proyecto → Settings → Environment Variables
- Añade las variables necesarias:
  - `NEXT_PUBLIC_SUPABASE_URL` - URL de tu proyecto Supabase
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key de Supabase
  - `METEOGALICIA_API_KEY` - Tu API key de MeteoGalicia
  - `NODE_ENV=production`

## Configuración de TypeScript

El proyecto usa configuración estricta de TypeScript. Puedes ajustar las opciones en [tsconfig.json](tsconfig.json).

## Configuración de Tailwind CSS

Personaliza los estilos en [tailwind.config.ts](tailwind.config.ts). Los estilos globales están en [app/globals.css](app/globals.css).

## Buenas prácticas

- Usa componentes de servidor por defecto (Server Components)
- Añade `"use client"` solo cuando necesites interactividad
- Organiza los componentes por feature en carpetas
- Escribe tests para componentes críticos
- Usa TypeScript para tipado fuerte
- Sigue las convenciones de nombres de archivos de Next.js

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Vitest](https://vitest.dev/)
- [Documentación de Vercel](https://vercel.com/docs)

## 🔒 Seguridad

- **Supabase Auth** - Sistema de autenticación empresarial
- **Cookies HttpOnly** - Tokens seguros (no accesibles desde JavaScript)
- **Row Level Security (RLS)** - Políticas de seguridad a nivel de base de datos
- **OAuth 2.0** - Autenticación con Google, Facebook, Apple
- **Middleware de protección** - Rutas protegidas automáticamente
- **Variables de entorno** - Credenciales seguras fuera del código

## 🌍 Localización

- Idioma: Español (España)
- Zona horaria: Europe/Madrid
- Localización: Viveiro, Lugo, Galicia

## 📄 Licencia

MIT License

## 👤 Autor

**landropunk**
- GitHub: [@landropunk](https://github.com/landropunk)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📝 Historial de Cambios

Consulta el archivo [CHANGELOG.md](CHANGELOG.md) para ver un historial detallado de todos los cambios, mejoras y correcciones de errores del proyecto. Incluye:
- ✨ Nuevas características añadidas
- 🔧 Cambios en funcionalidades existentes
- 🐛 Correcciones de bugs
- 📚 Documentación e investigación técnica
- 🗑️ Código eliminado o deprecado

Todos los cambios están documentados en **español** con explicaciones detalladas.

---

**Desarrollado con** ❤️ **usando Next.js y MeteoGalicia API**

🤖 **Asistido por Claude Code**
