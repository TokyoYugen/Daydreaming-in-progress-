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
    <header className="sticky top-0 z-40 bg-[#080c16]/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={onBackToGallery}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-amber-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:border-amber-400/50 transition-colors shadow-inner">
                <Moon className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif tracking-wider text-lg font-semibold text-slate-100 group-hover:text-amber-200 transition-colors">
                    NOCTURNE
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    {t.archetypalAiBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  {t.brandSubtitle}
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation Tabs for Desktop/Tablet */}
          {!selectedDream && (
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
              <button
                id="tab-journal-btn"
                onClick={() => setActiveTab('journal')}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'journal'
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.dreamRecordsTab} ({dreams.length})</span>
              </button>
              <button
                id="tab-insights-btn"
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === 'insights'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.archetypeMapTab}</span>
              </button>
            </div>
          )}

          {/* Action Controls & Top Right Switch */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {selectedDream ? (
              <button
                id="back-to-journal-btn"
                onClick={onBackToGallery}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 font-medium transition-all"
              >
                {t.backToJournal}
              </button>
            ) : (
              <button
                id="export-dreams-btn"
                onClick={() => exportDreamsAsJSON(dreams)}
                title={t.exportJsonTooltip}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden sm:flex items-center justify-center min-h-[40px] min-w-[40px]"
              >
                <Download className="w-4 h-4" />
              </button>
            )}

            {/* Language Selector Switch (UK & Italy flags) */}
            <LanguageSwitch />

            {/* Text Entry Option */}
            <button
              id="open-manual-entry-btn"
              onClick={onOpenManualEntry}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors min-h-[40px]"
              title={t.writeDream}
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">{t.writeDream}</span>
              <span className="md:hidden hidden sm:inline">{t.writeShort || 'Scrivi'}</span>
            </button>

            {/* Primary Voice Wake Recording Button */}
            <button
              id="open-voice-recorder-btn"
              onClick={onOpenVoiceRecorder}
              className="relative group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium shadow-lg shadow-indigo-500/20 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[40px]"
            >
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <Mic className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-200" />
              <span className="font-medium whitespace-nowrap hidden md:inline">{t.recordWakingDream}</span>
              <span className="font-medium whitespace-nowrap md:hidden">{t.recordShort || 'Registra'}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 opacity-80 hidden sm:inline" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        {!selectedDream && (
          <div className="flex sm:hidden items-center justify-center gap-2 pt-2.5 mt-2 border-t border-slate-800/60">
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'journal'
                  ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.tabJournalShort || 'Diario'} ({dreams.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'insights'
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tabInsightsShort || 'Archetipi'}</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
