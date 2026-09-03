export type Language = 'it' | 'en';

export const translations = {
  en: {
    // Brand & Header
    brandSubtitle: 'Multimodal Oneiric Journal & Jungian Analysis',
    archetypalAiBadge: 'Archetypal AI',
    dreamRecordsTab: 'Dream Records',
    archetypeMapTab: 'Archetype Map',
    backToJournal: '← Back to Journal',
    writeDream: 'Write Dream',
    recordWakingDream: 'Record Waking Dream',
    exportJsonTooltip: 'Export all dreams as JSON',
    
    // Hero Banner
    heroKicker: 'STREAM OF CONSCIOUSNESS & ONEIROMANCY',
    heroTitle: 'Record fresh dreams upon waking. Decode their archetypal soul.',
    heroDescription: 'Speak your stream of consciousness as soon as your eyes open. Nocturne transcribes your voice, paints surrealist fine art in the style of Dalí & Magritte, extracts Jungian archetypes, and guides interactive symbol inquiries.',
    recordWakingVoice: 'Record Waking Voice',

    // Gallery Filters
    searchPlaceholder: 'Search dreams, archetypes (e.g. Shadow, Anima), symbols...',
    favorites: 'Favorites',
    allDreams: 'All Dreams',
    sortByNewest: 'Newest First',
    sortByOldest: 'Oldest First',
    sortByLucidity: 'Highest Lucidity',
    noDreamsFound: 'No matching dream records found',
    noDreamsSub: 'Record your next waking dream with your microphone or clear your search filters.',
    recordNow: 'Record Now',

    // Card
    lucidity: 'Lucidity',
    audioSeconds: 's audio',
    exploreArchetypes: 'Explore Archetypes & Chat',
    exportNoteTooltip: 'Export as Markdown journal note',
    deleteEntryTooltip: 'Delete entry',
    confirmDelete: 'Are you sure you want to delete this dream entry?',

    // Dream Viewer
    psychologicalInterpretation: 'Psychological Interpretation',
    symbolDialogue: 'Symbol Dialogue',
    exportNote: 'Export Note',
    aesthetic: 'Aesthetic',
    fineTuneArt: 'Fine-tune Art',
    wakingDreamNarrative: 'Waking Dream Narrative',
    atmosphere: 'Atmosphere',
    dominantEmotion: 'Dominant Emotion',
    subconsciousTension: 'Subconscious Tension',
    compensatoryMessage: 'Compensatory Message',
    recognizedArchetypes: 'Recognized Jungian Archetypes',
    identified: 'Identified',
    manifestation: 'Manifestation',
    psychologicalMeaning: 'Psychological Meaning',
    integration: 'Integration',
    symbolicAnchors: 'Symbolic Anchors & Deep Inquiries',
    clickToInquire: 'Click to inquire in chat',
    askAnalystAboutThis: 'Ask Jungian Analyst about this',
    wakingIntegrationTitle: 'Waking Integration & Active Imagination',
    reflectiveJournaling: 'Reflective Journaling Questions:',
    activeImaginationExercise: 'Active Imagination Exercise',
    generateDreamPainting: 'Generate Dream Painting',

    // Categories
    categoryObject: 'Object',
    categoryFigure: 'Figure',
    categoryLandscape: 'Landscape',
    categoryAction: 'Action',
    categoryPhenomenon: 'Phenomenon',

    // Art Modal
    customArtTitle: 'Fine-tune Surrealist Art',
    customArtPromptLabel: 'Artwork Visual Prompt',
    customArtStyleLabel: 'Painting Aesthetic Style',
    generateArtButton: 'Paint with Imagen 3',
    generatingArt: 'Painting masterpiece...',
    noArtGenerated: 'No artwork generated yet.',
    dreamCountSingular: 'dream',
    dreamCountPlural: 'dreams',

    // Symbol Chat
    symbolDialogueHeader: 'Jungian Archetypal Dialogue',
    activeBadge: 'Active',
    chatSubtitle: 'Explore hidden symbolism, personal associations & shadow integration',
    selectSymbolToInquire: 'Select a Dream Symbol to Inquire:',
    inquiringSymbol: 'Inquiring Symbol:',
    suggestions: 'Suggestions:',
    suggestionCompensatory: 'What subconscious fear or desire is this dream compensating for?',
    suggestionActiveImagination: 'How can I perform an active imagination dialog with the primary figure in this dream?',
    suggestionSetting: 'What does the surreal setting tell me about my current psychological state?',
    chatInputPlaceholder: 'Ask about any symbol, feeling, or archetype...',
    chatInputFocusedPlaceholder: 'Ask about "{symbol}" or dream archetypes...',
    analystContemplating: 'Carl Jung is contemplating your dream symbol...',
    
    // Voice Recorder Modal
    captureWakingDream: 'Capture Waking Dream',
    captureWakingSub: 'Speak freely while the dream is still fresh. Don’t worry about coherence or grammar.',
    surrealistArtAesthetic: 'Surrealist Art Aesthetic',
    freshWakingPrompts: 'Fresh Waking Prompts to Speak:',
    prompt1: 'What was the strangest thing you saw or touched?',
    prompt2: 'Were there recurring figures, animals, or enigmatic guides?',
    prompt3: 'How did your emotions shift from beginning to waking?',
    prompt4: 'Did you notice impossible transformations, flying, or water?',
    beginSpeakingDream: 'Begin Speaking Dream',
    recordingStream: 'Recording stream of consciousness...',
    finishAndInterpret: 'Finish & Interpret Dream',
    transformingTitle: 'Transforming Waking Thoughts Into Archetypal Art',
    transformingSubtitle: 'Gemini and Imagen 3 are synthesizing your subconscious narrative into symbols and imagery.',
    stepTranscribingTitle: 'Transcribing Stream-of-Consciousness Voice',
    stepTranscribingDesc: 'Capturing sensory details, emotion shifts, and raw memory.',
    stepArchetypeTitle: 'Jungian Archetypal & Symbolic Decomposition',
    stepArchetypeDesc: 'Analyzing Shadow, Anima/Animus, The Self, and subconscious conflicts.',
    stepArtTitle: 'Painting Surrealist Artwork (Imagen 3)',
    stepArtDesc: 'Generating evocative fine art reflecting the core emotional resonance.',
    voiceNotice: 'Voice Recording Notice',
    retryButton: 'Retry Processing Dream',
    sampleDreamBadge: 'Demo / Sample',
    sampleDreamTooltip: 'Preloaded demonstration dream to explore Jungian analysis and Surrealist art.',
    recordedBadge: 'Voice Recorded',
    writtenBadge: 'Written Entry',
    reviewTranscriptionTitle: 'Review & Refine Transcription',
    reviewTranscriptionDesc: 'Verify the transcribed voice narrative or edit details before Jungian archetypal analysis.',
    proceedToAnalysis: 'Analyze & Paint Dream',
    reRecord: 'Re-record Voice',
    saveDraftNow: 'Save Directly to Journal',
    playbackVoice: 'Listen to Voice Audio',
    dreamSavedSuccess: 'Dream successfully saved to your journal!',
    tabJournalShort: 'Journal',
    tabInsightsShort: 'Archetypes',
    recordShort: 'Record',
    writeShort: 'Write',

    // Manual Modal
    recordNarrativeTitle: 'Record Dream Narrative',
    recordNarrativeSub: 'Write or paste your dream memories for archetypal decomposition & surrealist art.',
    dreamTitleOptional: 'Dream Title (Optional)',
    dreamTitlePlaceholder: 'e.g. The Floating Clockwork Maze',
    fillSampleDream: 'Fill sample dream',
    narrativeSensoryDetails: 'Dream Narrative & Sensory Details',
    narrativePlaceholder: 'Describe everything you remember: the setting, shifts in identity, figures you encountered, emotions felt, bizarre symbols, colors, atmosphere...',
    cancel: 'Cancel',
    analyzeAndPaint: 'Analyze & Paint Dream',
    analyzingAndGenerating: 'Analyzing & Generating Art...',

    // Art Styles
    styleDali: 'Classic Dalí & Magritte (Floating objects, desert landscapes, impossible physics)',
    styleAlchemical: 'Alchemical & Occult (Intricate clockwork, celestial towers, mystical beasts)',
    styleMetaphysical: 'Metaphysical Oneiric (Long shadowy arcades, vacant sunlit piazzas, statues)',
    styleBiomorphic: 'Biomorphic Ethereal (Floating organic dreamscapes, luminescent flora)',

    // Insights / Archetype Map
    subconsciousArchetypeMap: 'Subconscious Archetype Map',
    insightsSub: 'Cross-dream analysis of recurring Jungian archetypes, symbolic anchors, and emotional patterns.',
    recordedDreams: 'Recorded Dreams',
    uniqueArchetypes: 'Unique Archetypes',
    avgLucidityScore: 'Avg Lucidity Score',
    archetypalFrequencies: 'Archetypal Frequencies',
    archetypeDesc: 'Archetypes represent universal patterns of energy arising in your dreamscapes.',
    recurringSymbolLandscape: 'Recurring Symbol Landscape',
    recurringSymbolDesc: 'Symbols that repeatedly emerge from your personal and collective unconscious.',
    emotionalClimates: 'Atmospheric Emotional Climates:',
    noArchetypesYet: 'No archetypes recorded yet.',
    noSymbolsYet: 'No symbols analyzed yet.',

    // Footer
    footerTitle: 'NOCTURNE — Multi-modal Dream Journal & Jungian Archetypal Explorer',
    footerSub: 'Powered by Gemini 3.7 Flash & Imagen 3 | Built for immediate waking capture & subconscious integration',
  },
  it: {
    // Brand & Header
    brandSubtitle: 'Diario Onirico Multimodale & Analisi Junghiana',
    archetypalAiBadge: 'IA Archetipale',
    dreamRecordsTab: 'Sogni Registrati',
    archetypeMapTab: 'Mappa Archetipi',
    backToJournal: '← Torna al Diario',
    writeDream: 'Scrivi Sogno',
    recordWakingDream: 'Registra Sogno al Risveglio',
    exportJsonTooltip: 'Esporta tutti i sogni in JSON',

    // Hero Banner
    heroKicker: 'FLUSSO DI COSCIENZA & ONEIROMANZIA',
    heroTitle: 'Registra i sogni appena sveglio. Decodifica la loro anima archetipica.',
    heroDescription: 'Esprimi il tuo flusso di coscienza appena apri gli occhi. Nocturne trascrive la tua voce, dipinge arte surrealista nello stile di Dalí e Magritte, estrae gli archetipi junghiani e guida dialoghi interattivi sui simboli.',
    recordWakingVoice: 'Registra Voce al Risveglio',

    // Gallery Filters
    searchPlaceholder: 'Cerca sogni, archetipi (es. Ombra, Anima), simboli...',
    favorites: 'Preferiti',
    allDreams: 'Tutti i Sogni',
    sortByNewest: 'Più Recenti',
    sortByOldest: 'Meno Recenti',
    sortByLucidity: 'Lucidità Più Alta',
    noDreamsFound: 'Nessun sogno trovato con questi filtri',
    noDreamsSub: 'Registra il tuo prossimo sogno al risveglio con il microfono o azzera i filtri di ricerca.',
    recordNow: 'Registra Ora',

    // Card
    lucidity: 'Lucidità',
    audioSeconds: 's audio',
    exploreArchetypes: 'Esplora Archetipi & Chat',
    exportNoteTooltip: 'Esporta come nota Markdown',
    deleteEntryTooltip: 'Elimina sogno',
    confirmDelete: 'Sei sicuro di voler eliminare questo sogno dal diario?',

    // Dream Viewer
    psychologicalInterpretation: 'Interpretazione Psicologica',
    symbolDialogue: 'Dialogo sui Simboli',
    exportNote: 'Esporta Nota',
    aesthetic: 'Estetica',
    fineTuneArt: 'Personalizza Arte',
    wakingDreamNarrative: 'Racconto del Sogno al Risveglio',
    atmosphere: 'Atmosfera',
    dominantEmotion: 'Emozione Dominante',
    subconsciousTension: 'Tensione Inconscia',
    compensatoryMessage: 'Messaggio Compensatorio',
    recognizedArchetypes: 'Archetipi Junghiani Riconosciuti',
    identified: 'Identificati',
    manifestation: 'Manifestazione',
    psychologicalMeaning: 'Significato Psicologico',
    integration: 'Integrazione',
    symbolicAnchors: 'Ancore Simboliche & Domande Profonde',
    clickToInquire: 'Clicca per approfondire nella chat',
    askAnalystAboutThis: 'Chiedi all\'analista junghiano',
    wakingIntegrationTitle: 'Integrazione nella Veglia & Immaginazione Attiva',
    reflectiveJournaling: 'Domande di Riflessione per il Diario:',
    activeImaginationExercise: 'Esercizio di Immaginazione Attiva',
    generateDreamPainting: 'Genera Dipinto Onirico',

    // Categories
    categoryObject: 'Oggetto',
    categoryFigure: 'Figura',
    categoryLandscape: 'Paesaggio',
    categoryAction: 'Azione',
    categoryPhenomenon: 'Fenomeno',

    // Art Modal
    customArtTitle: 'Personalizza Arte Surrealista',
    customArtPromptLabel: 'Prompt Visivo dell\'Opera',
    customArtStyleLabel: 'Stile Pittorico',
    generateArtButton: 'Dipingi con Imagen 3',
    generatingArt: 'Pittura del capolavoro in corso...',
    noArtGenerated: 'Nessuna opera d\'arte ancora generata.',
    dreamCountSingular: 'sogno',
    dreamCountPlural: 'sogni',

    // Symbol Chat
    symbolDialogueHeader: 'Dialogo Archetipale Junghiano',
    activeBadge: 'Attivo',
    chatSubtitle: 'Esplora il simbolismo nascosto, le associazioni personali e l\'integrazione dell\'Ombra',
    selectSymbolToInquire: 'Seleziona un Simbolo del Sogno per Approfondire:',
    inquiringSymbol: 'Simbolo in Esame:',
    suggestions: 'Suggerimenti:',
    suggestionCompensatory: 'Quale paura o desiderio inconscio sta compensando questo sogno?',
    suggestionActiveImagination: 'Come posso avviare un dialogo di immaginazione attiva con la figura principale?',
    suggestionSetting: 'Cosa rivela l\'ambientazione surreale sul mio stato psicologico attuale?',
    chatInputPlaceholder: 'Fai una domanda su qualsiasi simbolo, emozione o archetipo...',
    chatInputFocusedPlaceholder: 'Chiedi approfondimenti su "{symbol}" o sugli archetipi...',
    analystContemplating: 'Carl Jung sta contemplando il tuo simbolo onirico...',

    // Voice Recorder Modal
    captureWakingDream: 'Cattura il Sogno al Risveglio',
    captureWakingSub: 'Parla liberamente finché il sogno è ancora vivido. Non preoccuparti di sintassi o coerenza.',
    surrealistArtAesthetic: 'Stile Artistico Surrealista',
    freshWakingPrompts: 'Spunti da pronunciare appena sveglio:',
    prompt1: 'Qual è stata la cosa più insolita che hai visto o toccato?',
    prompt2: 'C\'erano figure ricorrenti, animali o guide enigmatiche?',
    prompt3: 'Come sono cambiate le tue emozioni dall\'inizio al risveglio?',
    prompt4: 'Hai notato trasformazioni impossibili, voli o specchi d\'acqua?',
    beginSpeakingDream: 'Inizia a Raccontare il Sogno',
    recordingStream: 'Registrazione del flusso di coscienza...',
    finishAndInterpret: 'Concludi e Interpreta Sogno',
    transformingTitle: 'Trasformazione dei Pensieri in Arte Archetipica',
    transformingSubtitle: 'Gemini e Imagen 3 stanno sintetizzando il tuo racconto in simboli, archetipi e dipinti.',
    stepTranscribingTitle: 'Trascrizione Vocale del Flusso di Coscienza',
    stepTranscribingDesc: 'Cattura dettagli sensoriali, cambi emotivi e memorie grezze.',
    stepArchetypeTitle: 'Decomposizione Simbolica & Archetipi di Jung',
    stepArchetypeDesc: 'Analisi di Ombra, Anima/Animus, Sé e conflitti inconsci.',
    stepArtTitle: 'Pittura dell\'Opera Surrealista (Imagen 3)',
    stepArtDesc: 'Generazione di un dipinto artistico che riflette la risonanza emotiva.',
    voiceNotice: 'Avviso Registrazione Vocale',
    retryButton: 'Riprova Elaborazione Sogno',
    sampleDreamBadge: 'Demo / Esempio',
    sampleDreamTooltip: 'Sogno dimostrativo precaricato per esplorare l\'analisi junghiana e l\'arte surrealista.',
    recordedBadge: 'Registrato a Voce',
    writtenBadge: 'Scritto nel Diario',
    reviewTranscriptionTitle: 'Verifica e Modifica Trascrizione',
    reviewTranscriptionDesc: 'Verifica il racconto vocale trascritto o integra dettagli prima dell\'analisi archetipica junghiana.',
    proceedToAnalysis: 'Analizza e Dipingi Sogno',
    reRecord: 'Registra di Nuovo',
    saveDraftNow: 'Salva Subito nel Diario',
    playbackVoice: 'Ascolta Registrazione Vocale',
    dreamSavedSuccess: 'Sogno salvato con successo nel tuo diario!',
    tabJournalShort: 'Diario',
    tabInsightsShort: 'Archetipi',
    recordShort: 'Registra',
    writeShort: 'Scrivi',

    // Manual Modal
    recordNarrativeTitle: 'Scrivi il Racconto del Sogno',
    recordNarrativeSub: 'Scrivi o incolla i tuoi ricordi onirici per l\'analisi archetipica e l\'arte surrealista.',
    dreamTitleOptional: 'Titolo del Sogno (Opzionale)',
    dreamTitlePlaceholder: 'es. Il Labirinto di Orologi Fluttuanti',
    fillSampleDream: 'Inserisci sogno di esempio',
    narrativeSensoryDetails: 'Racconto del Sogno & Dettagli Sensoriali',
    narrativePlaceholder: 'Descrivi tutto ciò che ricordi: l\'ambientazione, cambi di identità, figure incontrate, emozioni provate, simboli bizzarri, colori, atmosfera...',
    cancel: 'Annulla',
    analyzeAndPaint: 'Analizza e Dipingi Sogno',
    analyzingAndGenerating: 'Analisi e Generazione Arte in corso...',

    // Art Styles
    styleDali: 'Classico Dalí & Magritte (Oggetti fluttuanti, paesaggi desertici, fisica impossibile)',
    styleAlchemical: 'Alchemico & Occulto (Meccanismi a orologeria, torri celesti, creature mistiche)',
    styleMetaphysical: 'Metafisico Onirico (Lunghi portici ombrosi, piazze assolate deserte, statue)',
    styleBiomorphic: 'Biomorfo Etereo (Paesaggi organici fluttuanti, flora luminescente)',

    // Insights / Archetype Map
    subconsciousArchetypeMap: 'Mappa Archetipica del Subconscio',
    insightsSub: 'Analisi trasversale dei sogni su archetipi junghiani ricorrenti, ancore simboliche e schemi emotivi.',
    recordedDreams: 'Sogni Registrati',
    uniqueArchetypes: 'Archetipi Unici',
    avgLucidityScore: 'Punteggio Lucidità Medio',
    archetypalFrequencies: 'Frequenze Archetipiche',
    archetypeDesc: 'Gli archetipi rappresentano schemi universali di energia psichica che emergono nei tuoi sogni.',
    recurringSymbolLandscape: 'Panorama dei Simboli Ricorrenti',
    recurringSymbolDesc: 'Simboli che emergono ripetutamente dal tuo inconscio personale e collettivo.',
    emotionalClimates: 'Climi Emotivi Atmosferici:',
    noArchetypesYet: 'Nessun archetipo ancora registrato.',
    noSymbolsYet: 'Nessun simbolo ancora analizzato.',

    // Footer
    footerTitle: 'NOCTURNE — Diario Onirico Multimodale & Esploratore Archetipico Junghiano',
    footerSub: 'Alimentato da Gemini 3.7 Flash & Imagen 3 | Creato per la cattura immediata al risveglio e l\'integrazione psicologica',
  },
};

