export type VideoProvider = 'youtube' | 'vimeo' | 'drive' | 'unknown';

export interface VideoSource {
  provider: VideoProvider;
  id: string;
  url: string;
}

export function detectVideoSource(url: string): VideoSource | null {
  const normalized = url.trim();

  const youtubeId = extractYouTubeId(normalized);
  if (youtubeId) {
    return {
      provider: 'youtube',
      id: youtubeId,
      url: normalized
    };
  }

  const vimeoId = extractVimeoId(normalized);
  if (vimeoId) {
    return {
      provider: 'vimeo',
      id: vimeoId,
      url: normalized
    };
  }

  const driveId = extractDriveId(normalized);
  if (driveId) {
    return {
      provider: 'drive',
      id: driveId,
      url: normalized
    };
  }

  return null;
}

function extractYouTubeId(url: string): string | null {
  const youtuBeMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return youtuBeMatch[1];
  }

  const youtubeMatch = url.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (youtubeMatch && youtubeMatch[1]) {
    return youtubeMatch[1];
  }

  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function extractDriveId(url: string): string | null {
  const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}
