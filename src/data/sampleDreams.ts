import { DreamEntry } from '../types';
import { Language } from '../utils/translations';
import {
  SUBMERGED_CATHEDRAL_ARTWORK,
  CLOCKWORK_FOREST_ARTWORK,
} from '../utils/dreamArtwork';

export const SAMPLE_DREAMS_EN: DreamEntry[] = [
  {
    id: 'sample-dream-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // Yesterday
    title: 'The Submerged Cathedral of Mirrors',
    transcription:
      'I was standing at the edge of a turquoise ocean where the tides were flowing backwards. Below the clear water, an ancient gothic cathedral was slowly rising towards the surface. As I stepped onto the submerged spire, I could breathe underwater. Inside the cathedral nave, instead of stained glass, there were massive silver mirrors showing not my current reflection, but alternate versions of my life—one where I lived alone in a lighthouse, another where I was an alchemist shaping molten glass. A figure shrouded in deep indigo robes approached holding an unlit brass lantern and asked me which reflection I was willing to sacrifice.',
    tags: ['Water', 'Mirrors', 'Cathedral', 'Indigo Guide', 'Identity'],
    lucidityRating: 8,
    isFavorite: true,
    isSample: true,
    entryType: 'sample',
    audioDuration: 42,
    imageUrl: SUBMERGED_CATHEDRAL_ARTWORK,
    imagePrompt:
      'A monumental gothic cathedral partially submerged under a crystalline turquoise sea with reverse flowing waves, towering silver mirrors reflecting ethereal alternate lives, René Magritte and Salvador Dalí surrealist style, mysterious indigo veiled figure holding brass lantern, dreamlike mystical light rays underwater, museum quality fine art painting',
    interpretation: {
      title: 'The Submerged Cathedral of Mirrors',
      summary:
        'A powerful initiation dream exploring latent life potentials, conscious identity choices, and surrender of the ego. The rising underwater cathedral represents deep spiritual contents rising from the collective unconscious into conscious awareness.',
      dominantEmotion: 'Reverent Awe & Existential Yearning',
      emotionIntensity: 8,
      lucidityScore: 8,
      surrealismAtmosphere: 'Submerged Oneiric Sanctum',
      archetypes: [
        {
          archetype: 'The Self',
          presence: 'The grand rising cathedral from the ocean depths',
          psychologicalMeaning: 'The totality of your psyche seeking integration and higher wholeness beyond mundane identity.',
          integrationAdvice: 'Make space for quiet contemplative reflection to hear your soul\'s deeper calling.'
        },
        {
          archetype: 'The Wise Guide / Psychopomp',
          presence: 'The indigo-robed figure presenting the choice and lantern',
          psychologicalMeaning: 'An internal spiritual guide prompting you to illuminate the unconscious and make definitive life decisions.',
          integrationAdvice: 'Examine which path or creative calling you have been hesitating to commit to.'
        },
        {
          archetype: 'The Persona',
          presence: 'The multiple mirror reflections showing alternate versions of yourself',
          psychologicalMeaning: 'Your tension between the masks you wear in waking life versus unlived potentials.',
          integrationAdvice: 'Acknowledge that choosing one path requires grieving the unlived paths without regret.'
        }
      ],
      symbols: [
        {
          name: 'Rising Submerged Cathedral',
          category: 'landscape',
          jungianMeaning: 'Sacred architecture emerging from the unconscious ocean of the psyche.',
          archetypalResonance: 'Spiritual awakening and deep reservoir of ancestral memory.',
          inquiryPrompt: 'What long-buried core value or creative devotion is now demanding to surface in your daily life?'
        },
        {
          name: 'Silver Mirrors with Alternate Lives',
          category: 'object',
          jungianMeaning: 'The tension of unlived lives and the burden of infinite potential before commitment.',
          archetypalResonance: 'The multiplicity of the Self before individuation crystallization.',
          inquiryPrompt: 'Which "alternate life" in your waking thoughts drains your energy because you haven\'t fully let it go?'
        },
        {
          name: 'Indigo Robed Figure with Brass Lantern',
          category: 'figure',
          jungianMeaning: 'The Psychopomp guiding the conscious ego through the twilight of transformation.',
          archetypalResonance: 'Hermes/Thoth figure carrying the light of inner wisdom.',
          inquiryPrompt: 'If you had to sacrifice one outdated comfort or identity today to step into your true self, what would it be?'
        },
        {
          name: 'Breathing Underwater',
          category: 'phenomenon',
          jungianMeaning: 'Ego comfort within emotional depth and subconscious waters without fear of drowning.',
          archetypalResonance: 'Emotional resilience and psychic permeability.',
          inquiryPrompt: 'Notice how comfortable you are navigating complex, deep emotions without feeling overwhelmed.'
        }
      ],
      subconsciousConflict:
        'Tension between holding on to all potential futures versus making a brave conscious choice to solidify your true path.',
      resolutionOrMessage:
        'Your unconscious is assuring you that you have the psychic depth to survive transformation. You do not need to fear choosing your destiny.',
      wakingReflections: [
        'Write down the 3 "alternate versions" of your life that you still daydream about, and acknowledge their gift.',
        'What is the brass lantern asking you to illuminate in your personal relationships or work?',
        'Notice where in your life you feel like you are flowing against the tide, and whether that resistance is purposeful.'
      ],
      activeImaginationPrompt:
        'Close your eyes, visualize standing before the indigo-robed guide in the submerged cathedral. Ask the figure: "What must I ignite inside this brass lantern?" Listen silently for the first answer that arises.',
      artPromptUsed:
        'A monumental gothic cathedral partially submerged under a crystalline turquoise sea with reverse flowing waves, towering silver mirrors reflecting ethereal alternate lives, René Magritte and Salvador Dalí surrealist style',
      artStyle: 'Surrealism (Dalí & Magritte)'
    },
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Welcome to your dream analysis. Your dream of the Submerged Cathedral presents profound themes of the **Self**, unlived potentials, and the **Wise Guide**. Which symbol would you like to explore first?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Why was the guide asking me to sacrifice a reflection? That felt intimidating.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        relatedSymbol: 'Silver Mirrors with Alternate Lives'
      },
      {
        id: 'msg-3',
        sender: 'assistant',
        text: 'In Jungian psychology, **sacrifice** (from the Latin *sacrificium*, literally "to make sacred") is not about punishment or loss, but conscious surrender. When we refuse to commit to our true path, we keep all our psychic energy scattered across countless fantasy futures.\n\nThe guide is asking you to make one of those reflections sacred by choosing your authentic reality. By letting go of the illusion that you can be everything at once, you liberate immense creative energy to truly become who you are.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString()
      }
    ]
  },
  {
    id: 'sample-dream-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    title: 'The Clockwork Forest of Brass Owls',
    transcription:
      'I was wandering through a dark forest where the trees had gears for bark and leaves made of copper foils ticking in rhythm. A giant mechanical owl with glowing amber lenses perched on a branch above me. When it turned its head 360 degrees, it dropped a golden key into my palm. It told me in a mechanical whisper: "You are trying to measure what can only be felt." Suddenly the ground transformed into a velvet sky with floating antique clocks.',
    tags: ['Forest', 'Clockwork', 'Owl', 'Golden Key', 'Time'],
    lucidityRating: 6,
    isFavorite: false,
    isSample: true,
    entryType: 'sample',
    audioDuration: 35,
    imageUrl: CLOCKWORK_FOREST_ARTWORK,
    imagePrompt:
      'Surreal forest of intricate brass clockwork trees with glowing copper gears and leaves, giant majestic mechanical owl with glowing amber eyes perching on a bough, dropping a shimmering golden key, surrealist dream art style of Remedios Varo and Max Ernst, deep velvet midnight sky with floating clock faces, mystical illumination',
    interpretation: {
      title: 'The Clockwork Forest of Brass Owls',
      summary:
        'A commentary on over-intellectualizing emotional life. The ticking clockwork forest reflects the ego\'s hyper-rational structure, while the mechanical owl acts as the messenger bridging logic and intuitive feeling.',
      dominantEmotion: 'Intrigue & Release of Control',
      emotionIntensity: 7,
      lucidityScore: 6,
      surrealismAtmosphere: 'Alchemical Mechanical Reverie',
      archetypes: [
        {
          archetype: 'The Wise Old Guide (Animal Archetype)',
          presence: 'The Great Clockwork Owl',
          psychologicalMeaning: 'Nocturnal wisdom and intuition operating above conscious clock-time and rigid metrics.',
          integrationAdvice: 'Allow yourself to trust gut feelings rather than seeking logical justification for every move.'
        },
        {
          archetype: 'The Shadow of Rationality',
          presence: 'The rigid ticking trees and measuring devices',
          psychologicalMeaning: 'The hyper-analytical defenses used to avoid vulnerable, chaotic feelings.',
          integrationAdvice: 'Notice where in your work or daily routine you are over-scheduling and over-analyzing.'
        }
      ],
      symbols: [
        {
          name: 'The Golden Key',
          category: 'object',
          jungianMeaning: 'Access to the locked chambers of the unconscious and intuitive insight.',
          archetypalResonance: 'The treasure hard to attain (Sol / Gold).',
          inquiryPrompt: 'What truth have you been keeping locked behind an intellectual explanation?'
        },
        {
          name: 'Clockwork Trees Ticking in Unison',
          category: 'landscape',
          jungianMeaning: 'The mechanization of living natural vitality by rigid cognitive habits.',
          archetypalResonance: 'Kronos (Chronos) confining the living psyche in linear time.',
          inquiryPrompt: 'Where in your life does spontaneity feel threatening to your sense of order?'
        },
        {
          name: 'Amber Lenses of the Owl',
          category: 'figure',
          jungianMeaning: 'Vision in the dark; perceiving what remains hidden in the daylight of consciousness.',
          archetypalResonance: 'Athena\'s owl; penetrating inner perception.',
          inquiryPrompt: 'What are you sensing right now that your logical mind is trying to dismiss?'
        }
      ],
      subconsciousConflict:
        'Conflict between the drive to calculate, measure, and control versus the soul\'s need for intuitive surrender.',
      resolutionOrMessage:
        'Wisdom cannot be measured with a stopwatch. The key unlocks the door to feeling without calculating outcome.',
      wakingReflections: [
        'Spend 30 minutes today without tracking time, checking clocks, or checking notifications.',
        'What feeling have you been analyzing into numbness rather than simply allowing yourself to experience?'
      ],
      activeImaginationPrompt:
        'Picture holding the heavy, warm golden key in your hand. What door or chest in your mind does this key belong to? Turn the key in your imagination and step inside.',
      artPromptUsed:
        'Surreal forest of intricate brass clockwork trees with glowing copper gears and leaves, giant majestic mechanical owl with glowing amber eyes, style of Remedios Varo',
      artStyle: 'Alchemical Surrealism (Remedios Varo)'
    },
    chatHistory: [
      {
        id: 'msg-forest-1',
        sender: 'assistant',
        text: 'The owl\'s words—*"You are trying to measure what can only be felt"*—strike directly at the core of Jungian compensatory wisdom. How did that phrase land when you woke up?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString()
      }
    ]
  }
];