// Bidirectional mappings for Jungian archetypes, symbols, and emotions
export function localizeArchetypeName(name: string, lang: Language): string {
  if (!name) return name;
  const itToEn: Record<string, string> = {
    'Il Sé': 'The Self',
    "L'Ombra": 'The Shadow',
    "L'Anima / L'Animus": 'The Anima/Animus',
    "L'Anima": 'The Anima',
    "L'Animus": 'The Animus',
    'La Persona': 'The Persona',
    'La Guida Saggia / Psicopompo': 'The Wise Guide / Psychopomp',
    'La Guida Saggia': 'The Wise Guide',
    'Il Vecchio Saggio (Archetipo Animale)': 'The Wise Old Guide (Animal Archetype)',
    'Il Vecchio Saggio': 'The Wise Old Guide',
    "L'Ombra della Razionalità": 'The Shadow of Rationality',
    'Il Trickster': 'The Trickster',
    'Il Briccone Divino': 'The Trickster',
    'Il Guardiano della Soglia': 'The Threshold Guardian',
    'La Grande Madre': 'The Great Mother',
    "L'Eroe": 'The Hero',
    'Il Fanciullo': 'The Child',
    'Il Fanciullo / Puer Aeternus': 'The Child / Puer Aeternus',
    'La Rinascita': 'The Rebirth',
    "L'Unione Alchemica": 'The Alchemical Union',
  };

  const enToIt: Record<string, string> = {
    'The Self': 'Il Sé',
    'The Shadow': "L'Ombra",
    'The Anima/Animus': "L'Anima / L'Animus",
    'The Anima': "L'Anima",
    'The Animus': "L'Animus",
    'The Persona': 'La Persona',
    'The Wise Guide / Psychopomp': 'La Guida Saggia / Psicopompo',
    'The Wise Guide': 'La Guida Saggia',
    'The Wise Old Guide (Animal Archetype)': 'Il Vecchio Saggio (Archetipo Animale)',
    'The Wise Old Guide': 'Il Vecchio Saggio',
    'The Wise Old Man': 'Il Vecchio Saggio',
    'The Shadow of Rationality': "L'Ombra della Razionalità",
    'The Trickster': 'Il Trickster',
    'The Threshold Guardian': 'Il Guardiano della Soglia',
    'The Great Mother': 'La Grande Madre',
    'The Hero': "L'Eroe",
    'The Child': 'Il Fanciullo',
    'The Child / Puer Aeternus': 'Il Fanciullo (Puer Aeternus)',
    'The Rebirth': 'La Rinascita',
    'The Alchemical Union': "L'Unione Alchemica",
  };

  if (lang === 'it') {
    return enToIt[name] || name;
  } else {
    return itToEn[name] || name;
  }
}

