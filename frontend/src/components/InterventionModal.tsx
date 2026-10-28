import React, { useState } from 'react';
import {
  DifficultyType,
  EnergyLevel,
  Task,
  InterventionResponse,
  FeedbackCategory
} from '../types';
import { fetchIntervention } from '../services/api';
import {
  X,
  Sparkles,
  BookOpen,
  Coffee,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  Lightbulb,
  Cpu
} from 'lucide-react';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask?: Task | null;
  currentEnergy: EnergyLevel;
  onNavigateToStories: (difficulty: DifficultyType) => void;
  onNavigateToResetRoom: () => void;
  onSaveFeedback: (strategyId: string, difficulty: string, feedback: FeedbackCategory) => void;
}

const DIFFICULTIES: { type: DifficultyType; label: string; icon: string }[] = [
  { type: 'beginning', label: "I don't know how to begin", icon: '🌱' },
  { type: 'overwhelm', label: 'The task feels overwhelming', icon: '🌊' },
  { type: 'perfectionism', label: "I'm afraid of getting it wrong", icon: '🎯' },
  { type: 'distraction', label: "I'm distracted", icon: '🍃' },
  { type: 'low_energy', label: "I'm mentally tired", icon: '🔋' },
  { type: 'ineffective_approach', label: "My current approach isn't working", icon: '🔄' },
  { type: 'break', label: 'I need a break', icon: '☕' },
  { type: 'something_else', label: 'Something else', icon: '💬' },
];

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  activeTask,
  currentEnergy,
  onNavigateToStories,
  onNavigateToResetRoom,
  onSaveFeedback,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType | null>(null);
  const [userNote, setUserNote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [intervention, setIntervention] = useState<InterventionResponse | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<FeedbackCategory | null>(null);

  if (!isOpen) return null;

  const handleSelectDifficulty = async (diff: DifficultyType) => {
    setSelectedDifficulty(diff);
    setLoading(true);
    setIntervention(null);
    setFeedbackGiven(null);

    const result = await fetchIntervention(diff, currentEnergy, activeTask, userNote);
    setIntervention(result);
    setLoading(false);
  };

  const handleMakeItEasier = async () => {
    if (!selectedDifficulty) return;
    setLoading(true);
    const result = await fetchIntervention(
      selectedDifficulty,
      'low', // force lowest friction
      activeTask,
      (userNote ? userNote + ' ' : '') + 'Please make the initial action even smaller and lower friction.'
    );
    setIntervention(result);
    setLoading(false);
  };

  const handleFeedback = (category: FeedbackCategory) => {
    setFeedbackGiven(category);
    if (intervention && intervention.strategy_ids.length > 0 && selectedDifficulty) {
      onSaveFeedback(intervention.strategy_ids[0], selectedDifficulty, category);
    }
  };

  const handleResetModal = () => {
    setSelectedDifficulty(null);
    setIntervention(null);
    setUserNote('');
    setFeedbackGiven(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-text/45 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-brand-surface rounded-card border border-brand-border shadow-xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-control bg-brand-soft-leaf flex items-center justify-center text-brand-interactive">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-brand-primary-text">
                MindEase Intervention
              </h3>
              <p className="text-xs text-brand-secondary-text">
                {activeTask ? `Active Task: ${activeTask.title}` : 'Discover an approachable next step'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-brand-secondary-text hover:text-brand-primary-text p-1.5 rounded-control"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {!intervention ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-brand-primary-text mb-2 uppercase tracking-wider">
                  What feels difficult right now?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.type}
                      onClick={() => handleSelectDifficulty(d.type)}
                      disabled={loading}
                      className="p-3 text-left rounded-control border border-brand-border hover:border-brand-interactive hover:bg-brand-soft-leaf/40 text-brand-primary-text text-xs font-medium transition-all flex items-center space-x-2.5 group"
                    >
                      <span className="text-lg">{d.icon}</span>
                      <span className="flex-1 group-hover:text-brand-deep-forest">{d.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-brand-border group-hover:text-brand-interactive transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional brief note */}
              <div>
                <label className="block text-xs font-medium text-brand-secondary-text mb-1">
                  Optional note (e.g. "chapter 4 formulas", "stuck on intro paragraph"):
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="A few words about where things stand..."
                  className="w-full text-xs px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/50"
                  maxLength={160}
                />
              </div>

              {loading && (
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <div className="w-6 h-6 border-2 border-brand-interactive border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-xs text-brand-secondary-text">
                    Consulting RAG strategies & formulating guidance...
                  </p>
                </div>
              )}
            </>
          ) : (
            /* Render Generated Intervention */
            <div className="space-y-4">
              {/* Badge for Gemini or Local RAG source */}
              <div className="flex items-center justify-between text-[11px] pb-2 border-b border-brand-border">
                <span className="inline-flex items-center px-2 py-0.5 rounded-control bg-brand-soft-leaf text-brand-deep-forest font-medium border border-brand-border">
                  <Cpu className="w-3 h-3 mr-1 text-brand-interactive" />
                  Source: {intervention.generation_source === 'gemini' ? 'Google Gemini' : 'Built-in Knowledge Guidance'}
                </span>
                <button
                  onClick={handleResetModal}
                  className="text-brand-secondary-text hover:text-brand-primary-text font-medium"
                >
                  Change obstacle
                </button>
              </div>

              {/* Compassionate Acknowledgement */}
              <div className="bg-brand-soft-leaf/40 p-3.5 rounded-card border border-brand-border">
                <p className="text-xs text-brand-primary-text leading-relaxed italic">
                  "{intervention.acknowledgement}"
                </p>
              </div>

              {/* Concrete Practical Action */}
              <div className="bg-brand-surface p-4 rounded-card border-2 border-brand-fresh-leaf/40 shadow-xs">
                <div className="flex items-center space-x-2 text-brand-deep-forest mb-2">
                  <Lightbulb className="w-4 h-4 text-brand-warning" />
                  <h4 className="text-sm font-semibold text-brand-primary-text">
                    {intervention.action_title}
                  </h4>
                </div>
                <ul className="space-y-2 mb-3">
                  {intervention.action_steps.map((step, idx) => (
                    <li key={idx} className="text-xs text-brand-primary-text flex items-start space-x-2">
                      <span className="w-4 h-4 rounded-full bg-brand-soft-leaf text-brand-deep-forest font-semibold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-[11px] text-brand-secondary-text bg-brand-bg/60 p-2 rounded-control border border-brand-border/60">
                  <span className="font-medium text-brand-primary-text">Why this fits: </span>
                  {intervention.why_this_fits}
                </div>
              </div>

              {/* Retrieved RAG References */}
              {intervention.retrieved_strategies && intervention.retrieved_strategies.length > 0 && (
                <div className="text-[11px] text-brand-secondary-text">
                  <span className="font-semibold text-brand-primary-text">RAG Strategy Anchor: </span>
                  {intervention.retrieved_strategies.map(s => s.title).join(' • ')}
                </div>
              )}

              {/* Optional Did This Help Feedback */}
              <div className="pt-2 border-t border-brand-border">
                <span className="text-xs font-medium text-brand-primary-text block mb-1.5">
                  Did this help?
                </span>
                {feedbackGiven ? (
                  <div className="text-xs text-brand-success flex items-center font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Thank you. Your feedback refines future suggestions.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <button
                      onClick={() => handleFeedback('yes')}
                      className="px-2.5 py-1 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control border border-brand-border"
                    >
                      Yes, that helped
                    </button>
                    <button
                      onClick={() => handleFeedback('a_little')}
                      className="px-2.5 py-1 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control border border-brand-border"
                    >
                      A little
                    </button>
                    <button
                      onClick={() => handleFeedback('no')}
                      className="px-2.5 py-1 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control border border-brand-border"
                    >
                      No, try something different
                    </button>
                    <button
                      onClick={() => handleFeedback('rest_instead')}
                      className="px-2.5 py-1 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest rounded-control border border-brand-border"
                    >
                      I needed rest instead
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer / Alternate Paths */}
        <div className="p-4 border-t border-brand-border bg-brand-bg/40 flex flex-wrap items-center justify-between gap-2">
          {intervention && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMakeItEasier}
                disabled={loading}
                className="text-xs px-3 py-1.5 border border-brand-border bg-brand-surface hover:bg-brand-soft-leaf rounded-control text-brand-primary-text font-medium flex items-center"
              >
                <RefreshCw className="w-3 h-3 mr-1 text-brand-secondary-text" />
                Make it easier
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (selectedDifficulty) onNavigateToStories(selectedDifficulty);
                }}
                className="text-xs px-3 py-1.5 border border-brand-border bg-brand-surface hover:bg-brand-soft-leaf rounded-control text-brand-primary-text font-medium flex items-center"
              >
                <BookOpen className="w-3 h-3 mr-1 text-brand-interactive" />
                Hear a story
              </button>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToResetRoom();
                }}
                className="text-xs px-3 py-1.5 border border-brand-border bg-brand-surface hover:bg-brand-soft-leaf rounded-control text-brand-primary-text font-medium flex items-center"
              >
                <Coffee className="w-3 h-3 mr-1 text-brand-muted-clay" />
                Visit Reset Room
              </button>
            </div>
          )}
          <div className="ml-auto">
            <button
              onClick={onClose}
              className="text-xs px-4 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium transition-colors"
            >
              {intervention ? 'Try this' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
