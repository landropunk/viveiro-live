'use client';

import BlogPostForm from '@/components/admin/BlogPostForm';
import { createBlogPost, type BlogPostInput } from '@/lib/admin/blog';

export default function NewBlogPostPage() {
  const handleSubmit = async (data: BlogPostInput) => {
    await createBlogPost(data);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Nuevo Post
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Crea un nuevo artículo o noticia
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
        <BlogPostForm onSubmit={handleSubmit} submitLabel="Crear Post" />
      </div>
    </div>
  );
}
