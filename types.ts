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
    { id: '1', url: 'https://picsum.photos/id/10/800/600', aspectRatio: 1.33 },
    { id: '2', url: 'https://picsum.photos/id/14/600/800', aspectRatio: 0.75 },
    { id: '3', url: 'https://picsum.photos/id/25/800/800', aspectRatio: 1 },
  ],
  spacing: 2.5,
  size: 1.5,
  wallTexture: 'plaster',
  wallColor: '#e5e5e5',
  frameStyle: 'wood',
  spotlightIntensity: 2.5,
  ambientIntensity: 0.4,
};

// Using more reliable texture sources
export const TEXTURE_URLS = {
  plaster: 'https://images.unsplash.com/photo-1563293860-6395e3474581?auto=format&fit=crop&w=1000&q=80',
  concrete: 'https://images.unsplash.com/photo-1518182170546-0766be69bd56?auto=format&fit=crop&w=1000&q=80',
  brick: 'https://images.unsplash.com/photo-1558958212-0746979a0b93?auto=format&fit=crop&w=1000&q=80',
  wood: 'https://images.unsplash.com/photo-1582298538104-fe2e74c2ed54?auto=format&fit=crop&w=1000&q=80',
};