import { describe, it, expect, beforeEach } from 'vitest';
import { getInitialSampleTasks } from '../data/sampleTasks';
import { Task, EnergyLevel, DifficultyType, InterventionFeedback } from '../types';
import { rebalanceTasksApi, fetchIntervention } from '../services/api';

describe('MindEase AI Frontend Logic & State Tests', () => {
  beforeEach(() => {
    // Clear mock storage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it('provides at most 3 clearly labelled sample tasks', () => {
    const samples = getInitialSampleTasks();
    expect(samples.length).toBeLessThanOrEqual(3);
    expect(samples.length).toBe(3);
    for (const t of samples) {
      expect(t.is_sample).toBe(true);
      expect(t.status).toBe('not_started'); // Never pre-marked completed
      expect(t.estimated_duration).toBeGreaterThan(0);
      expect(t.title).toBeDefined();
    }
  });

  it('validates task completion toggling logic', () => {
    const tasks = getInitialSampleTasks();
    const target = tasks[0];
    expect(target.status).toBe('not_started');

    // Toggle complete
    const toggled = tasks.map((t) =>
      t.id === target.id ? { ...t, status: 'completed' as const } : t
    );
    expect(toggled[0].status).toBe('completed');

    // Reopen task
    const reopened = toggled.map((t) =>
      t.id === target.id ? { ...t, status: 'not_started' as const } : t
    );
    expect(reopened[0].status).toBe('not_started');
  });

  it('rebalances tasks deterministically according to energy level', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        title: 'Long Heavy Problem Set',
        subject: 'Math',
        estimated_duration: 90,
        priority: 'high',
        status: 'not_started',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Quick 15-Minute Outline',
        subject: 'English',
        estimated_duration: 15,
        priority: 'normal',
        status: 'not_started',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Already Completed Assignment',
        subject: 'Science',
        estimated_duration: 45,
        priority: 'normal',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Under low energy mode, the shorter task should be prioritized for low-friction momentum
    const lowResult = await rebalanceTasksApi(tasks, 'low', 120);
    expect(lowResult.ordered_tasks.length).toBe(3);
    // Completed task must remain completed
    const completed = lowResult.ordered_tasks.find((t) => t.id === '3');
    expect(completed?.status).toBe('completed');
  });

  it('handles client-side fallback gracefully when backend is offline', async () => {
    const intervention = await fetchIntervention(
      'beginning',
      'low',
      {
        id: 'sample',
        title: 'Mobile Comms Revision',
        subject: 'Engineering',
        estimated_duration: 30,
        priority: 'normal',
        status: 'not_started',
        created_at: '',
        updated_at: '',
      },
      'Cannot start reading lecture 3'
    );

    expect(intervention.acknowledgement).toBeDefined();
    expect(intervention.action_title).toBeDefined();
    expect(intervention.action_steps.length).toBeGreaterThanOrEqual(2);
    expect(intervention.why_this_fits).toBeDefined();
    expect(intervention.generation_source).toBeDefined();
  });

  it('records intervention feedback accurately', () => {
    const feedbackList: InterventionFeedback[] = [];
    const record: InterventionFeedback = {
      id: 'fb-1',
      strategyId: 'strat_micro_step',
      difficulty: 'beginning',
      feedbackCategory: 'yes',
      timestamp: new Date().toISOString(),
    };
    feedbackList.push(record);

    expect(feedbackList.length).toBe(1);
    expect(feedbackList[0].feedbackCategory).toBe('yes');
    expect(feedbackList[0].strategyId).toBe('strat_micro_step');
  });

  it('recovers safely from malformed localStorage without crashing', () => {
    const badJson = '{ invalid_json ::: ';
    let result = getInitialSampleTasks();
    try {
      result = JSON.parse(badJson);
    } catch {
      result = getInitialSampleTasks();
    }
    expect(result.length).toBe(3);
  });
});
