-- Agregar secciones 4 y 5 como ajustes bloqueados (preparadas para futuro)
INSERT INTO app_settings (key, value, category, label, description, locked) VALUES
  ('section_seccion4', '{"enabled": false}', 'sections', 'Sección 4', 'Sección adicional personalizable (requiere implementación)', true),
  ('section_seccion5', '{"enabled": false}', 'sections', 'Sección 5', 'Sección adicional personalizable (requiere implementación)', true)
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description,
  locked = EXCLUDED.locked;

-- Comentario explicativo
COMMENT ON TABLE app_settings IS 'Las secciones 4 y 5 están bloqueadas y requieren crear sus páginas correspondientes en /dashboard/seccion4 y /dashboard/seccion5 antes de activarlas.';
