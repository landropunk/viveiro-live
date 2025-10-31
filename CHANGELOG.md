# Historial de Cambios / Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/).

## [No publicado] - 2025-01-31

### ✨ Añadido - Sistema de Secciones Configurables y Blog Rediseñado

#### 🎛️ Sistema de Ajustes de Aplicación
**Secciones 5 y 6 Preparadas para Expansión**
- ✅ Agregadas secciones 5 y 6 como ajustes bloqueados en base de datos
- ✅ Configuradas con `locked: true` para indicar que requieren implementación
- ✅ Páginas placeholder creadas con instrucciones de personalización
- ✅ Iconos asignados: 🔧 (Sección 5) y 📋 (Sección 6)
- ✅ Integradas en dashboard layout y página Mi Espacio
- ✅ Aparecen en `/admin/settings` con badge 🔒 Bloqueado
- ✅ Controles deshabilitados hasta implementación

**Ordenamiento Mejorado de Secciones**
- ✅ Implementado ordenamiento personalizado en `/admin/settings`
- ✅ Orden correcto: Meteorología → Históricos → Live/Play → Webcams → Sección 5 → Sección 6
- ✅ Array `sectionOrder` para mantener jerarquía visual consistente

**Archivos Creados/Modificados**:
- `supabase/migrations/20250131_add_sections_5_6.sql` - Migración inicial (revertida)
- `supabase/migrations/20250131_rename_sections_5_6.sql` - Migración correcta
- `app/(protected)/dashboard/seccion5/page.tsx` - Página placeholder sección 5
- `app/(protected)/dashboard/seccion6/page.tsx` - Página placeholder sección 6
- `hooks/useDashboardConfig.ts` - Actualizado con seccion5 y seccion6
- `app/(protected)/dashboard/layout.tsx` - Menú con secciones 5 y 6
- `app/(protected)/dashboard/page.tsx` - Mi Espacio con secciones 5 y 6
- `app/(admin)/admin/settings/page.tsx` - Ordenamiento personalizado

#### 📝 Rediseño Completo del Blog

**Nuevo Layout Apilado Vertical**
- ✅ Cambio de grid 3 columnas a layout vertical apilado
- ✅ Diseño horizontal: imagen izquierda (320px), contenido derecha
- ✅ Posts se apilan uno debajo del otro (más recientes arriba)
- ✅ Título de sección: "Blog" (centrado, text-4xl)
- ✅ Título de posts aumentado a text-2xl para mejor legibilidad
- ✅ Excerpt completo sin límite de líneas
- ✅ Animación hover más sutil (scale 1.01, y: -2px)
- ✅ Responsive: vertical en móvil, horizontal en desktop

**Mejoras Visuales**
- ✅ Imagen con altura completa en desktop
- ✅ Contenido con flex-1 para usar espacio disponible
- ✅ Mejor espaciado y jerarquía visual
- ✅ Transiciones suaves en hover
- ✅ Zoom en imagen al pasar cursor

**Archivos Modificados**:
- `app/(public)/page.tsx` - Rediseño completo de sección blog
- `BLOG_SYSTEM.md` - Documentación completa del sistema (NUEVO)

#### 📚 Documentación

**Nuevos Documentos**:
- `BLOG_SYSTEM.md` - Guía completa del sistema de blog
  - Diseño y presentación
  - Gestión de posts
  - Control de visibilidad
  - Personalización
  - Troubleshooting
  - Roadmap de funcionalidades

**Actualizaciones**:
- `CHANGELOG.md` - Este archivo con registro de cambios

### 🐛 Correcciones

**Numeración de Secciones**
- 🔧 Corregida numeración de secciones adicionales (eran 4 y 5, ahora 5 y 6)
- 🔧 Históricos Horarios correctamente identificado como sección 4

**Visualización del Blog**
- 🔧 Intentos fallidos de expandir ancho (revertidos)
- ✅ Solución final: layout apilado vertical con tarjetas horizontales

### 📊 Estadísticas de Cambios

- **Archivos nuevos**: 3 (2 páginas + 1 doc)
- **Migraciones SQL**: 2
- **Archivos modificados**: 5
- **Commits**: 7
- **Líneas documentación**: ~300