export function localizeSymbolName(name: string, lang: Language): string {
  if (!name) return name;
  const itToEn: Record<string, string> = {
    'Cattedrale Sommersa che Emerge': 'Rising Submerged Cathedral',
    'Cattedrale Sommersa': 'Submerged Cathedral',
    "Specchi d'Argento con Vite Alternative": 'Silver Mirrors with Alternate Lives',
    "Figura in Tunica Indaco con Lanterna d'Ottone": 'Indigo Robed Figure with Brass Lantern',
    'Maree Oceaniche al Contrario e Respiro Subacqueo': 'Reverse Ocean Currents & Underwater Breathing',
    'Respiro Subacqueo': 'Breathing Underwater',
    'Alberi Meccanici a Ingranaggi di Rame': 'Clockwork Trees with Copper Gears',
    "Gufo Meccanico d'Ottone con Occhi d'Ambra": 'Brass Owl with Amber Lens Eyes',
    'Il Grande Gufo Meccanico': 'The Great Clockwork Owl',
    'La Chiave d\'Oro': 'The Golden Key',
    'Chiave Dorata Caduta nel Muschio': 'Golden Key Dropped into the Moss',
    "Orologi da Taschino Ticchettanti tra i Rami": 'Pocket Watches Ticking in the Canopy',
    "Orologi d'Epoca Fluttuanti tra i Rami": 'Antique Floating Clocks',
  };

  const enToIt: Record<string, string> = {
    'Rising Submerged Cathedral': 'Cattedrale Sommersa che Emerge',
    'Submerged Cathedral Rising': 'Cattedrale Sommersa che Emerge',
    'Submerged Cathedral': 'Cattedrale Sommersa',
    'Silver Mirrors with Alternate Lives': "Specchi d'Argento con Vite Alternative",
    'Silver Mirrors Reflecting Alternate Lives': "Specchi d'Argento con Vite Alternative",
    'Indigo Robed Figure with Brass Lantern': "Figura in Tunica Indaco con Lanterna d'Ottone",
    'Indigo Veiled Figure with Brass Lantern': "Figura in Tunica Indaco con Lanterna d'Ottone",
    'Reverse Ocean Currents & Underwater Breathing': 'Maree Oceaniche al Contrario e Respiro Subacqueo',
    'Breathing Underwater': 'Respiro Subacqueo',
    'Clockwork Trees with Copper Gears': 'Alberi Meccanici a Ingranaggi di Rame',
    'The Great Clockwork Owl': 'Il Grande Gufo Meccanico',
    'Brass Owl with Amber Lens Eyes': "Gufo Meccanico d'Ottone con Occhi d'Ambra",
    'The Golden Key': "La Chiave d'Oro",
    'Golden Key Dropped into the Moss': 'Chiave Dorata Caduta nel Muschio',
    'Pocket Watches Ticking in the Canopy': "Orologi da Taschino Ticchettanti tra i Rami",
    'Antique Floating Clocks': "Orologi d'Epoca Fluttuanti tra i Rami",
  };

  if (lang === 'it') {
    return enToIt[name] || name;
  } else {
    return itToEn[name] || name;
  }
}