export const SAMPLE_DREAMS_IT: DreamEntry[] = [
  {
    id: 'sample-dream-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    title: 'La Cattedrale Sommersa di Specchi',
    transcription:
      'Ero in piedi sul bordo di un oceano turchese dove le maree scorrevano al contrario. Sotto l\'acqua cristallina, un\'antica cattedrale gotica stava lentamente risalendo verso la superficie. Appena ho posato il piede sulla guglia sommersa, ho scoperto di poter respirare sott\'acqua. All\'interno della navata, al posto delle vetrate istoriate, vi erano enormi specchi d\'argento che mostravano non il mio riflesso attuale, ma versioni alternative della mia vita: una in cui vivevo da solo in un faro, un\'altra in cui ero un alchimista che modellava vetro fuso. Una figura avvolta in una tunica indaco profondo si è avvicinata tenendo una lanterna d\'ottone spenta e mi ha chiesto quale riflesso fossi disposto a sacrificare.',
    tags: ['Acqua', 'Specchi', 'Cattedrale', 'Guida Indaco', 'Identità'],
    lucidityRating: 8,
    isFavorite: true,
    isSample: true,
    entryType: 'sample',
    audioDuration: 42,
    imageUrl: SUBMERGED_CATHEDRAL_ARTWORK,
    imagePrompt:
      'A monumental gothic cathedral partially submerged under a crystalline turquoise sea with reverse flowing waves, towering silver mirrors reflecting ethereal alternate lives, René Magritte and Salvador Dalí surrealist style, mysterious indigo veiled figure holding brass lantern, dreamlike mystical light rays underwater, museum quality fine art painting',
    interpretation: {
      title: 'La Cattedrale Sommersa di Specchi',
      summary:
        'Un profondo sogno di iniziazione che esplora i potenziali latenti di vita, le scelte coscienti di identità e la resa dell\'Io. La cattedrale subacquea che riaffiora rappresenta contenuti spirituali profondi che dall\'inconscio collettivo emergono verso la consapevolezza vigile.',
      dominantEmotion: 'Meraviglia Reverente & Anelito Esistenziale',
      emotionIntensity: 8,
      lucidityScore: 8,
      surrealismAtmosphere: 'Santuario Onirico Sommerso',
      archetypes: [
        {
          archetype: 'Il Sé',
          presence: 'La maestosa cattedrale che emerge dagli abissi oceanici',
          psychologicalMeaning: 'La totalità della tua psiche alla ricerca di integrazione e pienezza oltre l\'identità mondana.',
          integrationAdvice: 'Dedica spazio alla riflessione contemplativa per ascoltare la chiamata profonda della tua anima.'
        },
        {
          archetype: 'La Guida Saggia / Psicopompo',
          presence: 'La figura in tunica indaco che porge la lanterna e richiede la scelta',
          psychologicalMeaning: 'Una guida spirituale interiore che ti sprona a illuminare l\'inconscio e a prendere decisioni definitive per la tua vita.',
          integrationAdvice: 'Esamina quale cammino o vocazione creativa hai esitato a intraprendere finora.'
        },
        {
          archetype: 'La Persona',
          presence: 'I molteplici riflessi nello specchio che mostrano versioni alternative di te',
          psychologicalMeaning: 'La tensione tra le maschere che indossi nella vita quotidiana e i tuoi potenziali non vissuti.',
          integrationAdvice: 'Riconosci che scegliere una strada richiede di accettare senza rimpianti i sentieri non intrapresi.'
        }
      ],
      symbols: [
        {
          name: 'Cattedrale Sommersa che Emerge',
          category: 'landscape',
          jungianMeaning: 'Architettura sacra che sorge dall\'oceano inconscio della psiche.',
          archetypalResonance: 'Risveglio spirituale e profondo serbatoio di memoria ancestrale.',
          inquiryPrompt: 'Quale valore fondamentale o devozione creativa a lungo sepolta sta chiedendo di emergere nella tua vita quotidiana?'
        },
        {
          name: 'Specchi d\'Argento con Vite Alternative',
          category: 'object',
          jungianMeaning: 'La tensione delle vite non vissute e il peso dell\'infinito potenziale prima della scelta.',
          archetypalResonance: 'La molteplicità del Sé prima della cristallizzazione dell\'individuazione.',
          inquiryPrompt: 'Quale "vita alternativa" nei tuoi pensieri assorbe le tue energie perché non l\'hai ancora lasciata andare?'
        },
        {
          name: 'Figura in Tunica Indaco con Lanterna d\'Ottone',
          category: 'figure',
          jungianMeaning: 'Lo Psicopompo che guida l\'Io cosciente attraverso il crepuscolo della trasformazione.',
          archetypalResonance: 'Figura archetipica di Hermes/Thoth portatrice della luce della saggezza interiore.',
          inquiryPrompt: 'Se dovessi sacrificare una vecchia abitudine rassicurante oggi per diventare davvero te stesso, quale sceglieresti?'
        },
        {
          name: 'Respirare Sott\'acqua',
          category: 'phenomenon',
          jungianMeaning: 'Naturale agio all\'interno della profondità emotiva e delle acque subconsce senza timore di affogare.',
          archetypalResonance: 'Resilienza emotiva e permeabilità psichica.',
          inquiryPrompt: 'Nota come riesci a navigare emozioni complesse e profonde senza sentirti sopraffatto.'
        }
      ],
      subconsciousConflict:
        'Tensione tra il voler trattenere tutti i futuri potenziali e il compiere una scelta coraggiosa e consapevole per consolidare il proprio vero cammino.',
      resolutionOrMessage:
        'Il tuo inconscio ti rassicura che possiedi la profondità psichica necessaria per affrontare la trasformazione. Non devi temere di scegliere il tuo destino.',
      wakingReflections: [
        'Trascrivi le 3 "versioni alternative" della tua vita che sogni ancora ad occhi aperti e riconosci il loro valore.',
        'Cosa ti sta chiedendo di illuminare la lanterna d\'ottone nelle tue relazioni personali o nel lavoro?',
        'Nota in quale ambito della tua vita ti sembra di muoverti controcorrente, e se tale resistenza sia intenzionale e proficua.'
      ],
      activeImaginationPrompt:
        'Chiudi gli occhi, visualizza di trovarti davanti alla guida in tunica indaco nella cattedrale sommersa. Chiedi alla figura: "Cosa devo accendere dentro questa lanterna d\'ottone?" Ascolta in silenzio la prima risposta che affiora.',
      artPromptUsed:
        'A monumental gothic cathedral partially submerged under a crystalline turquoise sea with reverse flowing waves, towering silver mirrors reflecting ethereal alternate lives, René Magritte and Salvador Dalí surrealist style',
      artStyle: 'Surrealismo (Dalí & Magritte)'
    },
    chatHistory: [
      {
        id: 'msg-1',
        sender: 'assistant',
        text: 'Benvenuto all\'analisi del tuo sogno. La Cattedrale Sommersa presenta temi profondi legati al **Sé**, ai potenziali non vissuti e alla **Guida Saggia**. Quale simbolo desideri esplorare per primo?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString()
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Perché la guida mi chiedeva di sacrificare un riflesso? Mi è sembrato intimidatorio.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        relatedSymbol: 'Specchi d\'Argento con Vite Alternative'
      },
      {
        id: 'msg-3',
        sender: 'assistant',
        text: 'Nella psicologia junghiana, il **sacrificio** (dal latino *sacrificium*, letteralmente "rendere sacro") non è una punizione o una perdita, ma una resa consapevole. Quando esitiamo a impegnarci nel nostro autentico percorso, disperdiamo le nostre energie psichiche in innumerevoli futuri di fantasia.\n\nLa guida ti invita a rendere sacro uno di quei riflessi scegliendo la tua realtà autentica. Lasciando andare l\'illusione di poter essere tutto contemporaneamente, liberi un\'immensa energia creativa per diventare pienamente chi sei.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString()
      }
    ]
  },
  {
    id: 'sample-dream-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    title: 'La Foresta Meccanica dei Gufi d\'Ottone',
    transcription:
      'Vagavo attraverso una foresta oscura dove gli alberi avevano cortecce fatte di ingranaggi e foglie di rame che scandivano il tempo a ritmo. Un maestoso gufo meccanico con lenti d\'ambra incandescenti era appollaiato su un ramo sopra di me. Quando ha ruotato il capo di 360 gradi, ha lasciato cadere una chiave dorata sul mio palmo. Mi ha detto in un sussurro metallico: "Stai cercando di misurare ciò che può essere solo sentito." All\'improvviso il terreno si è trasformato in un cielo di velluto cosparso di orologi d\'epoca fluttuanti.',
    tags: ['Foresta', 'Meccanismi', 'Gufo', 'Chiave Dorata', 'Tempo'],
    lucidityRating: 6,
    isFavorite: false,
    isSample: true,
    entryType: 'sample',
    audioDuration: 35,
    imageUrl: CLOCKWORK_FOREST_ARTWORK,
    imagePrompt:
      'Surreal forest of intricate brass clockwork trees with glowing copper gears and leaves, giant majestic mechanical owl with glowing amber eyes perching on a bough, dropping a shimmering golden key, surrealist dream art style of Remedios Varo and Max Ernst, deep velvet midnight sky with floating clock faces, mystical illumination',
    interpretation: {
      title: 'La Foresta Meccanica dei Gufi d\'Ottone',
      summary:
        'Una riflessione sull\'eccesso di intellettualizzazione della vita emotiva. La foresta di ingranaggi riflette la struttura iper-razionale dell\'Io, mentre il gufo meccanico funge da messaggero che unisce la logica al sentire intuitivo.',
      dominantEmotion: 'Intrigo & Abbandono del Controllo',
      emotionIntensity: 7,
      lucidityScore: 6,
      surrealismAtmosphere: 'Reverie Alchemica Meccanica',
      archetypes: [
        {
          archetype: 'Il Vecchio Saggio (Archetipo Animale)',
          presence: 'Il Grande Gufo Meccanico',
          psychologicalMeaning: 'Saggezza notturna e intuizione che operano al di sopra del tempo lineare e delle metriche rigide.',
          integrationAdvice: 'Permettiti di fidarti delle intuizioni viscerali invece di cercare una giustificazione logica per ogni passo.'
        },
        {
          archetype: 'L\'Ombra della Razionalità',
          presence: 'Gli alberi a orologeria e i congegni di misurazione',
          psychologicalMeaning: 'Le difese iper-analitiche impiegate per evitare il contatto con sentimenti vulnerabili o caotici.',
          integrationAdvice: 'Osserva in quale ambito del tuo lavoro o della tua routine stai pianificando e analizzando eccessivamente.'
        }
      ],
      symbols: [
        {
          name: 'La Chiave Dorata',
          category: 'object',
          jungianMeaning: 'L\'accesso alle stanze segrete dell\'inconscio e all\'intuizione profonda.',
          archetypalResonance: 'Il tesoro difficile da raggiungere (Sol / Oro alchemico).',
          inquiryPrompt: 'Quale verità stai tenendo chiusa a chiave dietro una spiegazione puramente intellettuale?'
        },
        {
          name: 'Alberi a Orologeria Sincronizzati',
          category: 'landscape',
          jungianMeaning: 'La meccanizzazione della vitalità naturale a causa di schemi cognitivi rigidi.',
          archetypalResonance: 'Kronos (Chronos) che imprigiona la psiche vivente nel tempo lineare.',
          inquiryPrompt: 'In quale aspetto della tua vita la spontaneità minaccia il tuo senso di controllo e ordine?'
        },
        {
          name: 'Lenti d\'Ambra del Gufo',
          category: 'figure',
          jungianMeaning: 'Visione nel buio; la percezione di ciò che rimane invisibile alla luce del giorno della coscienza.',
          archetypalResonance: 'La civetta di Atena; percezione interiore penetrante.',
          inquiryPrompt: 'Cosa stai intuendo in questo momento che la tua mente razionale sta tentando di respingere?'
        }
      ],
      subconsciousConflict:
        'Conflitto tra l\'impulso a calcolare, misurare e controllare e il bisogno dell\'anima di arrendersi all\'intuizione.',
      resolutionOrMessage:
        'La saggezza non si misura con un cronometro. La chiave dorata apre la porta all\'esperienza autentica del sentire.',
      wakingReflections: [
        'Trascorri 30 minuti oggi senza guardare l\'orologio, senza contare il tempo e senza notifiche.',
        'Quale emozione hai cercato di analizzare fino ad anestetizzarla invece di viverla semplicemente?'
      ],
      activeImaginationPrompt:
        'Immagina di stringere nel palmo la chiave dorata, pesante e calda. A quale porta o forziere interiore appartiene questa chiave? Girala nella tua immaginazione ed entra nello spazio rivelato.',
      artPromptUsed:
        'Surreal forest of intricate brass clockwork trees with glowing copper gears and leaves, giant majestic mechanical owl with glowing amber eyes, style of Remedios Varo',
      artStyle: 'Surrealismo Alchemico (Remedios Varo)'
    },
    chatHistory: [
      {
        id: 'msg-forest-1',
        sender: 'assistant',
        text: 'Le parole del gufo — *"Stai cercando di misurare ciò che può essere solo sentito"* — toccano direttamente il cuore della funzione compensatoria junghiana. Come ha risuonato questa frase al tuo risveglio?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString()
      }
    ]
  }
];

