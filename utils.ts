import { GalleryConfig } from './types';
import LZString from 'lz-string';

export const serializeConfig = (config: GalleryConfig): string => {
  try {
    const json = JSON.stringify(config);
    return LZString.compressToEncodedURIComponent(json);
  } catch (e) {
    console.error("Failed to serialize config", e);
    return "";
  }
};

export const deserializeConfig = (hash: string): GalleryConfig | null => {
  try {
    // 1. Try decompressing with LZString (new format)
    let json = LZString.decompressFromEncodedURIComponent(hash);

    // 2. Fallback: If LZString failed (returns null/empty), try the old format (Base64)
    // This maintains compatibility with links generated in the previous version
    if (!json) {
        try {
            const decoded = decodeURIComponent(atob(hash));
            // Check if it looks like JSON before parsing to avoid syntax errors
            if (decoded.startsWith('{')) {
                json = decoded;
            }
        } catch (e) {
            // Not a valid base64 string, just ignore
        }
    }

    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to deserialize config", e);
    return null;
  }
};

export const generateEmbedCode = (config: GalleryConfig, baseUrl: string): string => {
  const hash = serializeConfig(config);
  return `<iframe src="${baseUrl}#${hash}" width="100%" height="600px" frameborder="0" allow="fullscreen; accelerometer; gyroscope; magnetometer;"></iframe>`;
};

/**
 * Transforms URLs to ensure they load correctly in WebGL/CORS contexts.
 * Specifically handles Google Drive links by converting them to the thumbnail API.
 */
export const getOptimizedImageUrl = (url: string): string => {
  if (!url) return '';
  
  // Google Drive Detection
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
    // Regex to find ID in formats like:
    // https://drive.google.com/file/d/123456789/view
    // https://drive.google.com/open?id=123456789
    // https://drive.google.com/uc?id=123456789
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    
    if (idMatch && idMatch[1]) {
      // Use lh3.googleusercontent.com/d/{id} with a size parameter.
      // This endpoint is a direct link to the content on Google's global CDN.
      // Critically, it supports CORS (Access-Control-Allow-Origin) which is required for WebGL textures.
      // The standard drive.google.com links often redirect or lack these headers.
      return `https://lh3.googleusercontent.com/d/${idMatch[1]}=w2000`;
    }
  }
  
  return url;
};