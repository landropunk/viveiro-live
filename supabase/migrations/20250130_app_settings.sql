-- Tabla de configuración de la aplicación
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT NOT NULL, -- 'sections', 'features', 'general'
  label TEXT NOT NULL, -- Nombre amigable para mostrar
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_app_settings_key ON app_settings(key);
CREATE INDEX idx_app_settings_category ON app_settings(category);

-- RLS: Solo admins pueden modificar configuración
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer la configuración
CREATE POLICY "Cualquier usuario autenticado puede leer configuración"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo admins pueden insertar/actualizar
CREATE POLICY "Solo admins pueden modificar configuración"
  ON app_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role') = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role') = 'admin'
    )
  );

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar timestamp
CREATE TRIGGER app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_app_settings_updated_at();

-- Insertar configuración inicial
INSERT INTO app_settings (key, value, category, label, description) VALUES
  -- Secciones del dashboard
  ('section_meteo', '{"enabled": true}', 'sections', 'Meteorología', 'Muestra la sección de datos meteorológicos en tiempo real'),
  ('section_historicos', '{"enabled": false}', 'sections', 'Históricos Horarios', 'Muestra datos históricos horarios de las estaciones (requiere API de MeteoGalicia)'),
  ('section_live', '{"enabled": true}', 'sections', 'Live / Play', 'Muestra la sección de eventos en directo y reproducción'),
  ('section_webcams', '{"enabled": true}', 'sections', 'Webcams', 'Muestra las cámaras web de Viveiro'),

  -- Características generales
  ('feature_blog', '{"enabled": true}', 'features', 'Blog/Noticias', 'Muestra el blog y noticias en la página principal'),
  ('feature_user_registration', '{"enabled": true}', 'features', 'Registro de Usuarios', 'Permite que nuevos usuarios se registren en la plataforma'),
  ('feature_comments', '{"enabled": false}', 'features', 'Comentarios', 'Permite a usuarios dejar comentarios (funcionalidad futura)'),

  -- Configuración general
  ('general_site_name', '{"value": "viveiro.live"}', 'general', 'Nombre del Sitio', 'Nombre de la aplicación web'),
  ('general_maintenance_mode', '{"enabled": false}', 'general', 'Modo Mantenimiento', 'Activa el modo mantenimiento (solo admins pueden acceder)'),
  ('general_max_upload_size', '{"value": 5}', 'general', 'Tamaño Máx. Subida (MB)', 'Tamaño máximo de archivos subidos (imágenes de blog, etc.)')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE app_settings IS 'Configuración general de la aplicación modificable por administradores';
