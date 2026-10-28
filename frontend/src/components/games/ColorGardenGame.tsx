import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ColorGardenGameProps {
  onExit: () => void;
}

interface Tile {
  id: number;
  colorName: string;
  colorHex: string;
  category: 'moss' | 'sun' | 'earth' | 'water';
}

const INITIAL_TILES: Tile[] = [
  { id: 1, colorName: 'Sunlight Cream', colorHex: '#F2D69B', category: 'sun' },
  { id: 2, colorName: 'Deep Pine', colorHex: '#29483A', category: 'moss' },
  { id: 3, colorName: 'Muted Terracotta', colorHex: '#C47D57', category: 'earth' },
  { id: 4, colorName: 'Clear Stream', colorHex: '#52796F', category: 'water' },
  { id: 5, colorName: 'Fresh Sprout', colorHex: '#8EBD78', category: 'moss' },
  { id: 6, colorName: 'Warm Clay', colorHex: '#A3603F', category: 'earth' },
];

export const ColorGardenGame: React.FC<ColorGardenGameProps> = ({ onExit }) => {
  const [boardTiles, setBoardTiles] = useState<Tile[]>(INITIAL_TILES);
  const [gardenBeds, setGardenBeds] = useState<{ [key: string]: Tile[] }>({
    moss: [],
    sun: [],
    earth: [],
    water: [],
  });
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);

  const handleTileClick = (tile: Tile) => {
    setSelectedTile(tile);
  };

  const handleBedClick = (category: 'moss' | 'sun' | 'earth' | 'water') => {
    if (!selectedTile) return;

    if (selectedTile.category === category) {
      // Correct gentle placement
      setGardenBeds((prev) => ({
        ...prev,
        [category]: [...prev[category], selectedTile],
      }));
      setBoardTiles((prev) => prev.filter((t) => t.id !== selectedTile.id));
      setSelectedTile(null);
    } else {
      // Gentle feedback: no penalty, just deselected
      setSelectedTile(null);
    }
  };

  const handleReset = () => {
    setBoardTiles(INITIAL_TILES);
    setGardenBeds({ moss: [], sun: [], earth: [], water: [] });
    setSelectedTile(null);
  };

  const isComplete = boardTiles.length === 0;

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border p-6 flex flex-col items-center max-w-xl mx-auto shadow-xs">
      <div className="w-full flex items-center justify-between pb-4 border-b border-brand-border mb-6">
        <button
          onClick={onExit}
          className="inline-flex items-center text-sm text-brand-secondary-text hover:text-brand-primary-text font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Reset Room
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center text-xs text-brand-secondary-text hover:text-brand-primary-text"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset Tiles
        </button>
      </div>

      <h3 className="text-lg font-semibold text-brand-primary-text mb-1">Color Garden</h3>
      <p className="text-xs text-brand-secondary-text max-w-md text-center mb-6">
        Gently sort the nature color tiles into their matching beds. There are no timers or mistakes.
      </p>

      {/* Unsorted Tiles Pool */}
      <div className="w-full bg-brand-soft-leaf/60 p-4 rounded-card border border-brand-border mb-6 min-h-[90px] flex flex-wrap gap-3 items-center justify-center">
        {boardTiles.length === 0 ? (
          <div className="flex items-center text-brand-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Garden colors gathered harmoniously.
          </div>
        ) : (
          boardTiles.map((tile) => {
            const isSelected = selectedTile?.id === tile.id;
            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={`px-3 py-2 rounded-control text-xs font-medium flex items-center space-x-2 transition-all border ${
                  isSelected
                    ? 'ring-2 ring-brand-interactive border-brand-deep-forest scale-105'
                    : 'border-brand-border hover:scale-102 bg-brand-surface'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full shadow-inner inline-block"
                  style={{ backgroundColor: tile.colorHex }}
                />
                <span className="text-brand-primary-text">{tile.colorName}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Target Garden Beds */}
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        {/* Moss bed */}
        <div
          onClick={() => handleBedClick('moss')}
          className={`p-3.5 rounded-card border border-dashed cursor-pointer transition-colors ${
            selectedTile?.category === 'moss'
              ? 'border-brand-fresh-leaf bg-brand-fresh-leaf/10'
              : 'border-brand-border bg-brand-bg/50 hover:bg-brand-soft-leaf/40'
          }`}
        >
          <div className="text-xs font-semibold text-brand-deep-forest mb-2 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-fresh-leaf mr-1.5" />
            Meadow & Moss
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px]">
            {gardenBeds.moss.map((t) => (
              <span
                key={t.id}
                className="text-[11px] px-2 py-0.5 rounded-control text-brand-deep-forest bg-brand-surface border border-brand-border"
              >
                {t.colorName}
              </span>
            ))}
          </div>
        </div>

        {/* Sunlight bed */}
        <div
          onClick={() => handleBedClick('sun')}
          className={`p-3.5 rounded-card border border-dashed cursor-pointer transition-colors ${
            selectedTile?.category === 'sun'
              ? 'border-brand-sunlight bg-brand-sunlight/15'
              : 'border-brand-border bg-brand-bg/50 hover:bg-brand-soft-leaf/40'
          }`}
        >
          <div className="text-xs font-semibold text-brand-warning mb-2 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-sunlight mr-1.5" />
            Sunlight & Dawn
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px]">
            {gardenBeds.sun.map((t) => (
              <span
                key={t.id}
                className="text-[11px] px-2 py-0.5 rounded-control text-brand-primary-text bg-brand-surface border border-brand-border"
              >
                {t.colorName}
              </span>
            ))}
          </div>
        </div>

        {/* Earth bed */}
        <div
          onClick={() => handleBedClick('earth')}
          className={`p-3.5 rounded-card border border-dashed cursor-pointer transition-colors ${
            selectedTile?.category === 'earth'
              ? 'border-brand-muted-clay bg-brand-muted-clay/10'
              : 'border-brand-border bg-brand-bg/50 hover:bg-brand-soft-leaf/40'
          }`}
        >
          <div className="text-xs font-semibold text-brand-muted-clay mb-2 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-muted-clay mr-1.5" />
            Clay & Soil
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px]">
            {gardenBeds.earth.map((t) => (
              <span
                key={t.id}
                className="text-[11px] px-2 py-0.5 rounded-control text-brand-primary-text bg-brand-surface border border-brand-border"
              >
                {t.colorName}
              </span>
            ))}
          </div>
        </div>

        {/* Water bed */}
        <div
          onClick={() => handleBedClick('water')}
          className={`p-3.5 rounded-card border border-dashed cursor-pointer transition-colors ${
            selectedTile?.category === 'water'
              ? 'border-brand-interactive bg-brand-interactive/10'
              : 'border-brand-border bg-brand-bg/50 hover:bg-brand-soft-leaf/40'
          }`}
        >
          <div className="text-xs font-semibold text-brand-interactive mb-2 flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-interactive mr-1.5" />
            Stream & River
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px]">
            {gardenBeds.water.map((t) => (
              <span
                key={t.id}
                className="text-[11px] px-2 py-0.5 rounded-control text-brand-primary-text bg-brand-surface border border-brand-border"
              >
                {t.colorName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isComplete ? (
        <button
          onClick={onExit}
          className="px-4 py-2 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control text-sm font-medium transition-colors"
        >
          Return to Reset Room
        </button>
      ) : (
        <div className="text-xs text-brand-secondary-text">
          {selectedTile ? `Selected: ${selectedTile.colorName}. Now click its matching garden bed above.` : 'Click any color tile to pick it up.'}
        </div>
      )}
    </div>
  );
};
