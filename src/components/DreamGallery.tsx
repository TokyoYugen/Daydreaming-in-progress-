import React, { useState } from 'react';
import { Search, Sparkles, Filter, Mic, Plus, Eye, Heart } from 'lucide-react';
import { DreamEntry } from '../types';
import { DreamCard } from './DreamCard';
import { useLanguage } from '../context/LanguageContext';

interface DreamGalleryProps {
  dreams: DreamEntry[];
  onSelectDream: (dream: DreamEntry) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteDream: (id: string, e: React.MouseEvent) => void;
  onOpenVoiceRecorder: () => void;
  onOpenManualEntry: () => void;
}

export const DreamGallery: React.FC<DreamGalleryProps> = ({
  dreams,
  onSelectDream,
  onToggleFavorite,
  onDeleteDream,
  onOpenVoiceRecorder,
  onOpenManualEntry,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'lucidity'>('newest');

  // Collect all unique tags and archetypes
  const allTags = Array.from(
    new Set(
      dreams.flatMap((d) => [
        ...(d.tags || []),
        ...(d.interpretation?.archetypes || []).map((a) => a.archetype),
      ])
    )
  );

  const filteredDreams = dreams
    .filter((dream) => {
      if (onlyFavorites && !dream.isFavorite) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = dream.title.toLowerCase().includes(q);
        const matchesNarrative = dream.transcription.toLowerCase().includes(q);
        const matchesSummary = dream.interpretation?.summary?.toLowerCase().includes(q);
        const matchesArchetype = (dream.interpretation?.archetypes || []).some((a) =>
          a.archetype.toLowerCase().includes(q)
        );
        const matchesSymbol = (dream.interpretation?.symbols || []).some((s) =>
          s.name.toLowerCase().includes(q)
        );
        if (
          !matchesTitle &&
          !matchesNarrative &&
          !matchesSummary &&
          !matchesArchetype &&
          !matchesSymbol
        ) {
          return false;
        }
      }

      if (selectedTag !== 'all') {
        const hasTag = dream.tags?.includes(selectedTag);
        const hasArchetype = dream.interpretation?.archetypes?.some(
          (a) => a.archetype === selectedTag
        );
        if (!hasTag && !hasArchetype) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'lucidity') {
        return (b.lucidityRating || 0) - (a.lucidityRating || 0);
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950/70 via-[#10172a] to-purple-950/60 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.heroKicker}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100 leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {t.heroDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              id="hero-record-voice-btn"
              onClick={onOpenVoiceRecorder}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <Mic className="w-4 h-4 text-amber-200" />
              <span>{t.recordWakingVoice}</span>
            </button>

            <button
              id="hero-write-dream-btn"
              onClick={onOpenManualEntry}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-400" />
              <span>{t.writeDream}</span>
            </button>
          </div>
        </div>

        {/* Decorative background orb */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0e1424] p-3 rounded-2xl border border-slate-800/80">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="dream-search-input"
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Favorite Toggle */}
          <button
            id="toggle-only-favorites-btn"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              onlyFavorites
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'bg-[#131b2e] border-slate-700/80 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-400' : ''}`} />
            <span className="hidden sm:inline">{t.favorites}</span>
          </button>

          {/* Sort Selector */}
          <select
            id="gallery-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#131b2e] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
          >
            <option value="newest">{t.sortByNewest}</option>
            <option value="oldest">{t.sortByOldest}</option>
            <option value="lucidity">{t.sortByLucidity}</option>
          </select>
        </div>
      </div>

      {/* Tag Pills */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedTag === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.allDreams} ({dreams.length})
          </button>
          {allTags.slice(0, 12).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'all' : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTag === tag
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Dream Grid */}
      {filteredDreams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDreams.map((dream) => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onSelect={onSelectDream}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDeleteDream}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#0f1526] border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <Mic className="w-7 h-7 text-amber-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {t.noDreamsFound}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {t.noDreamsSub}
            </p>
          </div>
          <button
            onClick={onOpenVoiceRecorder}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2"
          >
            <Mic className="w-4 h-4 text-amber-200" />
            <span>{t.recordNow}</span>
          </button>
        </div>
      )}
    </div>
  );
};
