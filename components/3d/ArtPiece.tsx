import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { FrameStyle, GalleryImage } from '../../types';
import { getOptimizedImageUrl } from '../../utils';

interface ArtPieceProps {
  image: GalleryImage;
  position: [number, number, number];
  size: number;
  frameStyle: FrameStyle;
  spotlightIntensity: number;
}

const ArtPiece: React.FC<ArtPieceProps> = ({ 
  image, 
  position, 
  size, 
  frameStyle,
  spotlightIntensity 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Create a persistent target for the spotlight to point at
  const [target] = useState(() => new THREE.Object3D());

  // Safe Texture Loading
  useEffect(() => {
      let isMounted = true;
      setLoading(true);
      setError(false);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      
      const optimizedUrl = getOptimizedImageUrl(image.url);

      loader.load(
          optimizedUrl,
          (tex) => {
              if (isMounted) {
                  // Ensure correct encoding/color space
                  tex.colorSpace = THREE.SRGBColorSpace; 
                  setTexture(tex);
                  setLoading(false);
              }
          },
          undefined,
          (err) => {
              console.warn(`Failed to load image: ${optimizedUrl}`, err);
              if (isMounted) {
                  setError(true);
                  setLoading(false);
              }
          }
      );

      return () => { isMounted = false; };
  }, [image.url]);
  
  // Calculate dimensions based on aspect ratio provided or default to 1:1 if not
  const aspectRatio = image.aspectRatio || 1;
  const height = size;
  const width = size * aspectRatio;
  
  // Frame logic
  const frameThickness = 0.1;
  const frameDepth = 0.1;
  
  const frameMaterial = useMemo(() => {
    switch (frameStyle) {
      case 'gold':
        return new THREE.MeshStandardMaterial({ 
            color: '#FFD700', 
            roughness: 0.2, 
            metalness: 0.8 
        });
      case 'black':
        return new THREE.MeshStandardMaterial({ 
            color: '#1a1a1a', 
            roughness: 0.6, 
            metalness: 0.1 
        });
      case 'wood':
        return new THREE.MeshStandardMaterial({ 
            color: '#5c4033', 
            roughness: 0.9,
            map: null 
        });
      case 'minimal':
      default:
        return new THREE.MeshStandardMaterial({ 
            color: '#ffffff', 
            roughness: 0.8 
        });
    }
  }, [frameStyle]);

  return (
    <group position={position}>
        {/* Target for spotlight must be in the scene graph */}
        <primitive object={target} position={[0, 0, 0]} />

        {/* Spotlight Targeting the center of this group */}
        {/* decay={0} and boosted intensity ensures visibility with physical lights */}
        <spotLight
            position={[0, 4, 3]}
            angle={0.4}
            penumbra={0.5}
            intensity={spotlightIntensity} 
            castShadow
            target={target}
            distance={15}
            decay={0}
            color="#fff8e7" 
        />

        {/* The Frame Container */}
        <group 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
        >
            {/* Backboard/Frame Mesh - Only render if frame style is not 'none' */}
            {frameStyle !== 'none' && (
                <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
                    <boxGeometry args={[width + frameThickness, height + frameThickness, frameDepth]} />
                    <primitive object={frameMaterial} attach="material" />
                </mesh>
            )}

            {/* The Image Mesh */}
            <mesh ref={meshRef} position={[0, 0, 0.01]}>
                <planeGeometry args={[width, height]} />
                {texture && !error ? (
                    // Use MeshBasicMaterial so the art is always visible regardless of lighting
                    <meshBasicMaterial map={texture} toneMapped={false} />
                ) : (
                    <meshStandardMaterial color={error ? "#333" : "#666"} roughness={0.8} />
                )}
            </mesh>

            {/* Loading / Error Indicator */}
            {(loading || error) && (
                 <Text position={[0, 0, 0.02]} fontSize={size * 0.1} color="white">
                    {loading ? "Loading..." : "Image Failed"}
                 </Text>
            )}

            {/* Title Text (Only shows on hover if title exists) */}
            {image.title && hovered && !loading && (
                <group position={[0, -height/2 - 0.25, 0.1]}>
                    <mesh position={[0,0,-0.01]}>
                        <planeGeometry args={[width, 0.15]} />
                        <meshBasicMaterial color="rgba(0,0,0,0.8)" transparent opacity={0.8} />
                    </mesh>
                    <Text
                        fontSize={0.075} 
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={width}
                    >
                        {image.title}
                    </Text>
                </group>
            )}
        </group>
    </group>
  );
};

export default ArtPiece;