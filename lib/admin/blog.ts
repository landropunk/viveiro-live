/**
 * Funciones auxiliares para gestión del blog en el panel de administración
 */

import { createClient } from '@/lib/supabase/client'

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category: string
  tags: string[]
  is_published: boolean
  published_at: string | null
  view_count: number
  created_at: string
  updated_at: string
  author_id: string
}

export type BlogPostInput = {
  title: string
  slug: string
  excerpt?: string
  content: string
  cover_image_url?: string
  category?: string
  tags?: string[]
  is_published: boolean
  published_at?: string
}

/**
 * Obtener todos los posts (para admin)
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw error
  }

  return data || []
}

/**
 * Obtener un post por ID
 */
export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    throw error
  }

  return data
}

/**
 * Obtener posts publicados (para la página pública)
 */
export async function getPublishedBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = createClient()
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching published posts:', error)
    throw error
  }

  return data || []
}

/**
 * Crear un nuevo post
 */
export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  console.log('🚀 createBlogPost llamada con:', input)

  const supabase = createClient()

  // Obtener el usuario actual
  console.log('🔐 Obteniendo usuario...')
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError) {
    console.error('❌ Error al obtener usuario:', userError)
    throw new Error(`Error de autenticación: ${userError.message}`)
  }

  if (!user) {
    console.error('❌ Usuario no autenticado')
    throw new Error('Usuario no autenticado')
  }

  console.log('✅ Usuario autenticado:', user.email)

  const postData = {
    ...input,
    author_id: user.id,
    published_at: input.is_published && !input.published_at
      ? new Date().toISOString()
      : input.published_at,
  }

  console.log('📝 Datos del post a insertar:', postData)

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([postData])
    .select()
    .single()

  if (error) {
    console.error('❌ Error creating blog post:', error)
    throw new Error(`Error al crear post: ${error.message}`)
  }

  console.log('✅ Post creado exitosamente:', data)
  return data
}

/**
 * Actualizar un post existente
 */
export async function updateBlogPost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
  const supabase = createClient()

  // Si se está publicando por primera vez, establecer published_at
  const postData: any = { ...input }
  if (input.is_published && !input.published_at) {
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('published_at')
      .eq('id', id)
      .single()

    if (!existingPost?.published_at) {
      postData.published_at = new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog post:', error)
    throw error
  }

  return data
}

/**
 * Eliminar un post
 */
export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    throw error
  }
}

/**
 * Generar slug a partir del título
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Eliminar guiones duplicados
}
