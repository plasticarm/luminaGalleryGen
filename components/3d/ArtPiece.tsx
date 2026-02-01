import React, { useRef, useMemo, useState } from 'react';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { FrameStyle, GalleryImage } from '../../types';
import { TEXTURE_URLS } from '../../types';

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
  const spotlightRef = useRef<THREE.SpotLight>(null);
  const [hovered, setHovered] = useState(false);

  // Load image texture with error handling fallback
  const texture = useTexture(image.url, (texture) => {
    // Correct aspect ratio if needed based on texture
    // But we are sticking to simple sizing for this builder
  });
  
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
            map: null // Could load a wood texture here 
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
        {/* Spotlight Targeting the Image */}
        <spotLight
            ref={spotlightRef}
            position={[0, 4, 3]}
            angle={0.3}
            penumbra={0.5}
            intensity={spotlightIntensity}
            castShadow
            target={meshRef.current || undefined}
            color="#fff8e7" // Slightly warm light
        />

        {/* The Frame Container */}
        <group 
            onPointerOver={() => setHovered(true)} 
            onPointerOut={() => setHovered(false)}
        >
            {/* Backboard/Frame Mesh */}
            <mesh position={[0, 0, -0.05]}>
                <boxGeometry args={[width + frameThickness, height + frameThickness, frameDepth]} />
                <primitive object={frameMaterial} attach="material" />
            </mesh>

            {/* The Image Mesh */}
            <mesh ref={meshRef} position={[0, 0, 0.01]}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial map={texture} roughness={0.4} />
            </mesh>

            {/* Title Text (Only shows on hover if title exists) */}
            {image.title && hovered && (
                <group position={[0, -height/2 - 0.4, 0.1]}>
                    <mesh position={[0,0,-0.01]}>
                        <planeGeometry args={[width, 0.3]} />
                        <meshBasicMaterial color="rgba(0,0,0,0.8)" transparent opacity={0.8} />
                    </mesh>
                    <Text
                        fontSize={0.15}
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