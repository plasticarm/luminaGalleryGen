
export type FrameStyle = 'minimal' | 'wood' | 'gold' | 'black' | 'none';
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
  wallColor: '#ffffff', // Default to pure white so textures show true colors
  frameStyle: 'wood',
  spotlightIntensity: 2.5,
  ambientIntensity: 0.5,
};

// Using wsrv.nl proxy to strictly enforce CORS headers for WebGL usage
export const TEXTURE_URLS = {
  // Clean white plaster
  plaster: 'https://wsrv.nl/?url=images.unsplash.com/photo-1594905479634-114cb6c5c808&w=1000&q=80', 
  // Raw concrete
  concrete: 'https://wsrv.nl/?url=images.unsplash.com/photo-1518135122165-22d7b8893701&w=1000&q=80',
  // White painted brick - The specific requested image
  brick: 'https://wsrv.nl/?url=www.patternpictures.com/wp-content/uploads/White-brick-wall-background-texture-PhotosPublic4419FD-1500x940.jpg',
  // Dark wood floor/wall (Optional placeholder)
  wood: 'https://wsrv.nl/?url=images.unsplash.com/photo-1542268112-9856f70914c6&w=1000&q=80',
};