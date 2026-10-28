import React from 'react';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Trees,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'tasks', label: 'My Tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus Room', icon: <Timer className="w-4 h-4" /> },
    { id: 'reset', label: 'Reset Room', icon: <Trees className="w-4 h-4" /> },
    { id: 'stories', label: 'Mind Stories', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleSelect = (tab: NavigationTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-brand-primary-text/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-60 bg-brand-sidebar-forest text-brand-surface flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } border-r border-[#1B2722]`}
      >
        {/* Brand Header */}
        <div className="p-5">
          <div className="flex items-center space-x-2.5 mb-1.5">
            {/* Nature Brand Icon */}
            <div className="w-8 h-8 rounded-control bg-brand-interactive/60 flex items-center justify-center border border-brand-fresh-leaf/30 text-brand-fresh-leaf shadow-xs">
              <Trees className="w-5 h-5 text-brand-fresh-leaf" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-brand-surface font-sans">
                mindease
              </span>
            </div>
          </div>
          <p className="text-[12px] text-brand-fresh-leaf/80 font-normal ml-0.5">
            A little more room to think.
          </p>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-control text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-interactive text-brand-surface font-semibold shadow-xs'
                    : 'text-brand-surface/75 hover:bg-brand-deep-forest hover:text-brand-surface'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-brand-fresh-leaf' : 'text-brand-surface/60'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer & Disclosure */}
        <div className="p-4 border-t border-[#1C2923] text-left">
          <div className="bg-[#1C2923]/80 rounded-control p-2.5 mb-2.5 border border-brand-deep-forest">
            <div className="flex items-center text-[11px] font-semibold text-brand-fresh-leaf mb-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Team CodeXpress
            </div>
            <p className="text-[10px] text-brand-surface/60 leading-tight">
              Lead: Sumit Kumar Singh
            </p>
          </div>
          <p className="text-[11px] text-brand-surface/50 leading-relaxed font-sans">
            MindEase is a productivity aid, not a medical or diagnostic system.
          </p>
        </div>
      </aside>
    </>
  );
};