## [No publicado] - 2025-10-26

### 🔐 Migración Completa a Supabase Auth y Limpieza de Código

#### 🗑️ Eliminado - Sistema JWT Antiguo

**Sistema de Autenticación JWT Completamente Removido**
- ❌ **Archivos eliminados**:
  - `lib/auth.ts` - Sistema JWT completo con jose (187 líneas)
  - `lib/auth.README.md` - Documentación del sistema JWT
  - `lib/db.ts` - Base de datos en archivo JSON (4770 bytes)
  - `app/api/auth/login/route.ts` - Ruta de login con JWT
  - `app/api/auth/register/route.ts` - Ruta de registro con JWT
  - `app/api/auth/logout/route.ts` - Ruta de logout con JWT
  - `app/api/auth/refresh/route.ts` - Ruta de refresh tokens JWT
  - `AUTH_SYSTEM.md` - Documentación obsoleta
  - `ADVANCED_AUTH_GUIDE.md` - Guía avanzada obsoleta
  - `__tests__/api/auth/` - Tests del sistema JWT
  - `__tests__/lib/auth.test.ts` - Tests de autenticación antigua

**Datos Sintéticos Completamente Removidos**
- ❌ **Función eliminada**: `generateSampleWeatherData()` en `lib/meteogalicia.ts` (23 líneas)
- ❌ **Bloque eliminado**: Datos sintéticos de fallback en `app/dashboard/page.tsx` (42 líneas)
- ✅ **Nuevo comportamiento**: La aplicación lanza error formal en lugar de mostrar datos fake

**Archivos Backup y Duplicados**
- ❌ `app/dashboard/page-simple-working.tsx` - Backup del dashboard eliminado

**Total eliminado**: 13 archivos, ~500+ líneas de código

#### ✨ Añadido - Supabase Auth

**Configuración de Supabase**
- ✅ `lib/supabase/client.ts` - Cliente de navegador con @supabase/ssr
- ✅ `lib/supabase/server.ts` - Cliente de servidor con manejo de cookies
- ✅ `lib/supabase/middleware.ts` - Actualización de sesiones
- ✅ `lib/supabase/auth-helpers.ts` - Helpers para rutas protegidas
- ✅ `contexts/AuthContext.tsx` - Context React con useAuth hook
- ✅ `app/auth/callback/route.ts` - Callback para OAuth

**Funcionalidades OAuth**
- ✅ Botones de login con Google, Facebook y Apple en páginas auth
- ✅ Soporte completo para OAuth 2.0 via Supabase

#### 🔧 Cambiado - Migración de Autenticación

**Sistema de Autenticación**
- **ANTES**: JWT en localStorage + JSON file database
- **AHORA**: Supabase Auth con cookies seguras + PostgreSQL

**Rutas API Migradas a Supabase Auth**
- ✅ `app/api/protected/weather/current/route.ts`
- ✅ `app/api/protected/weather/forecast/route.ts`
- ✅ `app/api/protected/weather/municipality/route.ts`
- ✅ `app/api/protected/stations/route.ts`
- ✅ `app/api/protected/stations/comparison/route.ts`
- ✅ `app/api/protected/stations/[id]/route.ts`
- ✅ `app/api/protected/stations/[id]/historical/route.ts`
- ✅ `app/api/protected/me/route.ts`

**Componentes Migrados**
- ✅ `components/Header.tsx` - Usa `useAuth()` hook
- ✅ `components/stations/StationsView.tsx` - Usa cookies con `credentials: 'include'`
- ✅ `components/stations/HistoricalChart.tsx` - Migrado a cookies
- ✅ `app/dashboard/page.tsx` - Usa `useAuth()` hook
- ✅ `app/dashboard/station/[id]/page.tsx` - Migrado a cookies
- ✅ `app/auth/login/page.tsx` - Integrado con Supabase
- ✅ `app/auth/register/page.tsx` - Integrado con Supabase

**Middleware y Protección de Rutas**
- ✅ `middleware.ts` - Actualizado para usar Supabase session management
- ✅ Protección automática de `/dashboard` - redirige a login si no autenticado
- ✅ Redirección automática a dashboard si ya autenticado en páginas auth

