'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { getBlogPostById, updateBlogPost, type BlogPost, type BlogPostInput } from '@/lib/admin/blog';

// Force dynamic rendering for client component page
export const dynamic = 'force-dynamic';

export default function EditBlogPostPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getBlogPostById(id);
      setPost(data);
    } catch (err) {
      setError('Error al cargar el post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: BlogPostInput) => {
    await updateBlogPost(id, data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-4 text-4xl">⏳</div>
          <p className="text-gray-600 dark:text-gray-400">Cargando post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <p className="text-red-800 dark:text-red-200">
          {error || 'Post no encontrado'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Editar Post
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Modifica el artículo "{post.title}"
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <BlogPostForm
          initialData={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? undefined,
            content: post.content,
            cover_image_url: post.cover_image_url ?? undefined,
            category: post.category,
            tags: post.tags,
            is_published: post.is_published,
            published_at: post.published_at ?? undefined
          }}
          onSubmit={handleSubmit}
          submitLabel="Guardar Cambios"
        />
      </div>
    </div>
  );
}
