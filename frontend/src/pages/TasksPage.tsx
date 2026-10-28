import React, { useState } from 'react';
import { Task, EnergyLevel, TaskPriority, TaskStatus } from '../types';
import { rebalanceTasksApi, RebalanceResult } from '../services/api';
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Filter,
  Check,
  X
} from 'lucide-react';

interface TasksPageProps {
  tasks: Task[];
  energy: EnergyLevel;
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onStartFocus: (task: Task) => void;
  onApplyRebalancedPlan: (reorderedTasks: Task[]) => void;
  onOpenIntervention: (task: Task) => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  energy,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onStartFocus,
  onApplyRebalancedPlan,
  onOpenIntervention,
}) => {
  // Filters & sorting
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'duration'>('deadline');

  // New task modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [formError, setFormError] = useState('');

  // Edit task modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete confirmation
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Rebalance modal / banner
  const [rebalanceResult, setRebalanceResult] = useState<RebalanceResult | null>(null);
  const [isRebalancing, setIsRebalancing] = useState(false);

  // Unique subjects for filter
  const subjects = Array.from(new Set(tasks.map((t) => t.subject))).filter(Boolean);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a task title.');
      return;
    }
    if (duration <= 0) {
      setFormError('Estimated duration must be at least 1 minute.');
      return;
    }

    onAddTask({
      title: title.trim(),
      subject: subject.trim() || 'General',
      description: description.trim(),
      deadline: deadline || undefined,
      estimated_duration: Number(duration),
      priority,
      status: 'not_started',
    });

    // Reset form
    setTitle('');
    setSubject('');
    setDescription('');
    setDeadline('');
    setDuration(30);
    setPriority('normal');
    setFormError('');
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    onUpdateTask({
      ...editingTask,
      title: editingTask.title.trim(),
      subject: editingTask.subject.trim() || 'General',
      updated_at: new Date().toISOString(),
    });

    setEditingTask(null);
  };

  const handleRebalance = async () => {
    setIsRebalancing(true);
    const result = await rebalanceTasksApi(tasks, energy, 180);
    setRebalanceResult(result);
    setIsRebalancing(false);
  };

  const handleApplyRebalance = () => {
    if (!rebalanceResult) return;
    onApplyRebalancedPlan(rebalanceResult.ordered_tasks);
    setRebalanceResult(null);
  };

  // Filtered and sorted tasks
  const filteredTasks = tasks.filter((t) => {
    if (filterSubject !== 'all' && t.subject !== filterSubject) return false;
    if (filterStatus === 'completed' && t.status !== 'completed') return false;
    if (filterStatus === 'open' && t.status === 'completed') return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    }
    if (sortBy === 'priority') {
      const pMap = { high: 3, normal: 2, low: 1 };
      return (pMap[b.priority] || 2) - (pMap[a.priority] || 2);
    }
    if (sortBy === 'duration') {
      return a.estimated_duration - b.estimated_duration;
    }
    return 0;
  });

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
            My Tasks
          </h2>
          <p className="text-xs text-brand-secondary-text mt-0.5">
            Organize study objectives with flexible time estimates and energy-adapted ordering.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRebalance}
            disabled={isRebalancing}
            className="inline-flex items-center text-xs font-medium px-3.5 py-2 bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 text-brand-deep-forest border border-brand-border rounded-control transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-brand-interactive" />
            {isRebalancing ? 'Rebalancing...' : 'Rebalance my plan'}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center text-xs font-medium px-3.5 py-2 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create task
          </button>
        </div>
      </div>

      {/* Rebalance Plan Result Banner */}
      {rebalanceResult && (
        <div className="bg-brand-surface border-2 border-brand-fresh-leaf/60 p-4.5 rounded-card shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-fresh-leaf" />
              <h3 className="text-sm font-semibold text-brand-primary-text">
                Adaptive Plan Recommendation
              </h3>
            </div>
            <button
              onClick={() => setRebalanceResult(null)}
              className="text-brand-secondary-text hover:text-brand-primary-text"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-primary-text mb-2 leading-relaxed">
            {rebalanceResult.recommendation_reason}
          </p>
          <p className="text-[11px] text-brand-secondary-text mb-3">
            {rebalanceResult.energy_adaptation_note}
          </p>

          {rebalanceResult.has_time_conflict && (
            <div className="bg-brand-warning/10 border border-brand-warning/30 p-2.5 rounded-control text-xs text-brand-warning mb-3">
              <div className="flex items-center font-semibold mb-0.5">
                <AlertCircle className="w-3.5 h-3.5 mr-1" />
                Schedule Notice
              </div>
              {rebalanceResult.conflicts.map((c, i) => (
                <p key={i}>{c.message}</p>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={handleApplyRebalance}
              className="px-3.5 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface text-xs font-medium rounded-control transition-colors"
            >
              Accept & Apply Order
            </button>
            <button
              onClick={() => setRebalanceResult(null)}
              className="px-3 py-1.5 border border-brand-border hover:bg-brand-bg text-brand-secondary-text hover:text-brand-primary-text text-xs font-medium rounded-control transition-colors"
            >
              Reject changes
            </button>
          </div>
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="bg-brand-surface p-3.5 rounded-card border border-brand-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-brand-secondary-text flex items-center font-medium mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-control border border-brand-border bg-brand-bg/50 focus:border-brand-interactive"
          >
            <option value="all">All statuses</option>
            <option value="open">Open only</option>
            <option value="completed">Completed only</option>
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-2.5 py-1.5 rounded-control border border-brand-border bg-brand-bg/50 focus:border-brand-interactive"
          >
            <option value="all">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-brand-secondary-text font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-control border border-brand-border bg-brand-bg/50 focus:border-brand-interactive"
          >
            <option value="deadline">Upcoming deadline</option>
            <option value="priority">Priority</option>
            <option value="duration">Estimated duration</option>
          </select>
        </div>
      </div>

      {/* Tasks Table / Card List */}
      <div className="bg-brand-surface rounded-card border border-brand-border overflow-hidden">
        {sortedTasks.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-8 h-8 text-brand-secondary-text mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-brand-primary-text">No tasks found</h3>
            <p className="text-xs text-brand-secondary-text mt-1 max-w-sm mx-auto">
              Create a task to get started, or clear active filters to show existing objectives.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-3.5 py-1.5 bg-brand-interactive text-brand-surface rounded-control text-xs font-medium"
            >
              Add a new task
            </button>
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {sortedTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`p-4 hover:bg-brand-bg/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted ? 'bg-brand-soft-leaf/20 opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 min-w-0">
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-1 text-brand-secondary-text hover:text-brand-success transition-colors shrink-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-success" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-semibold text-brand-primary-text truncate ${
                            isCompleted ? 'line-through text-brand-secondary-text' : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs border ${
                            task.priority === 'high'
                              ? 'bg-brand-muted-clay/15 text-brand-muted-clay border-brand-muted-clay/30'
                              : task.priority === 'low'
                              ? 'bg-brand-soft-leaf text-brand-deep-forest border-brand-border'
                              : 'bg-brand-bg text-brand-secondary-text border-brand-border'
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.is_sample && (
                          <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded-xs bg-brand-soft-leaf text-brand-secondary-text border border-brand-border">
                            Sample
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-brand-secondary-text mt-0.5 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-brand-secondary-text mt-2">
                        <span className="font-medium text-brand-deep-forest bg-brand-soft-leaf/60 px-2 py-0.5 rounded-control">
                          {task.subject}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {task.estimated_duration} mins
                        </span>
                        {task.deadline && (
                          <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            Target: {task.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    {!isCompleted && (
                      <>
                        <button
                          onClick={() => onOpenIntervention(task)}
                          className="px-2.5 py-1 text-xs text-brand-deep-forest bg-brand-soft-leaf hover:bg-brand-fresh-leaf/25 rounded-control border border-brand-border font-medium flex items-center"
                          title="Generate step-by-step guidance"
                        >
                          <Sparkles className="w-3 h-3 mr-1 text-brand-interactive" />
                          Help me start
                        </button>
                        <button
                          onClick={() => onStartFocus(task)}
                          className="px-2.5 py-1 text-xs bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium flex items-center"
                          title="Start focus timer"
                        >
                          <Play className="w-3 h-3 mr-1 fill-current" />
                          Focus
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1.5 text-brand-secondary-text hover:text-brand-primary-text rounded-control"
                      title="Edit task"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task)}
                      className="p-1.5 text-brand-secondary-text hover:text-brand-error rounded-control"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-text/45 backdrop-blur-xs">
          <div className="bg-brand-surface rounded-card border border-brand-border p-6 max-w-md w-full shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <h3 className="text-base font-semibold text-brand-primary-text">Create New Task</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-brand-secondary-text hover:text-brand-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-3 text-xs text-brand-error bg-brand-error/10 p-2 rounded-control border border-brand-error/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solve Practice Set 2"
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Subject / Category</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Data Structures, Wireless Comms"
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Optional Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key sub-questions or files needed..."
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-brand-primary-text mb-1">Estimated Mins *</label>
                  <input
                    type="number"
                    min={1}
                    max={480}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-brand-primary-text mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-brand-border text-brand-secondary-text hover:text-brand-primary-text rounded-control"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-text/45 backdrop-blur-xs">
          <div className="bg-brand-surface rounded-card border border-brand-border p-6 max-w-md w-full shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
              <h3 className="text-base font-semibold text-brand-primary-text">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="text-brand-secondary-text hover:text-brand-primary-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Subject</label>
                <input
                  type="text"
                  value={editingTask.subject}
                  onChange={(e) => setEditingTask({ ...editingTask, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-brand-primary-text mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingTask.estimated_duration}
                    onChange={(e) => setEditingTask({ ...editingTask, estimated_duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-brand-primary-text mb-1">Priority</label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-brand-primary-text mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={editingTask.deadline || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-control border border-brand-border focus:border-brand-interactive bg-brand-bg/30 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-3 py-1.5 border border-brand-border text-brand-secondary-text hover:text-brand-primary-text rounded-control"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-text/45 backdrop-blur-xs">
          <div className="bg-brand-surface rounded-card border border-brand-border p-5 max-w-sm w-full shadow-xl animate-in fade-in">
            <h3 className="text-sm font-semibold text-brand-primary-text mb-2">Delete Task?</h3>
            <p className="text-xs text-brand-secondary-text mb-4 leading-relaxed">
              Are you sure you want to remove <span className="font-semibold text-brand-primary-text">"{taskToDelete.title}"</span>? This action can be undone by recreating the task.
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-3 py-1.5 border border-brand-border text-brand-secondary-text hover:text-brand-primary-text rounded-control text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }}
                className="px-3.5 py-1.5 bg-brand-error text-brand-surface rounded-control text-xs font-medium hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
