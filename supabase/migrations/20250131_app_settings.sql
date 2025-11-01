-- Crear tabla de configuración de la aplicación
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas por clave
CREATE INDEX IF NOT EXISTS app_settings_key_idx ON app_settings(key);

-- Índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS app_settings_category_idx ON app_settings(category);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_app_settings_updated_at();

-- Políticas RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden leer la configuración
CREATE POLICY "Authenticated users can read settings"
  ON app_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Solo service_role puede modificar la configuración (para uso del servidor/admin)
CREATE POLICY "Service role can update settings"
  ON app_settings FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Insertar configuraciones por defecto
INSERT INTO app_settings (key, label, value, description, category) VALUES
  ('users_can_edit_profile', 'Los usuarios pueden editar su perfil', 'true', 'Permite que los usuarios editen su propio perfil', 'users'),
  ('users_can_change_email', 'Los usuarios pueden cambiar su email', 'false', 'Permite que los usuarios cambien su email', 'users'),
  ('require_email_verification', 'Requiere verificación de email', 'true', 'Requiere verificación de email para nuevos usuarios', 'auth'),
  ('allow_user_registration', 'Permitir registro de nuevos usuarios', 'true', 'Permite que nuevos usuarios se registren', 'auth'),
  ('default_user_role', 'Rol por defecto', '"user"', 'Rol por defecto para nuevos usuarios', 'users'),
  ('password_reset_enabled', 'Permitir restablecimiento de contraseña', 'true', 'Permite que los usuarios restablezcan su contraseña', 'auth')
ON CONFLICT (key) DO NOTHING;

-- Comentarios
COMMENT ON TABLE app_settings IS 'Configuración global de la aplicación controlada por administradores';
COMMENT ON COLUMN app_settings.key IS 'Clave única del ajuste (ej: users_can_edit_profile)';
COMMENT ON COLUMN app_settings.value IS 'Valor del ajuste en formato JSON (puede ser string, boolean, number, object, etc.)';
COMMENT ON COLUMN app_settings.category IS 'Categoría del ajuste (users, auth, general, etc.)';