#### 🎨 Mejorado - Manejo de Errores

**Mensajes de Error Formales**
- **ANTES**: Mostraba datos sintéticos cuando fallaba la API
- **AHORA**: Muestra mensaje profesional de disculpa con:
  - Icono de error en rojo
  - Mensaje formal: "Disculpe las molestias"
  - Explicación clara del problema
  - Nota sobre problemas temporales de MeteoGalicia
  - Botón "Reintentar" con spinner

**Comportamiento de Errores en lib/meteogalicia.ts**
- **ANTES**: `if (weatherData.length === 0) { weatherData.push(...generateSampleWeatherData()) }`
- **AHORA**: `if (weatherData.length === 0) { throw new Error('No se pudieron obtener datos...') }`

#### 📊 Ventajas de la Migración

**Seguridad**
- ✅ Cookies HttpOnly en lugar de localStorage (más seguro)
- ✅ PostgreSQL en lugar de archivo JSON
- ✅ Row Level Security (RLS) de Supabase
- ✅ Sin tokens expuestos en JavaScript del cliente

**Funcionalidades**
- ✅ OAuth listo para configurar (Google, Facebook, Apple)
- ✅ Gestión de usuarios profesional
- ✅ Reset de contraseña integrado
- ✅ Email verification disponible

**Código**
- ✅ -500 líneas de código eliminadas
- ✅ Sin dependencias de `jose` y `bcryptjs`
- ✅ Sin archivos duplicados o backups
- ✅ 0% datos sintéticos - 100% datos reales

## [No publicado] - 2025-10-24

### 🚀 Eliminación Total de Caché y Datos Sintéticos

#### 🗑️ Eliminado

**Datos Sintéticos Completamente Removidos**
- ❌ **Archivo eliminado**: `lib/meteogalicia-historical.ts` - Contenía funciones de generación de datos falsos
  - `generateHistoricalData()` - Simulaba series temporales de datos meteorológicos
  - `generateRealisticValue()` - Generaba valores sintéticos con patrones matemáticos
- ✅ **100% datos reales** - Toda la aplicación ahora usa exclusivamente `lib/meteogalicia-historical-real.ts`
- ✅ **Sin fallbacks sintéticos** - Eliminados todos los datos de ejemplo/demostración

**Caché de Servidor (ISR) Completamente Deshabilitado**
- ❌ Eliminada opción `next: { revalidate: 1800 }` (30 min) en predicción meteorológica
- ❌ Eliminada opción `next: { revalidate: 3600 }` (60 min) en datos municipales
- ❌ Eliminada opción `next: { revalidate: 600 }` (10 min) en observaciones de estaciones
- ✅ **Todas las peticiones ahora usan** `cache: 'no-store'` para obtener datos frescos siempre

#### 🔧 Cambiado

**Estrategia de Caché Actualizada**
- **ANTES**: ISR con revalidación cada 10-60 minutos
- **AHORA**: Sin caché - datos frescos en cada request
- **Archivos modificados**:
  - `lib/meteogalicia.ts` - 2 endpoints actualizados
  - `lib/meteogalicia-stations.ts` - 1 endpoint actualizado
  - `lib/meteogalicia-historical-real.ts` - Ya estaba sin caché (confirmado)

**Comportamiento de Actualización**
- **Predicción meteorológica**: Cada apertura = datos frescos de MeteoGalicia API V5
- **Observaciones estaciones**: Cada apertura = datos frescos del RSS
- **Datos históricos**: Cada consulta = petición directa sin caché intermedio
- **Client-side polling**: Mantiene actualización automática cada 10-15 minutos mientras la página está abierta

#### 🐛 Corregido

**Corrección de Tipos TypeScript**
- **Problema**: Tipo `WeatherVariable` incluía `VV_AVG_10m` pero `HISTORICAL_VARIABLES` no lo tenía (no existe en API histórica)
- **Solución**: Cambiado a `Partial<Record<WeatherVariable, ...>>` para permitir variables opcionales
- **Archivos corregidos**:
  - `lib/meteogalicia-historical-real.ts` - Tipo actualizado a Partial
  - `components/stations/VariableSelector.tsx` - Añadidas verificaciones `if (!variable) return null`
  - `types/weather.ts` - `StationHistoricalData.period` actualizado de `'24h' | '7d' | '30d'` a `HistoricalPeriod`
  - `components/stations/HistoricalChart.tsx` - Corrección en formateo de timestamps para períodos 48h/72h

