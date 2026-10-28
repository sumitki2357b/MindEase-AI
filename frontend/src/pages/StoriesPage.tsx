import React, { useState, useEffect } from 'react';
import { Story, NavigationTab, DifficultyType } from '../types';
import { fetchStories } from '../services/api';
import { useSpeechNarration } from '../hooks/useSpeechNarration';
import { StorySceneSvg } from '../components/illustrations/StoryScenesSvg';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Square,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
  Compass
} from 'lucide-react';

interface StoriesPageProps {
  initialStoryId?: string;
  onNavigate: (tab: NavigationTab) => void;
  onOpenInterventionWithDifficulty: (difficulty: DifficultyType) => void;
}

export const StoriesPage: React.FC<StoriesPageProps> = ({
  initialStoryId,
  onNavigate,
  onOpenInterventionWithDifficulty,
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    isSupported,
    isPlaying,
    isPaused,
    play,
    pause,
    resume,
    stop,
    replay,
  } = useSpeechNarration();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const data = await fetchStories();
      if (mounted) {
        setStories(data);
        if (data.length > 0) {
          const match = initialStoryId
            ? data.find((s) => s.id === initialStoryId) || data[0]
            : data[0];
          setSelectedStory(match);
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
      stop(); // Stop audio on unmount
    };
  }, [initialStoryId, stop]);

  const handleSelectStory = (story: Story) => {
    stop();
    setSelectedStory(story);
    setCurrentSceneIndex(0);
  };

  const handleNextScene = () => {
    if (!selectedStory) return;
    if (currentSceneIndex < selectedStory.scenes.length - 1) {
      stop();
      setCurrentSceneIndex((prev) => prev + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      stop();
      setCurrentSceneIndex((prev) => prev - 1);
    }
  };

  const currentScene = selectedStory?.scenes[currentSceneIndex];

  const handlePlayCurrentSceneNarration = () => {
    if (!currentScene) return;
    play(currentScene.narration_text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
            Mind Stories
          </h2>
          <p className="text-xs text-brand-secondary-text mt-0.5">
            Original, readable parables about finding alternate paths, pacing, and rest.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isSupported && (
            <span className="text-[11px] text-brand-secondary-text bg-brand-surface px-2.5 py-1 rounded-control border border-brand-border flex items-center">
              <Volume2 className="w-3.5 h-3.5 mr-1 text-brand-interactive" />
              Narration ready
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-brand-secondary-text">
          Loading original story library...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Story Library List (1 col) */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-secondary-text px-1">
              Curated Stories ({stories.length})
            </h3>
            <div className="space-y-2">
              {stories.map((story) => {
                const isSelected = selectedStory?.id === story.id;
                return (
                  <button
                    key={story.id}
                    onClick={() => handleSelectStory(story)}
                    className={`w-full text-left p-3.5 rounded-card border transition-all ${
                      isSelected
                        ? 'border-brand-interactive bg-brand-surface ring-2 ring-brand-interactive/30 shadow-xs'
                        : 'border-brand-border bg-brand-surface hover:bg-brand-soft-leaf/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-brand-primary-text">
                        {story.title}
                      </span>
                      <span className="text-[10px] text-brand-secondary-text flex items-center">
                        <Clock className="w-3 h-3 mr-0.5" />
                        {story.estimated_reading_time_minutes}m
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-secondary-text line-clamp-2 leading-relaxed">
                      {story.summary}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {story.difficulty_tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-control bg-brand-soft-leaf text-brand-deep-forest font-medium"
                        >
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Story Reader (2 cols) */}
          {selectedStory && currentScene && (
            <div className="lg:col-span-2 bg-brand-surface rounded-card border border-brand-border p-6 shadow-xs flex flex-col justify-between space-y-6">
              {/* Story Title & Scene Indicator */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-brand-border mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-brand-primary-text tracking-tight">
                      {selectedStory.title}
                    </h3>
                    <span className="text-xs text-brand-interactive font-medium">
                      Scene {currentSceneIndex + 1} of {selectedStory.scenes.length}: {currentScene.title}
                    </span>
                  </div>
                  {/* Scene Navigation Pills */}
                  <div className="flex items-center space-x-1.5">
                    {selectedStory.scenes.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          stop();
                          setCurrentSceneIndex(idx);
                        }}
                        className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center transition-colors ${
                          idx === currentSceneIndex
                            ? 'bg-brand-interactive text-brand-surface'
                            : 'bg-brand-soft-leaf text-brand-deep-forest hover:bg-brand-fresh-leaf/30'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Scene Illustration */}
                <div className="rounded-control overflow-hidden border border-brand-border mb-5 bg-brand-bg">
                  <StorySceneSvg visualKey={currentScene.visual_key} />
                </div>

                {/* Narration Player Toolbar */}
                <div className="bg-brand-soft-leaf/60 p-3 rounded-control border border-brand-border flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {!isPlaying ? (
                      <button
                        onClick={handlePlayCurrentSceneNarration}
                        disabled={!isSupported}
                        className="inline-flex items-center px-3 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover disabled:opacity-40 text-brand-surface text-xs font-semibold rounded-control transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                        Play narration
                      </button>
                    ) : isPaused ? (
                      <button
                        onClick={resume}
                        className="inline-flex items-center px-3 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface text-xs font-semibold rounded-control transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 mr-1.5" />
                        Resume
                      </button>
                    ) : (
                      <button
                        onClick={pause}
                        className="inline-flex items-center px-3 py-1.5 bg-brand-deep-forest text-brand-surface text-xs font-semibold rounded-control transition-colors"
                      >
                        <Pause className="w-3.5 h-3.5 mr-1.5" />
                        Pause
                      </button>
                    )}

                    {isPlaying && (
                      <button
                        onClick={stop}
                        className="p-1.5 border border-brand-border hover:bg-brand-surface rounded-control text-brand-secondary-text"
                        title="Stop narration"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={replay}
                      disabled={!isSupported}
                      className="p-1.5 border border-brand-border hover:bg-brand-surface rounded-control text-brand-secondary-text"
                      title="Replay scene"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] text-brand-secondary-text">
                    Browser SpeechSynthesis
                  </span>
                </div>

                {/* Captions / Narration Text */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-secondary-text">
                    Scene Narrative
                  </span>
                  <p className="text-sm text-brand-primary-text leading-relaxed font-serif">
                    {currentScene.narration_text}
                  </p>
                </div>
              </div>

              {/* Bottom: Next/Prev Scene Controls + Takeaway / Reflection */}
              <div className="pt-4 border-t border-brand-border space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevScene}
                    disabled={currentSceneIndex === 0}
                    className="inline-flex items-center px-3 py-1.5 border border-brand-border hover:bg-brand-soft-leaf disabled:opacity-30 rounded-control text-xs font-medium text-brand-primary-text"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous Scene
                  </button>

                  <button
                    onClick={handleNextScene}
                    disabled={currentSceneIndex === selectedStory.scenes.length - 1}
                    className="inline-flex items-center px-3.5 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover disabled:opacity-30 text-brand-surface rounded-control text-xs font-medium"
                  >
                    Next Scene
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Final Scene Reflection & Takeaway */}
                {currentSceneIndex === selectedStory.scenes.length - 1 && (
                  <div className="bg-brand-soft-leaf/50 p-4 rounded-card border border-brand-fresh-leaf/40 space-y-3 animate-in fade-in">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-deep-forest block mb-1">
                        Core Takeaway
                      </span>
                      <p className="text-xs font-medium text-brand-primary-text italic">
                        "{selectedStory.takeaway}"
                      </p>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-interactive block mb-1">
                        Gentle Reflection
                      </span>
                      <p className="text-xs text-brand-primary-text">
                        {selectedStory.reflection_question}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-brand-border flex flex-wrap gap-2 text-xs">
                      <button
                        onClick={() => onOpenInterventionWithDifficulty('ineffective_approach')}
                        className="px-3 py-1.5 bg-brand-interactive hover:bg-brand-interactive-hover text-brand-surface rounded-control font-medium"
                      >
                        Change approach
                      </button>
                      <button
                        onClick={() => onNavigate('reset')}
                        className="px-3 py-1.5 border border-brand-border hover:bg-brand-surface rounded-control text-brand-deep-forest font-medium"
                      >
                        Try a short reset
                      </button>
                      <button
                        onClick={() => onNavigate('focus')}
                        className="px-3 py-1.5 border border-brand-border hover:bg-brand-surface rounded-control text-brand-primary-text font-medium"
                      >
                        Return to my task
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
