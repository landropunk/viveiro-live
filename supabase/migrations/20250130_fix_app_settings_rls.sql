-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Cualquier usuario autenticado puede leer configuración" ON app_settings;
DROP POLICY IF EXISTS "Solo admins pueden modificar configuración" ON app_settings;

-- Política: Todos pueden leer la configuración
CREATE POLICY "Cualquier usuario autenticado puede leer configuración"
  ON app_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Política: Solo admins pueden insertar/actualizar
-- IMPORTANTE: En PostgreSQL/Supabase, el campo se llama raw_user_meta_data
-- pero el valor se almacena en el JSON sin el prefijo "raw_"
CREATE POLICY "Solo admins pueden modificar configuración"
  ON app_settings
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
    OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );

-- Comentario explicativo
COMMENT ON POLICY "Solo admins pueden modificar configuración" ON app_settings IS
'Permite modificar configuración solo a usuarios con role=admin en su JWT. Verifica tanto el nivel raíz del JWT como dentro de user_metadata.';
