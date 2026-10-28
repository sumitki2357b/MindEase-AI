import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';

interface BreatheBloomGameProps {
  onExit: () => void;
}

export const BreatheBloomGame: React.FC<BreatheBloomGameProps> = ({ onExit }) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phase, setPhase] = useState<'Inhale gently' | 'Hold softly' | 'Exhale slowly' | 'Rest'>('Inhale gently');
  const [secondsLeft, setSecondsLeft] = useState<number>(75);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!isActive) return;

    // 4-phase gentle breathing cycle (4s in, 3s hold, 5s out, 2s rest = 14s total)
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const cycleSeconds = 14;
    const elapsedInCycle = (75 - secondsLeft) % cycleSeconds;

    if (elapsedInCycle < 4) {
      setPhase('Inhale gently');
      setScale(1 + (elapsedInCycle / 4) * 0.45);
    } else if (elapsedInCycle < 7) {
      setPhase('Hold softly');
      setScale(1.45);
    } else if (elapsedInCycle < 12) {
      setPhase('Exhale slowly');
      const exhaleProgress = (elapsedInCycle - 7) / 5;
      setScale(1.45 - exhaleProgress * 0.45);
    } else {
      setPhase('Rest');
      setScale(1.0);
    }
  }, [secondsLeft, isActive]);

  const handleReset = () => {
    setSecondsLeft(75);
    setIsActive(true);
  };

  return (
    <div className="bg-brand-surface rounded-card border border-brand-border p-6 flex flex-col items-center max-w-xl mx-auto shadow-xs text-center">
      <div className="w-full flex items-center justify-between pb-4 border-b border-brand-border mb-6">
        <button
          onClick={onExit}
          className="inline-flex items-center text-sm text-brand-secondary-text hover:text-brand-primary-text font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Reset Room
        </button>
        <span className="text-xs bg-brand-soft-leaf text-brand-deep-forest px-2.5 py-1 rounded-control font-medium">
          {secondsLeft}s gentle rhythm
        </span>
      </div>

      <h3 className="text-lg font-semibold text-brand-primary-text mb-1">Breathe & Bloom</h3>
      <p className="text-xs text-brand-secondary-text max-w-md mb-8">
        Follow the natural blooming rhythm if you like, or simply watch the petals expand and soften at your own pace.
      </p>

      {/* Flower Petal Visual Container */}
      <div className="relative w-64 h-64 flex items-center justify-center my-4">
        {/* Soft background aura */}
        <div
          className="absolute inset-4 rounded-full bg-brand-sky-mist transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale * 0.9})` }}
        />

        {/* Animated Flower SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-56 h-56 transition-transform duration-1000 ease-in-out"
          style={{ transform: `scale(${scale})` }}
        >
          {/* Petals */}
          <circle cx="100" cy="55" r="30" fill="#8EBD78" opacity="0.85" />
          <circle cx="145" cy="80" r="30" fill="#8EBD78" opacity="0.85" />
          <circle cx="145" cy="130" r="30" fill="#8EBD78" opacity="0.85" />
          <circle cx="100" cy="155" r="30" fill="#8EBD78" opacity="0.85" />
          <circle cx="55" cy="130" r="30" fill="#8EBD78" opacity="0.85" />
          <circle cx="55" cy="80" r="30" fill="#8EBD78" opacity="0.85" />
          {/* Inner Petal Ring */}
          <circle cx="100" cy="75" r="20" fill="#F2D69B" opacity="0.9" />
          <circle cx="125" cy="100" r="20" fill="#F2D69B" opacity="0.9" />
          <circle cx="100" cy="125" r="20" fill="#F2D69B" opacity="0.9" />
          <circle cx="75" cy="100" r="20" fill="#F2D69B" opacity="0.9" />
          {/* Flower Center */}
          <circle cx="100" cy="100" r="18" fill="#C47D57" />
        </svg>

        {/* Center label */}
        <div className="absolute text-center pointer-events-none">
          <span className="text-xs uppercase tracking-wider font-semibold text-brand-surface drop-shadow-xs">
            {phase}
          </span>
        </div>
      </div>

      <div className="text-sm font-medium text-brand-primary-text mb-6 h-6">
        {phase}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className="inline-flex items-center px-4 py-2 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control text-sm font-medium transition-colors"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 mr-1.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-1.5" />
              Resume
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center px-3.5 py-2 border border-brand-border hover:bg-brand-soft-leaf text-brand-primary-text rounded-control text-sm font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-1.5 text-brand-secondary-text" />
          Restart
        </button>
      </div>
    </div>
  );
};
