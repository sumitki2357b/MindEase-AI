import React, { useState } from 'react';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

interface PatternPauseGameProps {
  onExit: () => void;
}

interface ShapeItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const SHAPES: ShapeItem[] = [
  { id: 'leaf', name: 'Fresh Leaf', icon: '🍃', color: '#8EBD78' },
  { id: 'sun', name: 'Warm Sun', icon: '☀️', color: '#F2D69B' },
  { id: 'water', name: 'Gentle Drop', icon: '💧', color: '#52796F' },
  { id: 'stone', name: 'River Stone', icon: '🪨', color: '#747C75' },
];

export const PatternPauseGame: React.FC<PatternPauseGameProps> = ({ onExit }) => {
  const [sequence, setSequence] = useState<string[]>(['leaf', 'sun', 'water']);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [userStep, setUserStep] = useState<number>(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('Press "Show Pattern" to watch the gentle rhythm.');

  const playSequence = () => {
    setIsPlayingSeq(true);
    setUserStep(0);
    setFeedbackMsg('Observing the pattern...');

    sequence.forEach((item, index) => {
      setTimeout(() => {
        setActiveHighlight(item);
      }, (index + 1) * 700);

      setTimeout(() => {
        setActiveHighlight(null);
        if (index === sequence.length - 1) {
          setIsPlayingSeq(false);
          setFeedbackMsg('Your turn — tap the shapes in the same order.');
        }
      }, (index + 1) * 700 + 450);
    });
  };

  const handleShapeClick = (shapeId: string) => {
    if (isPlayingSeq) return;

    setActiveHighlight(shapeId);
    setTimeout(() => setActiveHighlight(null), 300);

    if (shapeId === sequence[userStep]) {
      const nextStep = userStep + 1;
      if (nextStep === sequence.length) {
        setFeedbackMsg('Beautifully recalled. Would you like to try another pattern or return?');
        setUserStep(0);
      } else {
        setUserStep(nextStep);
      }
    } else {
      // Gentle, supportive message without penalty
      setFeedbackMsg('No rush at all. You can watch the pattern again whenever you wish.');
      setUserStep(0);
    }
  };

  const generateNewSequence = () => {
    const pool = ['leaf', 'sun', 'water', 'stone'];
    const newSeq = [
      pool[Math.floor(Math.random() * pool.length)],
      pool[Math.floor(Math.random() * pool.length)],
      pool[Math.floor(Math.random() * pool.length)],
    ];
    setSequence(newSeq);
    setUserStep(0);
    setFeedbackMsg('New pattern prepared. Click "Show Pattern" when ready.');
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
        <button
          onClick={generateNewSequence}
          className="inline-flex items-center text-xs text-brand-secondary-text hover:text-brand-primary-text"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          New Pattern
        </button>
      </div>

      <h3 className="text-lg font-semibold text-brand-primary-text mb-1">Pattern Pause</h3>
      <p className="text-xs text-brand-secondary-text max-w-md mb-6">
        A tranquil memory pause. Notice the glowing shapes and repeat them gently. Mistakes carry zero penalty.
      </p>

      {/* Status banner */}
      <div className="bg-brand-soft-leaf/60 text-brand-deep-forest px-4 py-2 rounded-control text-xs font-medium mb-8 border border-brand-border min-h-[36px] flex items-center justify-center">
        {feedbackMsg}
      </div>

      {/* 4 Shape Tiles */}
      <div className="grid grid-cols-2 gap-4 w-64 mb-8">
        {SHAPES.map((shape) => {
          const isLit = activeHighlight === shape.id;
          return (
            <button
              key={shape.id}
              onClick={() => handleShapeClick(shape.id)}
              disabled={isPlayingSeq}
              className={`h-24 rounded-card border flex flex-col items-center justify-center p-3 transition-all duration-300 ${
                isLit
                  ? 'scale-105 ring-4 ring-brand-fresh-leaf border-brand-deep-forest bg-brand-soft-leaf'
                  : 'border-brand-border hover:bg-brand-soft-leaf/40 bg-brand-bg/40'
              }`}
            >
              <span className="text-3xl mb-1">{shape.icon}</span>
              <span className="text-[12px] font-medium text-brand-primary-text">{shape.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={playSequence}
          disabled={isPlayingSeq}
          className="inline-flex items-center px-4 py-2 bg-brand-interactive hover:bg-brand-interactive-hover disabled:opacity-50 text-brand-surface rounded-control text-sm font-medium transition-colors"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Show Pattern
        </button>
        <button
          onClick={onExit}
          className="inline-flex items-center px-4 py-2 border border-brand-border hover:bg-brand-soft-leaf text-brand-primary-text rounded-control text-sm font-medium transition-colors"
        >
          Return to Reset Room
        </button>
      </div>
    </div>
  );
};
