-- ============================================================================
-- LIMPIEZA FINAL - Versión que ignora errores completamente
-- ============================================================================
-- Este script elimina todo de manera segura, ignorando si los objetos existen o no
-- ============================================================================

DO $$
DECLARE
  func_record RECORD;
  policy_record RECORD;
BEGIN
  -- 1. Eliminar TODAS las versiones de is_admin
  FOR func_record IN
    SELECT
      n.nspname as schema_name,
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = 'is_admin'
  LOOP
    BEGIN
      EXECUTE format('DROP FUNCTION %I.%I(%s) CASCADE',
        func_record.schema_name,
        func_record.function_name,
        func_record.args
      );
      RAISE NOTICE 'Eliminada función: %.%(%)',
        func_record.schema_name,
        func_record.function_name,
        func_record.args;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Ignorando error al eliminar función: %', SQLERRM;
    END;
  END LOOP;

  -- 2. Eliminar otras funciones (con manejo de errores)
  BEGIN
    DROP FUNCTION IF EXISTS public.update_user_profile_updated_at() CASCADE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    DROP FUNCTION IF EXISTS public.update_app_settings_updated_at() CASCADE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    DROP FUNCTION IF EXISTS public.update_live_streams_updated_at() CASCADE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  BEGIN
    DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- 3. Eliminar triggers del esquema auth
  BEGIN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;

  -- 4. Eliminar políticas RLS de todas las tablas
  FOR policy_record IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    BEGIN
      EXECUTE format('DROP POLICY %I ON %I.%I',
        policy_record.policyname,
        policy_record.schemaname,
        policy_record.tablename
      );
      RAISE NOTICE 'Eliminada política: % en %.%',
        policy_record.policyname,
        policy_record.schemaname,
        policy_record.tablename;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Ignorando error al eliminar política: %', SQLERRM;
    END;
  END LOOP;

  -- 5. Eliminar tablas (con CASCADE para eliminar triggers automáticamente)
  BEGIN
    DROP TABLE IF EXISTS public.live_streams CASCADE;
    RAISE NOTICE 'Eliminada tabla: live_streams';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Ignorando error al eliminar live_streams: %', SQLERRM;
  END;

  BEGIN
    DROP TABLE IF EXISTS public.blog_posts CASCADE;
    RAISE NOTICE 'Eliminada tabla: blog_posts';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Ignorando error al eliminar blog_posts: %', SQLERRM;
  END;

  BEGIN
    DROP TABLE IF EXISTS public.webcams CASCADE;
    RAISE NOTICE 'Eliminada tabla: webcams';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Ignorando error al eliminar webcams: %', SQLERRM;
  END;

  BEGIN
    DROP TABLE IF EXISTS public.app_settings CASCADE;
    RAISE NOTICE 'Eliminada tabla: app_settings';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Ignorando error al eliminar app_settings: %', SQLERRM;
  END;

  BEGIN
    DROP TABLE IF EXISTS public.user_profiles CASCADE;
    RAISE NOTICE 'Eliminada tabla: user_profiles';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Ignorando error al eliminar user_profiles: %', SQLERRM;
  END;

  RAISE NOTICE '===========================================';
  RAISE NOTICE '✅ LIMPIEZA COMPLETADA';
  RAISE NOTICE '===========================================';

END $$;

-- Verificación final: no deben quedar funciones is_admin
SELECT
  CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE p.proname = 'is_admin'
    ) THEN '✅ Limpieza completada - No quedan funciones is_admin'
    ELSE '⚠️ Aún quedan funciones is_admin'
  END as estado;

-- Verificación de tablas: no deben existir
SELECT
  CASE
    WHEN NOT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('user_profiles', 'app_settings', 'webcams', 'blog_posts', 'live_streams')
    ) THEN '✅ Todas las tablas fueron eliminadas correctamente'
    ELSE '⚠️ Algunas tablas aún existen'
  END as estado_tablas;

-- Mensaje final
SELECT '🚀 Ahora puedes ejecutar 00_INIT_viveiro_live.sql' as siguiente_paso;
