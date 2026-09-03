import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Palette,
  Brain,
  MessageSquare,
  Compass,
  ArrowLeft,
  Download,
  Share2,
  Maximize2,
  RefreshCw,
  Eye,
  Heart,
  BookOpen,
  HelpCircle,
  Flame,
  CheckCircle2,
  ChevronRight,
  ImageIcon,
} from 'lucide-react';
import { DreamEntry, DreamSymbol, JungianArchetypeAnalysis } from '../types';
import { SymbolChat } from './SymbolChat';
import { exportDreamAsMarkdown } from '../utils/storage';
import { fetchJson } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { getSafeDreamArtwork, generateDreamSvgArtwork } from '../utils/dreamArtwork';
import { localizeArchetypeName, localizeSymbolName, localizeEmotionName } from '../utils/translations';

interface DreamViewerProps {
  dream: DreamEntry;
  onBack: () => void;
  onUpdateDream: (updatedDream: DreamEntry) => void;
}

export const DreamViewer: React.FC<DreamViewerProps> = ({
  dream,
  onBack,
  onUpdateDream,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'interpretation' | 'chat'>('interpretation');
  const [activeSymbolForChat, setActiveSymbolForChat] = useState<DreamSymbol | null>(null);
  const [isRegeneratingArt, setIsRegeneratingArt] = useState(false);
  const [artErrorMessage, setArtErrorMessage] = useState<string | null>(null);
  const [showArtPromptModal, setShowArtPromptModal] = useState(false);
  const [customArtPrompt, setCustomArtPrompt] = useState(dream.imagePrompt || '');
  const [customArtStyle, setCustomArtStyle] = useState(
    dream.interpretation?.artStyle || 'Surrealism (Salvador Dalí & René Magritte)'
  );
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(() => getSafeDreamArtwork(dream));

  useEffect(() => {
    setImageSrc(getSafeDreamArtwork(dream));
    setCustomArtPrompt(dream.imagePrompt || dream.title);
  }, [dream.id, dream.imageUrl]);

  const inter = dream.interpretation;

  const handleDownloadArtwork = () => {
    try {
      const a = document.createElement('a');
      a.href = imageSrc;
      a.download = `${(dream.title || 'dream').toLowerCase().replace(/[^a-z0-9]/gi, '_')}-artwork.png`;
      if (imageSrc.includes('image/svg+xml')) {
        a.download = `${(dream.title || 'dream').toLowerCase().replace(/[^a-z0-9]/gi, '_')}-artwork.svg`;
      }
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleRegenerateArt = async () => {
    try {
      setIsRegeneratingArt(true);
      setArtErrorMessage(null);
      const promptToUse = customArtPrompt || dream.imagePrompt || dream.title;

      console.log(`[DreamViewer ART] Initiating art regeneration for "${dream.title}" with style: "${customArtStyle}" and prompt: "${promptToUse.slice(0, 100)}..."`);
      const data = await fetchJson<{
        imageUrl?: string;
        prompt?: string;
      }>('/api/generate-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          style: customArtStyle,
          dreamTitle: dream.title,
          emotion: dream.interpretation?.dominantEmotion,
        }),
      });

      console.log(`[DreamViewer ART SUCCESS] Server returned artwork response. ImageUrl length: ${data.imageUrl?.length || 0} chars | Prefix: "${data.imageUrl?.slice(0, 45)}..."`);

      if (data.imageUrl) {
        setImageSrc(data.imageUrl);
        onUpdateDream({
          ...dream,
          imageUrl: data.imageUrl,
          imagePrompt: data.prompt,
        });
        setShowArtPromptModal(false);
      } else {
        console.warn(`[DreamViewer ART WARN] No imageUrl in server response, generating client procedural SVG.`);
        const proceduralArt = generateDreamSvgArtwork(
          dream.title,
          customArtStyle,
          dream.interpretation?.dominantEmotion || 'Surrealist Vision'
        );
        setImageSrc(proceduralArt);
        onUpdateDream({
          ...dream,
          imageUrl: proceduralArt,
          imagePrompt: promptToUse,
        });
        setShowArtPromptModal(false);
      }
    } catch (err: any) {
      console.error('[DreamViewer ART ERROR] Art regeneration server call failed:', err);
      const promptToUse = customArtPrompt || dream.imagePrompt || dream.title;
      const proceduralArt = generateDreamSvgArtwork(
        dream.title,
        customArtStyle,
        dream.interpretation?.dominantEmotion || 'Surrealist Vision'
      );
      setImageSrc(proceduralArt);
      onUpdateDream({
        ...dream,
        imageUrl: proceduralArt,
        imagePrompt: promptToUse,
      });
      setShowArtPromptModal(false);
    } finally {
      setIsRegeneratingArt(false);
    }
  };

  const handleAskAboutSymbol = (symbol: DreamSymbol) => {
    setActiveSymbolForChat(symbol);
    setActiveTab('chat');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8 animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          id="back-btn"
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToJournal}</span>
        </button>

        {/* View Switcher: Interpretation vs Symbol Chat */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            id="tab-view-interpretation"
            onClick={() => setActiveTab('interpretation')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'interpretation'
                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{t.psychologicalInterpretation}</span>
          </button>

          <button
            id="tab-view-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.symbolDialogue} ({dream.chatHistory.length})</span>
          </button>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          <button
            id="export-single-dream-md-btn"
            onClick={() => exportDreamAsMarkdown(dream, language)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.exportNote}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Artwork + Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Surrealist Art Canvas (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl">
            <div className="relative aspect-[4/3] w-full bg-slate-900 overflow-hidden">
              <img
                src={imageSrc}
                alt={dream.title}
                referrerPolicy="no-referrer"
                onLoad={() => {
                  console.log(`[DreamViewer LOADED] Main artwork successfully rendered for "${dream.title}" (${dream.id}).`);
                }}
                onError={() => {
                  console.warn(`[DreamViewer FALLBACK] Main artwork load failed for "${dream.title}" (${dream.id}). Applying fallback SVG canvas.`);
                  const fallback = getSafeDreamArtwork({ ...dream, imageUrl: undefined });
                  setImageSrc(fallback);
                }}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                onClick={() => setIsImageFullscreen(true)}
              />

              {/* Floating Quick Action Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                <button
                  id="download-art-btn"
                  onClick={handleDownloadArtwork}
                  className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/20 hover:bg-black/80 transition-colors shadow-lg"
                  title={language === 'it' ? 'Scarica Dipinto' : 'Download Artwork'}
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  id="fullscreen-art-btn"
                  onClick={() => setIsImageFullscreen(true)}
                  className="p-2 rounded-lg bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/20 hover:bg-black/80 transition-colors shadow-lg"
                  title={language === 'it' ? 'Espandi a Schermo Intero' : 'Expand Artwork'}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtle Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

              {/* Regenerate Floating Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[11px] font-medium text-amber-200/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 truncate max-w-[200px]">
                  {inter?.artStyle || 'Surrealist Fine Art'}
                </span>
                <button
                  id="quick-regenerate-art-btn"
                  onClick={handleRegenerateArt}
                  disabled={isRegeneratingArt}
                  className="px-2.5 py-1 rounded-md bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-indigo-400/30 transition-all shadow-md"
                >
                  {isRegeneratingArt ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-amber-300" />
                  )}
                  <span>{language === 'it' ? 'Rigenera' : 'Regenerate'}</span>
                </button>
              </div>
            </div>

            {/* Art Meta Footer */}
            <div className="p-3.5 bg-[#0f1629] border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-500">{t.aesthetic}:</span>{' '}
                <span className="text-amber-300/90 font-medium">
                  {inter?.artStyle || 'Surrealist Masterpiece'}
                </span>
              </div>
              <button
                id="customize-art-btn"
                onClick={() => setShowArtPromptModal(true)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Palette className="w-3 h-3" />
                <span>{t.fineTuneArt}</span>
              </button>
            </div>
          </div>

          {/* Dream Narrative Transcription Card */}
          <div className="bg-[#0f1629] border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.wakingDreamNarrative}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(dream.createdAt).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US')}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              &ldquo;{dream.transcription}&rdquo;
            </p>

            {/* Tags */}
            {dream.tags && dream.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {dream.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Multi-tab Content (7 cols) */}
        <div className="lg:col-span-7">
          {activeTab === 'interpretation' ? (
            <div className="space-y-6">
              {/* Header Title & Atmosphere Banner */}
              <div className="bg-gradient-to-br from-[#12192e] to-[#0c1120] border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {dream.isSample || dream.id.startsWith('sample-dream') ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
                        {t.sampleDreamBadge || 'Demo / Esempio'}
                      </span>
                    ) : dream.entryType === 'voice' || dream.audioDuration ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                        {t.recordedBadge || 'Voce'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-semibold">
                        {t.writtenBadge || 'Scritto'}
                      </span>
                    )}

                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-mono">
                      {t.atmosphere}: {inter?.surrealismAtmosphere || (language === 'it' ? 'Trascendenza Onirica' : 'Oneiric Transcendence')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono">
                      {t.dominantEmotion}: {localizeEmotionName(inter?.dominantEmotion || '', language) || (language === 'it' ? 'Riflessivo' : 'Reflective')} (
                      {inter?.emotionIntensity || 7}/10)
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 leading-tight">
                    {dream.title}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-l-2 border-amber-400/60 pl-3.5 py-0.5">
                  {inter?.summary}
                </p>

                {/* Conflict and Compensatory Message */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-rose-400 font-semibold block">
                      {t.subconsciousTension}
                    </span>
                    <p className="text-xs text-slate-300">
                      {inter?.subconsciousConflict || (language === 'it' ? 'Integrazione tra desideri coscienti e aspirazioni latenti.' : 'Integration of conscious and unlived desires.')}
                    </p>
                  </div>
                  <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 font-semibold block">
                      {t.compensatoryMessage}
                    </span>
                    <p className="text-xs text-slate-300">
                      {inter?.resolutionOrMessage || (language === 'it' ? 'La psiche incoraggia la resa cosciente alla trasformazione interiore.' : 'The psyche encourages conscious surrender to transformation.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Recognized Jungian Archetypes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    <span>{t.recognizedArchetypes}</span>
                  </h2>
                  <span className="text-xs text-slate-400">
                    {inter?.archetypes?.length || 0} {t.identified}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {(inter?.archetypes || []).map((arch, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0f1629] border border-slate-800 hover:border-indigo-500/40 rounded-xl p-4 space-y-2.5 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-200 font-serif tracking-wide bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-500/30">
                          {localizeArchetypeName(arch.archetype, language)}
                        </span>
                        <span className="text-[11px] text-slate-400 italic">
                          {t.manifestation}: {arch.presence}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-indigo-300 font-medium">{t.psychologicalMeaning}: </strong>
                        {arch.psychologicalMeaning}
                      </p>

                      <div className="pt-1.5 border-t border-slate-800/80 flex items-start gap-2 text-xs text-emerald-300/90">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>
                          <strong className="font-semibold text-emerald-400">{t.integration}: </strong>
                          {arch.integrationAdvice}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Symbolic Anchors & Inquiry Questions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>{t.symbolicAnchors}</span>
                  </h2>
                  <span className="text-xs text-slate-400">{t.clickToInquire}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(inter?.symbols || []).map((sym, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0f1629] border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                            {localizeSymbolName(sym.name, language)}
                          </h4>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {sym.category}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {sym.jungianMeaning}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <p className="text-[11px] text-amber-300/90 italic">
                          &ldquo;{sym.inquiryPrompt}&rdquo;
                        </p>

                        <button
                          onClick={() => handleAskAboutSymbol(sym)}
                          className="w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-200 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{t.askAnalystAboutThis}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Waking Reflections & Active Imagination */}
              <div className="bg-[#0f1629] border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.wakingIntegrationTitle}</span>
                </h3>

                {inter?.wakingReflections && inter.wakingReflections.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-slate-400">
                      {t.reflectiveJournaling}
                    </span>
                    <ul className="space-y-2">
                      {inter.wakingReflections.map((ref, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{ref}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {inter?.activeImaginationPrompt && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-purple-950/20 border border-indigo-500/30 space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-300 uppercase font-mono tracking-wider block">
                      {t.activeImaginationExercise}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {inter.activeImaginationPrompt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Symbol Chat View */
            <div className="h-[750px]">
              <SymbolChat
                dream={dream}
                onUpdateDream={onUpdateDream}
                activeSymbolFocus={activeSymbolForChat}
              />
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Fullscreen Image Modal */}
      {isImageFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-fadeIn"
          onClick={() => setIsImageFullscreen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={imageSrc}
              alt={dream.title}
              referrerPolicy="no-referrer"
              onError={() => {
                setImageSrc(getSafeDreamArtwork(dream));
              }}
              className="max-h-[80vh] w-auto object-contain rounded-xl shadow-2xl border border-slate-700"
            />
            <div className="flex items-center justify-between w-full mt-3 px-2">
              <p className="text-xs text-slate-300 max-w-xl truncate">
                {dream.imagePrompt || dream.title}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadArtwork}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'it' ? 'Scarica' : 'Download'}</span>
                </button>
                <button
                  onClick={() => setIsImageFullscreen(false)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs text-white"
                >
                  {language === 'it' ? 'Chiudi' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fine-tune Art Prompt Modal */}
      {showArtPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e1424] border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span>{t.fineTuneArt}</span>
              </h3>
              <button
                onClick={() => setShowArtPromptModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                {language === 'it' ? 'Prompt Visivo Artistico' : 'Visual Art Prompt'}
              </label>
              <textarea
                rows={4}
                value={customArtPrompt}
                onChange={(e) => setCustomArtPrompt(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                {language === 'it' ? 'Stile Pittorico' : 'Painterly Style'}
              </label>
              <select
                value={customArtStyle}
                onChange={(e) => setCustomArtStyle(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Surrealism (Salvador Dalí & René Magritte)">
                  {t.styleDali}
                </option>
                <option value="Alchemical Mysticism (Remedios Varo & Leonora Carrington)">
                  {t.styleAlchemical}
                </option>
                <option value="Metaphysical Melancholy (Giorgio de Chirico)">
                  {t.styleMetaphysical}
                </option>
                <option value="Bioluminescent Dreamscape (Odilon Redon & Yves Tanguy)">
                  {t.styleBiomorphic}
                </option>
              </select>
            </div>

            {artErrorMessage && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-200">
                {artErrorMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowArtPromptModal(false);
                  setArtErrorMessage(null);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleRegenerateArt}
                disabled={isRegeneratingArt}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {isRegeneratingArt ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{language === 'it' ? 'Genera Opera d\'Arte' : 'Generate Artwork'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
