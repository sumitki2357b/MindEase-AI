import React from 'react';
import {
  Task,
  EnergyLevel,
  NavigationTab,
  ForestItem,
  DifficultyType
} from '../types';
import { EnergySelector } from '../components/EnergySelector';
import { ForestIllustration } from '../components/illustrations/ForestIllustration';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Compass,
  BookOpen,
  ArrowRight,
  Sparkles,
  Plus,
  Play,
  RotateCcw
} from 'lucide-react';

interface OverviewPageProps {
  tasks: Task[];
  energy: EnergyLevel;
  onSelectEnergy: (e: EnergyLevel) => void;
  onToggleTaskComplete: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onNavigate: (tab: NavigationTab) => void;
  onOpenIntervention: (task?: Task | null) => void;
  forestItems: ForestItem[];
  stuckRadarActive: boolean;
  onOpenStory: (storyId?: string) => void;
  isSampleDataActive: boolean;
  onClearSampleData: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  tasks,
  energy,
  onSelectEnergy,
  onToggleTaskComplete,
  onStartFocus,
  onNavigate,
  onOpenIntervention,
  forestItems,
  stuckRadarActive,
  onOpenStory,
  isSampleDataActive,
  onClearSampleData,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const openTasks = tasks.filter((t) => t.status !== 'completed');
  const totalPlannedMinutes = openTasks.reduce((acc, t) => acc + t.estimated_duration, 0);

