-- ============================================================================
-- VIVEIRO LIVE - MIGRACIÓN INICIAL COMPLETA
-- ============================================================================
-- Esta migración contiene TODAS las tablas, funciones y políticas necesarias
-- para arrancar el proyecto desde cero.
--
-- Uso: Ejecuta este archivo en Supabase SQL Editor después de crear el proyecto
--
-- Fecha: 2025-02-01
-- Versión: 1.0.0
-- ============================================================================

-- ============================================================================
-- 1. SISTEMA DE USUARIOS Y PERFILES
-- ============================================================================

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT DEFAULT 'Viveiro',
  postal_code TEXT,
  birth_date DATE,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_updated_at();

-- Función SECURITY DEFINER para verificar admin (evita recursión RLS)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE id = user_id
    AND role = 'admin'
  );
END;
$$;

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_select_all" ON user_profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_update_all" ON user_profiles;

-- Políticas RLS
CREATE POLICY "select_own_profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "admin_select_all"
  ON user_profiles FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "insert_own_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admin_update_all"
  ON user_profiles FOR UPDATE
  USING (is_admin(auth.uid()));

-- Crear perfiles para usuarios existentes (migración)
INSERT INTO user_profiles (id, email, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'role', 'user') as role
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Comentarios
COMMENT ON TABLE user_profiles IS 'Perfiles extendidos de usuarios con información personal y rol';
COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario: user (normal) o admin (administrador)';
COMMENT ON FUNCTION is_admin IS 'Verifica si un usuario es admin - usa SECURITY DEFINER para evitar recursión RLS';

-- ============================================================================
-- 2. SISTEMA DE CONFIGURACIÓN DE LA APLICACIÓN
-- ============================================================================

-- Tabla de configuración
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  label TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  locked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS app_settings_key_idx ON app_settings(key);
CREATE INDEX IF NOT EXISTS app_settings_category_idx ON app_settings(category);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_app_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_app_settings_updated_at ON app_settings;
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_app_settings_updated_at();

-- Habilitar RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DROP POLICY IF EXISTS "Authenticated users can read settings" ON app_settings;
DROP POLICY IF EXISTS "Service role can update settings" ON app_settings;

CREATE POLICY "Authenticated users can read settings"
  ON app_settings FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can update settings"
  ON app_settings FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Insertar configuraciones por defecto
INSERT INTO app_settings (key, label, value, description, category, locked) VALUES
  -- Configuración de usuarios
  ('users_can_edit_profile', 'Los usuarios pueden editar su perfil', 'true', 'Permite que los usuarios editen su propio perfil', 'users', false),
  ('users_can_change_email', 'Los usuarios pueden cambiar su email', 'false', 'Permite que los usuarios cambien su email', 'users', false),
  ('default_user_role', 'Rol por defecto', '"user"', 'Rol por defecto para nuevos usuarios', 'users', false),

  -- Configuración de autenticación
  ('require_email_verification', 'Requiere verificación de email', 'true', 'Requiere verificación de email para nuevos usuarios', 'auth', false),
  ('allow_user_registration', 'Permitir registro de nuevos usuarios', 'true', 'Permite que nuevos usuarios se registren', 'auth', false),
  ('password_reset_enabled', 'Permitir restablecimiento de contraseña', 'true', 'Permite que los usuarios restablezcan su contraseña', 'auth', false),

  -- Secciones del dashboard (las 4 principales están activas)
  ('section_meteo', 'Sección Meteorología', '{"enabled": true}', 'Mostrar sección de meteorología en el dashboard', 'sections', false),
  ('section_historicos', 'Sección Históricos', '{"enabled": true}', 'Mostrar sección de históricos en el dashboard', 'sections', false),
  ('section_webcams', 'Sección Webcams', '{"enabled": true}', 'Mostrar sección de webcams en el dashboard', 'sections', false),
  ('section_eventos', 'Sección Live/Play', '{"enabled": true}', 'Mostrar sección de eventos en vivo en el dashboard', 'sections', false),

  -- Secciones preparadas para futuro (bloqueadas)
  ('section_seccion5', 'Sección 5', '{"enabled": false}', 'Sección adicional personalizable (requiere implementación)', 'sections', true),
  ('section_seccion6', 'Sección 6', '{"enabled": false}', 'Sección adicional personalizable (requiere implementación)', 'sections', true),

  -- Configuración general
  ('general_site_name', 'Nombre del sitio', '"ViveiroLive"', 'Nombre dinámico del sitio (requiere activación en código)', 'general', true),
  ('blog_show_on_home', 'Mostrar blog en inicio', 'true', 'Mostrar últimos posts del blog en la página de inicio', 'general', false)
ON CONFLICT (key) DO NOTHING;

-- Comentarios
COMMENT ON TABLE app_settings IS 'Configuración global de la aplicación controlada por administradores';
COMMENT ON COLUMN app_settings.locked IS 'Indica si el ajuste está bloqueado y requiere cambios en el código para funcionar';

-- ============================================================================
-- 3. SISTEMA DE WEBCAMS
-- ============================================================================

-- Tabla de webcams
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

-- Índices
CREATE INDEX IF NOT EXISTS webcams_is_active_idx ON public.webcams(is_active);
CREATE INDEX IF NOT EXISTS webcams_display_order_idx ON public.webcams(display_order);

-- Función para actualizar updated_at
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

-- Habilitar RLS
ALTER TABLE public.webcams ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Webcams activas son visibles para todos" ON public.webcams;
DROP POLICY IF EXISTS "Solo admins pueden insertar webcams" ON public.webcams;
DROP POLICY IF EXISTS "Solo admins pueden actualizar webcams" ON public.webcams;
DROP POLICY IF EXISTS "Solo admins pueden eliminar webcams" ON public.webcams;

-- Políticas RLS
CREATE POLICY "Webcams activas son visibles para todos"
  ON public.webcams
  FOR SELECT
  USING (is_active = true);

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

-- Insertar webcams de ejemplo
INSERT INTO public.webcams (name, location, url, type, refresh_interval, display_order)
VALUES
  ('Penedo do Galo', 'MeteoGalicia - Viveiro', 'https://www.meteogalicia.gal/datosred/camaras/MeteoGalicia/Penedodogalo/ultima.jpg', 'image', 30, 1),
  ('Xandíns Noriega Varela', 'AngelCam - Viveiro', 'https://v.angelcam.com/iframe?v=enr0e6z7l8&autoplay=1', 'iframe', NULL, 2)
ON CONFLICT DO NOTHING;

-- Comentarios
COMMENT ON TABLE public.webcams IS 'Webcams de Viveiro gestionadas desde el panel de administración';
COMMENT ON COLUMN public.webcams.type IS 'Tipo de webcam: image (actualización periódica) o iframe (stream continuo)';
COMMENT ON COLUMN public.webcams.refresh_interval IS 'Intervalo de actualización en segundos (solo para tipo image)';

-- ============================================================================
-- FIN DE LA MIGRACIÓN INICIAL
-- ============================================================================

-- Mostrar resumen de tablas creadas
SELECT
  'user_profiles' as tabla,
  COUNT(*) as registros
FROM user_profiles
UNION ALL
SELECT
  'app_settings' as tabla,
  COUNT(*) as registros
FROM app_settings
UNION ALL
SELECT
  'webcams' as tabla,
  COUNT(*) as registros
FROM public.webcams;
