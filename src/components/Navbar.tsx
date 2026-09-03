import React from 'react';
import { Sparkles, Moon, Mic, Plus, Compass, BookOpen, Download } from 'lucide-react';
import { DreamEntry } from '../types';
import { exportDreamsAsJSON } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSwitch } from './LanguageSwitch';

interface NavbarProps {
  dreams: DreamEntry[];
  activeTab: 'journal' | 'insights';
  setActiveTab: (tab: 'journal' | 'insights') => void;
  onOpenVoiceRecorder: () => void;
  onOpenManualEntry: () => void;
  selectedDream: DreamEntry | null;
  onBackToGallery: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  dreams,
  activeTab,
  setActiveTab,
  onOpenVoiceRecorder,
  onOpenManualEntry,
  selectedDream,
  onBackToGallery,
}) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#080c16]/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="brand-logo-btn"
              onClick={onBackToGallery}
              className="flex items-center gap-2 sm:gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-amber-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:border-amber-400/50 transition-colors shadow-inner shrink-0">
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-serif tracking-wider text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors whitespace-nowrap">
                    NOCTURNE
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 shadow-2xs shrink-0 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shrink-0" />
                    {t.archetypalAiBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden xl:block truncate max-w-[200px]">
                  {t.brandSubtitle}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs for Desktop (>= lg: 1024px) */}
          {!selectedDream && (
            <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
              <button
                id="tab-journal-btn"
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'journal'
                    ? 'bg-indigo-600/30 text-indigo-100 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
                <span className="whitespace-nowrap">{t.dreamRecordsTab}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono leading-none border border-indigo-500/30">
                  {dreams.length}
                </span>
              </button>
              <button
                id="tab-insights-btn"
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeTab === 'insights'
                    ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span className="whitespace-nowrap">{t.archetypeMapTab}</span>
              </button>
            </nav>
          )}

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {selectedDream ? (
              <button
                id="back-to-journal-btn"
                onClick={onBackToGallery}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-all shrink-0 whitespace-nowrap"
              >
                {t.backToJournal}
              </button>
            ) : (
              <button
                id="export-dreams-btn"
                onClick={() => exportDreamsAsJSON(dreams)}
                title={t.exportJsonTooltip}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden md:flex items-center justify-center min-h-[38px] min-w-[38px] shrink-0"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Language Selector Switch (UK & Italy flags) */}
            <LanguageSwitch className="shrink-0" />

            {/* Text Entry Option */}
            <button
              id="open-manual-entry-btn"
              onClick={onOpenManualEntry}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors shrink-0 whitespace-nowrap min-h-[38px]"
              title={t.writeDream}
            >
              <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{t.writeDream}</span>
            </button>

            {/* Primary Voice Wake Recording Button */}
            <button
              id="open-voice-recorder-btn"
              onClick={onOpenVoiceRecorder}
              className="relative group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-600/20 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 whitespace-nowrap min-h-[38px]"
            >
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
              <Mic className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-200 shrink-0" />
              <span className="font-medium whitespace-nowrap hidden sm:inline">{t.recordWakingDream}</span>
              <span className="font-medium whitespace-nowrap sm:hidden">{t.recordShort || 'Registra'}</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher for Tablets & Mobile (< lg: 1024px) */}
        {!selectedDream && (
          <nav className="flex lg:hidden items-center justify-center gap-2 pt-2 mt-2 border-t border-slate-800/60 w-full">
            <button
              id="mobile-tab-journal-btn"
              onClick={() => setActiveTab('journal')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'journal'
                  ? 'bg-indigo-600/30 text-indigo-100 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
              <span className="whitespace-nowrap">{t.dreamRecordsTab}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono leading-none border border-indigo-500/30">
                {dreams.length}
              </span>
            </button>
            <button
              id="mobile-tab-insights-btn"
              onClick={() => setActiveTab('insights')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                activeTab === 'insights'
                  ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="whitespace-nowrap">{t.archetypeMapTab}</span>
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
