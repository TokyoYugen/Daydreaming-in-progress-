import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Square,
  Sparkles,
  X,
  AlertCircle,
  Brain,
  Palette,
  Volume2,
  CheckCircle2,
  RefreshCw,
  Wand2,
  Edit3,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { WakingVoiceRecorder, AudioRecordingResult } from '../utils/audioRecorder';
import { fetchJson } from '../utils/apiClient';
import { DreamEntry } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { generateDreamSvgArtwork } from '../utils/dreamArtwork';

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDreamCreated: (dream: DreamEntry) => void;
}

type PipelineStep =
  | 'idle'
  | 'recording'
  | 'transcribing'
  | 'review'
  | 'analyzing'
  | 'complete';

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onDreamCreated,
}) => {
  const { t, language } = useLanguage();
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Partial results as pipeline progresses
  const [transcribedText, setTranscribedText] = useState('');
  const [dreamTitle, setDreamTitle] = useState('');
  const [audioResult, setAudioResult] = useState<AudioRecordingResult | null>(null);
  const [selectedArtStyle, setSelectedArtStyle] = useState(
    'Surrealism (Salvador Dalí & René Magritte)'
  );

  const recorderRef = useRef<WakingVoiceRecorder | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize recorder
  useEffect(() => {
    if (isOpen) {
      setPipelineStep('idle');
      setRecordingSeconds(0);
      setVolumeLevel(0);
      setErrorMessage(null);
      setTranscribedText('');
      setDreamTitle('');
      setAudioResult(null);
    } else {
      if (recorderRef.current && recorderRef.current.isRecording) {
        recorderRef.current.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  }, [isOpen]);

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const recorder = new WakingVoiceRecorder();
      recorderRef.current = recorder;

      recorder.onVolumeUpdate = (vol) => {
        setVolumeLevel(vol);
      };

      await recorder.start();
      setPipelineStep('recording');
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? (language === 'it' 
              ? "Accesso al microfono negato. Consenti l'uso del microfono nelle impostazioni del browser per registrare il tuo sogno."
              : 'Microphone permission was denied. Please allow microphone access in your browser settings to record your dream.')
          : err.message || (language === 'it' ? 'Impossibile avviare la registrazione dal microfono.' : 'Failed to start microphone recording.')
      );
      setPipelineStep('idle');
    }
  };

  const cleanErrorMessage = (err: any): string => {
    const raw = err?.message || String(err);
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
      if (parsed?.error && typeof parsed.error === 'string') {
        return parsed.error;
      }
    } catch {
      // not json
    }
    return raw;
  };

  const stopAndTranscribeRecording = async () => {
    if (!recorderRef.current || !recorderRef.current.isRecording) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    try {
      const result = await recorderRef.current.stop();
      setAudioResult(result);
      setPipelineStep('transcribing');

      const transcribeData = await fetchJson<{
        transcription?: string;
        suggestedTitle?: string;
        detectedTone?: string;
        clarityScore?: number;
      }>('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: result.base64,
          mimeType: result.mimeType,
          language: language,
        }),
      });

      const rawTranscription = transcribeData.transcription || '';
      const suggestedTitle = transcribeData.suggestedTitle || (language === 'it' ? 'Ricordo Onirico al Risveglio' : 'Waking Dream Memory');

      setTranscribedText(rawTranscription);
      setDreamTitle(suggestedTitle);
      setPipelineStep('review');
    } catch (err: any) {
      console.error('Recording/transcribe error (moving to review with edit):', err);
      setErrorMessage(cleanErrorMessage(err));
      setDreamTitle(language === 'it' ? 'Ricordo Onirico al Risveglio' : 'Waking Dream Memory');
      setTranscribedText(
        transcribedText ||
          (language === 'it'
            ? 'Ho registrato la mia memoria onirica al risveglio. Modifica questo testo per aggiungere o perfezionare i dettagli.'
            : 'Recorded dream memory upon waking. Edit this text to refine your memories.')
      );
      setPipelineStep('review');
    }
  };

  const saveDirectlyWithoutWaiting = () => {
    const textToSave = transcribedText.trim();
    if (!textToSave) return;

    const titleToUse = dreamTitle.trim() || (language === 'it' ? 'Ricordo Onirico al Risveglio' : 'Waking Dream Memory');
    const isIt = language === 'it';

    const newDream: DreamEntry = {
      id: `dream-${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: titleToUse,
      transcription: textToSave,
      audioDuration: audioResult?.durationSeconds || recordingSeconds || 30,
      imageUrl: generateDreamSvgArtwork(titleToUse, selectedArtStyle, isIt ? 'Profonda Risonanza' : 'Deep Resonance'),
      interpretation: {
        title: titleToUse,
        summary: textToSave.slice(0, 160) + (textToSave.length > 160 ? '...' : ''),
        dominantEmotion: isIt ? 'Profonda Risonanza' : 'Deep Resonance',
        emotionIntensity: 7,
        lucidityScore: 7,
        surrealismAtmosphere: isIt ? 'Visione Onirica al Risveglio' : 'Waking Oneiric Impression',
        archetypes: [
          {
            archetype: isIt ? 'Il Sé' : 'The Self',
            presence: isIt ? 'L\'esperienza onirica diretta' : 'The direct dream experience',
            psychologicalMeaning: isIt ? 'Manifestazione del mondo interiore verso l\'integrazione cosciente.' : 'Manifestation of the inner world toward conscious integration.',
            integrationAdvice: isIt ? 'Rifletti sulle sensazioni provate al risveglio.' : 'Reflect on the immediate emotional feelings upon waking.',
          },
        ],
        symbols: [
          {
            name: isIt ? 'Il Viaggio Onirico' : 'The Dream Journey',
            category: 'action',
            jungianMeaning: isIt ? 'Esplorazione dei territori dell\'inconscio.' : 'Exploration of unconscious psychic territory.',
            archetypalResonance: isIt ? 'Processo di individuazione' : 'Individuation process',
            inquiryPrompt: isIt ? 'Quale messaggio ti ha lasciato questa esperienza?' : 'What message has this experience left with you?',
          },
        ],
        subconsciousConflict: isIt ? 'Integrazione tra inconscio e veglia' : 'Integrating subconscious feelings with waking awareness',
        resolutionOrMessage: isIt ? 'Accogli la saggezza dei tuoi simboli notturni.' : 'Trust the intuitive symbols arising from sleep.',
        wakingReflections: [
          isIt ? 'Come risuona questo sogno nella tua giornata?' : 'How does this dream resonate in your day today?',
        ],
        activeImaginationPrompt: isIt ? 'Richiama alla mente l\'immagine più vivida prima di dormire.' : 'Recall the most vivid image in quiet contemplation.',
      },
      chatHistory: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: isIt
            ? `Ho salvato il tuo sogno **"${titleToUse}"** nel diario. Puoi avviare un dialogo di approfondimento o rigenerare l'opera surrealista in qualunque momento.`
            : `I have saved your dream **"${titleToUse}"** to the journal. You can dialogue with Carl Jung or generate surrealist artwork at any time.`,
          timestamp: new Date().toISOString(),
        },
      ],
      tags: [isIt ? 'Voce' : 'Voice', isIt ? 'Risveglio' : 'Waking'],
      lucidityRating: 7,
      isFavorite: false,
      entryType: 'voice',
    };

    onDreamCreated(newDream);
    onClose();
  };

  const executeAnalysisAndArt = async () => {
    if (!transcribedText.trim()) return;

    const isIt = language === 'it';
    const titleToUse = dreamTitle.trim() || (isIt ? 'Ricordo Onirico al Risveglio' : 'Waking Dream Memory');

    try {
      setErrorMessage(null);
      setPipelineStep('analyzing');

      const analysisData = await fetchJson<{
        interpretation?: any;
        imageUrl?: string | null;
        imagePrompt?: string;
      }>('/api/analyze-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dreamText: transcribedText.trim(),
          stylePreference: selectedArtStyle,
          language: language,
        }),
      });

      setPipelineStep('complete');

      const finalTitle = dreamTitle.trim() || analysisData.interpretation?.title || titleToUse;
      const initialGreeting = isIt
        ? `Ho analizzato il tuo sogno **"${finalTitle}"**. Abbiamo identificato ${analysisData.interpretation?.archetypes?.length || 0} archetipi junghiani fondamentali e ${analysisData.interpretation?.symbols?.length || 0} simboli dominanti. Quale particolare momento o sensazione vorresti esplorare più a fondo?`
        : `I have analyzed your dream **"${finalTitle}"**. We identified ${analysisData.interpretation?.archetypes?.length || 0} core Jungian archetypes and ${analysisData.interpretation?.symbols?.length || 0} dominant symbols. What particular moment or feeling would you like to explore deeper?`;

      const newDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: finalTitle,
        transcription: transcribedText.trim(),
        audioDuration: audioResult?.durationSeconds || recordingSeconds || 30,
        imageUrl: analysisData.imageUrl || generateDreamSvgArtwork(finalTitle, selectedArtStyle, analysisData.interpretation?.dominantEmotion || 'Visione Onirica'),
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
          analysisData.interpretation?.dominantEmotion || (isIt ? 'Onirico' : 'Oneiric'),
          ...(analysisData.interpretation?.symbols || []).slice(0, 3).map((s: any) => s.name),
        ],
        lucidityRating: analysisData.interpretation?.lucidityScore || 7,
        isFavorite: false,
        entryType: 'voice',
      };

      setTimeout(() => {
        onDreamCreated(newDream);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Analysis pipeline failed (saving with resilient fallback):', err);
      // Even if AI analysis service had an issue, SAVE THE DREAM so user never loses it
      const fallbackDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: titleToUse,
        transcription: transcribedText.trim(),
        audioDuration: audioResult?.durationSeconds || recordingSeconds || 30,
        imageUrl: generateDreamSvgArtwork(titleToUse, selectedArtStyle, isIt ? 'Mistero & Riflessione' : 'Mystery & Reflection'),
        interpretation: {
          title: titleToUse,
          summary: transcribedText.trim().slice(0, 160) + '...',
          dominantEmotion: isIt ? 'Mistero & Riflessione' : 'Mystery & Reflection',
          emotionIntensity: 7,
          lucidityScore: 7,
          surrealismAtmosphere: isIt ? 'Atmosfera Onirica Simbolica' : 'Symbolic Oneiric Atmosphere',
          archetypes: [
            {
              archetype: isIt ? 'L\'Ombra' : 'The Shadow',
              presence: isIt ? 'Elementi misteriosi del racconto' : 'Mysterious elements of the narrative',
              psychologicalMeaning: isIt ? 'Aspetti sommersi della psiche in attesa di riconoscimento.' : 'Submerged aspects of the psyche awaiting conscious integration.',
              integrationAdvice: isIt ? 'Osserva senza giudizio i simboli emersi.' : 'Observe the emerging symbols with curiosity.',
            },
            {
              archetype: isIt ? 'Il Sé' : 'The Self',
              presence: isIt ? 'Il nucleo unitario del sogno' : 'The unifying core of the dream',
              psychologicalMeaning: isIt ? 'La spinta verso l\'armonia psichica interiore.' : 'The drive toward psychic wholeness.',
              integrationAdvice: isIt ? 'Annota le intuizioni al risveglio.' : 'Journal your fresh morning insights.',
            },
          ],
          symbols: [
            {
              name: isIt ? 'La Visione Notturna' : 'The Night Vision',
              category: 'phenomenon',
              jungianMeaning: isIt ? 'Comunicazione diretta dell\'inconscio.' : 'Direct unconscious communication.',
              archetypalResonance: isIt ? 'Archetipo del Risveglio' : 'Archetype of Awakening',
              inquiryPrompt: isIt ? 'Cosa ti suggerisce questa immagine?' : 'What does this image prompt in your daily life?',
            },
          ],
          subconsciousConflict: isIt ? 'Integrazione tra inconscio e vita vigile' : 'Integration of unconscious and waking life',
          resolutionOrMessage: isIt ? 'Accogli i messaggi simbolici del sonno.' : 'Embrace the symbolic messages of sleep.',
          wakingReflections: [
            isIt ? 'Cosa ti ha colpito maggiormente di questa esperienza?' : 'What struck you most about this dream experience?',
          ],
          activeImaginationPrompt: isIt ? 'Rivivi mentalmente la scena in un momento di quiete.' : 'Mentally re-enter the scene in quiet meditation.',
        },
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: isIt
              ? `Il tuo sogno **"${titleToUse}"** è stato registrato e salvato. Puoi esplorarne i dettagli simbolici o rigenerare il dipinto surrealista.`
              : `Your dream **"${titleToUse}"** has been recorded and saved. You can explore its symbols or regenerate surrealist artwork.`,
            timestamp: new Date().toISOString(),
          },
        ],
        tags: [isIt ? 'Voce' : 'Voice', isIt ? 'Risveglio' : 'Waking'],
        lucidityRating: 7,
        isFavorite: false,
        entryType: 'voice',
      };

      onDreamCreated(fallbackDream);
      onClose();
    }
  };

  const cancelRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onClose();
  };

  const resetToRecordAgain = () => {
    setPipelineStep('idle');
    setRecordingSeconds(0);
    setVolumeLevel(0);
    setErrorMessage(null);
    setTranscribedText('');
    setDreamTitle('');
    setAudioResult(null);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div
        id="voice-recorder-modal"
        className="relative w-full max-w-2xl bg-[#0e1424] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-8 my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Mic className="w-4 h-4 text-amber-300" />
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-slate-100">
                {pipelineStep === 'review' ? (t.reviewTranscriptionTitle || 'Review Transcription') : t.captureWakingDream}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {pipelineStep === 'review' ? (t.reviewTranscriptionDesc || 'Verify the transcribed voice narrative before analysis.') : t.captureWakingSub}
            </p>
          </div>
          <button
            id="close-voice-modal-btn"
            onClick={cancelRecording}
            className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-5 p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">{t.voiceNotice}</p>
                <p className="mt-0.5 text-slate-300">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetToRecordAgain}
              className="mt-2 sm:mt-0 shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.reRecord || 'Record Again'}
            </button>
          </div>
        )}

        {/* STAGE 1: IDLE */}
        {pipelineStep === 'idle' && (
          <div className="space-y-5">
            {/* Surreal Art Style Preference Selector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.surrealistArtAesthetic}</span>
              </label>
              <select
                id="art-style-select"
                value={selectedArtStyle}
                onChange={(e) => setSelectedArtStyle(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-700/80 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
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

            {/* Prompt Guidance Chips */}
            <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.freshWakingPrompts}</span>
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>{t.prompt1}</li>
                <li>{t.prompt2}</li>
                <li>{t.prompt3}</li>
                <li>{t.prompt4}</li>
              </ul>
            </div>

            {/* Start Button */}
            <div className="pt-2 flex justify-center">
              <button
                id="start-voice-recording-btn"
                onClick={startRecording}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-medium shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-red-400 animate-ping absolute left-6 opacity-75 hidden sm:block" />
                <Mic className="w-5 h-5 text-amber-200 relative z-10" />
                <span className="text-sm sm:text-base tracking-wide font-semibold relative z-10">
                  {t.beginSpeakingDream}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: RECORDING */}
        {pipelineStep === 'recording' && (
          <div className="py-6 sm:py-8 flex flex-col items-center justify-center space-y-6 text-center">
            {/* Visualizer Pulsing Orb */}
            <div className="relative flex items-center justify-center w-32 h-32 sm:w-36 sm:h-36">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/30 transition-transform duration-100"
                style={{
                  transform: `scale(${1 + volumeLevel * 0.8})`,
                  opacity: 0.4 + volumeLevel * 0.6,
                }}
              />
              <div
                className="absolute inset-3 rounded-full bg-gradient-to-br from-indigo-600/30 to-amber-500/20 border border-indigo-400/40 transition-transform duration-75 animate-pulse"
                style={{
                  transform: `scale(${1 + volumeLevel * 0.4})`,
                }}
              />
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg border border-indigo-300/40">
                <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200" />
              </div>
            </div>

            {/* Timer & Status */}
            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-slate-100">
                {formatTime(recordingSeconds)}
              </div>
              <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest font-mono flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {t.recordingStream}
              </p>
            </div>

            {/* Volume indicator bar */}
            <div className="w-44 sm:w-56 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(5, volumeLevel * 100))}%` }}
              />
            </div>

            {/* Stop Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                id="stop-and-interpret-btn"
                onClick={stopAndTranscribeRecording}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold shadow-lg shadow-emerald-700/20 border border-emerald-400/30 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{t.finishAndInterpret}</span>
                <Wand2 className="w-4 h-4 text-amber-200" />
              </button>
              <button
                type="button"
                onClick={cancelRecording}
                className="w-full sm:w-auto px-4 py-2.5 text-xs text-slate-400 hover:text-slate-200 transition-colors min-h-[44px] flex items-center justify-center"
              >
                {t.cancel || 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: TRANSCRIBING */}
        {pipelineStep === 'transcribing' && (
          <div className="py-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
              <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100">
                {t.stepTranscribingTitle}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                {t.stepTranscribingDesc}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 4: REVIEW TRANSCRIPTION & CONFIRM */}
        {pipelineStep === 'review' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === 'it' ? 'Titolo del Sogno:' : 'Dream Title:'}</span>
              </label>
              <input
                type="text"
                value={dreamTitle}
                onChange={(e) => setDreamTitle(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 font-serif focus:outline-none focus:border-indigo-500"
                placeholder={language === 'it' ? 'Titolo del sogno...' : 'Dream title...'}
              />
            </div>

            {/* Audio playback if recorded */}
            {audioResult?.audioUrl && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 shrink-0">
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>{t.playbackVoice || (language === 'it' ? 'Ascolta Registrazione' : 'Listen to Audio')}</span>
                  <span className="text-[11px] font-mono text-slate-400">({audioResult.durationSeconds}s)</span>
                </div>
                <audio
                  src={audioResult.audioUrl}
                  controls
                  className="w-full sm:w-64 h-8 text-xs accent-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'it' ? 'Trascrizione Vocale (Modificabile):' : 'Voice Transcription (Editable):'}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {transcribedText.length} {language === 'it' ? 'caratteri' : 'characters'}
                </span>
              </label>
              <textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                rows={5}
                className="w-full bg-[#131b2e] border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
                placeholder={language === 'it' ? 'Trascrizione del sogno...' : 'Transcribed dream memories...'}
              />
            </div>

            {/* Art Style Selector */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.surrealistArtAesthetic}</span>
              </label>
              <select
                id="art-style-review-select"
                value={selectedArtStyle}
                onChange={(e) => setSelectedArtStyle(e.target.value)}
                className="w-full bg-[#131b2e] border border-slate-700/80 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
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

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={resetToRecordAgain}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 text-xs font-medium transition-colors min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.reRecord || 'Record Again'}</span>
                </button>
                <button
                  type="button"
                  onClick={saveDirectlyWithoutWaiting}
                  disabled={!transcribedText.trim()}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium transition-colors disabled:opacity-50 min-h-[44px]"
                  title={language === 'it' ? 'Salva direttamente il testo e la registrazione senza attendere la generazione dell\'immagine' : 'Save text and audio directly without waiting for art'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.saveDraftNow || (language === 'it' ? 'Salva Subito' : 'Save Directly')}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={executeAnalysisAndArt}
                disabled={!transcribedText.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 border border-indigo-400/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.proceedToAnalysis || t.analyzeAndPaint}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STAGE 5: ANALYZING & GENERATING ART */}
        {(pipelineStep === 'analyzing' || pipelineStep === 'complete') && (
          <div className="py-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 mb-1">
                {pipelineStep === 'complete' ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
                ) : (
                  <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-slate-100">
                {pipelineStep === 'complete' ? (t.dreamSavedSuccess || 'Dream Saved!') : t.transformingTitle}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {pipelineStep === 'complete' ? (language === 'it' ? 'Apertura automatica nel visualizzatore del diario...' : 'Opening in dream journal viewer...') : t.transformingSubtitle}
              </p>
            </div>

            {/* Step progress pills */}
            <div className="space-y-2.5 max-w-md mx-auto">
              <div className="flex items-center gap-3 p-3 rounded-xl border text-xs bg-slate-900/60 border-slate-800 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold">{t.stepTranscribingTitle}</p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                  pipelineStep === 'analyzing'
                    ? 'bg-purple-950/40 border-purple-500/50 text-purple-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                {pipelineStep === 'analyzing' ? (
                  <Brain className="w-4 h-4 text-purple-400 animate-pulse shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{t.stepArchetypeTitle}</p>
                  <p className="text-[11px] text-slate-400">
                    {t.stepArchetypeDesc}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${
                  pipelineStep === 'complete'
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}
              >
                {pipelineStep === 'complete' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Palette className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{t.stepArtTitle}</p>
                  <p className="text-[11px] text-slate-400">
                    {t.stepArtDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
