import React from 'react';
import { Task, EnergyLevel, InterventionFeedback } from '../types';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  BatteryMedium,
  ThumbsUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface InsightsPageProps {
  tasks: Task[];
  energy: EnergyLevel;
  feedbackHistory: InterventionFeedback[];
}

export const InsightsPage: React.FC<InsightsPageProps> = ({
  tasks,
  energy,
  feedbackHistory,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const openTasks = tasks.filter((t) => t.status !== 'completed');
  const completedMins = completedTasks.reduce((sum, t) => sum + t.estimated_duration, 0);

  // Group feedback by category
  const feedbackCounts = {
    yes: feedbackHistory.filter((f) => f.feedbackCategory === 'yes').length,
    a_little: feedbackHistory.filter((f) => f.feedbackCategory === 'a_little').length,
    no: feedbackHistory.filter((f) => f.feedbackCategory === 'no').length,
    rest_instead: feedbackHistory.filter((f) => f.feedbackCategory === 'rest_instead').length,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
          Insights & Strategy Feedback
        </h2>
        <p className="text-xs text-brand-secondary-text mt-0.5">
          Transparent metrics drawn solely from your local activity. No fabricated analytics.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-brand-surface p-4.5 rounded-card border border-brand-border shadow-xs">
          <div className="flex items-center space-x-2 text-brand-secondary-text mb-1 text-xs">
            <CheckCircle2 className="w-4 h-4 text-brand-success" />
            <span>Tasks Completed</span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold text-brand-primary-text">
              {completedTasks.length}
            </span>
            <span className="text-xs text-brand-secondary-text">of {tasks.length} total</span>
          </div>
        </div>

        <div className="bg-brand-surface p-4.5 rounded-card border border-brand-border shadow-xs">
          <div className="flex items-center space-x-2 text-brand-secondary-text mb-1 text-xs">
            <Clock className="w-4 h-4 text-brand-interactive" />
            <span>Completed Focus Time</span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-2xl font-bold text-brand-primary-text">{completedMins}</span>
            <span className="text-xs text-brand-secondary-text">minutes</span>
          </div>
        </div>

        <div className="bg-brand-surface p-4.5 rounded-card border border-brand-border shadow-xs">
          <div className="flex items-center space-x-2 text-brand-secondary-text mb-1 text-xs">
            <BatteryMedium className="w-4 h-4 text-brand-fresh-leaf" />
            <span>Current Energy Mode</span>
          </div>
          <div className="flex items-baseline space-x-1.5 mt-1">
            <span className="text-xl font-bold text-brand-primary-text capitalize">
              {energy}
            </span>
            <span className="text-xs text-brand-secondary-text">capacity</span>
          </div>
        </div>
      </div>

      {/* Intervention Strategy Helpfulness History */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border">
        <div className="flex items-center space-x-2 mb-2">
          <ThumbsUp className="w-4 h-4 text-brand-interactive" />
          <h3 className="text-sm font-semibold text-brand-primary-text">
            Strategy Helpfulness History
          </h3>
        </div>
        <p className="text-xs text-brand-secondary-text mb-4 leading-relaxed">
          When you rate an intervention, your local feedback helps the planner prioritize strategies that resonate with you.
        </p>

        {feedbackHistory.length === 0 ? (
          <div className="p-6 text-center bg-brand-bg/40 rounded-control border border-brand-border text-xs text-brand-secondary-text">
            No feedback recorded yet. Try requesting an intervention and rating whether it helped.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-brand-soft-leaf/60 rounded-control border border-brand-border">
              <span className="text-xl font-bold text-brand-deep-forest block">
                {feedbackCounts.yes}
              </span>
              <span className="text-[11px] text-brand-secondary-text">Helped</span>
            </div>
            <div className="p-3 bg-brand-soft-leaf/60 rounded-control border border-brand-border">
              <span className="text-xl font-bold text-brand-deep-forest block">
                {feedbackCounts.a_little}
              </span>
              <span className="text-[11px] text-brand-secondary-text">A little</span>
            </div>
            <div className="p-3 bg-brand-soft-leaf/60 rounded-control border border-brand-border">
              <span className="text-xl font-bold text-brand-deep-forest block">
                {feedbackCounts.no}
              </span>
              <span className="text-[11px] text-brand-secondary-text">Try different</span>
            </div>
            <div className="p-3 bg-brand-soft-leaf/60 rounded-control border border-brand-border">
              <span className="text-xl font-bold text-brand-deep-forest block">
                {feedbackCounts.rest_instead}
              </span>
              <span className="text-[11px] text-brand-secondary-text">Needed rest</span>
            </div>
          </div>
        )}
      </div>

      {/* Task Breakdown by Subject */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border">
        <h3 className="text-sm font-semibold text-brand-primary-text mb-3">
          Subject Breakdown
        </h3>
        {tasks.length === 0 ? (
          <p className="text-xs text-brand-secondary-text italic">No tasks created yet.</p>
        ) : (
          <div className="space-y-2">
            {Array.from(new Set(tasks.map((t) => t.subject))).map((subj) => {
              const subjTasks = tasks.filter((t) => t.subject === subj);
              const doneCount = subjTasks.filter((t) => t.status === 'completed').length;
              return (
                <div
                  key={subj}
                  className="flex items-center justify-between p-2.5 rounded-control bg-brand-bg/50 border border-brand-border text-xs"
                >
                  <span className="font-semibold text-brand-primary-text">{subj}</span>
                  <div className="flex items-center space-x-3 text-brand-secondary-text">
                    <span>
                      {doneCount} of {subjTasks.length} done
                    </span>
                    <span className="w-20 bg-brand-border h-2 rounded-full overflow-hidden inline-block">
                      <span
                        className="bg-brand-fresh-leaf h-full block"
                        style={{ width: `${(doneCount / subjTasks.length) * 100}%` }}
                      />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transparent Privacy Card */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
        <div className="text-xs text-brand-secondary-text leading-relaxed">
          <span className="font-semibold text-brand-primary-text block mb-1">
            Privacy Architecture
          </span>
          All tasks, focus logs, and garden states are stored in your browser's localStorage. No camera, microphone, or background system monitoring is used. Interventions use deterministic local RAG strategies by default, with optional Google Gemini SDK enhancement when an API key is configured.
        </div>
      </div>
    </div>
  );
};
