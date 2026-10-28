import React, { useState } from 'react';
import { ForestItem } from '../../types';
import { Plus, Trash2, Pause, Play, Sparkles } from 'lucide-react';

interface ForestIllustrationProps {
  items: ForestItem[];
  onAddItem: (type: 'flower' | 'stone' | 'leaf') => void;
  onClearGarden: () => void;
  compact?: boolean;
}

export const ForestIllustration: React.FC<ForestIllustrationProps> = ({
  items,
  onAddItem,
  onClearGarden,
  compact = false,
}) => {
  const [animationsPaused, setAnimationsPaused] = useState(false);

  return (
    <div className={`relative bg-gradient-to-b from-brand-sky-mist via-brand-soft-leaf to-brand-deep-forest/10 rounded-card border border-brand-border overflow-hidden select-none ${compact ? 'h-48' : 'h-80'}`}>
      {/* Top subtle controls */}
      {!compact && (
        <div className="absolute top-3 right-3 z-20 flex items-center space-x-2 bg-brand-surface/85 backdrop-blur-sm px-2.5 py-1.5 rounded-control border border-brand-border shadow-xs text-xs">
          <button
            onClick={() => setAnimationsPaused(!animationsPaused)}
            className="flex items-center text-brand-secondary-text hover:text-brand-primary-text"
            title={animationsPaused ? "Resume subtle breeze" : "Pause animation"}
          >
            {animationsPaused ? <Play className="w-3.5 h-3.5 mr-1 text-brand-interactive" /> : <Pause className="w-3.5 h-3.5 mr-1" />}
            {animationsPaused ? "Resume" : "Pause breeze"}
          </button>
          <span className="text-brand-border">|</span>
          <button
            onClick={onClearGarden}
            className="text-brand-secondary-text hover:text-brand-error flex items-center"
            title="Reset personal garden"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            Clear
          </button>
        </div>
      )}

      {/* SVG Scenery */}
      <svg viewBox="0 0 800 400" className="w-full h-full object-cover pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5F0E8" />
            <stop offset="60%" stopColor="#E9EEE8" />
            <stop offset="100%" stopColor="#F3F4F0" />
          </linearGradient>
          <linearGradient id="sunGlowGrad" cx="70%" cy="15%" r="60%">
            <stop offset="0%" stopColor="#F2D69B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F2D69B" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8EBD78" />
            <stop offset="40%" stopColor="#52796F" />
            <stop offset="100%" stopColor="#29483A" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="800" height="400" fill="url(#skyGrad)" />

        {/* Warm Sunlight Clearing */}
        <circle cx="560" cy="70" r="160" fill="url(#sunGlowGrad)" />

        {/* Distant Layer 1 Mountain / Hills */}
        <path d="M 0 240 Q 200 190 400 230 T 800 220 L 800 400 L 0 400 Z" fill="#9FB5A2" opacity="0.35" />

        {/* Layer 2 Background Forest Silhouettes */}
        <g opacity="0.6">
          <polygon points="60,240 85,150 110,240" fill="#3B5749" />
          <polygon points="120,245 150,140 180,245" fill="#2E483B" />
          <polygon points="210,250 240,160 270,250" fill="#3B5749" />
          <polygon points="630,230 660,130 690,230" fill="#2E483B" />
          <polygon points="680,235 710,145 740,235" fill="#3B5749" />
        </g>

        {/* Layer 3 Foreground Rolling Meadow */}
        <path d="M 0 270 Q 260 230 520 280 T 800 260 L 800 400 L 0 400 Z" fill="url(#groundGrad)" />

        {/* Gentle Meandering Stream */}
        <path
          d="M 330 260 Q 360 300 320 340 T 360 400"
          stroke="#52796F"
          strokeWidth="28"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 330 260 Q 360 300 320 340 T 360 400"
          stroke="#E5F0E8"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10 15"
          opacity="0.6"
        />

        {/* Foreground Birch and Pine Trees */}
        {/* Left Tree */}
        <rect x="140" y="170" width="16" height="150" fill="#DEE2DC" rx="2" />
        <ellipse cx="148" cy="160" rx="42" ry="60" fill="#29483A" opacity="0.95" />
        <ellipse cx="148" cy="140" rx="35" ry="45" fill="#52796F" opacity="0.9" />
        <ellipse cx="148" cy="120" rx="28" ry="35" fill="#8EBD78" opacity="0.85" />

        {/* Right Tree */}
        <rect x="670" y="190" width="14" height="130" fill="#4A3B32" rx="2" />
        <circle cx="677" cy="175" r="45" fill="#24332D" opacity="0.95" />
        <circle cx="677" cy="150" r="38" fill="#52796F" opacity="0.9" />
        <circle cx="677" cy="130" r="30" fill="#8EBD78" opacity="0.8" />

        {/* Natural Riverbed Stones */}
        <ellipse cx="300" cy="320" rx="18" ry="10" fill="#5A615D" />
        <ellipse cx="370" cy="360" rx="22" ry="12" fill="#747C75" />
        <ellipse cx="280" cy="365" rx="14" ry="8" fill="#4A524D" />

        {/* User-Placed Elements */}
        {items.map((item) => {
          if (item.type === 'flower') {
            return (
              <g key={item.id} transform={`translate(${item.x}, ${item.y})`} className={animationsPaused ? '' : 'animate-pulse'}>
                <line x1="0" y1="0" x2="0" y2="18" stroke="#286B50" strokeWidth="3" />
                <circle cx="0" cy="0" r="7" fill="#C47D57" />
                <circle cx="-6" cy="-2" r="5" fill="#F2D69B" />
                <circle cx="6" cy="-2" r="5" fill="#F2D69B" />
                <circle cx="0" cy="-7" r="5" fill="#F2D69B" />
                <circle cx="-4" cy="5" r="5" fill="#F2D69B" />
                <circle cx="4" cy="5" r="5" fill="#F2D69B" />
                <circle cx="0" cy="0" r="4" fill="#C47D57" />
              </g>
            );
          } else if (item.type === 'stone') {
            return (
              <g key={item.id} transform={`translate(${item.x}, ${item.y})`}>
                <ellipse cx="0" cy="0" rx="14" ry="8" fill="#DEE2DC" stroke="#4A524D" strokeWidth="2" />
                <ellipse cx="-2" cy="-2" rx="10" ry="5" fill="#FFFFFF" opacity="0.3" />
              </g>
            );
          } else {
            // Leaf
            return (
              <g key={item.id} transform={`translate(${item.x}, ${item.y})`}>
                <path d="M 0 0 C 8 -10, 16 -5, 18 6 C 10 12, 2 8, 0 0 Z" fill="#8EBD78" stroke="#29483A" strokeWidth="1.5" />
                <line x1="2" y1="0" x2="14" y2="4" stroke="#29483A" strokeWidth="1" />
              </g>
            );
          }
        })}
      </svg>

      {/* Action bar to add peaceful elements */}
      {!compact && (
        <div className="absolute bottom-3 left-4 z-20 flex items-center space-x-2 bg-brand-surface/90 backdrop-blur-sm px-3 py-2 rounded-control border border-brand-border shadow-xs">
          <span className="text-xs font-medium text-brand-secondary-text mr-1">Add to forest:</span>
          <button
            onClick={() => onAddItem('flower')}
            className="inline-flex items-center text-xs bg-brand-soft-leaf hover:bg-brand-fresh-leaf/30 text-brand-deep-forest px-2.5 py-1 rounded-control transition-colors font-medium border border-brand-fresh-leaf/40"
          >
            <Sparkles className="w-3 h-3 mr-1 text-brand-sunlight" />
            + Flower
          </button>
          <button
            onClick={() => onAddItem('leaf')}
            className="inline-flex items-center text-xs bg-brand-soft-leaf hover:bg-brand-fresh-leaf/30 text-brand-deep-forest px-2.5 py-1 rounded-control transition-colors font-medium border border-brand-fresh-leaf/40"
          >
            <Plus className="w-3 h-3 mr-1 text-brand-fresh-leaf" />
            + Leaf
          </button>
          <button
            onClick={() => onAddItem('stone')}
            className="inline-flex items-center text-xs bg-brand-soft-leaf hover:bg-brand-fresh-leaf/30 text-brand-deep-forest px-2.5 py-1 rounded-control transition-colors font-medium border border-brand-fresh-leaf/40"
          >
            <Plus className="w-3 h-3 mr-1 text-brand-secondary-text" />
            + Stone
          </button>
        </div>
      )}
    </div>
  );
};
