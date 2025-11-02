/**
 * Funciones auxiliares para gestión de Live Streams en el panel de administración
 */

import { createClient } from '@/lib/supabase/client';
import type { LiveStream, LiveStreamInput } from '@/types/live-stream';
import { extractVideoId } from '@/types/live-stream';

/**
 * Obtener todos los streams (para admin)
 */
export async function getAllStreams(): Promise<LiveStream[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('live_streams')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching streams:', error);
    throw error;
  }

  return data || [];
}

/**
 * Obtener un stream por ID
 */
export async function getStreamById(id: string): Promise<LiveStream | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('live_streams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching stream:', error);
    throw error;
  }

  return data;
}

/**
 * Obtener streams activos (para la página pública)
 */
export async function getActiveStreams(limit?: number): Promise<LiveStream[]> {
  const supabase = createClient();
  let query = supabase
    .from('live_streams')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching active streams:', error);
    throw error;
  }

  return data || [];
}

/**
 * Obtener streams por tipo
 */
export async function getStreamsByType(type: 'live' | 'recorded' | 'scheduled'): Promise<LiveStream[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('live_streams')
    .select('*')
    .eq('stream_type', type)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${type} streams:`, error);
    throw error;
  }

  return data || [];
}

/**
 * Obtener streams destacados
 */
export async function getFeaturedStreams(limit: number = 3): Promise<LiveStream[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('live_streams')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured streams:', error);
    throw error;
  }

  return data || [];
}

/**
 * Crear un nuevo stream
 */
export async function createStream(input: LiveStreamInput): Promise<LiveStream> {
  console.log('🚀 createStream llamada con:', input);

  const supabase = createClient();

  // Obtener el usuario actual
  console.log('🔐 Obteniendo usuario...');
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error('❌ Error al obtener usuario:', userError);
    throw new Error(`Error de autenticación: ${userError.message}`);
  }

  if (!user) {
    console.error('❌ Usuario no autenticado');
    throw new Error('Usuario no autenticado');
  }

  console.log('✅ Usuario autenticado:', user.email);

  // Extraer video_id de la URL
  const videoId = extractVideoId(input.video_url, input.platform);

  const streamData = {
    ...input,
    video_id: videoId,
    author_id: user.id,
    tags: input.tags || [],
  };

  console.log('📝 Datos del stream a insertar:', streamData);

  const { data, error } = await supabase
    .from('live_streams')
    .insert([streamData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating stream:', error);
    throw new Error(`Error al crear stream: ${error.message}`);
  }

  console.log('✅ Stream creado exitosamente:', data);
  return data;
}

/**
 * Actualizar un stream existente
 */
export async function updateStream(id: string, input: Partial<LiveStreamInput>): Promise<LiveStream> {
  const supabase = createClient();

  // Si se actualizó la URL, extraer nuevo video_id
  const updateData: any = { ...input };
  if (input.video_url && input.platform) {
    updateData.video_id = extractVideoId(input.video_url, input.platform);
  }

  const { data, error } = await supabase
    .from('live_streams')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating stream:', error);
    throw error;
  }

  return data;
}

/**
 * Eliminar un stream
 */
export async function deleteStream(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('live_streams').delete().eq('id', id);

  if (error) {
    console.error('Error deleting stream:', error);
    throw error;
  }
}

/**
 * Incrementar contador de visualizaciones
 */
export async function incrementViewCount(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc('increment_stream_views', { stream_id: id });

  if (error) {
    console.error('Error incrementing view count:', error);
    // No lanzar error, solo registrar
  }
}

/**
 * Actualizar orden de visualización de múltiples streams
 */
export async function updateStreamsOrder(streamIds: string[]): Promise<void> {
  const supabase = createClient();

  // Actualizar display_order basado en el índice del array
  const updates = streamIds.map((id, index) =>
    supabase.from('live_streams').update({ display_order: index }).eq('id', id)
  );

  const results = await Promise.all(updates);

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    console.error('Errors updating stream order:', errors);
    throw new Error('Error al actualizar el orden de los streams');
  }
}
