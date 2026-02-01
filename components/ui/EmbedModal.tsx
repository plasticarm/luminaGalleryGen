import React, { useState, useEffect } from 'react';
import { GalleryConfig } from '../../types';
import { generateEmbedCode, serializeConfig } from '../../utils';
import { X, Copy, Check, Link as LinkIcon, AlertTriangle, Globe } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GalleryConfig;
}

const EmbedModal: React.FC<EmbedModalProps> = ({ isOpen, onClose, config }) => {
  const [baseUrl, setBaseUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [directLink, setDirectLink] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [urlLength, setUrlLength] = useState(0);

  // Initialize Base URL when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentUrl = window.location.origin + window.location.pathname;
      setBaseUrl(currentUrl);

      // Check if running on localhost
      const hostname = window.location.hostname;
      setIsLocalhost(hostname === 'localhost' || hostname === '127.0.0.1');
    }
  }, [isOpen]);

  // Update generated code when config or baseUrl changes
  useEffect(() => {
    if (baseUrl) {
        const hash = serializeConfig(config);
        const fullLink = `${baseUrl}#${hash}`;
        
        setEmbedCode(generateEmbedCode(config, baseUrl));
        setDirectLink(fullLink);
        setUrlLength(fullLink.length);
    }
  }, [baseUrl, config]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  const isTooLong = urlLength > 2000;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 z-10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LinkIcon size={18} /> Embed Gallery
            </h2>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
            </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Warning Section */}
            {(isLocalhost || isTooLong) && (
                <div className="space-y-3">
                    {isLocalhost && (
                        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 flex gap-3 items-start">
                            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-amber-200">Deployment Required</p>
                                <p className="text-xs text-amber-200/80">
                                    This app is running on <strong>localhost</strong>. For the embed to work on Google Sites, you must <strong>deploy this app</strong> to a public host (e.g., Vercel, Netlify) and update the "App URL" below.
                                </p>
                            </div>
                        </div>
                    )}
                    {isTooLong && (
                        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 flex gap-3 items-start">
                            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-red-200">URL Too Long ({urlLength} chars)</p>
                                <p className="text-xs text-red-200/80">
                                    Google Sites supports URLs up to ~2000 characters. Try removing some images to shorten the link.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Base URL Input */}
            <div className="space-y-2">
                 <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Globe size={14} /> App URL
                 </label>
                 <input 
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://your-project.vercel.app"
                    className={`w-full bg-zinc-950 border rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 ${isLocalhost ? 'border-amber-500/50 focus:border-amber-500' : 'border-zinc-800'}`}
                />
                 <p className="text-[10px] text-zinc-500">
                    The public URL where this app is hosted.
                </p>
            </div>

            {/* Direct Link */}
            <div className="space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-300">Direct Link</label>
                    <button 
                        onClick={handleCopyLink}
                        className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 transition-colors"
                    >
                        {copiedLink ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                        {copiedLink ? 'Copied' : 'Copy Link'}
                    </button>
                </div>
                <div className="relative">
                    <input 
                        readOnly
                        value={directLink}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500 truncate"
                    />
                </div>
                <p className="text-[10px] text-zinc-500">
                    Paste this into Google Sites under <strong>Insert &gt; Embed &gt; By URL</strong>.
                </p>
            </div>

            {/* Embed Code */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-300">Embed Code (iFrame)</label>
                    <button 
                        onClick={handleCopyCode}
                        className="text-xs flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 transition-colors"
                    >
                        {copiedCode ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                        {copiedCode ? 'Copied' : 'Copy Code'}
                    </button>
                </div>
                <textarea 
                    readOnly
                    value={embedCode}
                    className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 font-mono resize-y focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
            </div>
            
            <div className="bg-blue-900/20 border border-blue-900/50 rounded p-3">
                <p className="text-xs text-blue-200">
                    <strong>Note:</strong> Settings are stored in the URL. No database required.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedModal;