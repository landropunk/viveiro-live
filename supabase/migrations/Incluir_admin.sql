-- ============================================================================
-- CONFIGURAR ADMINISTRADORES INICIALES
-- ============================================================================
-- ⚠️ IMPORTANTE: Reemplaza 'landropunk@hotmail.com' con los emails de tu .env.local
-- Si tienes varios admins, añade más líneas:
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'otro@email.com';
-- ============================================================================

UPDATE user_profiles
SET role = 'admin'
WHERE email = 'landropunk@hotmail.com';
