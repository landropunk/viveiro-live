-- Migraciones para el sistema de administración de viveiro.live
-- Ejecutar en el SQL Editor de Supabase

-- 1. Añadir columna role a la tabla auth.users (metadata)
-- Nota: Los roles se guardarán en user_metadata

-- 2. Crear tabla de webcams
CREATE TABLE IF NOT EXISTS public.webcams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  stream_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para webcams
CREATE INDEX IF NOT EXISTS idx_webcams_active ON public.webcams(is_active);
CREATE INDEX IF NOT EXISTS idx_webcams_order ON public.webcams(display_order);

-- 3. Crear tabla de contenido Live/Play
CREATE TABLE IF NOT EXISTS public.live_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('live', 'video')) DEFAULT 'video',
  category TEXT DEFAULT 'general',
  thumbnail_url TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')) DEFAULT 'scheduled',
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id)
);

-- Índices para live_content
CREATE INDEX IF NOT EXISTS idx_live_content_active ON public.live_content(is_active);
CREATE INDEX IF NOT EXISTS idx_live_content_status ON public.live_content(status);
CREATE INDEX IF NOT EXISTS idx_live_content_scheduled ON public.live_content(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_live_content_type ON public.live_content(content_type);

-- 4. Crear tabla de blog/noticias
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Índices para blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- 5. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Crear triggers para updated_at
CREATE TRIGGER update_webcams_updated_at BEFORE UPDATE ON public.webcams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_content_updated_at BEFORE UPDATE ON public.live_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Habilitar Row Level Security (RLS)
ALTER TABLE public.webcams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 8. Políticas de seguridad para webcams
-- Cualquiera puede leer webcams activas
CREATE POLICY "Webcams activas son visibles para todos" ON public.webcams
  FOR SELECT USING (is_active = true);

-- Solo admins pueden insertar, actualizar y borrar webcams
CREATE POLICY "Solo admins pueden gestionar webcams" ON public.webcams
  FOR ALL USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- 9. Políticas de seguridad para live_content
-- Cualquiera puede leer contenido activo
CREATE POLICY "Contenido activo es visible para todos" ON public.live_content
  FOR SELECT USING (is_active = true);

-- Solo admins pueden gestionar contenido
CREATE POLICY "Solo admins pueden gestionar contenido" ON public.live_content
  FOR ALL USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- 10. Políticas de seguridad para blog_posts
-- Cualquiera puede leer posts publicados
CREATE POLICY "Posts publicados son visibles para todos" ON public.blog_posts
  FOR SELECT USING (is_published = true);

-- Solo admins pueden gestionar posts
CREATE POLICY "Solo admins pueden gestionar posts" ON public.blog_posts
  FOR ALL USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- 11. Función auxiliar para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Crear vista para usuarios (para el panel de admin)
CREATE OR REPLACE VIEW admin_users_view AS
SELECT
  id,
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'full_name' as full_name,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users;

-- Nota: Para convertir tu usuario en admin, ejecuta esto en Supabase SQL Editor
-- reemplazando 'tu-email@ejemplo.com' con tu email real:
/*
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'tu-email@ejemplo.com';
*/
