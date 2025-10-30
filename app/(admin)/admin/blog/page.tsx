'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllBlogPosts, deleteBlogPost, type BlogPost } from '@/lib/admin/blog';

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllBlogPosts();
      setPosts(data);
    } catch (err) {
      setError('Error al cargar los posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${title}"?`)) {
      return;
    }

    try {
      await deleteBlogPost(id);
      await loadPosts();
    } catch (err) {
      alert('Error al eliminar el post');
      console.error(err);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No publicado';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={loadPosts}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog / Noticias
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona los artículos y noticias del sitio
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nuevo Post
        </Link>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-4 text-6xl">📝</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            No hay posts todavía
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Crea tu primer artículo para empezar
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Crear Primer Post
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    {post.is_published ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Publicado
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        Borrador
                      </span>
                    )}
                  </div>

                  {post.excerpt && (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      📅 {formatDate(post.published_at || post.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      📂 {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      👁️ {post.view_count} visitas
                    </span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        🏷️ {post.tags.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex gap-2">
                  <Link
                    href={`/admin/blog/edit/${post.id}`}
                    className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="rounded-lg border border-red-600 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
