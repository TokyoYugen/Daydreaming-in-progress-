export interface DreamSymbol {
  name: string;
  category: 'object' | 'figure' | 'landscape' | 'action' | 'phenomenon';
  jungianMeaning: string;
  archetypalResonance: string;
  inquiryPrompt: string;
}

export interface JungianArchetypeAnalysis {
  archetype: string; // e.g. "The Shadow", "The Anima/Animus", "The Self", "The Persona", "The Trickster", "The Wise Guide", "The Threshold Guardian"
  presence: string; // How it manifested in the dream
  psychologicalMeaning: string; // Subconscious message
  integrationAdvice: string; // How to integrate in waking life
}

export interface DreamInterpretation {
  title: string;
  summary: string;
  dominantEmotion: string;
  emotionIntensity: number; // 1-10
  lucidityScore: number; // 1-10
  surrealismAtmosphere: string; // e.g. "Oneiric Solitude", "Alchemical Metamorphosis"
  archetypes: JungianArchetypeAnalysis[];
  symbols: DreamSymbol[];
  subconsciousConflict: string;
  resolutionOrMessage: string;
  wakingReflections: string[];
  activeImaginationPrompt: string;
  artPromptUsed?: string;
  artStyle?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedSymbol?: string;
}

export interface DreamEntry {
  id: string;
  createdAt: string;
  title: string;
  transcription: string;
  audioUrl?: string; // Blob or base64 if saved
  audioDuration?: number;
  imageUrl?: string;
  imagePrompt?: string;
  interpretation?: DreamInterpretation;
  chatHistory: ChatMessage[];
  tags: string[];
  lucidityRating: number;
  isFavorite?: boolean;
  notes?: string;
  isSample?: boolean;
  entryType?: 'voice' | 'manual' | 'sample';
}
