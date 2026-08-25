import React, { useState } from 'react';
import { Sparkles, X, Brain, Palette, RefreshCw, Wand2, PenTool } from 'lucide-react';
import { DreamEntry } from '../types';
import { fetchJson } from '../utils/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { generateDreamSvgArtwork } from '../utils/dreamArtwork';

interface ManualDreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDreamCreated: (dream: DreamEntry) => void;
}

export const ManualDreamModal: React.FC<ManualDreamModalProps> = ({
  isOpen,
  onClose,
  onDreamCreated,
}) => {
  const { t, language } = useLanguage();
  const [dreamText, setDreamText] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Surrealism (Salvador Dalí & René Magritte)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamText.trim()) return;

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const analysisData = await fetchJson<{
        interpretation?: any;
        imageUrl?: string | null;
        imagePrompt?: string;
      }>('/api/analyze-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamText: dreamText.trim(),
          stylePreference: selectedStyle,
          language: language,
        }),
      });

      const defaultTitle = language === 'it' ? 'Memoria Onirica Scritta' : 'Written Dream Memory';
      const finalTitle = customTitle.trim() || analysisData.interpretation?.title || defaultTitle;

      const initialGreeting = language === 'it'
        ? `Ho analizzato il tuo sogno **"${finalTitle}"**. Abbiamo identificato ${analysisData.interpretation?.archetypes?.length || 0} archetipi junghiani e ${analysisData.interpretation?.symbols?.length || 0} ancore simboliche. Quale simbolo o emozione vorresti esplorare?`
        : `I have analyzed your dream **"${finalTitle}"**. We identified ${analysisData.interpretation?.archetypes?.length || 0} Jungian archetypes and ${analysisData.interpretation?.symbols?.length || 0} symbolic anchors. Which symbol or feeling would you like to explore?`;

      const newDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: finalTitle,
        transcription: dreamText.trim(),
        imageUrl: analysisData.imageUrl || generateDreamSvgArtwork(finalTitle, selectedStyle, analysisData.interpretation?.dominantEmotion || 'Visione Onirica'),
        imagePrompt: analysisData.imagePrompt,
        interpretation: analysisData.interpretation,
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: initialGreeting,
            timestamp: new Date().toISOString(),
          },
        ],
        tags: [
          analysisData.interpretation?.dominantEmotion || 'Oneiric',
          ...(analysisData.interpretation?.symbols || []).slice(0, 3).map((s: any) => s.name),
        ],
        lucidityRating: analysisData.interpretation?.lucidityScore || 7,
        isFavorite: false,
        entryType: 'manual',
      };

      onDreamCreated(newDream);
      onClose();
    } catch (err: any) {
      console.error('Error analyzing dream (saving with zero-loss fallback):', err);
      const isIt = language === 'it';
      const defaultTitle = isIt ? 'Memoria Onirica Scritta' : 'Written Dream Memory';
      const finalTitle = customTitle.trim() || defaultTitle;

      const fallbackDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: finalTitle,
        transcription: dreamText.trim(),
        imageUrl: generateDreamSvgArtwork(finalTitle, selectedStyle, isIt ? 'Introspezione & Simbolismo' : 'Introspection & Symbolism'),
        interpretation: {
          title: finalTitle,
          summary: dreamText.trim().slice(0, 160) + '...',
          dominantEmotion: isIt ? 'Introspezione & Simbolismo' : 'Introspection & Symbolism',
          emotionIntensity: 7,
          lucidityScore: 7,
          surrealismAtmosphere: isIt ? 'Paesaggio Onirico Scritto' : 'Written Dreamscape',
          archetypes: [
            {
              archetype: isIt ? 'Il Sé' : 'The Self',
              presence: isIt ? 'Il nucleo interiore del racconto' : 'The inner core of the narrative',
              psychologicalMeaning: isIt ? 'La spinta della psiche verso l\'integrazione e la chiarezza.' : 'The psyche\'s drive toward integration and clarity.',
              integrationAdvice: isIt ? 'Rifletti sulle impressioni chiave emerse dal testo.' : 'Reflect on key impressions emerging from the text.',
            },
          ],
          symbols: [
            {
              name: isIt ? 'La Memoria Onirica' : 'The Dream Memory',
              category: 'figure',
              jungianMeaning: isIt ? 'Ponte tra conscio e inconscio.' : 'Bridge between conscious and unconscious.',
              archetypalResonance: isIt ? 'Processo di Individuazione' : 'Individuation Process',
              inquiryPrompt: isIt ? 'Quale sentimento ti suscita questo ricordo?' : 'What emotion does this memory evoke in you?',
            },
          ],
          subconsciousConflict: isIt ? 'Integrazione dell\'esperienza notturna' : 'Integration of the night experience',
          resolutionOrMessage: isIt ? 'La scrittura onirica ancora la saggezza dell\'inconscio.' : 'Dream journaling anchors unconscious wisdom.',
          wakingReflections: [
            isIt ? 'Come puoi portare questo simbolo nella tua giornata?' : 'How can you bring this symbol into your day?',
          ],
          activeImaginationPrompt: isIt ? 'Chiudi gli occhi e riprendi contatto con la scena del sogno.' : 'Close your eyes and reconnect with the scene in stillness.',
        },
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: isIt
              ? `Il tuo racconto **"${finalTitle}"** è stato salvato nel diario. Puoi dialogare con Carl Jung o generare l'opera surrealista.`
              : `Your written dream **"${finalTitle}"** has been saved to the journal. You can dialogue with Carl Jung or generate surrealist artwork.`,
            timestamp: new Date().toISOString(),
          },
        ],
        tags: [isIt ? 'Scritto' : 'Written', isIt ? 'Diario' : 'Journal'],
        lucidityRating: 7,
        isFavorite: false,
        entryType: 'manual',
      };

      onDreamCreated(fallbackDream);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInsertSample = () => {
    if (language === 'it') {
      setCustomTitle('Il Treno Celeste sullo Specchio Liquido');
      setDreamText(
        'Ero a bordo di un antico treno di legno decorato con sedili di velluto scuro che scivolava senza binari su una sconfinata distesa di vetro liquido riflettente sotto un\'eclissi. Nella carrozza ristorante, i passeggeri bevevano tè viola fluorescente da tazze scolpite in frammenti di meteorite. Un controllore con il volto costellato di galassie ha timbrato un biglietto a forma di chiave dorata dicendomi: "Sei arrivato alla stazione sospesa tra la memoria e il domani". Guardando fuori dal finestrino, enormi uccelli origami trasportavano lanterne galleggianti lungo l\'orizzonte.'
      );
    } else {
      setCustomTitle('The Celestial Train Over Liquid Glass');
      setDreamText(
        'I was riding an ornate wooden train with velvet seats that had no tracks beneath it—instead, it was gliding smoothly across a boundless sheet of mirror-like liquid glass under an eclipse. In the dining car, the passengers were drinking glowing violet tea from teacups carved out of meteorites. A conductor with a face made of constellations punched a ticket shaped like a golden key and told me: "You have arrived at the station between memory and tomorrow." When I looked out the window, giant origami birds were carrying floating lanterns across the horizon.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        id="manual-dream-modal"
        className="relative w-full max-w-2xl bg-[#0e1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <PenTool className="w-4 h-4 text-amber-300" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-slate-100">
                {t.recordNarrativeTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.recordNarrativeSub}
              </p>
            </div>
          </div>
          <button
            id="close-manual-modal-btn"
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t.dreamTitleOptional}
              </label>
              <button
                type="button"
                id="insert-sample-dream-btn"
                onClick={handleInsertSample}
                className="text-[11px] text-amber-400/90 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>{t.fillSampleDream}</span>
              </button>
            </div>
            <input
              id="manual-dream-title-input"
              type="text"
              placeholder={t.dreamTitlePlaceholder}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {t.narrativeSensoryDetails} <span className="text-red-400">*</span>
            </label>
            <textarea
              id="manual-dream-narrative-input"
              rows={6}
              required
              placeholder={t.narrativePlaceholder}
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          {/* Aesthetic selector */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.surrealistArtAesthetic}</span>
            </label>
            <select
              id="manual-art-style-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-[#131b2e] border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
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

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              id="cancel-manual-dream-btn"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              id="submit-manual-dream-btn"
              disabled={isProcessing || !dreamText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.analyzingAndGenerating}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5 text-amber-200" />
                  <span>{t.analyzeAndPaint}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
