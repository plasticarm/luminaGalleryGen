
export type FrameStyle = 'minimal' | 'wood' | 'gold' | 'black';
export type WallTexture = 'plaster' | 'concrete' | 'brick' | 'dark';

export interface GalleryConfig {
  images: GalleryImage[];
  spacing: number;
  size: number;
  wallTexture: WallTexture;
  wallColor: string;
  frameStyle: FrameStyle;
  spotlightIntensity: number;
  ambientIntensity: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  title?: string;
  aspectRatio?: number; // width / height
}

export const DEFAULT_CONFIG: GalleryConfig = {
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?fit=crop&w=800&q=80', aspectRatio: 1.33 },
    { id: '2', url: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?fit=crop&w=600&q=80', aspectRatio: 0.75 },
    { id: '3', url: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?fit=crop&w=800&q=80', aspectRatio: 1 },
  ],
  spacing: 2.5,
  size: 1.5,
  wallTexture: 'plaster',
  wallColor: '#e5e5e5',
  frameStyle: 'wood',
  spotlightIntensity: 2.5,
  ambientIntensity: 0.4,
};

// Using reliable texture sources
export const TEXTURE_URLS = {
  // White stucco/plaster
  plaster: 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&w=1000&q=80', 
  // Concrete texture
  concrete: 'https://images.unsplash.com/photo-1518135122165-22d7b8893701?auto=format&fit=crop&w=1000&q=80',
  // White brick wall
  brick: 'https://images.unsplash.com/photo-1596131460336-e822f303666d?auto=format&fit=crop&w=1000&q=80',
  // Dark wood floor/wall texture
  wood: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1000&q=80',
};
