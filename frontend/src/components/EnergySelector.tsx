import React from 'react';
import { EnergyLevel } from '../types';
import { Battery, BatteryMedium, BatteryCharging, Check } from 'lucide-react';

interface EnergySelectorProps {
  energy: EnergyLevel;
  onSelectEnergy: (energy: EnergyLevel) => void;
  compact?: boolean;
}

export const EnergySelector: React.FC<EnergySelectorProps> = ({
  energy,
  onSelectEnergy,
  compact = false,
}) => {
  const options: {
    level: EnergyLevel;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    colorClasses: string;
  }[] = [
    {
      level: 'low',
      label: 'Low Energy',
      sublabel: 'Lighter entries, micro-steps, or quiet rest',
      icon: <Battery className="w-4 h-4 text-brand-muted-clay" />,
      colorClasses: 'border-brand-muted-clay/40 bg-brand-muted-clay/10 text-brand-primary-text',
    },
    {
      level: 'medium',
      label: 'Medium Energy',
      sublabel: 'Balanced focus periods with regular breathers',
      icon: <BatteryMedium className="w-4 h-4 text-brand-interactive" />,
      colorClasses: 'border-brand-interactive/40 bg-brand-soft-leaf text-brand-primary-text',
    },
    {
      level: 'high',
      label: 'High Energy',
      sublabel: 'Tackle ambitious or higher-priority deep work',
      icon: <BatteryCharging className="w-4 h-4 text-brand-success" />,
      colorClasses: 'border-brand-fresh-leaf/50 bg-brand-fresh-leaf/15 text-brand-primary-text',
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center space-x-1.5 p-1 bg-brand-bg rounded-control border border-brand-border">
        {options.map((opt) => {
          const isSelected = energy === opt.level;
          return (
            <button
              key={opt.level}
              onClick={() => onSelectEnergy(opt.level)}
              className={`flex items-center px-2.5 py-1 rounded-control text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-brand-surface text-brand-primary-text shadow-xs border border-brand-border font-semibold'
                  : 'text-brand-secondary-text hover:text-brand-primary-text'
              }`}
            >
              <span className="mr-1">{opt.icon}</span>
              {opt.label.split(' ')[0]}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {options.map((opt) => {
        const isSelected = energy === opt.level;
        return (
          <button
            key={opt.level}
            onClick={() => onSelectEnergy(opt.level)}
            className={`p-3.5 rounded-card border text-left transition-all relative ${
              isSelected
                ? `${opt.colorClasses} ring-2 ring-brand-interactive border-transparent`
                : 'border-brand-border bg-brand-surface hover:bg-brand-soft-leaf/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                {opt.icon}
                <span className="text-sm font-semibold text-brand-primary-text">{opt.label}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-brand-interactive" />}
            </div>
            <p className="text-xs text-brand-secondary-text leading-relaxed">{opt.sublabel}</p>
          </button>
        );
      })}
    </div>
  );
};
