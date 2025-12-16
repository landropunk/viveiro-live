'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/lib/admin/blog';

// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (fetchError) {
        console.error('Error fetching post:', fetchError);
        setError('Post no encontrado');
        return;
      }

      setPost(data);

      // Incrementar contador de visitas
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

    } catch (err) {
      console.error('Error loading post:', err);
      setError('Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Header showLogo={true} />
        <main className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-4xl">⏳</div>
                <p className="text-gray-600 dark:text-gray-400">Cargando artículo...</p>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header showLogo={true} />
        <main className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
              <div className="mb-4 text-4xl">😕</div>
              <h2 className="mb-2 text-xl font-semibold text-red-900 dark:text-red-200">
                {error || 'Post no encontrado'}
              </h2>
              <p className="mb-4 text-red-800 dark:text-red-300">
                El artículo que buscas no existe o ha sido eliminado.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header showLogo={true} />
      <main className="min-h-screen bg-gray-50 pt-24 dark:bg-gray-900">
        <article className="mx-auto max-w-4xl px-4 py-12">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Inicio
            </Link>
            <span>→</span>
            <span className="text-gray-900 dark:text-white">Blog</span>
          </motion.div>

          {/* Imagen de portada */}
          {post.cover_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 overflow-hidden rounded-2xl"
            >
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="h-auto w-full max-h-[500px] object-cover"
              />
            </motion.div>
          )}

          {/* Header del post */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {/* Categoría y fecha */}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                {post.category}
              </span>
              <span>•</span>
              <span>📅 {formatDate(post.published_at)}</span>
              <span>•</span>
              <span>👁️ {post.view_count} visitas</span>
            </div>

            {/* Título */}
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white md:text-5xl">
              {post.title}
            </h1>

            {/* Extracto */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {post.excerpt}
              </p>
            )}

            {/* Etiquetas */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* Contenido */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg dark:prose-invert max-w-none"
            style={{
              lineHeight: '1.8',
            }}
          >
            {/* Renderizar Markdown como HTML simple por ahora */}
            <div
              className="space-y-4 text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-8">$1</h1>')
                  .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
                  .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/\n\n/g, '</p><p class="mb-4">')
                  .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
              }}
            />
          </motion.div>

          {/* Footer del post */}
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ← Volver al inicio
            </Link>
          </motion.footer>
        </article>
      </main>
    </>
  );
}
