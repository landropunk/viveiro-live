-- SOLUCIÓN CORRECTA Y SEGURA: Usar funciones SECURITY DEFINER
-- Esto evita recursión RLS y cumple con GDPR

-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Los admins pueden ver todos los perfiles" ON user_profiles;
DROP POLICY IF EXISTS "Usuarios pueden ver perfiles" ON user_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Los admins pueden actualizar cualquier perfil" ON user_profiles;
DROP POLICY IF EXISTS "Los admins pueden desactivar usuarios" ON user_profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON user_profiles;
DROP POLICY IF EXISTS "Admins pueden actualizar cualquier perfil" ON user_profiles;
DROP POLICY IF EXISTS "Los usuarios pueden crear su propio perfil" ON user_profiles;
DROP POLICY IF EXISTS "Service role puede insertar perfiles" ON user_profiles;
DROP POLICY IF EXISTS "select_own_or_admin" ON user_profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "admin_update_any" ON user_profiles;
DROP POLICY IF EXISTS "select_own" ON user_profiles;
DROP POLICY IF EXISTS "select_all_authenticated" ON user_profiles;
DROP POLICY IF EXISTS "insert_own" ON user_profiles;
DROP POLICY IF EXISTS "update_own" ON user_profiles;

-- 2. Crear función SECURITY DEFINER para verificar si un usuario es admin
-- Esta función se ejecuta con privilegios de superusuario, evitando RLS
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

-- 3. CREAR POLÍTICAS SEGURAS USANDO LA FUNCIÓN

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

-- 4. Verificar políticas
SELECT
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY cmd, policyname;
