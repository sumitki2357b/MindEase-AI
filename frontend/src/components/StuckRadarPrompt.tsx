import React from 'react';
import { Sparkles, X, ArrowRight, Coffee, Compass } from 'lucide-react';

interface StuckRadarPromptProps {
  isOpen: boolean;
  explanation: string;
  onKeepGoing: () => void;
  onChangeApproach: () => void;
  onTakeBreak: () => void;
  onDismiss: () => void;
}

export const StuckRadarPrompt: React.FC<StuckRadarPromptProps> = ({
  isOpen,
  explanation,
  onKeepGoing,
  onChangeApproach,
  onTakeBreak,
  onDismiss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-brand-surface rounded-card border border-brand-border shadow-lg p-4.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-brand-soft-leaf flex items-center justify-center text-brand-interactive">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-deep-forest">
            Stuck Radar Check-in
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="text-brand-secondary-text hover:text-brand-primary-text p-1 -mr-1"
          aria-label="Dismiss check-in"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-sm font-semibold text-brand-primary-text mb-1">
        Would a different approach help right now?
      </h4>
      <p className="text-xs text-brand-secondary-text mb-4 leading-relaxed">
        {explanation || 'Offered after an observable pause during your focus block.'}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={onChangeApproach}
          className="flex items-center justify-center px-3 py-2 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Change approach
        </button>
        <button
          onClick={onTakeBreak}
          className="flex items-center justify-center px-3 py-2 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control font-medium border border-brand-border transition-colors"
        >
          <Coffee className="w-3.5 h-3.5 mr-1.5 text-brand-muted-clay" />
          Take a break
        </button>
        <button
          onClick={onKeepGoing}
          className="flex items-center justify-center px-3 py-1.5 border border-brand-border hover:bg-brand-bg text-brand-primary-text rounded-control font-medium transition-colors"
        >
          Keep going
        </button>
        <button
          onClick={onDismiss}
          className="flex items-center justify-center px-3 py-1.5 text-brand-secondary-text hover:text-brand-primary-text rounded-control transition-colors"
        >
          Not now
        </button>
      </div>
    </div>
  );
};
