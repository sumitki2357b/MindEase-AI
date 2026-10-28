import React, { useState, useEffect } from 'react';
import { Task, EnergyLevel, NavigationTab } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Compass,
  Sparkles,
  Coffee,
  Clock,
  ArrowRight
} from 'lucide-react';

interface FocusRoomPageProps {
  activeTask: Task | null;
  tasks: Task[];
  energy: EnergyLevel;
  onSelectTask: (task: Task) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onOpenIntervention: (task?: Task | null) => void;
  onNavigateToReset: () => void;
  onNavigate: (tab: NavigationTab) => void;
  onAddForestProgress: () => void;
}

export const FocusRoomPage: React.FC<FocusRoomPageProps> = ({
  activeTask,
  tasks,
  energy,
  onSelectTask,
  onToggleTaskComplete,
  onOpenIntervention,
  onNavigateToReset,
  onNavigate,
  onAddForestProgress,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [sessionCompletedModal, setSessionCompletedModal] = useState<boolean>(false);

  // Restore task if none selected: default to first open task
  const openTasks = tasks.filter((t) => t.status !== 'completed');
  const currentTask = activeTask || (openTasks.length > 0 ? openTasks[0] : null);

  const targetMinutes = currentTask ? currentTask.estimated_duration : 25;
  const targetSeconds = targetMinutes * 60;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setElapsedSeconds(0);
  };

  const handleEndSession = () => {
    setIsRunning(false);
    setSessionCompletedModal(true);
  };

  const handleCompleteAndReward = () => {
    if (currentTask) {
      onToggleTaskComplete(currentTask.id);
      onAddForestProgress();
    }
    setSessionCompletedModal(false);
    setElapsedSeconds(0);
  };

  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
            Focus Room
          </h2>
          <p className="text-xs text-brand-secondary-text mt-0.5">
            A quiet, protected container. You remain in control of your pace at all times.
          </p>
        </div>
        {currentTask && (
          <span className="text-xs bg-brand-soft-leaf text-brand-deep-forest font-semibold px-3 py-1.5 rounded-control border border-brand-border self-start">
            Target: {currentTask.estimated_duration} mins
          </span>
        )}
      </div>

      {/* Main Focus Container */}
      <div className="bg-brand-surface rounded-card border border-brand-border p-6 sm:p-8 shadow-xs text-center flex flex-col items-center">
        {/* Task Title & Subject Pill */}
        {currentTask ? (
          <div className="mb-6 max-w-lg">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-control bg-brand-soft-leaf/80 text-brand-deep-forest border border-brand-border mb-2 inline-block">
              {currentTask.subject}
            </span>
            <h3 className="text-xl font-bold text-brand-primary-text tracking-tight">
              {currentTask.title}
            </h3>
            {currentTask.description && (
              <p className="text-xs text-brand-secondary-text mt-1.5 leading-relaxed">
                {currentTask.description}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6">
            <h3 className="text-base font-semibold text-brand-primary-text mb-2">
              Select a task to begin focus
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {openTasks.slice(0, 3).map((t) => (
                <button
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  className="text-xs px-3 py-1.5 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 rounded-control text-brand-deep-forest font-medium border border-brand-border"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Circular Progress & Timer Display */}
        <div className="relative w-64 h-64 my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="128"
              cy="128"
              r="105"
              stroke="#DEE2DC"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress ring */}
            <circle
              cx="128"
              cy="128"
              r="105"
              stroke="#52796F"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={2 * Math.PI * 105 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          {/* Center Timer Output */}
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-brand-primary-text tracking-tight">
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-xs text-brand-secondary-text mt-1 font-medium">
              {isRunning ? 'Focused Block' : elapsedSeconds > 0 ? 'Paused' : 'Ready'}
            </span>
            <span className="text-[11px] text-brand-fresh-leaf font-semibold mt-0.5">
              {progressPercent}% of target
            </span>
          </div>
        </div>

        {/* Primary Timer Controls */}
        <div className="flex items-center space-x-3 my-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center px-6 py-2.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control text-sm font-semibold shadow-xs transition-colors"
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              {elapsedSeconds > 0 ? 'Resume' : 'Start session'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center px-6 py-2.5 bg-brand-deep-forest hover:opacity-90 text-brand-surface rounded-control text-sm font-semibold shadow-xs transition-colors"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-2.5 border border-brand-border hover:bg-brand-soft-leaf/40 text-brand-secondary-text hover:text-brand-primary-text rounded-control transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {elapsedSeconds > 10 && (
            <button
              onClick={handleEndSession}
              className="px-4 py-2.5 border border-brand-border bg-brand-soft-leaf/60 hover:bg-brand-soft-leaf text-brand-deep-forest font-medium text-sm rounded-control transition-colors"
            >
              End session
            </button>
          )}
        </div>

        {/* Support Actions: Stuck Radar & Rest */}
        <div className="pt-6 border-t border-brand-border w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenIntervention(currentTask)}
            className="inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-control bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest border border-brand-fresh-leaf/40 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-interactive" />
            I'm feeling stuck
          </button>
          <button
            onClick={onNavigateToReset}
            className="inline-flex items-center text-xs font-medium px-3.5 py-2 rounded-control border border-brand-border hover:bg-brand-soft-leaf/40 text-brand-secondary-text hover:text-brand-primary-text transition-colors"
          >
            <Coffee className="w-3.5 h-3.5 mr-1.5 text-brand-muted-clay" />
            I need a break
          </button>
        </div>
      </div>

      {/* Transparent Observer Information */}
      <div className="bg-brand-surface p-4 rounded-card border border-brand-border flex items-start space-x-3 text-xs">
        <Compass className="w-4 h-4 text-brand-interactive shrink-0 mt-0.5" />
        <div className="text-brand-secondary-text leading-relaxed">
          <span className="font-semibold text-brand-primary-text">Observer Transparency: </span>
          Stuck Radar quietly monitors in-app interaction pauses (120s limit) to provide support when needed. It does not access your camera, audio, or private notes.
        </div>
      </div>

      {/* Post Session Modal */}
      {sessionCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-text/45 backdrop-blur-xs">
          <div className="bg-brand-surface rounded-card border border-brand-border p-6 max-w-md w-full shadow-xl animate-in fade-in text-center">
            <CheckCircle2 className="w-10 h-10 text-brand-fresh-leaf mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-primary-text mb-1">
              Focus Block Concluded
            </h3>
            <p className="text-xs text-brand-secondary-text mb-5 leading-relaxed">
              You dedicated {Math.round(elapsedSeconds / 60)} minutes to "{currentTask?.title}".
              How would you like to continue?
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={handleCompleteAndReward}
                className="w-full py-2.5 px-3 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface font-semibold rounded-control transition-colors flex items-center justify-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark task complete & plant flower
              </button>
              <button
                onClick={() => {
                  setSessionCompletedModal(false);
                  onNavigateToReset();
                }}
                className="w-full py-2 px-3 border border-brand-border hover:bg-brand-soft-leaf/50 text-brand-deep-forest font-medium rounded-control transition-colors"
              >
                Visit Reset Room for a gentle rest
              </button>
              <button
                onClick={() => {
                  setSessionCompletedModal(false);
                  setElapsedSeconds(0);
                }}
                className="w-full py-2 px-3 text-brand-secondary-text hover:text-brand-primary-text transition-colors"
              >
                Keep task open and return to overview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