**Build de Next.js**
- ✅ **Compilación exitosa** sin errores de tipo
- ✅ **16 páginas generadas** correctamente
- ⚠️ Warnings esperados: Rutas API protegidas intentan ejecutarse en build-time (comportamiento normal de Next.js)

#### 📊 Resultado Final

**Garantías de Datos**
- ✅ **0% datos sintéticos** en toda la aplicación
- ✅ **0% caché en servidor** - todos los datos provienen directo de MeteoGalicia
- ✅ **100% datos reales** de la API oficial
- ✅ **Actualización inmediata** al abrir cualquier página

**Archivos de Datos Verificados**
- ✅ `app/api/protected/stations/[id]/historical/route.ts` → usa `meteogalicia-historical-real`
- ✅ `app/api/protected/stations/comparison/route.ts` → usa `meteogalicia-historical-real`
- ✅ `components/stations/HistoricalChart.tsx` → usa `meteogalicia-historical-real`
- ✅ `components/stations/VariableSelector.tsx` → usa `meteogalicia-historical-real`

**Verificación de Caché**
- ✅ `lib/meteogalicia.ts` → `cache: 'no-store'` (2 ubicaciones)
- ✅ `lib/meteogalicia-stations.ts` → `cache: 'no-store'` (1 ubicación)
- ✅ `lib/meteogalicia-historical-real.ts` → Sin caché (fetch directo)

---

## [Versión anterior] - 2025-10-24

### ✨ Añadido

#### Datos Históricos Reales de Estaciones Meteorológicas
- **Integración completa con endpoint oficial de MeteoGalicia** para datos históricos horarios reales
- Endpoint: `https://servizos.meteogalicia.gal/mgrss/observacion/ultimosHorariosEstacions.action`
- Servicio nuevo: `lib/meteogalicia-historical-real.ts` que reemplaza los datos sintéticos
- **100% datos reales** - eliminados todos los datos simulados/sintéticos
- Soporte para períodos históricos: 24h, 48h, 72h (límite real de MeteoGalicia)

#### Datos de Viento Mejorados
- **Tarjetas de datos actuales** ahora muestran AMBOS tipos de viento:
  - 💨 **Viento (media)** - Velocidad media del viento (solo en tiempo real)
  - 🌬️ **Viento (rachas)** - Rachas máximas (tiempo real + históricos)
- **Gráficos históricos** muestran "Viento (rachas máximas)" con datos reales
- Nota: MeteoGalicia NO proporciona velocidad media en datos históricos, solo rachas

#### Actualización de Datos Mejorada
- **Headers anti-caché** en todas las peticiones fetch del dashboard
- **Botón de actualización manual** en la tab de Predicción con:
  - Icono animado que gira durante la actualización
  - Estado visual: "Actualizando..." / "Actualizar"
  - Botón deshabilitado durante la actualización
- **Garantiza datos frescos** cada vez que se abre el dashboard (sin caché del navegador)
- **Auto-actualización cada 15 minutos** en ambas tabs (Predicción y Estaciones)

#### Gráficos de Comparación Entre Estaciones
- **Gráficos históricos de comparación** restaurados con datos reales
- Muestra evolución temporal de múltiples parámetros
- Comparación entre estaciones Penedo do Galo y Borreiros
- Escala temporal: cada 2 horas en punto
- Leyendas muestran nombres de estaciones (no IDs)

### 🔧 Cambiado

#### Períodos Históricos Ajustados a Límites Reales
- **ANTES**: '24h', '7d', '30d' (los últimos dos NO funcionaban)
- **AHORA**: '24h', '48h', '72h' (límite real de MeteoGalicia)
- Actualizado en:
  - `types/weather.ts` - Tipo `HistoricalPeriod`
  - `lib/meteogalicia-historical-real.ts` - Funciones de cálculo
  - `components/stations/HistoricalChart.tsx` - Selector de período
  - Endpoints de API - Validaciones actualizadas

