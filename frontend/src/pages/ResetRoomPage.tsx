import React, { useState } from 'react';
import { ForestItem, NavigationTab } from '../types';
import { ForestIllustration } from '../components/illustrations/ForestIllustration';
import { BreatheBloomGame } from '../components/games/BreatheBloomGame';
import { ColorGardenGame } from '../components/games/ColorGardenGame';
import { PatternPauseGame } from '../components/games/PatternPauseGame';
import { LittleZenGardenGame } from '../components/games/LittleZenGardenGame';
import {
  Sparkles,
  Wind,
  Palette,
  Compass,
  Smile,
  BookOpen,
  ArrowRight,
  Coffee
} from 'lucide-react';

interface ResetRoomPageProps {
  forestItems: ForestItem[];
  onAddForestItem: (type: 'flower' | 'stone' | 'leaf') => void;
  onClearForestGarden: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

type ActiveGame = 'none' | 'breathe' | 'color' | 'pattern' | 'zen';

export const ResetRoomPage: React.FC<ResetRoomPageProps> = ({
  forestItems,
  onAddForestItem,
  onClearForestGarden,
  onNavigate,
}) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  if (activeGame === 'breathe') {
    return <BreatheBloomGame onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'color') {
    return <ColorGardenGame onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'pattern') {
    return <PatternPauseGame onExit={() => setActiveGame('none')} />;
  }
  if (activeGame === 'zen') {
    return <LittleZenGardenGame onExit={() => setActiveGame('none')} />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
            Reset Room
          </h2>
          <p className="text-xs text-brand-secondary-text mt-0.5">
            A restorative space when you need mental clearing. Rest is part of continuing.
          </p>
        </div>
        <button
          onClick={() => onNavigate('focus')}
          className="inline-flex items-center text-xs font-medium px-3.5 py-1.5 bg-brand-surface hover:bg-brand-soft-leaf border border-brand-border text-brand-deep-forest rounded-control transition-colors self-start"
        >
          Return to Focus Room
          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </button>
      </div>

      {/* Interactive Forest Garden */}
      <div className="bg-brand-surface rounded-card border border-brand-border p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <div>
            <h3 className="text-sm font-semibold text-brand-primary-text">
              Your Personal Forest Clearing
            </h3>
            <p className="text-xs text-brand-secondary-text">
              Place peaceful stones and blossoms. Stored locally; no streaks or penalties.
            </p>
          </div>
          <span className="text-xs font-medium text-brand-deep-forest bg-brand-soft-leaf px-2.5 py-1 rounded-control border border-brand-border">
            {forestItems.length} garden elements
          </span>
        </div>

        <ForestIllustration
          items={forestItems}
          onAddItem={onAddForestItem}
          onClearGarden={onClearForestGarden}
          compact={false}
        />
      </div>

      {/* Mini-Games Section */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-interactive" />
          <h3 className="text-sm font-semibold text-brand-primary-text uppercase tracking-wider">
            Gentle Reset Activities
          </h3>
        </div>
        <p className="text-xs text-brand-secondary-text mb-4">
          Optional low-cognitive activities designed to relieve tension without forced competition or timers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Game A: Breathe & Bloom */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border flex flex-col justify-between hover:border-brand-interactive/50 transition-all shadow-xs group">
            <div>
              <div className="w-8 h-8 rounded-control bg-brand-soft-leaf flex items-center justify-center text-brand-interactive mb-3 group-hover:scale-105 transition-transform">
                <Wind className="w-4 h-4 text-brand-fresh-leaf" />
              </div>
              <h4 className="text-sm font-semibold text-brand-primary-text mb-1">
                Breathe & Bloom
              </h4>
              <p className="text-xs text-brand-secondary-text leading-relaxed mb-3">
                Watch gentle petals expand and contract. Follow the visual rhythm if you wish.
              </p>
              <span className="text-[11px] text-brand-secondary-text block mb-4">
                ~60–90 seconds
              </span>
            </div>
            <button
              onClick={() => setActiveGame('breathe')}
              className="w-full text-xs font-semibold py-2 px-3 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control transition-colors border border-brand-border"
            >
              Start Breathing
            </button>
          </div>

          {/* Game B: Color Garden */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border flex flex-col justify-between hover:border-brand-interactive/50 transition-all shadow-xs group">
            <div>
              <div className="w-8 h-8 rounded-control bg-brand-soft-leaf flex items-center justify-center text-brand-interactive mb-3 group-hover:scale-105 transition-transform">
                <Palette className="w-4 h-4 text-brand-sunlight" />
              </div>
              <h4 className="text-sm font-semibold text-brand-primary-text mb-1">
                Color Garden
              </h4>
              <p className="text-xs text-brand-secondary-text leading-relaxed mb-3">
                Gather serene forest palette tiles into matching beds. No penalties or timers.
              </p>
              <span className="text-[11px] text-brand-secondary-text block mb-4">
                ~1–2 minutes
              </span>
            </div>
            <button
              onClick={() => setActiveGame('color')}
              className="w-full text-xs font-semibold py-2 px-3 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control transition-colors border border-brand-border"
            >
              Open Garden
            </button>
          </div>

          {/* Game C: Pattern Pause */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border flex flex-col justify-between hover:border-brand-interactive/50 transition-all shadow-xs group">
            <div>
              <div className="w-8 h-8 rounded-control bg-brand-soft-leaf flex items-center justify-center text-brand-interactive mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4 text-brand-interactive" />
              </div>
              <h4 className="text-sm font-semibold text-brand-primary-text mb-1">
                Pattern Pause
              </h4>
              <p className="text-xs text-brand-secondary-text leading-relaxed mb-3">
                Follow an illuminated sequence of nature shapes. Gentle and zero pressure.
              </p>
              <span className="text-[11px] text-brand-secondary-text block mb-4">
                ~1–2 minutes
              </span>
            </div>
            <button
              onClick={() => setActiveGame('pattern')}
              className="w-full text-xs font-semibold py-2 px-3 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control transition-colors border border-brand-border"
            >
              Play Sequence
            </button>
          </div>

          {/* Game D: Little Zen Garden */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border flex flex-col justify-between hover:border-brand-interactive/50 transition-all shadow-xs group">
            <div>
              <div className="w-8 h-8 rounded-control bg-brand-soft-leaf flex items-center justify-center text-brand-interactive mb-3 group-hover:scale-105 transition-transform">
                <Smile className="w-4 h-4 text-brand-muted-clay" />
              </div>
              <h4 className="text-sm font-semibold text-brand-primary-text mb-1">
                Little Zen Garden
              </h4>
              <p className="text-xs text-brand-secondary-text leading-relaxed mb-3">
                Rake sand ripples and position river stones in a quiet, sandbox garden.
              </p>
              <span className="text-[11px] text-brand-secondary-text block mb-4">
                Open-ended sandbox
              </span>
            </div>
            <button
              onClick={() => setActiveGame('zen')}
              className="w-full text-xs font-semibold py-2 px-3 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control transition-colors border border-brand-border"
            >
              Rake Sand
            </button>
          </div>
        </div>
      </div>

      {/* Alternate Rest & Story Banner */}
      <div className="bg-gradient-to-r from-brand-soft-leaf/60 to-brand-surface p-4.5 rounded-card border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-brand-interactive shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-brand-primary-text">
              Looking for thoughtful reflection instead?
            </h4>
            <p className="text-xs text-brand-secondary-text">
              Listen to or read five original nature stories with takeaways and reflections.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('stories')}
          className="px-4 py-2 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface text-xs font-medium rounded-control transition-colors shrink-0"
        >
          Explore Mind Stories
        </button>
      </div>
    </div>
  );
};
