import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Calendar,
  Volume2,
  Brain,
  Trash2,
  Download,
  Eye,
} from 'lucide-react';
import { DreamEntry } from '../types';
import { exportDreamAsMarkdown } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import { getSafeDreamArtwork } from '../utils/dreamArtwork';

interface DreamCardProps {
  dream: DreamEntry;
  onSelect: (dream: DreamEntry) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const DreamCard: React.FC<DreamCardProps> = ({
  dream,
  onSelect,
  onToggleFavorite,
  onDelete,
}) => {
  const { t, language } = useLanguage();
  const archetypes = dream.interpretation?.archetypes || [];
  const dominantEmotion = dream.interpretation?.dominantEmotion || (language === 'it' ? 'Misterioso' : 'Mysterious');
  const symbols = dream.interpretation?.symbols || [];
  const [imageSrc, setImageSrc] = useState<string>(() => getSafeDreamArtwork(dream));

  useEffect(() => {
    setImageSrc(getSafeDreamArtwork(dream));
  }, [dream.id, dream.imageUrl]);

  return (
    <div
      id={`dream-card-${dream.id}`}
      onClick={() => onSelect(dream)}
      className="group relative bg-[#0f1526] hover:bg-[#131b30] border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
    >
      {/* Artwork Canvas / Header Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={imageSrc}
          alt={dream.title}
          referrerPolicy="no-referrer"
          onError={() => {
            setImageSrc(getSafeDreamArtwork(dream));
          }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1526] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Lucidity & Entry Type Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-indigo-300 flex items-center gap-1">
              <Eye className="w-3 h-3 text-indigo-400" />
              <span>{t.lucidity} {dream.lucidityRating}/10</span>
            </span>

            {dream.isSample || dream.id.startsWith('sample-dream') ? (
              <span
                className="px-2 py-0.5 rounded-md bg-amber-500/30 backdrop-blur-md border border-amber-400/40 text-[10px] font-semibold text-amber-200"
                title={t.sampleDreamTooltip}
              >
                {t.sampleDreamBadge || 'Demo'}
              </span>
            ) : dream.entryType === 'voice' || dream.audioDuration ? (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-[10px] font-semibold text-emerald-200">
                {t.recordedBadge || 'Voce'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-blue-500/30 backdrop-blur-md border border-blue-400/40 text-[10px] font-semibold text-blue-200">
                {t.writtenBadge || 'Scritto'}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleFavorite(dream.id, e)}
              className={`p-1.5 rounded-lg backdrop-blur-md border transition-colors ${
                dream.isFavorite
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-black/50 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title={dream.isFavorite ? t.favorites : t.favorites}
            >
              <Heart className={`w-3.5 h-3.5 ${dream.isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom image metadata */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300">
          <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-amber-300 font-medium">
            {dominantEmotion}
          </span>
          {dream.audioDuration && (
            <span className="flex items-center gap-1 text-slate-300 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded border border-white/10 text-[10px] font-mono">
              <Volume2 className="w-3 h-3 text-indigo-300" />
              <span>{dream.audioDuration}{t.audioSeconds}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(dream.createdAt).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h3 className="font-serif text-base font-bold text-slate-100 group-hover:text-amber-200 transition-colors line-clamp-1">
            {dream.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {dream.transcription}
          </p>
        </div>

        {/* Archetypes & Symbols Summary */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          {archetypes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Brain className="w-3 h-3 text-indigo-400 shrink-0" />
              {archetypes.slice(0, 2).map((a, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                >
                  {a.archetype}
                </span>
              ))}
              {archetypes.length > 2 && (
                <span className="text-[10px] text-slate-400">+{archetypes.length - 2}</span>
              )}
            </div>
          )}

          {symbols.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {symbols.slice(0, 3).map((s, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700/50"
                >
                  #{s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Quick Controls */}
        <div
          className="pt-2 flex items-center justify-between border-t border-slate-800/60 text-xs text-slate-400"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onSelect(dream)}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>{t.exploreArchetypes}</span>
            <span>→</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => exportDreamAsMarkdown(dream)}
              title={t.exportNoteTooltip}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => onDelete(dream.id, e)}
              title={t.deleteEntryTooltip}
              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
