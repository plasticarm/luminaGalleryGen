import React, { useState, useEffect } from 'react';
import GalleryScene from './components/3d/GalleryScene';
import Controls from './components/ui/Controls';
import EmbedModal from './components/ui/EmbedModal';
import { GalleryConfig, DEFAULT_CONFIG } from './types';
import { deserializeConfig } from './utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<GalleryConfig>(DEFAULT_CONFIG);
  const [isEmbedMode, setIsEmbedMode] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    // Check for hash config
    const hash = window.location.hash.slice(1); // Remove #
    if (hash) {
        const loadedConfig = deserializeConfig(hash);
        if (loadedConfig) {
            setConfig(loadedConfig);
            setIsEmbedMode(true);
        }
    }
  }, []);

  // Ensure focused index is valid when images change
  useEffect(() => {
    if (focusedIndex >= config.images.length) {
        setFocusedIndex(Math.max(0, config.images.length - 1));
    }
  }, [config.images.length]);

  const handlePrev = () => {
    setFocusedIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setFocusedIndex(prev => Math.min(config.images.length - 1, prev + 1));
  };

  return (
    <div className="w-full h-screen relative bg-black text-white overflow-hidden">
      
      {/* 3D Scene */}
      <div className={`w-full h-full transition-all duration-500 ${!isEmbedMode ? 'pl-80' : ''}`}>
        <GalleryScene 
            config={config} 
            isEmbed={isEmbedMode} 
            focusedIndex={focusedIndex}
        />
      </div>

      {/* Navigation Arrows */}
      {config.images.length > 0 && (
          <>
            <button 
                onClick={handlePrev}
                disabled={focusedIndex === 0}
                className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur text-white hover:bg-purple-600 transition-all ${!isEmbedMode ? 'ml-80' : ''} disabled:opacity-30 disabled:hover:bg-black/50 z-20`}
            >
                <ChevronLeft size={32} />
            </button>
            <button 
                onClick={handleNext}
                disabled={focusedIndex === config.images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur text-white hover:bg-purple-600 transition-all disabled:opacity-30 disabled:hover:bg-black/50 z-20"
            >
                <ChevronRight size={32} />
            </button>
            
            {/* Position Indicator */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-4 py-1 rounded-full text-sm font-mono text-zinc-300 z-20 transition-all ${!isEmbedMode ? 'ml-40' : ''}`}>
                {focusedIndex + 1} / {config.images.length}
            </div>
          </>
      )}

      {/* Builder UI - Only show if not in embed mode */}
      {!isEmbedMode && (
        <>
            <Controls 
                config={config} 
                updateConfig={setConfig} 
                onOpenEmbed={() => setIsEmbedModalOpen(true)}
            />
            <EmbedModal 
                isOpen={isEmbedModalOpen} 
                onClose={() => setIsEmbedModalOpen(false)} 
                config={config} 
            />
        </>
      )}

      {/* Helper text for camera controls */}
      <div className="absolute top-6 right-6 pointer-events-none opacity-50 text-xs font-mono bg-black/50 p-2 rounded z-10">
        Drag to rotate • Scroll to zoom
      </div>

      {/* Embed Mode Branding (Small) */}
      {isEmbedMode && (
          <a href={window.location.origin + window.location.pathname} target="_blank" rel="noreferrer" className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white hover:bg-purple-600 transition-colors pointer-events-auto">
              Built with Lumina
          </a>
      )}
    </div>
  );
};

export default App;