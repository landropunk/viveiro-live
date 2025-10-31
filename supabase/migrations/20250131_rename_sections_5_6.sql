-- Eliminar las secciones 4 y 5 incorrectas si existen
DELETE FROM app_settings WHERE key IN ('section_seccion4', 'section_seccion5');

-- Agregar secciones 5 y 6 como ajustes bloqueados (preparadas para futuro)
INSERT INTO app_settings (key, value, category, label, description, locked) VALUES
  ('section_seccion5', '{"enabled": false}', 'sections', 'Sección 5', 'Sección adicional personalizable (requiere implementación)', true),
  ('section_seccion6', '{"enabled": false}', 'sections', 'Sección 6', 'Sección adicional personalizable (requiere implementación)', true)
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description,
  locked = EXCLUDED.locked;

-- Comentario explicativo
COMMENT ON TABLE app_settings IS 'Las secciones 5 y 6 están bloqueadas y requieren crear sus páginas correspondientes en /dashboard/seccion5 y /dashboard/seccion6 antes de activarlas.';
