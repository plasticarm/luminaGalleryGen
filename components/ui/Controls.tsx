import React, { useState } from 'react';
import { GalleryConfig, WallTexture, FrameStyle } from '../../types';
import { getOptimizedImageUrl } from '../../utils';
import { Trash2, Plus, Share2, Eye, GripHorizontal, Settings, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ControlsProps {
  config: GalleryConfig;
  updateConfig: (newConfig: GalleryConfig) => void;
  onOpenEmbed: () => void;
}

const Controls: React.FC<ControlsProps> = ({ config, updateConfig, onOpenEmbed }) => {
  const [activeTab, setActiveTab] = useState<'layout' | 'images' | 'style'>('layout');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleUpdate = (key: keyof GalleryConfig, value: any) => {
    updateConfig({ ...config, [key]: value });
  };

  const addImage = () => {
    if (!newImageUrl) return;
    const newImage = {
        id: Date.now().toString(),
        url: newImageUrl,
        title: 'New Artwork',
        aspectRatio: 1
    };
    updateConfig({
        ...config,
        images: [...config.images, newImage]
    });
    setNewImageUrl('');
  };

  const removeImage = (id: string) => {
    updateConfig({
        ...config,
        images: config.images.filter(img => img.id !== id)
    });
  };

  const updateImageAspect = (id: string, ratio: number) => {
      const newImages = config.images.map(img => {
          if (img.id === id) return { ...img, aspectRatio: ratio };
          return img;
      });
      updateConfig({ ...config, images: newImages });
  };

  const updateImageTitle = (id: string, title: string) => {
      const newImages = config.images.map(img => {
          if (img.id === id) return { ...img, title };
          return img;
      });
      updateConfig({ ...config, images: newImages });
  };

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-zinc-900/95 backdrop-blur-md border-r border-zinc-800 text-zinc-100 flex flex-col z-10 shadow-2xl">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Lumina</h1>
        <button onClick={onOpenEmbed} className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
            <Share2 size={12} /> Embed
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        <button 
            onClick={() => setActiveTab('layout')} 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'layout' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
            <Settings size={14} /> Layout
        </button>
        <button 
            onClick={() => setActiveTab('style')} 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'style' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
            <Eye size={14} /> Style
        </button>
        <button 
            onClick={() => setActiveTab('images')} 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === 'images' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
        >
            <ImageIcon size={14} /> Art
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Layout Settings */}
        {activeTab === 'layout' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Image Size</label>
                    <input 
                        type="range" min="0.5" max="3" step="0.1" 
                        value={config.size}
                        onChange={(e) => handleUpdate('size', parseFloat(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-zinc-400">
                        <span>Small</span>
                        <span>Large</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Spacing</label>
                    <input 
                        type="range" min="0.5" max="5" step="0.1" 
                        value={config.spacing}
                        onChange={(e) => handleUpdate('spacing', parseFloat(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        )}

        {/* Style Settings */}
        {activeTab === 'style' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Wall Texture</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['plaster', 'concrete', 'brick', 'dark'] as WallTexture[]).map(t => (
                            <button
                                key={t}
                                onClick={() => handleUpdate('wallTexture', t)}
                                className={`px-3 py-2 rounded text-sm capitalize border ${config.wallTexture === t ? 'border-purple-500 bg-purple-500/10 text-purple-200' : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {config.wallTexture === 'plaster' && (
                     <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Wall Color</label>
                        <input 
                            type="color" 
                            value={config.wallColor}
                            onChange={(e) => handleUpdate('wallColor', e.target.value)}
                            className="w-full h-10 rounded cursor-pointer bg-zinc-800 border-none"
                        />
                    </div>
                )}

                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Frame Style</label>
                    <select 
                        value={config.frameStyle}
                        onChange={(e) => handleUpdate('frameStyle', e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option value="minimal">Minimal White</option>
                        <option value="wood">Classic Wood</option>
                        <option value="gold">Ornate Gold</option>
                        <option value="black">Modern Black</option>
                        <option value="none">No Frame</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Lighting Intensity</label>
                    <div className="flex gap-4">
                         <div className="flex-1">
                             <span className="text-xs text-zinc-400 mb-1 block">Ambient</span>
                             <input 
                                type="range" min="0" max="1" step="0.1" 
                                value={config.ambientIntensity}
                                onChange={(e) => handleUpdate('ambientIntensity', parseFloat(e.target.value))}
                                className="w-full accent-purple-500 h-1 bg-zinc-700 rounded-lg"
                            />
                         </div>
                         <div className="flex-1">
                             <span className="text-xs text-zinc-400 mb-1 block">Spotlights</span>
                             <input 
                                type="range" min="0" max="5" step="0.1" 
                                value={config.spotlightIntensity}
                                onChange={(e) => handleUpdate('spotlightIntensity', parseFloat(e.target.value))}
                                className="w-full accent-purple-500 h-1 bg-zinc-700 rounded-lg"
                            />
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* Images Settings */}
        {activeTab === 'images' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                 <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Add Artwork</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Image URL..." 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                        />
                        <button 
                            onClick={addImage}
                            disabled={!newImageUrl}
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded p-2 text-zinc-300 disabled:opacity-50"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    
                    <div className="bg-amber-900/30 border border-amber-800/50 rounded p-2 flex gap-2 items-start mt-2">
                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-200/80 leading-relaxed">
                            For Google Drive images, you <strong>must</strong> set access to <strong>"Anyone with the link"</strong>. 
                            If the image fails in the gallery but works in the sidebar, it's likely a permission/cookie issue.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-bold">Gallery Order ({config.images.length})</label>
                    {config.images.map((img, i) => (
                        <div key={img.id} className="bg-zinc-800/50 border border-zinc-800 rounded p-3 flex gap-3 items-start group">
                            <div 
                                className="w-12 h-12 bg-zinc-700 rounded bg-cover bg-center shrink-0"
                                style={{ backgroundImage: `url(${getOptimizedImageUrl(img.url)})` }}
                            />
                            <div className="flex-1 min-w-0">
                                <input 
                                    type="text"
                                    value={img.title || ''}
                                    onChange={(e) => updateImageTitle(img.id, e.target.value)}
                                    placeholder={`Artwork #${i + 1}`}
                                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-600 focus:border-purple-500 text-xs text-zinc-300 font-medium focus:outline-none transition-colors px-0 py-0.5"
                                />
                                <div className="mt-2 flex items-center gap-2">
                                    <label className="text-[10px] text-zinc-500">Aspect</label>
                                    <input 
                                        type="number" step="0.1"
                                        value={img.aspectRatio}
                                        onChange={(e) => updateImageAspect(img.id, parseFloat(e.target.value))}
                                        className="w-12 bg-zinc-900 border border-zinc-700 text-xs px-1 rounded"
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={() => removeImage(img.id)}
                                className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
      <div className="p-4 border-t border-zinc-800 text-center">
        <p className="text-[10px] text-zinc-600">Built with React + Three Fiber</p>
      </div>
    </div>
  );
};

export default Controls;