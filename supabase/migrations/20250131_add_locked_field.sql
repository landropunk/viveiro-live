-- Agregar campo 'locked' a app_settings para indicar ajustes que requieren cambios en el código
ALTER TABLE app_settings ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT false;

-- Marcar general_site_name como bloqueado (requiere activación en el código)
UPDATE app_settings SET locked = true WHERE key = 'general_site_name';

-- Comentario explicativo
COMMENT ON COLUMN app_settings.locked IS 'Indica si el ajuste está bloqueado y requiere cambios en el código para funcionar. Los ajustes bloqueados se muestran con un candado en la UI.';