  // Next recommended task based on scheduled_order or open priority
  const nextTask = openTasks.length > 0 ? openTasks[0] : null;

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
            Your overview
          </h2>
          <p className="text-xs text-brand-secondary-text mt-0.5">
            Here's your plan for today. You can adjust it anytime.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isSampleDataActive && (
            <button
              onClick={onClearSampleData}
              className="text-xs text-brand-secondary-text hover:text-brand-error px-2.5 py-1.5 rounded-control border border-brand-border bg-brand-surface"
            >
              Remove sample tasks
            </button>
          )}
          <button
            onClick={() => onNavigate('tasks')}
            className="inline-flex items-center text-xs font-medium px-3 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New task
          </button>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-brand-surface p-4 rounded-card border border-brand-border shadow-2xs">
          <span className="text-xs text-brand-secondary-text block mb-1">Completed today</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold text-brand-primary-text">{completedTasks.length}</span>
            <span className="text-xs text-brand-secondary-text">of {tasks.length}</span>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-card border border-brand-border shadow-2xs">
          <span className="text-xs text-brand-secondary-text block mb-1">Total open tasks</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold text-brand-primary-text">{openTasks.length}</span>
            <span className="text-xs text-brand-secondary-text">pending</span>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-card border border-brand-border shadow-2xs">
          <span className="text-xs text-brand-secondary-text block mb-1">Planned focus time</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold text-brand-primary-text">{totalPlannedMinutes}</span>
            <span className="text-xs text-brand-secondary-text">minutes</span>
          </div>
        </div>

        <div className="bg-brand-surface p-4 rounded-card border border-brand-border shadow-2xs">
          <span className="text-xs text-brand-secondary-text block mb-1">Observer status</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-fresh-leaf animate-pulse" />
            <span className="text-xs font-semibold text-brand-deep-forest">
              {stuckRadarActive ? 'Stuck Radar active' : 'Radar ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Tasks & Timeline, Right = Radar, Stories, Forest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Energy Section */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-secondary-text">
                Current Energy Level
              </span>
              <span className="text-[11px] text-brand-secondary-text">
                Used to adapt suggestions and planning pace
              </span>
            </div>
            <EnergySelector energy={energy} onSelectEnergy={onSelectEnergy} />
          </div>

          {/* Today's Tasks List */}
          <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
            <div className="p-4 border-b border-brand-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-brand-primary-text">Today's Tasks</h3>
                <p className="text-xs text-brand-secondary-text">
                  Prioritized to support manageable, low-friction initiation.
                </p>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-brand-interactive hover:underline font-medium"
              >
                View all ({tasks.length})
              </button>
            </div>

            {openTasks.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-brand-fresh-leaf mx-auto mb-2" />
                <p className="text-sm font-medium text-brand-primary-text">All tasks completed!</p>
                <p className="text-xs text-brand-secondary-text mt-1">
                  Enjoy some calm downtime in the Reset Room.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-brand-border">
                {openTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 hover:bg-brand-bg/50 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <button
                        onClick={() => onToggleTaskComplete(task.id)}
                        className="mt-0.5 text-brand-secondary-text hover:text-brand-success transition-colors shrink-0"
                        title="Mark complete"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-brand-primary-text truncate">
                            {task.title}
                          </span>
                          {task.is_sample && (
                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded-xs bg-brand-soft-leaf text-brand-secondary-text border border-brand-border">
                              Sample
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-brand-secondary-text mt-0.5">
                          <span className="font-medium text-brand-deep-forest/80">{task.subject}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {task.estimated_duration}m
                          </span>
                          {task.deadline && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {task.deadline}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => onOpenIntervention(task)}
                        className="text-[11px] px-2.5 py-1 text-brand-deep-forest bg-brand-soft-leaf hover:bg-brand-fresh-leaf/20 rounded-control border border-brand-border font-medium flex items-center"
                        title="Open supportive intervention"
                      >
                        <Sparkles className="w-3 h-3 mr-1 text-brand-interactive" />
                        Help me start
                      </button>
                      <button
                        onClick={() => onStartFocus(task)}
                        className="text-[11px] px-2.5 py-1 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium flex items-center"
                        title="Start focus block"
                      >
                        <Play className="w-3 h-3 mr-1 fill-current" />
                        Focus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Today's Timeline View */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border">
            <h3 className="text-sm font-semibold text-brand-primary-text mb-1">
              Adaptive Schedule Sequence
            </h3>
            <p className="text-xs text-brand-secondary-text mb-4">
              Flexible blocks arranged around your energy and deadlines.
            </p>

            <div className="space-y-2.5">
              {openTasks.slice(0, 3).map((t, index) => (
                <div
                  key={t.id}
                  className="flex items-center p-2.5 rounded-control bg-brand-bg/60 border border-brand-border text-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-brand-soft-leaf font-bold text-brand-deep-forest flex items-center justify-center mr-3 shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-brand-primary-text truncate block">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-brand-secondary-text">
                      {t.subject} • {t.estimated_duration} mins
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-brand-deep-forest px-2 py-0.5 rounded-control bg-brand-soft-leaf">
                    {index === 0 ? 'Next Up' : 'Later'}
                  </span>
                </div>
              ))}
              {openTasks.length === 0 && (
                <p className="text-xs text-brand-secondary-text italic">
                  No upcoming timeline blocks. Add tasks to see a suggested sequence.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Stuck Radar, Mind Story Card, Forest Garden */}
        <div className="space-y-6">
          {/* Stuck Radar Status Card */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border">
            <div className="flex items-center space-x-2 text-brand-deep-forest mb-2">
              <Compass className="w-4 h-4 text-brand-interactive" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-primary-text">
                Stuck Radar
              </h3>
            </div>
            <p className="text-xs text-brand-secondary-text leading-relaxed mb-3">
              A transparent in-app observer. If you pause or encounter friction during a study block,
              it offers a low-pressure check-in.
            </p>
            <div className="bg-brand-soft-leaf/60 p-2.5 rounded-control text-[11px] text-brand-deep-forest mb-3 border border-brand-border">
              <span className="font-semibold">Observation basis: </span>
              In-app interaction pauses (120s threshold). Never analyzes webcam, voice, or private data.
            </div>
            <button
              onClick={() => onOpenIntervention(nextTask)}
              className="w-full text-xs font-medium py-2 px-3 bg-brand-surface hover:bg-brand-soft-leaf border border-brand-border rounded-control text-brand-primary-text transition-colors flex items-center justify-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-interactive" />
              Voluntary Check-in
            </button>
          </div>

          {/* Mind Stories Feature Card */}
          <div className="bg-gradient-to-br from-brand-surface to-brand-soft-leaf/40 p-4.5 rounded-card border border-brand-border shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-interactive">
                Mind Story for You
              </span>
              <span className="text-[11px] text-brand-secondary-text">2 min read</span>
            </div>
            <h4 className="text-sm font-bold text-brand-primary-text mb-1">
              The Seed and the Rock
            </h4>
            <p className="text-xs text-brand-secondary-text leading-relaxed mb-4">
              "You don't always have to remove the obstacle. Sometimes you can change your approach."
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenStory('story_seed_rock')}
                className="flex-1 inline-flex items-center justify-center text-xs font-medium py-2 px-3 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                Read Story
              </button>
              <button
                onClick={() => onNavigate('stories')}
                className="inline-flex items-center justify-center text-xs font-medium py-2 px-3 border border-brand-border hover:bg-brand-surface rounded-control text-brand-secondary-text hover:text-brand-primary-text transition-colors"
              >
                All Stories
              </button>
            </div>
          </div>

          {/* Forest Garden Preview Card */}
          <div className="bg-brand-surface p-4 rounded-card border border-brand-border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-primary-text">
                Your Personal Forest
              </h3>
              <span className="text-[11px] text-brand-secondary-text">
                {forestItems.length} elements
              </span>
            </div>
            <div className="mb-3">
              <ForestIllustration
                items={forestItems}
                onAddItem={() => {}}
                onClearGarden={() => {}}
                compact={true}
              />
            </div>
            <p className="text-[11px] text-brand-secondary-text mb-3 leading-relaxed">
              Symbolic leaves and blossoms added when you mark personal progress. Plants never die when rest is needed.
            </p>
            <button
              onClick={() => onNavigate('reset')}
              className="w-full text-xs font-medium py-2 px-3 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest border border-brand-border rounded-control transition-colors flex items-center justify-center"
            >
              Explore Reset Room & Games
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
