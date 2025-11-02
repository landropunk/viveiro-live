'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateSlug, type BlogPostInput } from '@/lib/admin/blog';

type BlogPostFormProps = {
  initialData?: Partial<BlogPostInput> & { id?: string };
  onSubmit: (data: BlogPostInput) => Promise<void>;
  submitLabel?: string;
};

export default function BlogPostForm({
  initialData,
  onSubmit,
  submitLabel = 'Crear Post',
}: BlogPostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BlogPostInput>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    cover_image_url: initialData?.cover_image_url || '',
    category: initialData?.category || 'general',
    tags: initialData?.tags || [],
    is_published: initialData?.is_published || false,
    published_at: initialData?.published_at || undefined,
  });

  const [tagInput, setTagInput] = useState('');

  // Auto-generar slug cuando cambie el título
  useEffect(() => {
    if (!initialData?.slug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }));
    }
  }, [formData.title, initialData?.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Enviando post:', formData);
      await onSubmit(formData);
      console.log('Post creado exitosamente');
      router.push('/admin/blog');
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al guardar el post';
      setError(errorMessage);
      console.error('Error completo:', err);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/10">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Título *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="Título del artículo"
        />
      </div>

      {/* Slug */}
      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Slug (URL) *
        </label>
        <input
          type="text"
          id="slug"
          required
          value={formData.slug}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, slug: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="url-del-articulo"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Se genera automáticamente desde el título
        </p>
      </div>

      {/* Extracto */}
      <div>
        <label
          htmlFor="excerpt"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Extracto
        </label>
        <textarea
          id="excerpt"
          rows={2}
          value={formData.excerpt}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="Breve descripción del artículo"
        />
      </div>

      {/* Contenido */}
      <div>
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Contenido *
        </label>
        <textarea
          id="content"
          required
          rows={12}
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="Contenido del artículo (Markdown soportado)"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Puedes usar Markdown para formatear el contenido
        </p>
      </div>

      {/* Imagen de portada */}
      <div>
        <label
          htmlFor="cover_image_url"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          URL de Imagen de Portada
        </label>
        <input
          type="url"
          id="cover_image_url"
          value={formData.cover_image_url}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, cover_image_url: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      {/* Categoría */}
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Categoría
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="general">General</option>
          <option value="noticias">Noticias</option>
          <option value="eventos">Eventos</option>
          <option value="cultura">Cultura</option>
          <option value="turismo">Turismo</option>
        </select>
      </div>

      {/* Etiquetas */}
      <div>
        <label
          htmlFor="tags"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Etiquetas
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            placeholder="Añadir etiqueta"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Añadir
          </button>
        </div>
        {formData.tags && formData.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-900 dark:hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Estado de publicación */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, is_published: e.target.checked }))
          }
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <label
          htmlFor="is_published"
          className="text-sm font-medium text-gray-900 dark:text-white"
        >
          Publicar inmediatamente
        </label>
      </div>

      {/* Botones */}
      <div className="flex gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
