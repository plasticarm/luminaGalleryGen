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