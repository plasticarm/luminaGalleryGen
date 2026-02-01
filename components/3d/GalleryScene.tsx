import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GalleryConfig, TEXTURE_URLS } from '../../types';
import ArtPiece from './ArtPiece';

interface GallerySceneProps {
  config: GalleryConfig;
  isEmbed?: boolean;
  focusedIndex?: number;
}

// Safer Wall Component that handles texture loading without throwing Suspense errors
const Wall = ({ config, width }: { config: GalleryConfig, width: number }) => {
    const textureUrl = config.wallTexture !== 'dark' ? TEXTURE_URLS[config.wallTexture] : null;
    const effectiveColor = config.wallTexture === 'dark' ? '#1a1a1a' : config.wallColor;
    
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [loading, setLoading] = useState(false);

    // 1. Load Texture (Only runs when URL changes)
    useEffect(() => {
        if (!textureUrl) {
            setTexture(null);
            return;
        }

        let isMounted = true;
        setLoading(true);
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        
        loader.load(
            textureUrl,
            (loadedTex) => {
                if(isMounted) {
                    loadedTex.colorSpace = THREE.SRGBColorSpace;
                    setTexture(loadedTex);
                    setLoading(false);
                }
            },
            undefined,
            (err) => {
                console.warn("Failed to load wall texture:", textureUrl);
                if(isMounted) {
                    setTexture(null);
                    setLoading(false);
                }
            }
        );
        return () => { isMounted = false; };
    }, [textureUrl]);

    // 2. Update Repeat Pattern (Runs when width changes)
    useEffect(() => {
        if (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(width / 4, 2);
            texture.needsUpdate = true;
        }
    }, [texture, width]);

    return (
        <mesh position={[0, 0, -0.5]} receiveShadow>
            <planeGeometry args={[width * 1.5, 10]} />
            {texture ? (
                <meshStandardMaterial map={texture} color={effectiveColor} roughness={0.8} />
            ) : (
                <meshStandardMaterial color={effectiveColor} roughness={0.8} />
            )}
        </mesh>
    );
};

// Floor Component
const Floor = ({ width }: { width: number }) => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 2]} receiveShadow>
            <planeGeometry args={[width * 1.5, 10]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.2} />
        </mesh>
    );
};

// Camera Rig to handle navigation
const CameraRig = ({ focusedIndex, config }: { focusedIndex: number, config: GalleryConfig }) => {
    const { camera, controls } = useThree();
    const vec = new THREE.Vector3();
    const target = new THREE.Vector3();

    useFrame((state, delta) => {
        const totalWidth = config.images.length * (config.size + config.spacing);
        const startX = -(totalWidth / 2) + (config.size / 2) + (config.spacing / 2);
        
        // Calculate target position for the focused image
        const xPos = startX + focusedIndex * (config.size + config.spacing);
        
        // Camera target position (standing in front of the art)
        const targetCameraX = xPos;
        
        // We want to move the controls target to look at the art
        target.set(xPos, 0, 0);
        
        const orbitControls = controls as any;
        if (orbitControls) {
            // Smoothly move the look-at target
            orbitControls.target.lerp(target, 4 * delta);
            
            // Also gently nudge the camera X to follow
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 4 * delta);
            
            orbitControls.update();
        }
    });

    return null;
}

const GalleryScene: React.FC<GallerySceneProps> = ({ config, isEmbed = false, focusedIndex = 0 }) => {
  // Calculate total width based on content
  const totalWidth = config.images.length * (config.size + config.spacing);
  const startX = -(totalWidth / 2) + (config.size / 2) + (config.spacing / 2);

  return (
    <Canvas shadows dpr={[1, 2]} className="w-full h-full bg-black">
      <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
      
      {/* Controls */}
      <OrbitControls 
        makeDefault
        minPolarAngle={Math.PI / 2.5} 
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={12}
      />

      {/* Global Lighting */}
      <ambientLight intensity={config.ambientIntensity} />

      <CameraRig focusedIndex={focusedIndex} config={config} />

      {/* Content Group */}
      <group position={[0, 0, 0]}>
          {/* The Back Wall */}
          <Wall config={config} width={Math.max(totalWidth, 15)} />
          
          {/* The Floor */}
          <Floor width={Math.max(totalWidth, 15)} />

          {/* Render Artworks */}
          {config.images.map((img, index) => {
              const xPos = startX + index * (config.size + config.spacing);
              return (
                  <ArtPiece 
                      key={img.id}
                      image={img}
                      position={[xPos, 0, 0]}
                      size={config.size}
                      frameStyle={config.frameStyle}
                      spotlightIntensity={config.spotlightIntensity}
                  />
              );
          })}
      </group>

      {/* Environment for reflections */}
      <Environment preset="city" />
    </Canvas>
  );
};

export default GalleryScene;