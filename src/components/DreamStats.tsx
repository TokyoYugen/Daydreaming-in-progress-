import React from 'react';
import { Brain, Compass, Sparkles, Eye, TrendingUp, Moon } from 'lucide-react';
import { DreamEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DreamStatsProps {
  dreams: DreamEntry[];
  onSelectDream: (dream: DreamEntry) => void;
}

export const DreamStats: React.FC<DreamStatsProps> = ({ dreams, onSelectDream }) => {
  const { t, language } = useLanguage();
  // Aggregate Archetypes
  const archetypeCounts: Record<string, number> = {};
  const symbolCounts: Record<string, number> = {};
  const emotionCounts: Record<string, number> = {};
  let totalLucidity = 0;

  dreams.forEach((dream) => {
    totalLucidity += dream.lucidityRating || 5;

    if (dream.interpretation?.archetypes) {
      dream.interpretation.archetypes.forEach((a) => {
        archetypeCounts[a.archetype] = (archetypeCounts[a.archetype] || 0) + 1;
      });
    }

    if (dream.interpretation?.symbols) {
      dream.interpretation.symbols.forEach((s) => {
        symbolCounts[s.name] = (symbolCounts[s.name] || 0) + 1;
      });
    }

    if (dream.interpretation?.dominantEmotion) {
      const em = dream.interpretation.dominantEmotion;
      emotionCounts[em] = (emotionCounts[em] || 0) + 1;
    }
  });

  const avgLucidity = dreams.length > 0 ? (totalLucidity / dreams.length).toFixed(1) : '0';

  const sortedArchetypes = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1]);
  const sortedSymbols = Object.entries(symbolCounts).sort((a, b) => b[1] - a[1]);
  const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <Compass className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-serif font-bold text-slate-100">
            {t.subconsciousArchetypeMap}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {t.insightsSub}
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0f1526] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-xs font-medium">{t.recordedDreams}</span>
          <div className="text-2xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <span>{dreams.length}</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="bg-[#0f1526] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-xs font-medium">{t.uniqueArchetypes}</span>
          <div className="text-2xl font-bold font-serif text-indigo-300 flex items-center gap-2">
            <span>{sortedArchetypes.length}</span>
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>
        </div>

        <div className="bg-[#0f1526] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-xs font-medium">{t.symbolicAnchors}</span>
          <div className="text-2xl font-bold font-serif text-amber-300 flex items-center gap-2">
            <span>{sortedSymbols.length}</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <div className="bg-[#0f1526] border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-slate-400 text-xs font-medium">{t.avgLucidityScore}</span>
          <div className="text-2xl font-bold font-serif text-emerald-300 flex items-center gap-2">
            <span>{avgLucidity}/10</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Grid: Archetype Distribution & Recurring Symbols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Archetype Resonance */}
        <div className="bg-[#0f1526] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span>{t.archetypalFrequencies}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t.archetypeDesc}
          </p>

          <div className="space-y-3 pt-2">
            {sortedArchetypes.length > 0 ? (
              sortedArchetypes.map(([name, count]) => {
                const percentage = Math.round((count / dreams.length) * 100);
                return (
                  <div key={name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{name}</span>
                      <span className="text-slate-400 font-mono">
                        {count} {language === 'it' ? (count > 1 ? 'sogni' : 'sogno') : `dream${count > 1 ? 's' : ''}`} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 italic">{t.noArchetypesYet}</p>
            )}
          </div>
        </div>

        {/* Recurring Symbols & Motifs */}
        <div className="bg-[#0f1526] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.recurringSymbolLandscape}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t.recurringSymbolDesc}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {sortedSymbols.length > 0 ? (
              sortedSymbols.map(([symbolName, count]) => (
                <span
                  key={symbolName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/70 text-xs font-medium text-slate-300 hover:border-amber-400/50 hover:text-amber-200 transition-colors"
                >
                  <span>{symbolName}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                    {count}
                  </span>
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">{t.noSymbolsYet}</p>
            )}
          </div>

          {/* Dominant Emotional Climates */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-slate-300">
              {t.emotionalClimates}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sortedEmotions.map(([em, count]) => (
                <span
                  key={em}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-amber-950/30 border border-amber-500/30 text-amber-300"
                >
                  {em} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
