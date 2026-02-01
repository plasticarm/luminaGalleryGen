
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
    { id: '1', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80', aspectRatio: 0.75, title: 'Portrait of Art' },
    { id: '2', url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80', aspectRatio: 1.5, title: 'Abstract Waves' },
    { id: '3', url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=800&q=80', aspectRatio: 1.33, title: 'The Mountains' },
  ],
  spacing: 2.5,
  size: 1.5,
  wallTexture: 'plaster',
  wallColor: '#e5e5e5',
  frameStyle: 'wood',
  spotlightIntensity: 2.5,
  ambientIntensity: 0.5,
};

// Using seamless architectural textures
export const TEXTURE_URLS = {
  // Clean white plaster
  plaster: 'https://images.unsplash.com/photo-1594905479634-114cb6c5c808?auto=format&fit=crop&w=1000&q=80', 
  // Raw concrete
  concrete: 'https://images.unsplash.com/photo-1518135122165-22d7b8893701?auto=format&fit=crop&w=1000&q=80',
  // White painted brick
  brick: 'https://images.unsplash.com/photo-1596131460336-e822f303666d?auto=format&fit=crop&w=1000&q=80',
  // Dark wood floor/wall
  wood: 'https://images.unsplash.com/photo-1542268112-9856f70914c6?auto=format&fit=crop&w=1000&q=80',
};