#### Nombres de Variables Clarificados
- "Racha de viento" → "Viento (rachas máximas)" en gráficos históricos
- "Viento" → "Viento (media)" en tarjetas actuales
- Añadido icono distintivo 🌬️ para rachas vs 💨 para velocidad media

#### Función de Actualización Refactorizada
- `fetchWeatherData` movida fuera del `useEffect` para permitir llamadas manuales
- Añadido estado `refreshing` para controlar actualizaciones manuales
- Bloque `finally` para asegurar limpieza de estados de carga

### 🗑️ Eliminado

#### Datos Sintéticos Completamente Removidos
- **Archivo sin uso**: `lib/meteogalicia-historical.ts` (generación sintética)
- **Eliminada función**: `generateRealisticValue()` que creaba datos falsos
- **Eliminada función**: `generateHistoricalData()` con datos simulados
- Todas las referencias a datos sintéticos en comentarios y logs

#### Gráficos de Comparación Temporalmente Removidos (luego restaurados)
- Inicialmente eliminados al descubrir que usaban datos sintéticos
- Restaurados después de integrar datos reales de MeteoGalicia

### 🐛 Corregido

#### Selector de Variables No Actualiza Gráficos
- **PROBLEMA**: Variables podían marcarse/desmarcarse en el desplegable pero gráficos no se actualizaban
- **CAUSA**: `HistoricalChart.tsx` creaba estado interno desde prop pero nunca sincronizaba cambios
- **SOLUCIÓN**: Añadido `useEffect` para sincronizar estado interno con prop `selectedVariables`
- **ARCHIVOS CORREGIDOS**:
  - `components/stations/HistoricalChart.tsx` - Sincronización de estado
  - `components/stations/VariableSelector.tsx` - Import correcto y variable por defecto
  - `app/dashboard/station/[id]/page.tsx` - Variable por defecto actualizada

#### Variable VV_AVG_10m Eliminada del Selector Histórico
- **PROBLEMA**: `VV_AVG_10m` (velocidad media del viento) aparecía en el desplegable de variables históricas pero NO existe en la API de MeteoGalicia
- **VERIFICACIÓN**: Consultado endpoint `ultimosHorariosEstacions.action` - Confirmado que solo existe `VV_RACHA_10m` (rachas de viento)
- **SOLUCIÓN**:
  - Eliminada `VV_AVG_10m` de `HISTORICAL_VARIABLES` en `lib/meteogalicia-historical-real.ts`
  - Eliminada de `PARAMETER_CODE_MAP`
  - Renombrada `VV_RACHA_10m` de "Viento (rachas máximas)" a **"Rachas de viento a 10m"** para mayor precisión
- **RESULTADO**: El desplegable ahora solo muestra variables que REALMENTE existen en los datos históricos

#### Soporte para Anemómetros a Diferentes Alturas
- **DESCUBRIMIENTO**: Las estaciones de Viveiro tienen anemómetros a **diferentes alturas**:
  - **Penedo do Galo (10104)**: Anemómetro a **10 metros** → `VV_RACHA_10m`, `DV_AVG_10m`
  - **Borreiros (10162)**: Anemómetro a **2 metros** → `VV_RACHA_2m`, `DV_AVG_2m`
- **PROBLEMA ANTERIOR**: Borreiros NO aparecía en gráficos de viento porque el código solo buscaba variables `_10m`
- **SOLUCIÓN IMPLEMENTADA**:
  - Añadidas nuevas variables de tipo: `VV_RACHA_2m`, `DV_AVG_2m` en `types/weather.ts`
  - Actualizadas `HISTORICAL_VARIABLES` y `PARAMETER_CODE_MAP` en `lib/meteogalicia-historical-real.ts`
  - Gráficos de comparación **agrupan ambas alturas** en el mismo gráfico
  - Leyendas muestran **altura entre paréntesis**: "Penedo do Galo (10m)", "Borreiros (2m)"
