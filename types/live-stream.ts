/**
 * Tipos para el sistema de Live Streams
 */

export type StreamPlatform = 'youtube' | 'twitch' | 'vimeo' | 'facebook' | 'other';
export type StreamType = 'live' | 'recorded' | 'scheduled';

export interface LiveStream {
  id: string;
  title: string;
  description: string | null;
  platform: StreamPlatform;
  video_url: string;
  video_id: string | null;
  stream_type: StreamType;
  category: string | null;
  tags: string[];
  thumbnail_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  scheduled_start: string | null;
  scheduled_end: string | null;
  view_count: number;
  display_order: number;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface LiveStreamInput {
  title: string;
  description?: string;
  platform: StreamPlatform;
  video_url: string;
  stream_type: StreamType;
  category?: string;
  tags?: string[];
  thumbnail_url?: string;
  is_active: boolean;
  is_featured?: boolean;
  scheduled_start?: string;
  scheduled_end?: string;
  display_order?: number;
}

/**
 * Información de plataformas soportadas
 */
export interface PlatformInfo {
  id: StreamPlatform;
  name: string;
  icon: string;
  embedUrlPattern: string;
  videoIdPattern: RegExp;
  color: string;
}

export const PLATFORM_INFO: Record<StreamPlatform, PlatformInfo> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    embedUrlPattern: 'https://www.youtube.com/embed/{VIDEO_ID}',
    videoIdPattern: /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    color: '#FF0000',
  },
  twitch: {
    id: 'twitch',
    name: 'Twitch',
    icon: '🎮',
    embedUrlPattern: 'https://player.twitch.tv/?channel={VIDEO_ID}&parent=localhost',
    videoIdPattern: /twitch\.tv\/([a-zA-Z0-9_]+)/,
    color: '#9146FF',
  },
  vimeo: {
    id: 'vimeo',
    name: 'Vimeo',
    icon: '🎬',
    embedUrlPattern: 'https://player.vimeo.com/video/{VIDEO_ID}',
    videoIdPattern: /vimeo\.com\/([0-9]+)/,
    color: '#1AB7EA',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    icon: '👥',
    embedUrlPattern: 'https://www.facebook.com/plugins/video.php?href={VIDEO_URL}',
    videoIdPattern: /facebook\.com\/.*\/videos\/([0-9]+)/,
    color: '#1877F2',
  },
  other: {
    id: 'other',
    name: 'Otra',
    icon: '🔗',
    embedUrlPattern: '{VIDEO_URL}',
    videoIdPattern: /.*/,
    color: '#6B7280',
  },
};

/**
 * Extrae el ID del vídeo de una URL según la plataforma
 */
export function extractVideoId(url: string, platform: StreamPlatform): string | null {
  const platformInfo = PLATFORM_INFO[platform];
  const match = url.match(platformInfo.videoIdPattern);
  return match ? match[1] : null;
}

/**
 * Genera URL de embed según la plataforma
 */
export function getEmbedUrl(videoId: string, platform: StreamPlatform, videoUrl?: string): string {
  const platformInfo = PLATFORM_INFO[platform];

  if (platform === 'facebook' && videoUrl) {
    return platformInfo.embedUrlPattern.replace('{VIDEO_URL}', encodeURIComponent(videoUrl));
  }

  if (platform === 'other' && videoUrl) {
    return videoUrl;
  }

  return platformInfo.embedUrlPattern.replace('{VIDEO_ID}', videoId);
}
