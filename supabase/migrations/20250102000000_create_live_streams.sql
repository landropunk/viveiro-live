-- Migration: Create live_streams table
-- Description: Tabla para gestionar streams en vivo y vídeos grabados de plataformas como YouTube, Twitch, Vimeo, Facebook
-- Author: Claude
-- Date: 2025-01-02

-- ============================================================================
-- 1. CREAR TABLA live_streams
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Información básica
  title TEXT NOT NULL,
  description TEXT,

  -- Plataforma y URL
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'twitch', 'vimeo', 'facebook', 'other')),
  video_url TEXT NOT NULL,
  video_id TEXT, -- ID del vídeo en la plataforma (extraído de la URL)

  -- Tipo de contenido
  stream_type TEXT NOT NULL DEFAULT 'live' CHECK (stream_type IN ('live', 'recorded', 'scheduled')),

  -- Categoría y tags
  category TEXT, -- Ej: "evento", "concierto", "conferencia", "deportes"
  tags TEXT[] DEFAULT '{}',

  -- Imagen de portada
  thumbnail_url TEXT,

  -- Estado y visibilidad
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false, -- Para destacar en la página principal

  -- Programación
  scheduled_start TIMESTAMP WITH TIME ZONE,
  scheduled_end TIMESTAMP WITH TIME ZONE,

  -- Estadísticas
  view_count INTEGER DEFAULT 0,

  -- Orden para mostrar
  display_order INTEGER DEFAULT 0,

  -- Metadatos
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. ÍNDICES
-- ============================================================================

-- Índice para búsquedas por plataforma
CREATE INDEX IF NOT EXISTS idx_live_streams_platform
  ON public.live_streams(platform);

-- Índice para filtrar por tipo
CREATE INDEX IF NOT EXISTS idx_live_streams_type
  ON public.live_streams(stream_type);

-- Índice para streams activos
CREATE INDEX IF NOT EXISTS idx_live_streams_active
  ON public.live_streams(is_active)
  WHERE is_active = true;

-- Índice para streams destacados
CREATE INDEX IF NOT EXISTS idx_live_streams_featured
  ON public.live_streams(is_featured)
  WHERE is_featured = true;

-- Índice para ordenar por fecha de programación
CREATE INDEX IF NOT EXISTS idx_live_streams_scheduled
  ON public.live_streams(scheduled_start DESC);

-- Índice para búsqueda de texto completo en título y descripción
CREATE INDEX IF NOT EXISTS idx_live_streams_search
  ON public.live_streams
  USING gin(to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(description, '')));

-- ============================================================================
-- 3. TRIGGER PARA ACTUALIZAR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_live_streams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_live_streams_updated_at
  BEFORE UPDATE ON public.live_streams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_live_streams_updated_at();

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS
ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;

-- Política: Cualquier usuario autenticado puede ver streams activos
CREATE POLICY "Streams activos son visibles para usuarios autenticados"
  ON public.live_streams
  FOR SELECT
  USING (
    auth.role() = 'authenticated'
    AND is_active = true
  );

-- Política: Solo administradores pueden ver todos los streams (incluyendo inactivos)
CREATE POLICY "Administradores pueden ver todos los streams"
  ON public.live_streams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Política: Solo administradores pueden insertar streams
CREATE POLICY "Solo administradores pueden crear streams"
  ON public.live_streams
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Política: Solo administradores pueden actualizar streams
CREATE POLICY "Solo administradores pueden actualizar streams"
  ON public.live_streams
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Política: Solo administradores pueden eliminar streams
CREATE POLICY "Solo administradores pueden eliminar streams"
  ON public.live_streams
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.user_id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- ============================================================================
-- 5. COMENTARIOS
-- ============================================================================

COMMENT ON TABLE public.live_streams IS 'Tabla para gestionar streams en vivo y vídeos grabados';
COMMENT ON COLUMN public.live_streams.platform IS 'Plataforma de streaming: youtube, twitch, vimeo, facebook, other';
COMMENT ON COLUMN public.live_streams.stream_type IS 'Tipo: live (en vivo), recorded (grabado), scheduled (programado)';
COMMENT ON COLUMN public.live_streams.video_id IS 'ID del vídeo extraído de la URL de la plataforma';
COMMENT ON COLUMN public.live_streams.is_featured IS 'Si está destacado en la página principal';
COMMENT ON COLUMN public.live_streams.display_order IS 'Orden de visualización (menor = primero)';
