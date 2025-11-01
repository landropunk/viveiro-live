-- Crear tabla de webcams
CREATE TABLE IF NOT EXISTS public.webcams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'iframe')),
  refresh_interval INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS webcams_is_active_idx ON public.webcams(is_active);
CREATE INDEX IF NOT EXISTS webcams_display_order_idx ON public.webcams(display_order);

-- Habilitar RLS
ALTER TABLE public.webcams ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Webcams activas son visibles para todos" ON public.webcams;
DROP POLICY IF EXISTS "Solo admins pueden insertar webcams" ON public.webcams;
DROP POLICY IF EXISTS "Solo admins pueden actualizar webcams" ON public.webcams;
DROP POLICY IF EXISTS "Solo admins pueden eliminar webcams" ON public.webcams;

-- Todos pueden ver webcams activas
CREATE POLICY "Webcams activas son visibles para todos"
  ON public.webcams
  FOR SELECT
  USING (is_active = true);

-- Solo administradores pueden insertar
CREATE POLICY "Solo admins pueden insertar webcams"
  ON public.webcams
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo administradores pueden actualizar
CREATE POLICY "Solo admins pueden actualizar webcams"
  ON public.webcams
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Solo administradores pueden eliminar
CREATE POLICY "Solo admins pueden eliminar webcams"
  ON public.webcams
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_webcams_updated_at ON public.webcams;
CREATE TRIGGER update_webcams_updated_at
  BEFORE UPDATE ON public.webcams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar webcams existentes
INSERT INTO public.webcams (name, location, url, type, refresh_interval, display_order)
VALUES
  ('Penedo do Galo', 'MeteoGalicia - Viveiro', 'https://www.meteogalicia.gal/datosred/camaras/MeteoGalicia/Penedodogalo/ultima.jpg', 'image', 30, 1),
  ('Xandíns Noriega Varela', 'AngelCam - Viveiro', 'https://v.angelcam.com/iframe?v=enr0e6z7l8&autoplay=1', 'iframe', NULL, 2)
ON CONFLICT DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE public.webcams IS 'Webcams de Viveiro gestionadas desde el panel de administración';
COMMENT ON COLUMN public.webcams.type IS 'Tipo de webcam: image (actualización periódica) o iframe (stream continuo)';
COMMENT ON COLUMN public.webcams.refresh_interval IS 'Intervalo de actualización en segundos (solo para tipo image)';
COMMENT ON COLUMN public.webcams.display_order IS 'Orden de visualización (menor número = más arriba)';
