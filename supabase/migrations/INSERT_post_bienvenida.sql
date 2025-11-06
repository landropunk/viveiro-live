-- ============================================================================
-- POST DE BIENVENIDA PARA VIVEIRO.LIVE
-- ============================================================================
-- Este script inserta un post inicial de bienvenida al blog
-- ============================================================================

-- Primero, obtener el ID del admin (landropunk@hotmail.com)
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Buscar el ID del usuario admin
  SELECT id INTO admin_user_id
  FROM user_profiles
  WHERE email = 'landropunk@hotmail.com'
  LIMIT 1;

  -- Si no se encuentra el admin, mostrar error
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'No se encontró el usuario admin con email landropunk@hotmail.com. Asegúrate de haber ejecutado Incluir_admin.sql primero.';
  END IF;

  -- Insertar el post de bienvenida
  INSERT INTO blog_posts (
    id,
    title,
    slug,
    excerpt,
    content,
    cover_image_url,
    category,
    tags,
    is_published,
    published_at,
    view_count,
    author_id,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    'Bienvenido a viveiro.live',
    'bienvenido-a-viveiro-live',
    'Tu portal de información en tiempo real sobre Viveiro: meteorología, webcams, eventos en directo y mucho más.',
    E'# Bienvenido a viveiro.live 🌊

viveiro.live es tu **portal de información en tiempo real** sobre la villa marinera de Viveiro, en la provincia de Lugo, Galicia.

## ¿Qué encontrarás aquí?

### 🌤️ Meteorología en Tiempo Real
Consulta las condiciones meteorológicas actuales y previsiones para Viveiro y sus alrededores. Datos actualizados de temperatura, viento, humedad y más.

### 📊 Datos Históricos
Accede a registros históricos del clima en Viveiro para analizar tendencias y patrones meteorológicos a lo largo del tiempo.

### 📹 Webcams en Directo
Disfruta de vistas en tiempo real de los lugares más emblemáticos de Viveiro: playas, puerto, casco histórico y más.

### 📺 Eventos en Directo
Sigue en streaming eventos importantes de Viveiro: fiestas tradicionales, conciertos, actos culturales y acontecimientos especiales.

### 📰 Noticias y Actualidad
Mantente informado sobre las últimas noticias, eventos y novedades de nuestra villa.

## Nuestra Misión

Queremos ser tu **ventana digital a Viveiro**, ofreciéndote información útil, actual y de calidad sobre nuestra villa. Ya seas vecino, visitante o alguien que siente cariño por Viveiro desde la distancia, este es tu espacio.

## Tecnología y Transparencia

viveiro.live es un proyecto desarrollado con tecnologías modernas:
- **Next.js 14** con TypeScript
- **Supabase** para la base de datos
- **Integración con MeteoGalicia** para datos meteorológicos oficiales
- **Sistema de autenticación OAuth** (Google, Facebook, Microsoft)

Todo el código es **open source** y puedes consultarlo en nuestro repositorio de GitHub.

## Participa

Este proyecto está en constante evolución. Si tienes sugerencias, ideas o quieres colaborar, no dudes en contactarnos.

---

**¡Bienvenido a tu portal de información sobre Viveiro!** 🏰⚓

*Última actualización: ' || to_char(NOW(), 'DD/MM/YYYY') || '*',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=630&fit=crop',
    'General',
    ARRAY['bienvenida', 'viveiro', 'información', 'meteorología', 'webcams', 'eventos'],
    true,
    NOW(),
    0,
    admin_user_id,
    NOW(),
    NOW()
  )
  ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE '✅ Post de bienvenida creado exitosamente';
END $$;

-- Verificar que se insertó correctamente
SELECT
  '✅ Post creado: ' || title as confirmacion,
  slug,
  is_published,
  published_at
FROM blog_posts
WHERE slug = 'bienvenido-a-viveiro-live';
