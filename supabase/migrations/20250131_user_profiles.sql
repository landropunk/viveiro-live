-- Crear tabla de perfiles de usuario
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

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);

-- Índice para búsquedas por rol
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_profile_updated_at();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Políticas RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil (excepto role)
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM user_profiles WHERE id = auth.uid())
  );

-- Los admins pueden ver todos los perfiles
CREATE POLICY "Los admins pueden ver todos los perfiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Los admins pueden actualizar cualquier perfil
CREATE POLICY "Los admins pueden actualizar cualquier perfil"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Los admins pueden eliminar perfiles (soft delete desactivando)
CREATE POLICY "Los admins pueden desactivar usuarios"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Crear perfiles para usuarios existentes
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
COMMENT ON COLUMN user_profiles.is_active IS 'Indica si el usuario está activo o desactivado';