export const SAMPLE_DREAMS = SAMPLE_DREAMS_EN;

export function getLocalizedDream(dream: DreamEntry, language: Language): DreamEntry {
  if (!dream) return dream;

  // If it's a sample dream, map it directly to the localized sample version while keeping user interactions
  if (dream.id === 'sample-dream-1') {
    const base = language === 'it' ? SAMPLE_DREAMS_IT[0] : SAMPLE_DREAMS_EN[0];
    const hasUserChat = Array.isArray(dream.chatHistory) && dream.chatHistory.some(m => m.sender === 'user');
    return {
      ...base,
      ...dream,
      title: base.title,
      transcription: base.transcription,
      interpretation: base.interpretation,
      tags: base.tags,
      isFavorite: dream.isFavorite ?? base.isFavorite,
      imageUrl: dream.imageUrl || base.imageUrl,
      chatHistory: hasUserChat ? dream.chatHistory : base.chatHistory,
      isSample: true,
      entryType: 'sample',
    };
  }

  if (dream.id === 'sample-dream-2') {
    const base = language === 'it' ? SAMPLE_DREAMS_IT[1] : SAMPLE_DREAMS_EN[1];
    const hasUserChat = Array.isArray(dream.chatHistory) && dream.chatHistory.some(m => m.sender === 'user');
    return {
      ...base,
      ...dream,
      title: base.title,
      transcription: base.transcription,
      interpretation: base.interpretation,
      tags: base.tags,
      isFavorite: dream.isFavorite ?? base.isFavorite,
      imageUrl: dream.imageUrl || base.imageUrl,
      chatHistory: hasUserChat ? dream.chatHistory : base.chatHistory,
      isSample: true,
      entryType: 'sample',
    };
  }

  return dream;
}

export function getLocalizedDreams(dreams: DreamEntry[], language: Language): DreamEntry[] {
  return dreams.map((d) => getLocalizedDream(d, language));
}
