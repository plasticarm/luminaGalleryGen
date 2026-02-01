import React, { Suspense, useRef, useEffect, Component, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GalleryConfig, TEXTURE_URLS } from '../../types';
import ArtPiece from './ArtPiece';

interface GallerySceneProps {
  config: GalleryConfig;
  isEmbed?: boolean;
  focusedIndex?: number;
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error Boundary for Three.js components to handle texture load failures
class TextureErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    console.warn("Texture load failed:", error);
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Separated component to ensure useTexture is not called conditionally
const TexturedWallMaterial = ({ url, color, width }: { url: string, color: string, width: number }) => {
    const texture = useTexture(url);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 4, 2);
    return <meshStandardMaterial map={texture} color={color} roughness={0.8} />;
};

// Wall Component
const Wall = ({ config, width }: { config: GalleryConfig, width: number }) => {
    const textureUrl = config.wallTexture !== 'dark' ? TEXTURE_URLS[config.wallTexture] : null;
    const effectiveColor = config.wallTexture === 'dark' ? '#1a1a1a' : config.wallColor;

    return (
        <mesh position={[0, 0, -0.5]} receiveShadow>
            <planeGeometry args={[width * 1.5, 10]} />
            <TextureErrorBoundary fallback={<meshStandardMaterial color={effectiveColor} roughness={0.8} />}>
                {textureUrl ? (
                    <TexturedWallMaterial url={textureUrl} color={effectiveColor} width={width} />
                ) : (
                    <meshStandardMaterial color={effectiveColor} roughness={0.8} />
                )}
            </TextureErrorBoundary>
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
        // Distance depends on size to ensure it fits in view
        const distance = Math.max(2, config.size * 1.5); 
        
        // Smoothly interpolate camera position
        // We keep the user's current Y and Z zoom to some extent, but center X
        // Actually, forcing Z might be better for "slide" effect
        
        const targetCameraX = xPos;
        const targetCameraZ = 6; // Standard viewing distance
        
        // We want to move the controls target to look at the art
        target.set(xPos, 0, 0);
        
        // Move camera
        // We only animate X automatically, leaving Z (zoom) somewhat under user control 
        // unless it's very far off. But for a "tour" feel, let's animate to a sweet spot.
        
        // However, OrbitControls fights us if we set position directly while it's active.
        // If we update controls.target, OrbitControls updates the camera to look at it.
        
        const orbitControls = controls as any;
        if (orbitControls) {
            // Smoothly move the look-at target
            orbitControls.target.lerp(target, 4 * delta);
            
            // Also gently nudge the camera X to follow, maintaining offset
            // This creates a "dolly" effect along the rail
            const currentDist = camera.position.distanceTo(orbitControls.target);
            
            // Simple approach: Lerp camera X to match target X
            camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraX, 4 * delta);
            
            // Ensure camera doesn't get stuck too close or far if config changes
            // camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCameraZ, 2 * delta);
            
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
      
      {/* Controls: Limited rotation to simulate standing in front of wall */}
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

      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
            {/* The Back Wall */}
            <Wall config={config} width={Math.max(totalWidth, 15)} />
            
            {/* The Floor */}
            <Floor width={Math.max(totalWidth, 15)} />

            {/* Render Artworks */}
            {config.images.map((img, index) => {
                const xPos = startX + index * (config.size + config.spacing);
                return (
                    <TextureErrorBoundary 
                        key={img.id}
                        fallback={
                             <group position={[xPos, 0, 0]}>
                                <mesh>
                                    <boxGeometry args={[config.size, config.size, 0.1]} />
                                    <meshStandardMaterial color="#333" />
                                </mesh>
                                <Text position={[0, 0, 0.1]} fontSize={0.2} color="red">
                                    !
                                </Text>
                            </group>
                        }
                    >
                        <ArtPiece 
                            image={img}
                            position={[xPos, 0, 0]}
                            size={config.size}
                            frameStyle={config.frameStyle}
                            spotlightIntensity={config.spotlightIntensity}
                        />
                    </TextureErrorBoundary>
                );
            })}
        </group>

        {/* Environment for reflections */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
};

export default GalleryScene;