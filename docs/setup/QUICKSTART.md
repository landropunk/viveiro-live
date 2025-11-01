# Inicio Rápido - Meteorología Viveiro

## ¡Tu aplicación meteorológica está lista! 🌤️

He transformado tu proyecto Next.js en una aplicación completa de meteorología para Viveiro con autenticación y dashboard interactivo.

## Próximos Pasos

### 1. Configura tu API Key de MeteoGalicia

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local
```

Edita `.env.local` y añade tu API key:
```env
METEOGALICIA_API_KEY=tu-api-key-aqui
```

**¿No tienes API key?** No hay problema, la aplicación funciona con datos de demostración mientras tanto.

### 2. Inicia el servidor de desarrollo

```bash
npm run dev
```

### 3. Prueba la aplicación

1. Abre http://localhost:3000
2. Registra un nuevo usuario
3. Inicia sesión
4. Accede al dashboard en `/dashboard`

## Estructura de lo que he creado

### 📁 Nuevos archivos y carpetas

```
app/
├── dashboard/
│   └── page.tsx                        # Dashboard meteorológico principal
├── api/protected/weather/
│   ├── current/route.ts               # API clima actual
│   └── forecast/route.ts              # API predicción

components/weather/
├── CurrentWeatherCard.tsx             # Tarjeta clima actual
├── TemperatureChart.tsx               # Gráfico temperatura/humedad
└── PrecipitationChart.tsx             # Gráfico precipitación/viento

lib/
└── meteogalicia.ts                    # Cliente API MeteoGalicia

types/
└── weather.ts                         # Tipos TypeScript para datos meteorológicos
```

### ✨ Características implementadas

- ✅ Sistema de autenticación completo (ya existente)
- ✅ Integración con MeteoGalicia API V5
- ✅ Dashboard protegido por autenticación
- ✅ Tarjeta de clima actual con:
  - Temperatura y sensación térmica
  - Humedad y presión
  - Viento (velocidad y dirección)
  - Precipitación
- ✅ Gráficos interactivos con Recharts:
  - Temperatura y humedad (24h)
  - Precipitación y viento (24h)
- ✅ Actualización automática cada 15 minutos
- ✅ Diseño responsive
- ✅ Modo oscuro
- ✅ Datos de ejemplo si la API no está disponible

## Personalización

### Cambiar la ubicación

Si quieres cambiar de Viveiro a otra localidad, edita [lib/meteogalicia.ts:13-18](lib/meteogalicia.ts#L13-L18):

```typescript
const VIVEIRO_LOCATION = {
  id: 27066,
  name: 'Viveiro',
  province: 'Lugo',
  latitude: 43.6626,
  longitude: -7.5947,
};
```

### Añadir más gráficos

Puedes crear nuevos componentes en `components/weather/` siguiendo el patrón de los existentes.

### Modificar estilos

Los estilos están en Tailwind CSS. Puedes personalizar colores y estilos en:
- [tailwind.config.ts](tailwind.config.ts)
- Directamente en los componentes

## Dependencias instaladas

He añadido las siguientes librerías:
- `recharts` - Gráficos interactivos
- `date-fns` - Formateo de fechas

## Próximas mejoras sugeridas

1. **Añadir más variables meteorológicas**:
   - Índice UV
   - Calidad del aire
   - Visibilidad
   - Probabilidad de lluvia

2. **Predicción extendida**:
   - Vista de 7 días
   - Predicción por horas más detallada

3. **Notificaciones**:
   - Alertas meteorológicas
   - Avisos por mal tiempo

4. **Comparativas**:
   - Comparar con días anteriores
   - Estadísticas históricas

5. **Mapas**:
   - Radar de lluvia
   - Mapas de temperatura

## Documentación

- [README.md](README.md) - Documentación completa del proyecto
- [SETUP.md](SETUP.md) - Guía detallada de configuración
- [CLAUDE.md](CLAUDE.md) - Instrucciones para el proyecto

## Soporte

Si encuentras algún problema:

1. Verifica que todas las dependencias estén instaladas: `npm install`
2. Asegúrate de que la base de datos esté configurada: `npx prisma db push`
3. Revisa que las variables de entorno estén en `.env.local`
4. Consulta [SETUP.md](SETUP.md) para solución de problemas comunes

## Deploy a Producción

Cuando estés listo para desplegar:

```bash
# Vercel (recomendado)
npm install -g vercel
vercel

# O conecta tu repositorio GitHub a Vercel
```

No olvides configurar las variables de entorno en Vercel:
- `DATABASE_URL` (PostgreSQL para producción)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `METEOGALICIA_API_KEY`

---

**¡Tu aplicación de meteorología está lista para usar!** 🎉

Si tienes alguna pregunta o necesitas ayuda adicional, no dudes en preguntar.