- **RESULTADO**:
  - ✅ Ambas estaciones ahora aparecen en gráficos de viento
  - ✅ Usuario puede comparar visualmente las diferencias por altura
  - ✅ Nomenclatura clara y científicamente correcta
  - ℹ️ Nota: El viento a 10m es típicamente más fuerte que a 2m (menor fricción)

#### Problema de Caché del Navegador
- **PROBLEMA**: Dashboard mostraba datos antiguos al abrir nueva sesión
- **CAUSA**: Navegador cacheaba respuestas de las APIs
- **SOLUCIÓN**: Headers `Cache-Control`, `Pragma` y opción `cache: 'no-store'` en fetch

#### Dirección del Viento en Gráficos
- **PROBLEMA**: Dirección del viento aparecía como grados en gráficos comparativos
- **SOLUCIÓN**: Mostrar como tarjetas con puntos cardinales (N, S, E, O, etc.) en lugar de gráficos

#### Columnas Extra en Leyendas de Gráficos
- **PROBLEMA**: Aparecían "isWindDirection" y "_degrees" en leyendas
- **SOLUCIÓN**: Filtro mejorado para excluir claves de metadatos

#### Escalas de Gráficos Poco Coherentes
- **PROBLEMA**: Rangos automáticos mostraban escalas poco significativas (ej: humedad 63-80%)
- **SOLUCIÓN**: Rangos fijos apropiados:
  - Temperatura: -15°C a 50°C
  - Humedad: 0% a 100%
  - Precipitación: 0 a 250 L/m²
  - Viento: desde 0 con máximo automático

### 📚 Documentación

#### Investigación de API de MeteoGalicia
- Documentado endpoint oficial de datos históricos
- Probados múltiples períodos para determinar límites reales
- Confirmado que API NO proporciona:
  - Velocidad media del viento en históricos
  - Más de 72 horas de datos históricos
  - Datos de presión atmosférica, radiación solar, temperatura de rocío en históricos

#### Notas Técnicas Añadidas
- Comentarios en código sobre limitaciones de MeteoGalicia
- Documentación de estructura de respuestas de API
- Mapeo de códigos de parámetros entre API y aplicación

### 🔒 Seguridad

#### Validaciones de Endpoints Mejoradas
- Validación estricta de períodos en APIs: solo '24h', '48h', '72h'
- Mensajes de error descriptivos que explican limitaciones
- Manejo robusto de errores en obtención de datos históricos

### ⚡ Rendimiento

#### Optimización de Peticiones
- Reducción de datos solicitados (solo períodos disponibles)
- Prevención de peticiones duplicadas con estado `refreshing`
- Limpieza de intervalos al desmontar componentes

## Descubrimientos Importantes

### Limitaciones de MeteoGalicia API

1. **Datos Históricos**:
   - Máximo: 72 horas (3 días)
   - Solo datos horarios (no más granulares)
   - NO incluye velocidad media del viento, solo rachas

2. **Parámetros Disponibles en Históricos**:
   - ✅ Temperatura (TA_AVG_1.5m)
   - ✅ Humedad (HR_AVG_1.5m)
   - ✅ Precipitación (PP_SUM_1.5m)
   - ✅ Dirección del viento (DV_AVG_10m)
   - ✅ Rachas de viento (VV_RACHA_10m)
   - ✅ Intensidad de lluvia (IP_MAX_1.5m)
   - ✅ Horas de sol (HSOL_SUM_1.5m)
   - ❌ Velocidad media del viento (NO disponible)
   - ❌ Presión atmosférica (NO disponible)
   - ❌ Radiación solar (NO disponible)

3. **Datos en Tiempo Real**:
   - Incluye velocidad media del viento
   - Actualización cada 10 minutos
   - Todos los parámetros disponibles

---

## Próximas Mejoras Sugeridas

- [ ] Sistema de almacenamiento en base de datos para acumular históricos propios más allá de 72h
- [ ] Cron job para guardar lecturas cada hora
- [ ] Gráficos de tendencias a largo plazo (semanas/meses) con datos almacenados
- [ ] Exportación de datos históricos a CSV/Excel
- [ ] Alertas personalizadas basadas en umbrales de usuario
- [ ] Comparación con años anteriores (requiere base de datos histórica)

---

🤖 **Desarrollado con asistencia de Claude Code**
