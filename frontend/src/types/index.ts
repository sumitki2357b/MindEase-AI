export type EnergyLevel = 'low' | 'medium' | 'high';

export type TaskPriority = 'low' | 'normal' | 'high';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  subject: string;
  description?: string;
  deadline?: string;
  estimated_duration: number; // minutes
  priority: TaskPriority;
  status: TaskStatus;
  scheduled_order?: number;
  created_at: string;
  updated_at: string;
  is_sample?: boolean;
}

export type DifficultyType =
  | 'beginning'
  | 'overwhelm'
  | 'perfectionism'
  | 'distraction'
  | 'low_energy'
  | 'ineffective_approach'
  | 'break'
  | 'something_else';

export interface StrategyRecord {
  id: string;
  title: string;
  difficulty_tags: string[];
  keywords: string[];
  explanation: string;
  suggested_action: string;
  safety_note?: string;
  score?: number;
}

export interface InterventionResponse {
  acknowledgement: string;
  action_title: string;
  action_steps: string[];
  why_this_fits: string;
  strategy_ids: string[];
  generation_source: 'gemini' | 'local_fallback';
  fallback_reason?: string;
  retrieved_strategies?: StrategyRecord[];
}

export interface StoryScene {
  scene_number: number;
  title: string;
  description: string;
  narration_text: string;
  visual_key: string;
}

export interface Story {
  id: string;
  title: string;
  difficulty_tags: string[];
  summary: string;
  takeaway: string;
  reflection_question: string;
  suggested_next_actions: string[];
  narration_language: string;
  estimated_reading_time_minutes: number;
  scenes: StoryScene[];
}

export interface ForestItem {
  id: string;
  type: 'tree' | 'flower' | 'stone' | 'fern' | 'leaf';
  x: number;
  y: number;
  variant?: number;
  label?: string;
  created_at: string;
}

export interface FocusSession {
  taskId: string | null;
  isActive: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  startedAt: string | null;
}

export type FeedbackCategory = 'yes' | 'a_little' | 'no' | 'rest_instead';

export interface InterventionFeedback {
  id: string;
  strategyId: string;
  difficulty: string;
  feedbackCategory: FeedbackCategory;
  timestamp: string;
}

export interface StuckRadarConfig {
  enabled: boolean;
  inactivityThresholdSeconds: number;
  repeatedRequestLimit: number;
  dismissalCooldownSeconds: number;
}

export type NavigationTab =
  | 'overview'
  | 'tasks'
  | 'focus'
  | 'reset'
  | 'stories'
  | 'insights'
  | 'settings';
