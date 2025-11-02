'use client';

import { useState } from 'react';
import type { LiveStreamInput, StreamPlatform, StreamType } from '@/types/live-stream';
import { PLATFORM_INFO } from '@/types/live-stream';

interface LiveStreamFormProps {
  initialData?: Partial<LiveStreamInput>;
  onSubmit: (data: LiveStreamInput) => Promise<void>;
  submitLabel?: string;
  disabled?: boolean;
}

export default function LiveStreamForm({
  initialData,
  onSubmit,
  submitLabel = 'Guardar',
  disabled = false,
}: LiveStreamFormProps) {
  const [formData, setFormData] = useState<Partial<LiveStreamInput>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    platform: initialData?.platform || 'youtube',
    video_url: initialData?.video_url || '',
    stream_type: initialData?.stream_type || 'recorded',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    thumbnail_url: initialData?.thumbnail_url || '',
    is_active: initialData?.is_active ?? true,
    is_featured: initialData?.is_featured ?? false,
    scheduled_start: initialData?.scheduled_start || '',
    scheduled_end: initialData?.scheduled_end || '',
    display_order: initialData?.display_order ?? 0,
  });

  const [tagInput, setTagInput] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.title?.trim()) {
      alert('El título es requerido');
      return;
    }

    if (!formData.video_url?.trim()) {
      alert('La URL del vídeo es requerida');
      return;
    }

    if (!formData.platform) {
      alert('La plataforma es requerida');
      return;
    }

    if (!formData.stream_type) {
      alert('El tipo de stream es requerido');
      return;
    }

    // Preparar datos
    const submitData: LiveStreamInput = {
      title: formData.title!,
      description: formData.description || undefined,
      platform: formData.platform as StreamPlatform,
      video_url: formData.video_url!,
      stream_type: formData.stream_type as StreamType,
      category: formData.category || undefined,
      tags: formData.tags,
      thumbnail_url: formData.thumbnail_url || undefined,
      is_active: formData.is_active ?? true,
      is_featured: formData.is_featured ?? false,
      scheduled_start: formData.scheduled_start || undefined,
      scheduled_end: formData.scheduled_end || undefined,
      display_order: formData.display_order ?? 0,
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Título *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
          placeholder="Ej: Concierto en vivo de las fiestas"
        />
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
          placeholder="Descripción del evento o vídeo"
        />
      </div>

      {/* Plataforma y Tipo */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="platform" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Plataforma *
          </label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
          >
            {Object.values(PLATFORM_INFO).map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.icon} {platform.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stream_type" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo *
          </label>
          <select
            id="stream_type"
            name="stream_type"
            value={formData.stream_type}
            onChange={handleChange}
            required
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
          >
            <option value="live">● En Vivo</option>
            <option value="recorded">Grabado</option>
            <option value="scheduled">Programado</option>
          </select>
        </div>
      </div>

      {/* URL del Vídeo */}
      <div>
        <label htmlFor="video_url" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          URL del Vídeo *
        </label>
        <input
          type="url"
          id="video_url"
          name="video_url"
          value={formData.video_url}
          onChange={handleChange}
          required
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
          placeholder={
            formData.platform === 'youtube'
              ? 'https://www.youtube.com/watch?v=...'
              : formData.platform === 'twitch'
              ? 'https://www.twitch.tv/...'
              : 'URL del vídeo'
          }
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Pega la URL completa del vídeo de la plataforma seleccionada
        </p>
      </div>

      {/* Categoría y Thumbnail */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoría
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
            placeholder="Ej: evento, concierto, deportes"
          />
        </div>

        <div>
          <label htmlFor="thumbnail_url" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            URL Imagen (Thumbnail)
          </label>
          <input
            type="url"
            id="thumbnail_url"
            name="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={handleChange}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            disabled={disabled}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
            placeholder="Escribe un tag y presiona Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={disabled}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
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
                  disabled={disabled}
                  className="hover:text-blue-900 dark:hover:text-blue-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Fechas de programación (si es scheduled) */}
      {formData.stream_type === 'scheduled' && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="scheduled_start" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha y Hora de Inicio
            </label>
            <input
              type="datetime-local"
              id="scheduled_start"
              name="scheduled_start"
              value={formData.scheduled_start}
              onChange={handleChange}
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
            />
          </div>

          <div>
            <label htmlFor="scheduled_end" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha y Hora de Fin
            </label>
            <input
              type="datetime-local"
              id="scheduled_end"
              name="scheduled_end"
              value={formData.scheduled_end}
              onChange={handleChange}
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
            />
          </div>
        </div>
      )}

      {/* Opciones */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Activo
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_featured"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
            disabled={disabled}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
          />
          <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Destacado
          </label>
        </div>

        <div>
          <label htmlFor="display_order" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Orden
          </label>
          <input
            type="number"
            id="display_order"
            name="display_order"
            value={formData.display_order}
            onChange={handleChange}
            min="0"
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-blue-400"
          />
        </div>
      </div>

      {/* Botón Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
