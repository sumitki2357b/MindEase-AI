import React, { useState } from 'react';
import { StuckRadarConfig } from '../types';
import {
  Compass,
  Trash2,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Users,
  Check,
  AlertTriangle
} from 'lucide-react';

interface SettingsPageProps {
  radarConfig: StuckRadarConfig;
  onUpdateRadarConfig: (config: StuckRadarConfig) => void;
  onResetSampleData: () => void;
  onClearGarden: () => void;
  onClearAllData: () => void;
  geminiConfigured: boolean;
  geminiModel: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  radarConfig,
  onUpdateRadarConfig,
  onResetSampleData,
  onClearGarden,
  onClearAllData,
  geminiConfigured,
  geminiModel,
}) => {
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleToggleRadar = () => {
    onUpdateRadarConfig({ ...radarConfig, enabled: !radarConfig.enabled });
    showSaved();
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateRadarConfig({
      ...radarConfig,
      inactivityThresholdSeconds: Number(e.target.value),
    });
    showSaved();
  };

  const showSaved = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-primary-text">
            Settings & Privacy
          </h2>
          <p className="text-xs text-brand-secondary-text mt-0.5">
            Configure interaction signals, external AI disclosures, and local storage controls.
          </p>
        </div>
        {saveToast && (
          <span className="text-xs bg-brand-soft-leaf text-brand-deep-forest px-3 py-1 rounded-control font-semibold flex items-center border border-brand-fresh-leaf/40">
            <Check className="w-3.5 h-3.5 mr-1 text-brand-success" />
            Preferences updated
          </span>
        )}
      </div>

      {/* Stuck Radar Configuration */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-brand-interactive" />
            <h3 className="text-sm font-semibold text-brand-primary-text">
              Stuck Radar Observer
            </h3>
          </div>
          <button
            onClick={handleToggleRadar}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              radarConfig.enabled ? 'bg-brand-interactive' : 'bg-brand-border'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-brand-surface shadow-xs transition duration-200 ease-in-out ${
                radarConfig.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <p className="text-xs text-brand-secondary-text leading-relaxed">
          Stuck Radar evaluates in-app interaction pauses during focus blocks to offer optional check-ins. It observes only actions inside MindEase without accessing webcam, microphone, or external windows.
        </p>

        {radarConfig.enabled && (
          <div className="pt-3 border-t border-brand-border space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium text-brand-primary-text mb-1">
                <span>Inactivity Check-in Threshold</span>
                <span className="font-bold text-brand-deep-forest">
                  {radarConfig.inactivityThresholdSeconds} seconds
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={300}
                step={30}
                value={radarConfig.inactivityThresholdSeconds}
                onChange={handleThresholdChange}
                className="w-full accent-brand-interactive cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-secondary-text mt-1">
                <span>60s (sensitive)</span>
                <span>120s (recommended)</span>
                <span>300s (extended)</span>
              </div>
            </div>

            <p className="text-[11px] text-brand-secondary-text bg-brand-soft-leaf/40 p-2.5 rounded-control border border-brand-border">
              Dismissal cooldown is set to 10 minutes to prevent repeated interruptions.
            </p>
          </div>
        )}
      </div>

      {/* External AI & Model Transparency */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border space-y-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-brand-interactive" />
          <h3 className="text-sm font-semibold text-brand-primary-text">
            AI Integration & External Disclosure
          </h3>
        </div>

        <div className="bg-brand-soft-leaf/60 p-3 rounded-control border border-brand-border text-xs text-brand-primary-text leading-relaxed">
          <span className="font-semibold text-brand-deep-forest block mb-1">
            External AI Disclosure
          </span>
          "Task details included in an AI request may be sent to Google's Gemini API ({geminiModel}). You can use built-in guidance without an API key."
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-brand-secondary-text">Gemini API status:</span>
          <span className="font-semibold text-brand-primary-text">
            {geminiConfigured ? `Connected (${geminiModel})` : 'Offline / No-key mode (Built-in guidance)'}
          </span>
        </div>
      </div>

      {/* Local Storage & Data Management */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border space-y-4">
        <h3 className="text-sm font-semibold text-brand-primary-text">
          Data Management
        </h3>
        <p className="text-xs text-brand-secondary-text leading-relaxed">
          Your tasks, garden stones, and intervention ratings remain stored locally on your device.
        </p>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            onClick={onResetSampleData}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-brand-border hover:bg-brand-soft-leaf rounded-control text-brand-deep-forest"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-brand-interactive" />
            Reload Sample Tasks
          </button>

          <button
            onClick={onClearGarden}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-brand-border hover:bg-brand-soft-leaf rounded-control text-brand-secondary-text hover:text-brand-primary-text"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Personal Forest
          </button>

          <button
            onClick={() => setConfirmClearAll(true)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-brand-error/40 hover:bg-brand-error/10 rounded-control text-brand-error"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All Application Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clear All */}
      {confirmClearAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-primary-text/45 backdrop-blur-xs">
          <div className="bg-brand-surface rounded-card border border-brand-border p-6 max-w-sm w-full shadow-xl animate-in fade-in text-center">
            <AlertTriangle className="w-8 h-8 text-brand-error mx-auto mb-2" />
            <h3 className="text-base font-bold text-brand-primary-text mb-1">
              Clear all local data?
            </h3>
            <p className="text-xs text-brand-secondary-text mb-4 leading-relaxed">
              This will remove all created tasks, garden elements, and feedback records from your browser's localStorage.
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs">
              <button
                onClick={() => setConfirmClearAll(false)}
                className="px-3.5 py-1.5 border border-brand-border rounded-control text-brand-secondary-text hover:text-brand-primary-text"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setConfirmClearAll(false);
                }}
                className="px-4 py-1.5 bg-brand-error text-brand-surface font-semibold rounded-control"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Credits */}
      <div className="bg-brand-surface p-5 rounded-card border border-brand-border">
        <div className="flex items-center space-x-2 mb-2 text-brand-deep-forest">
          <Users className="w-4 h-4 text-brand-interactive" />
          <h3 className="text-sm font-semibold text-brand-primary-text">
            Project Information | CodeXpress
          </h3>
        </div>
        <p className="text-xs text-brand-secondary-text leading-relaxed mb-3">
          MindEase AI was developed for the One-Day Hackathon MVP by Team CodeXpress.
        </p>
        <div className="text-xs text-brand-primary-text space-y-1 bg-brand-soft-leaf/40 p-3 rounded-control border border-brand-border">
          <p><span className="font-semibold text-brand-deep-forest">Team Leader:</span> Sumit Kumar Singh</p>
          <p><span className="font-semibold text-brand-deep-forest">Team Members:</span> Kajal Yadav, Kashish Rai, Madhura Patil</p>
        </div>
      </div>
    </div>
  );
};
