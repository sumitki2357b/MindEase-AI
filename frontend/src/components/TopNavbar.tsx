import React from 'react';
import { Menu, Battery, BatteryMedium, BatteryCharging, ShieldCheck, Cpu } from 'lucide-react';
import { EnergyLevel, NavigationTab } from '../types';

interface TopNavbarProps {
  activeTab: NavigationTab;
  onOpenMobile: () => void;
  energy: EnergyLevel;
  onEnergyClick: () => void;
  geminiConfigured: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  onOpenMobile,
  energy,
  onEnergyClick,
  geminiConfigured,
}) => {
  const titles: Record<NavigationTab, string> = {
    overview: 'Overview',
    tasks: 'My Tasks',
    focus: 'Focus Room',
    reset: 'Reset Room',
    stories: 'Mind Stories',
    insights: 'Insights & History',
    settings: 'Settings & Privacy',
  };

  const getEnergyBadge = () => {
    switch (energy) {
      case 'low':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-control bg-brand-muted-clay/15 text-brand-muted-clay border border-brand-muted-clay/30">
            <Battery className="w-3.5 h-3.5 mr-1" />
            Low Energy Mode
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-control bg-brand-fresh-leaf/20 text-brand-deep-forest border border-brand-fresh-leaf/40">
            <BatteryCharging className="w-3.5 h-3.5 mr-1 text-brand-success" />
            High Energy Mode
          </span>
        );
      case 'medium':
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-control bg-brand-soft-leaf text-brand-deep-forest border border-brand-border">
            <BatteryMedium className="w-3.5 h-3.5 mr-1 text-brand-interactive" />
            Balanced Energy
          </span>
        );
    }
  };

  return (
    <header className="h-14 bg-brand-surface border-b border-brand-border flex items-center justify-between px-4 sm:px-6 z-30">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobile}
          className="md:hidden p-1.5 text-brand-secondary-text hover:text-brand-primary-text rounded-control"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold text-brand-primary-text tracking-tight">
          {titles[activeTab]}
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        {/* Gemini status pill */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-control bg-brand-bg border border-brand-border text-brand-secondary-text">
          <Cpu className="w-3.5 h-3.5 text-brand-interactive" />
          <span>{geminiConfigured ? 'Gemini 3.5 Active' : 'Local Guidance Mode'}</span>
        </div>

        {/* Energy quick button */}
        <button
          onClick={onEnergyClick}
          className="hover:opacity-85 transition-opacity"
          title="Click to adjust current energy mode"
        >
          {getEnergyBadge()}
        </button>
      </div>
    </header>
  );
};
