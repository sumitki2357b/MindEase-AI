import React, { useState, useEffect } from 'react';
import {
  Task,
  EnergyLevel,
  NavigationTab,
  ForestItem,
  InterventionFeedback,
  FeedbackCategory,
  StuckRadarConfig,
  DifficultyType
} from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useStuckRadar } from './hooks/useStuckRadar';
import { getInitialSampleTasks } from './data/sampleTasks';
import { fetchHealth, HealthData } from './services/api';

import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { InterventionModal } from './components/InterventionModal';
import { StuckRadarPrompt } from './components/StuckRadarPrompt';

import { OverviewPage } from './pages/OverviewPage';
import { TasksPage } from './pages/TasksPage';
import { FocusRoomPage } from './pages/FocusRoomPage';
import { ResetRoomPage } from './pages/ResetRoomPage';
import { StoriesPage } from './pages/StoriesPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  // Navigation state
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Health and backend status
  const [health, setHealth] = useState<HealthData>({
    status: 'checking',
    gemini_configured: false,
    gemini_model: 'gemini-3.5-flash-lite',
    version: '1.0.0',
  });

  useEffect(() => {
    fetchHealth().then(setHealth);
  }, []);

  // Persistent user state
  const [tasks, setTasks] = useLocalStorage<Task[]>('mindease_tasks', getInitialSampleTasks());
  const [energy, setEnergy] = useLocalStorage<EnergyLevel>('mindease_energy', 'medium');
  const [forestItems, setForestItems] = useLocalStorage<ForestItem[]>('mindease_forest', [
    { id: 'f1', type: 'flower', x: 220, y: 280, created_at: new Date().toISOString() },
    { id: 'f2', type: 'stone', x: 380, y: 310, created_at: new Date().toISOString() },
  ]);
  const [feedbackHistory, setFeedbackHistory] = useLocalStorage<InterventionFeedback[]>(
    'mindease_feedback',
    []
  );
  const [radarConfig, setRadarConfig] = useLocalStorage<StuckRadarConfig>('mindease_radar_config', {
    enabled: true,
    inactivityThresholdSeconds: 120,
    repeatedRequestLimit: 3,
    dismissalCooldownSeconds: 600,
  });

  // Active focus task
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);

  // Intervention modal state
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);
  const [interventionTask, setInterventionTask] = useState<Task | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(undefined);

  // Stuck Radar Observer Hook
  const {
    showPrompt,
    triggerExplanation,
    dismissPrompt,
  } = useStuckRadar({
    config: radarConfig,
    isSessionActive: activeTab === 'focus',
  });

  // Task Operations
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      created_at: now,
      updated_at: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    if (activeFocusTask?.id === updatedTask.id) {
      setActiveFocusTask(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeFocusTask?.id === taskId) {
      setActiveFocusTask(null);
    }
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === 'completed' ? 'not_started' : 'completed';
          return { ...t, status: newStatus, updated_at: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  const handleStartFocus = (task: Task) => {
    setActiveFocusTask(task);
    setActiveTab('focus');
  };

  const handleOpenIntervention = (task?: Task | null) => {
    setInterventionTask(task || activeFocusTask || null);
    setIsInterventionOpen(true);
  };

  const handleSaveFeedback = (strategyId: string, difficulty: string, feedback: FeedbackCategory) => {
    const newFeedback: InterventionFeedback = {
      id: `fb-${Date.now()}`,
      strategyId,
      difficulty,
      feedbackCategory: feedback,
      timestamp: new Date().toISOString(),
    };
    setFeedbackHistory((prev) => [newFeedback, ...prev]);
  };

  // Forest Operations
  const handleAddForestItem = (type: 'flower' | 'stone' | 'leaf') => {
    const newItem: ForestItem = {
      id: `forest-${Date.now()}`,
      type,
      x: 140 + Math.random() * 450,
      y: 240 + Math.random() * 90,
      created_at: new Date().toISOString(),
    };
    setForestItems((prev) => [...prev, newItem]);
  };

  const handleClearGarden = () => {
    setForestItems([]);
  };

  const handleResetSampleData = () => {
    setTasks(getInitialSampleTasks());
  };

  const handleClearSampleData = () => {
    setTasks((prev) => prev.filter((t) => !t.is_sample));
  };

  const handleClearAllData = () => {
    window.localStorage.clear();
    setTasks([]);
    setForestItems([]);
    setFeedbackHistory([]);
    setEnergy('medium');
    setActiveFocusTask(null);
  };

  const handleOpenStoryWithDifficulty = (diff: DifficultyType) => {
    setIsInterventionOpen(false);
    if (diff === 'ineffective_approach') setSelectedStoryId('story_river_route');
    else if (diff === 'perfectionism') setSelectedStoryId('story_smallest_tree');
    else if (diff === 'low_energy' || diff === 'break') setSelectedStoryId('story_flower_rain');
    else if (diff === 'beginning') setSelectedStoryId('story_one_stone');
    else setSelectedStoryId('story_seed_rock');
    setActiveTab('stories');
  };

  const isSampleDataActive = tasks.some((t) => t.is_sample);

  return (
    <div className="flex h-screen bg-brand-bg text-brand-primary-text font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar
          activeTab={activeTab}
          onOpenMobile={() => setIsMobileOpen(true)}
          energy={energy}
          onEnergyClick={() => setActiveTab('overview')}
          geminiConfigured={health.gemini_configured}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
          {activeTab === 'overview' && (
            <OverviewPage
              tasks={tasks}
              energy={energy}
              onSelectEnergy={setEnergy}
              onToggleTaskComplete={handleToggleComplete}
              onStartFocus={handleStartFocus}
              onNavigate={setActiveTab}
              onOpenIntervention={handleOpenIntervention}
              forestItems={forestItems}
              stuckRadarActive={radarConfig.enabled}
              onOpenStory={(id) => {
                if (id) setSelectedStoryId(id);
                setActiveTab('stories');
              }}
              isSampleDataActive={isSampleDataActive}
              onClearSampleData={handleClearSampleData}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksPage
              tasks={tasks}
              energy={energy}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onStartFocus={handleStartFocus}
              onApplyRebalancedPlan={setTasks}
              onOpenIntervention={handleOpenIntervention}
            />
          )}

          {activeTab === 'focus' && (
            <FocusRoomPage
              activeTask={activeFocusTask}
              tasks={tasks}
              energy={energy}
              onSelectTask={setActiveFocusTask}
              onToggleTaskComplete={handleToggleComplete}
              onOpenIntervention={handleOpenIntervention}
              onNavigateToReset={() => setActiveTab('reset')}
              onNavigate={setActiveTab}
              onAddForestProgress={() => handleAddForestItem('flower')}
            />
          )}

          {activeTab === 'reset' && (
            <ResetRoomPage
              forestItems={forestItems}
              onAddForestItem={handleAddForestItem}
              onClearForestGarden={handleClearGarden}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'stories' && (
            <StoriesPage
              initialStoryId={selectedStoryId}
              onNavigate={setActiveTab}
              onOpenInterventionWithDifficulty={handleOpenStoryWithDifficulty}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsPage
              tasks={tasks}
              energy={energy}
              feedbackHistory={feedbackHistory}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              radarConfig={radarConfig}
              onUpdateRadarConfig={setRadarConfig}
              onResetSampleData={handleResetSampleData}
              onClearGarden={handleClearGarden}
              onClearAllData={handleClearAllData}
              geminiConfigured={health.gemini_configured}
              geminiModel={health.gemini_model}
            />
          )}
        </main>
      </div>

      {/* Global Intervention Modal */}
      <InterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        activeTask={interventionTask}
        currentEnergy={energy}
        onNavigateToStories={(diff) => handleOpenStoryWithDifficulty(diff)}
        onNavigateToResetRoom={() => {
          setIsInterventionOpen(false);
          setActiveTab('reset');
        }}
        onSaveFeedback={handleSaveFeedback}
      />

      {/* Stuck Radar Prompt */}
      <StuckRadarPrompt
        isOpen={showPrompt}
        explanation={triggerExplanation}
        onKeepGoing={() => dismissPrompt(false)}
        onChangeApproach={() => {
          dismissPrompt(false);
          handleOpenIntervention(activeFocusTask);
        }}
        onTakeBreak={() => {
          dismissPrompt(true);
          setActiveTab('reset');
        }}
        onDismiss={() => dismissPrompt(false)}
      />
    </div>
  );
};

export default App;
