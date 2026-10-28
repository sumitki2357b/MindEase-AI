import React, { useState, useRef } from 'react';
import { ArrowLeft, RotateCcw, Plus, Trash2 } from 'lucide-react';

interface LittleZenGardenGameProps {
  onExit: () => void;
}

interface ZenItem {
  id: string;
  type: 'stone' | 'leaf' | 'flower';
  x: number;
  y: number;
}

export const LittleZenGardenGame: React.FC<LittleZenGardenGameProps> = ({ onExit }) => {
  const [items, setItems] = useState<ZenItem[]>([
    { id: '1', type: 'stone', x: 180, y: 140 },
    { id: '2', type: 'stone', x: 260, y: 150 },
    { id: '3', type: 'leaf', x: 340, y: 110 },
  ]);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add raked sand ripple
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev.slice(-6), newRipple]);
  };

  const addItem = (type: 'stone' | 'leaf' | 'flower') => {
    const newItem: ZenItem = {
      id: Math.random().toString(),
      type,
      x: 100 + Math.random() * 280,
      y: 60 + Math.random() * 160,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleClear = () => {
    setItems([]);
    setRipples([]);
  };

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border p-6 flex flex-col items-center max-w-xl mx-auto shadow-xs text-center">
      <div className="w-full flex items-center justify-between pb-4 border-b border-brand-border mb-4">
        <button
          onClick={onExit}
          className="inline-flex items-center text-sm text-brand-secondary-text hover:text-brand-primary-text font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Reset Room
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center text-xs text-brand-secondary-text hover:text-brand-error"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Smooth Sand
        </button>
      </div>

      <h3 className="text-lg font-semibold text-brand-primary-text mb-1">Little Zen Garden</h3>
      <p className="text-xs text-brand-secondary-text max-w-md mb-4">
        Click to rake concentric ripples in the raked sand. Place river stones and leaves to create quiet harmony.
      </p>

      {/* Garden Sandbox Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        className="relative w-full h-72 rounded-card border-4 border-[#C47D57]/30 bg-[#F5F2EB] cursor-pointer overflow-hidden shadow-inner mb-4 select-none"
        style={{
          backgroundImage: 'radial-gradient(#E8E2D5 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Rake Ripples */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {ripples.map((r) => (
            <g key={r.id}>
              <circle cx={r.x} cy={r.y} r="25" stroke="#D9D2C3" strokeWidth="2" fill="none" opacity="0.8" />
              <circle cx={r.x} cy={r.y} r="50" stroke="#D9D2C3" strokeWidth="1.5" fill="none" opacity="0.6" />
              <circle cx={r.x} cy={r.y} r="75" stroke="#D9D2C3" strokeWidth="1" fill="none" opacity="0.4" />
            </g>
          ))}
        </svg>

        {/* Zen Objects */}
        {items.map((item) => {
          if (item.type === 'stone') {
            return (
              <div
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                style={{ left: item.x, top: item.y }}
              >
                <div className="w-12 h-8 rounded-full bg-gradient-to-br from-[#747C75] to-[#4A524D] shadow-md border border-[#3B423D]" />
              </div>
            );
          } else if (item.type === 'leaf') {
            return (
              <div
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl"
                style={{ left: item.x, top: item.y }}
              >
                🍃
              </div>
            );
          } else {
            return (
              <div
                key={item.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl"
                style={{ left: item.x, top: item.y }}
              >
                🌸
              </div>
            );
          }
        })}
      </div>

      {/* Toolbar to place stones/leaves */}
      <div className="flex items-center space-x-2 mb-6">
        <button
          onClick={() => addItem('stone')}
          className="inline-flex items-center text-xs px-3 py-1.5 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/20 text-brand-deep-forest rounded-control border border-brand-border font-medium"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Place Stone
        </button>
        <button
          onClick={() => addItem('leaf')}
          className="inline-flex items-center text-xs px-3 py-1.5 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/20 text-brand-deep-forest rounded-control border border-brand-border font-medium"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-brand-fresh-leaf" />
          Add Leaf
        </button>
        <button
          onClick={() => addItem('flower')}
          className="inline-flex items-center text-xs px-3 py-1.5 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/20 text-brand-deep-forest rounded-control border border-brand-border font-medium"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-brand-muted-clay" />
          Add Blossom
        </button>
      </div>

      <button
        onClick={onExit}
        className="px-4 py-2 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control text-sm font-medium transition-colors"
      >
        Return to Reset Room
      </button>
    </div>
  );
};