export function localizeEmotionName(name: string, lang: Language): string {
  if (!name) return name;
  const itToEn: Record<string, string> = {
    'Meraviglia Reverente & Anelito Esistenziale': 'Reverent Awe & Existential Yearning',
    'Tensione tra Intelletto e Anima': 'Intrigue & Release of Control',
    'Meraviglia Reverente': 'Reverent Wonder',
    'Meraviglia': 'Wonder',
    'Stupore': 'Awe',
    'Curiosità': 'Curiosity',
    'Curiosità e Mistero': 'Curiosity & Mystery',
    'Ansia': 'Anxiety',
    'Paura': 'Fear',
    'Pace': 'Peace',
    'Pace e Serenità': 'Peace & Serenity',
    'Gioia': 'Joy',
    'Malinconia': 'Melancholy',
    'Riflessivo': 'Reflective',
    'Intrigo & Abbandono del Controllo': 'Intrigue & Release of Control',
  };

  const enToIt: Record<string, string> = {
    'Reverent Awe & Existential Yearning': 'Meraviglia Reverente & Anelito Esistenziale',
    'Reverent Wonder & Existential Longing': 'Meraviglia Reverente & Anelito Esistenziale',
    'Intrigue & Release of Control': 'Tensione tra Intelletto e Anima',
    'Tension Between Intellect & Soul': 'Tensione tra Intelletto e Anima',
    'Reverent Wonder': 'Meraviglia Reverente',
    'Wonder': 'Meraviglia',
    'Awe': 'Stupore',
    'Curiosity': 'Curiosità',
    'Curiosity & Mystery': 'Curiosità e Mistero',
    'Anxiety': 'Ansia',
    'Fear': 'Paura',
    'Peace': 'Pace',
    'Peace & Serenity': 'Pace e Serenità',
    'Joy': 'Gioia',
    'Melancholy': 'Malinconia',
    'Reflective': 'Riflessivo',
  };

  if (lang === 'it') {
    return enToIt[name] || name;
  } else {
    return itToEn[name] || name;
  }
}

