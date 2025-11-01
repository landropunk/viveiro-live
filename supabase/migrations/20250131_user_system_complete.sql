-- ============================================================================
-- SISTEMA COMPLETO DE GESTIÓN DE USUARIOS
-- ============================================================================
-- Este archivo consolida toda la configuración necesaria para el sistema de
-- usuarios con OAuth, perfiles, roles y RLS
--
-- Fecha: 2025-01-31
-- Descripción: Sistema de autenticación y gestión de usuarios
-- ============================================================================

-- 1. TABLA DE PERFILES DE USUARIO
-- ============================================================================
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

-- 2. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_updated_at();

-- 3. FUNCIÓN SECURITY DEFINER PARA VERIFICAR ADMIN (evita recursión RLS)
-- ============================================================================
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

-- 4. POLÍTICAS RLS (Row Level Security)
-- ============================================================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_select_all" ON user_profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_update_all" ON user_profiles;

-- SELECT: Ver solo tu propio perfil
CREATE POLICY "select_own_profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- SELECT: Los admins pueden ver todos (usa la función SECURITY DEFINER)
CREATE POLICY "admin_select_all"
  ON user_profiles FOR SELECT
  USING (is_admin(auth.uid()));

-- INSERT: Solo puedes insertar tu propio perfil
CREATE POLICY "insert_own_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Puedes actualizar tu propio perfil
CREATE POLICY "update_own_profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- UPDATE: Los admins pueden actualizar cualquier perfil
CREATE POLICY "admin_update_all"
  ON user_profiles FOR UPDATE
  USING (is_admin(auth.uid()));

-- 5. CREAR PERFILES PARA USUARIOS EXISTENTES (migración)
-- ============================================================================
INSERT INTO user_profiles (id, email, role)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'role', 'user') as role
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 6. COMENTARIOS DE DOCUMENTACIÓN
-- ============================================================================
COMMENT ON TABLE user_profiles IS 'Perfiles extendidos de usuarios con información personal y rol';
COMMENT ON COLUMN user_profiles.role IS 'Rol del usuario: user (normal) o admin (administrador)';
COMMENT ON COLUMN user_profiles.is_active IS 'Indica si el usuario está activo o desactivado';
COMMENT ON COLUMN user_profiles.birth_date IS 'Fecha de nacimiento (obligatoria en registro OAuth)';
COMMENT ON FUNCTION is_admin IS 'Verifica si un usuario es admin - usa SECURITY DEFINER para evitar recursión RLS';

-- ============================================================================
-- FIN DEL SISTEMA DE USUARIOS
-- ============================================================================
