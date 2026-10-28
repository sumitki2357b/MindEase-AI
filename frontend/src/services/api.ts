import {
  Task,
  EnergyLevel,
  DifficultyType,
  InterventionResponse,
  StrategyRecord,
  Story,
  InterventionFeedback
} from '../types';

const API_BASE = '/api';

export interface HealthData {
  status: string;
  gemini_configured: boolean;
  gemini_model: string;
  version: string;
}

export interface RebalanceResult {
  ordered_tasks: Task[];
  recommended_next_task_id: string | null;
  recommendation_reason: string;
  total_planned_minutes: number;
  available_minutes: number;
  has_time_conflict: boolean;
  conflicts: { task_id: string; title: string; message: string }[];
  energy_adaptation_note: string;
}

export const fetchHealth = async (): Promise<HealthData> => {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      gemini_configured: false,
      gemini_model: 'built-in-local',
      version: '1.0.0 (offline mode)'
    };
  }
};

export const fetchStrategies = async (): Promise<StrategyRecord[]> => {
  try {
    const res = await fetch(`${API_BASE}/strategies`);
    if (!res.ok) throw new Error(`Fetch strategies failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const fetchStories = async (): Promise<Story[]> => {
  try {
    const res = await fetch(`${API_BASE}/stories`);
    if (!res.ok) throw new Error(`Fetch stories failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    return [];
  }
};

export const fetchIntervention = async (
  difficulty: DifficultyType,
  energy: EnergyLevel,
  task?: Task | null,
  description?: string,
  previousFeedback?: InterventionFeedback[]
): Promise<InterventionResponse> => {
  try {
    const res = await fetch(`${API_BASE}/intervention`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        difficulty,
        energy,
        task_title: task?.title,
        task_subject: task?.subject,
        description: description || '',
        previous_feedback: previousFeedback || []
      })
    });

    if (!res.ok) throw new Error(`Intervention API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    // Client-side fallback if server is unreachable
    return {
      acknowledgement: "You're taking a positive step by noticing when friction arises.",
      action_title: "Gentle 2-Minute Entry",
      action_steps: [
        "Open your study document or problem sheet.",
        "Write just one imperfect sentence or equation with no pressure.",
        "Decide after 2 minutes whether to pause or continue."
      ],
      why_this_fits: "Lowering initiation friction protects mental energy without requiring intense focus.",
      strategy_ids: ["strat_micro_step"],
      generation_source: "local_fallback",
      fallback_reason: "Backend offline. Served via instant client-side fallback."
    };
  }
};

export const fetchStoryRecommendation = async (
  difficulty: DifficultyType,
  energy: EnergyLevel
): Promise<{ recommended_story_id: string; title: string; selection_reason: string }> => {
  try {
    const res = await fetch(`${API_BASE}/story-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, energy })
    });
    if (!res.ok) throw new Error(`Story recommendation failed`);
    return await res.json();
  } catch {
    return {
      recommended_story_id: 'story_seed_rock',
      title: 'The Seed and the Rock',
      selection_reason: 'Finding another path when direct upward growth feels blocked.'
    };
  }
};

export const rebalanceTasksApi = async (
  tasks: Task[],
  energy: EnergyLevel,
  availableMinutes: number = 180
): Promise<RebalanceResult> => {
  try {
    const res = await fetch(`${API_BASE}/rebalance-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tasks,
        energy,
        available_minutes: availableMinutes
      })
    });
    if (!res.ok) throw new Error('Rebalance API failed');
    return await res.json();
  } catch (err) {
    // Client-side fallback rebalancing
    const openTasks = tasks.filter(t => t.status !== 'completed');
    const completedTasks = tasks.filter(t => t.status === 'completed');
    
    // Sort by duration if low energy, else priority
    const sorted = [...openTasks].sort((a, b) => {
      if (energy === 'low') return a.estimated_duration - b.estimated_duration;
      const pMap = { high: 3, normal: 2, low: 1 };
      return (pMap[b.priority] || 2) - (pMap[a.priority] || 2);
    });

    const ordered = [...sorted, ...completedTasks];
    const totalMins = openTasks.reduce((acc, t) => acc + t.estimated_duration, 0);

    return {
      ordered_tasks: ordered,
      recommended_next_task_id: sorted.length > 0 ? sorted[0].id : null,
      recommendation_reason: sorted.length > 0 
        ? `Recommended '${sorted[0].title}' based on local fallback rebalancer.`
        : 'All tasks completed!',
      total_planned_minutes: totalMins,
      available_minutes: availableMinutes,
      has_time_conflict: totalMins > availableMinutes,
      conflicts: totalMins > availableMinutes ? [{
        task_id: 'conflict',
        title: 'Time Overflow',
        message: `Planned work (${totalMins}m) exceeds focus budget (${availableMinutes}m).`
      }] : [],
      energy_adaptation_note: `Locally adapted for ${energy} energy mode.`
    };
  }
};
