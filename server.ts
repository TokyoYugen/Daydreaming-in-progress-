import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with higher limit for audio/image base64
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Server-side persistent storage file for dreams
const DATA_DIR = path.join(process.cwd(), "data");
const DREAMS_FILE = path.join(DATA_DIR, "dreams_store.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.error("Error creating data directory:", e);
  }
}

async function readStoredDreams(): Promise<any[]> {
  ensureDataDir();
  try {
    if (!fs.existsSync(DREAMS_FILE)) {
      return [];
    }
    const data = await fs.promises.readFile(DREAMS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error reading stored dreams:", err);
    return [];
  }
}

async function writeStoredDreams(dreams: any[]): Promise<void> {
  ensureDataDir();
  try {
    await fs.promises.writeFile(DREAMS_FILE, JSON.stringify(dreams, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing stored dreams:", err);
  }
}

// Lazy get GenAI client
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Clean JSON response from Gemini if wrapped in markdown blocks
function cleanJsonString(str?: string): string {
  if (!str) return "{}";
  return str
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// Clean error message formatter
function formatErrorMessage(error: any): string {
  if (!error) return "Unknown error occurred";
  if (typeof error === "string") return error;
  if (error.message) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error?.message) {
        return parsed.error.message;
      }
    } catch {
      // not a json string
    }
    return error.message;
  }
  return String(error);
}

// Robust Gemini caller with exponential backoff and instant fallback model support
async function generateContentWithRetryAndFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  },
  primaryModel: string = "gemini-3.7-flash",
  fallbackModels: string[] = ["gemini-flash-latest", "gemini-3.1-flash-lite"]
) {
  const models = [primaryModel, ...fallbackModels.filter((m) => m !== primaryModel)];
  let lastError: any = null;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
    const model = models[modelIndex];
    const isLastModel = modelIndex === models.length - 1;
    const maxAttempts = isLastModel ? 2 : 1; // Try fallback immediately if high demand, retry only on last model

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return result;
      } catch (err: any) {
        lastError = err;
        const msg = formatErrorMessage(err);
        const isTemporary =
          msg.includes("503") ||
          msg.includes("429") ||
          msg.includes("high demand") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("temporarily overloaded") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("spikes in demand") ||
          err?.status === 503 ||
          err?.status === 429;

        if (isTemporary && !isLastModel) {
          console.warn(
            `[Gemini Instant Fallback] Model ${model} is experiencing high demand (${msg.slice(0, 80)}). Immediately switching to fallback model ${models[modelIndex + 1]}...`
          );
          break; // Immediately move to next fallback model
        }

        if (isTemporary && isLastModel && attempt < maxAttempts) {
          const delayMs = 600 + Math.floor(Math.random() * 300);
          console.warn(
            `[Gemini Retry] Last fallback model ${model} temporary error. Retrying in ${delayMs}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        console.warn(
          `[Gemini Fallback] Model ${model} error: ${msg.slice(0, 100)}. Trying next available model...`
        );
        break;
      }
    }
  }

  throw lastError;
}

// Generate surrealist dream artwork using Gemini image models with multi-model fallback & procedural art fallback
async function generateArtworkWithGemini(
  ai: GoogleGenAI,
  prompt: string,
  aspectRatio: "4:3" | "1:1" | "16:9" = "4:3",
  dreamTitle: string = "Oneiric Vision"
): Promise<string | null> {
  // First try official Imagen 3 models
  const imagenModels = ["imagen-3.0-generate-002", "imagen-3.0-fast-generate-001"];
  for (const model of imagenModels) {
    try {
      const imageResult = await ai.models.generateImages({
        model,
        prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio === "4:3" ? "4:3" : "1:1",
          outputMimeType: "image/jpeg",
        },
      });

      const imageBytes = imageResult.generatedImages?.[0]?.image?.imageBytes;
      if (imageBytes) {
        return `data:image/jpeg;base64,${imageBytes}`;
      }
    } catch (err: any) {
      const errStr = formatErrorMessage(err);
      if (!errStr.includes("quota") && !errStr.includes("RESOURCE_EXHAUSTED")) {
        console.info(`[Imagen Model] ${model} info: ${errStr.slice(0, 80)}`);
      }
    }
  }

  // Next try multimodal image generation models
  const imageModels = [
    "gemini-2.5-flash-image",
    "gemini-3.1-flash-image",
  ];

  for (const model of imageModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              text: prompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || "image/png";
          return `data:${mime};base64,${part.inlineData.data}`;
        }
      }
    } catch (err: any) {
      // Quietly fall through on quota or service limitation
    }
  }

  // High-fidelity Procedural Surrealist Canvas Generator (Guarantees zero-loss & stunning fine-art visuals)
  try {
    const paletteSets = [
      { bg1: "#0b1021", bg2: "#1a1638", accent: "#fbbf24", glow: "#818cf8", light: "#38bdf8", motif: "portal" },
      { bg1: "#07131e", bg2: "#16283d", accent: "#34d399", glow: "#2dd4bf", light: "#fef08a", motif: "ocean" },
      { bg1: "#1c0b24", bg2: "#2d124d", accent: "#f472b6", glow: "#c084fc", light: "#fb923c", motif: "cosmic" },
      { bg1: "#18181b", bg2: "#27272a", accent: "#e2e8f0", glow: "#a855f7", light: "#60a5fa", motif: "shadow" },
      { bg1: "#0d1b2a", bg2: "#1b263b", accent: "#e0a96d", glow: "#778da9", light: "#f0ebd8", motif: "time" }
    ];
    // Pick palette deterministically from prompt
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) hash = (hash << 5) - hash + prompt.charCodeAt(i);
    const pIndex = Math.abs(hash) % paletteSets.length;
    const pal = paletteSets[pIndex];

    const safeTitle = dreamTitle.replace(/["<>]/g, "").slice(0, 42);
    const safeStyle = (prompt.includes("Magritte") ? "Magritte & Dalí Oneiric Style" : "Surrealist Vision").replace(/["<>]/g, "");

    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="${pal.glow}" stop-opacity="0.35" />
          <stop offset="60%" stop-color="${pal.bg2}" />
          <stop offset="100%" stop-color="${pal.bg1}" />
        </radialGradient>
        <linearGradient id="horizonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${pal.light}" stop-opacity="0.7" />
          <stop offset="100%" stop-color="${pal.bg1}" stop-opacity="0.9" />
        </linearGradient>
        <filter id="surrealGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <rect width="800" height="600" fill="url(#skyGrad)" />

      <!-- Luminous Moon / Sun Sphere -->
      <circle cx="400" cy="220" r="110" fill="${pal.accent}" fill-opacity="0.25" filter="url(#surrealGlow)" />
      <circle cx="400" cy="220" r="85" fill="${pal.light}" fill-opacity="0.85" />
      <circle cx="400" cy="220" r="80" fill="url(#skyGrad)" fill-opacity="0.9" />

      <!-- Geometric Surrealist Horizons -->
      <path d="M 0 380 Q 200 340 400 390 T 800 360 L 800 600 L 0 600 Z" fill="${pal.bg2}" fill-opacity="0.75" />
      <path d="M 0 430 Q 300 390 550 450 T 800 420 L 800 600 L 0 600 Z" fill="${pal.bg1}" />

      <!-- Infinite Portal Lines -->
      <line x1="400" y1="220" x2="100" y2="600" stroke="${pal.glow}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="4 4" />
      <line x1="400" y1="220" x2="700" y2="600" stroke="${pal.glow}" stroke-width="1.5" stroke-opacity="0.4" stroke-dasharray="4 4" />
      <line x1="400" y1="220" x2="400" y2="600" stroke="${pal.accent}" stroke-width="1" stroke-opacity="0.5" />

      <!-- Surreal Floating Obelisk / Mirror Portal -->
      <polygon points="400,160 440,380 400,410 360,380" fill="url(#horizonGrad)" stroke="${pal.accent}" stroke-width="1.5" filter="url(#surrealGlow)" />

      <!-- Subtle Fine Art Vignette & Frame -->
      <rect x="24" y="24" width="752" height="552" fill="none" stroke="${pal.accent}" stroke-opacity="0.25" stroke-width="1" />
      <rect x="28" y="28" width="744" height="544" fill="none" stroke="${pal.light}" stroke-opacity="0.15" stroke-width="0.5" />

      <!-- Oneiric Typographic Signature -->
      <text x="400" y="525" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="19" font-weight="600" fill="${pal.accent}" letter-spacing="3" opacity="0.95">${safeTitle}</text>
      <text x="400" y="548" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="${pal.light}" letter-spacing="1.5" opacity="0.75">${safeStyle}</text>
    </svg>`;

    const base64Svg = Buffer.from(svgString, "utf-8").toString("base64");
    return `data:image/svg+xml;base64,${base64Svg}`;
  } catch (svgErr) {
    console.error("Error creating SVG artwork:", svgErr);
    return null;
  }
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// Endpoint: Get all saved dreams from persistent server storage
app.get("/api/dreams", async (_req, res) => {
  try {
    const dreams = await readStoredDreams();
    return res.json({ dreams });
  } catch (error: any) {
    console.error("Failed to read dreams:", error);
    return res.status(500).json({ error: "Failed to read dreams" });
  }
});

// Endpoint: Save or update a dream in persistent server storage
app.post("/api/dreams", async (req, res) => {
  try {
    const dream = req.body;
    if (!dream || !dream.id) {
      return res.status(400).json({ error: "Invalid dream entry" });
    }

    const currentDreams = await readStoredDreams();
    const index = currentDreams.findIndex((d: any) => d.id === dream.id);

    let updatedList: any[];
    if (index >= 0) {
      updatedList = [...currentDreams];
      updatedList[index] = { ...updatedList[index], ...dream };
    } else {
      updatedList = [dream, ...currentDreams];
    }

    await writeStoredDreams(updatedList);
    return res.json({ success: true, dream, total: updatedList.length });
  } catch (error: any) {
    console.error("Failed to save dream:", error);
    return res.status(500).json({ error: "Failed to save dream" });
  }
});

// Endpoint: Delete a dream from persistent server storage
app.delete("/api/dreams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const currentDreams = await readStoredDreams();
    const filtered = currentDreams.filter((d: any) => d.id !== id);
    await writeStoredDreams(filtered);
    return res.json({ success: true, remaining: filtered.length });
  } catch (error: any) {
    console.error("Failed to delete dream:", error);
    return res.status(500).json({ error: "Failed to delete dream" });
  }
});

// Endpoint: Transcribe waking voice recording
app.post("/api/transcribe-audio", async (req, res) => {
  try {
    const { audioBase64, mimeType, language } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: "audioBase64 is required" });
    }

    const ai = getGenAI();
    const effectiveMimeType = mimeType || "audio/webm";
    const isItalian = language === "it";

    const prompt = `You are an expert audio transcriptionist and dream chronicler.
Accurately transcribe the exact spoken words and narrative from the audio recording without inventing, hallucinating, or replacing the speaker's words with fictional elements.
Preserve the speaker's authentic voice, emotional tone, and specific details. Format the output with cohesive, well-punctuated paragraphs.
${isItalian ? "CRITICAL: The speaker is speaking in Italian (or requested Italian). Output the transcription strictly in Italian (Italiano). Generate an evocative, concise dream title and detected emotional atmosphere in Italian based directly on what was spoken." : "Generate an evocative, concise dream title and detect the emotional atmosphere based directly on what was spoken."}

Respond in JSON with this exact schema:
{
  "transcription": "Faithful, structured transcription of the actual words spoken in the audio",
  "suggestedTitle": "A concise, evocative 3-6 word dream title reflecting the spoken content",
  "detectedTone": "Atmospheric emotion string ${isItalian ? "(e.g. 'Meraviglia & Riflessione')" : "(e.g. 'Wonder & Reflection')"} ",
  "clarityScore": 9
}`;

    const response = await generateContentWithRetryAndFallback(ai, {
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: effectiveMimeType,
                data: audioBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    let data;
    try {
      data = JSON.parse(cleanJsonString(responseText));
    } catch {
      data = {
        transcription: responseText,
        suggestedTitle: isItalian ? "Ricordo Onirico al Risveglio" : "Waking Dream Memory",
        detectedTone: isItalian ? "Misterioso & Onirico" : "Mysterious & Dreamlike",
        clarityScore: 8,
      };
    }

    return res.json(data);
  } catch (error: any) {
    const cleanError = formatErrorMessage(error);
    console.error("Transcription error:", cleanError);
    return res.status(500).json({
      error: cleanError || "Failed to transcribe audio",
    });
  }
});

// Endpoint: Analyze Dream (Jungian Archetypes, Symbols, Waking Prompts) & Generate Surrealist Art
app.post("/api/analyze-dream", async (req, res) => {
  try {
    const { dreamText, stylePreference, language } = req.body;

    if (!dreamText || typeof dreamText !== "string" || dreamText.trim().length === 0) {
      return res.status(400).json({ error: "dreamText is required" });
    }

    const ai = getGenAI();
    const isItalian = language === "it";

    const selectedStyle = stylePreference || "Surrealism inspired by Salvador Dalí, René Magritte, Remedios Varo, and Giorgio de Chirico";

    const systemInstruction = `You are Carl Jung, Marie-Louise von Franz, and an intuitive Depth Psychologist specializing in archetypal oneirology (dream analysis).
You analyze dreams not as random noise, but as symbolic compensatory messages from the personal and collective unconscious.

Your goal:
1. Provide a rigorous, profound, structured psychological interpretation:
   - Identify key Jungian Archetypes (e.g., The Shadow / L'Ombra, The Anima/Animus, The Self / Il Sé, The Persona, The Trickster, The Wise Guide / Il Vecchio Saggio, The Great Mother / La Grande Madre, The Threshold Guardian, The Puer Aeternus).
   - Identify 3 to 6 prominent Symbols, their universal/Jungian archetypal significance, and deep reflective questions for the dreamer.
   - Analyze the Subconscious Conflict and the Psyche's Compensatory Message.
   - Formulate actionable Waking-Life Reflections and an Active Imagination exercise prompt.
   - Evaluate emotional intensity (1-10), lucidity (1-10), and oneiric atmosphere.
2. Formulate a rich, visually arresting Surrealist Art Prompt that visualizes the core emotional and symbolic truth of the dream in the style of ${selectedStyle}. The prompt must be vivid, metaphorical, painterly, containing rich lighting, dreamlike scale distortion, impossible architecture, or symbolic motifs.

${
  isItalian
    ? `CRITICAL LANGUAGE REQUIREMENT: The user has selected Italian ('it'). You MUST generate all text fields (title, summary, dominantEmotion, surrealismAtmosphere, archetype names, presence, psychologicalMeaning, integrationAdvice, symbol names, categories, jungianMeaning, archetypalResonance, inquiryPrompt, subconsciousConflict, resolutionOrMessage, wakingReflections, activeImaginationPrompt) entirely in Italian (Italiano). Only the artPrompt should remain in English for optimal image generation with Imagen 3.`
    : `All output must be in English.`
}

Respond strictly in JSON matching the requested structure.`;

    const schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        summary: { type: Type.STRING },
        dominantEmotion: { type: Type.STRING },
        emotionIntensity: { type: Type.INTEGER, description: "Scale 1 to 10" },
        lucidityScore: { type: Type.INTEGER, description: "Scale 1 to 10" },
        surrealismAtmosphere: { type: Type.STRING },
        archetypes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              archetype: { type: Type.STRING },
              presence: { type: Type.STRING },
              psychologicalMeaning: { type: Type.STRING },
              integrationAdvice: { type: Type.STRING },
            },
            required: ["archetype", "presence", "psychologicalMeaning", "integrationAdvice"],
          },
        },
        symbols: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: {
                type: Type.STRING,
                enum: ["object", "figure", "landscape", "action", "phenomenon"],
              },
              jungianMeaning: { type: Type.STRING },
              archetypalResonance: { type: Type.STRING },
              inquiryPrompt: { type: Type.STRING },
            },
            required: ["name", "category", "jungianMeaning", "archetypalResonance", "inquiryPrompt"],
          },
        },
        subconsciousConflict: { type: Type.STRING },
        resolutionOrMessage: { type: Type.STRING },
        wakingReflections: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        activeImaginationPrompt: { type: Type.STRING },
        artPrompt: { type: Type.STRING, description: "Surrealist image generation prompt" },
      },
      required: [
        "title",
        "summary",
        "dominantEmotion",
        "emotionIntensity",
        "lucidityScore",
        "surrealismAtmosphere",
        "archetypes",
        "symbols",
        "subconsciousConflict",
        "resolutionOrMessage",
        "wakingReflections",
        "activeImaginationPrompt",
        "artPrompt",
      ],
    };

    const analysisResponse = await generateContentWithRetryAndFallback(ai, {
      contents: [
        {
          role: "user",
          parts: [{ text: `Dream Narrative:\n"""\n${dreamText}\n"""\nAnalyze this dream thoroughly.` }],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    let interpretation: any;
    try {
      interpretation = JSON.parse(cleanJsonString(analysisResponse.text));
    } catch {
      interpretation = {
        title: "The Subconscious Vision",
        summary: dreamText.slice(0, 150) + "...",
        dominantEmotion: "Mysterious",
        emotionIntensity: 7,
        lucidityScore: 6,
        surrealismAtmosphere: "Enigmatic dreamscape with symbolic undercurrents",
        archetypes: [
          {
            archetype: "The Self",
            presence: "Unifying presence within the dream narrative",
            psychologicalMeaning: "Represents the quest for psychological wholeness and balance.",
            integrationAdvice: "Reflect on how the elements of the dream bring balance to your waking consciousness.",
          },
        ],
        symbols: [
          {
            name: "The Dream Journey",
            category: "action",
            jungianMeaning: "A path through uncharted psychic territory.",
            archetypalResonance: "Individuation process",
            inquiryPrompt: "What step is your psyche urging you to take in waking life?",
          },
        ],
        subconsciousConflict: "Integrating hidden aspects of self into daily awareness.",
        resolutionOrMessage: "Trust the intuitive wisdom arising from within.",
        wakingReflections: ["Journal your immediate emotional impressions today."],
        activeImaginationPrompt: "Re-enter the dream scene in a quiet meditative state.",
        artPrompt: `A surrealist oil painting depicting a dream narrative in the style of ${selectedStyle}`,
      };
    }

    // Next, generate surrealist image using Gemini image models with multi-model fallback
    let imageUrl: string | null = null;
    let artPromptUsed = interpretation.artPrompt || `A surrealist oil painting depicting ${interpretation.title}, dreamlike atmosphere, Rene Magritte and Salvador Dali style, mysterious symbolic light`;

    try {
      const fullArtPrompt = `${artPromptUsed}, surrealist fine art masterpiece in the style of ${selectedStyle}, high detail, cinematic mystical lighting, museum quality painting`;
      imageUrl = await generateArtworkWithGemini(ai, fullArtPrompt, "4:3", interpretation.title || "Oneiric Vision");
    } catch (imageErr: any) {
      console.warn("Image generation error (falling back safely):", formatErrorMessage(imageErr));
    }

    return res.json({
      interpretation: {
        ...interpretation,
        artPromptUsed,
        artStyle: selectedStyle,
      },
      imageUrl,
      imagePrompt: artPromptUsed,
    });
  } catch (error: any) {
    const cleanError = formatErrorMessage(error);
    console.error("Dream analysis error:", cleanError);
    return res.status(500).json({
      error: cleanError || "Failed to analyze dream and generate artwork",
    });
  }
});

// Endpoint: Regenerate Art with custom style/prompt
app.post("/api/generate-art", async (req, res) => {
  try {
    const { prompt, style } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGenAI();
    const fullPrompt = `${prompt}, surrealist masterpiece in the artistic style of ${style || "Salvador Dali and Rene Magritte"}, intricate symbolic details, evocative dream atmosphere, oil on canvas, 8k fine art quality`;

    const titleCandidate = prompt.replace(/^(A surrealist oil painting depicting|A surrealist painting of|Surrealist painting of)/i, "").trim();
    const imageUrl = await generateArtworkWithGemini(ai, fullPrompt, "4:3", titleCandidate.slice(0, 38) || "Oneiric Vision");

    if (!imageUrl) {
      return res.status(503).json({
        error: "Image generation is temporarily unavailable or busy. Please try again in a moment.",
      });
    }

    return res.json({
      imageUrl,
      prompt: fullPrompt,
    });
  } catch (error: any) {
    const cleanError = formatErrorMessage(error);
    console.error("Art generation error:", cleanError);
    return res.status(500).json({
      error: cleanError || "Failed to generate dream artwork",
    });
  }
});

// Endpoint: Symbol Inquiry Chat
app.post("/api/symbol-chat", async (req, res) => {
  try {
    const { dreamContext, history, message, targetSymbol, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGenAI();
    const isItalian = language === "it";

    const systemInstruction = `You are an empathetic, insightful Jungian depth psychologist and dream analyst engaging with a dreamer in an interactive dialogue about their dream.

Context of the Dream:
- Title: ${dreamContext?.title || "Untitled Dream"}
- Transcription / Narrative: ${dreamContext?.transcription || "N/A"}
- Dominant Emotion: ${dreamContext?.interpretation?.dominantEmotion || "Subconscious reflection"}
- Identified Archetypes: ${JSON.stringify(dreamContext?.interpretation?.archetypes || [])}
- Identified Symbols: ${JSON.stringify(dreamContext?.interpretation?.symbols || [])}
- Subconscious Conflict: ${dreamContext?.interpretation?.subconsciousConflict || "N/A"}
${targetSymbol ? `- Focus Symbol being inquired about: "${targetSymbol}"` : ""}

Guidelines for your response:
1. Speak with warmth, deep psychological insight, and gentle curiosity.
2. Blend classical Jungian depth psychology (shadow integration, active imagination, collective unconscious, archetypal motifs, alchemy of the psyche) with personal introspection.
3. Help the dreamer explore their own subjective emotional associations ("What did the symbol feel like to you in the moment?").
4. If relevant, propose a brief active imagination visualization or a reflective journaling inquiry.
5. Format your answers with clear formatting, bolding important psychological terms, and keeping responses focused (2-4 thoughtful paragraphs).
${
  isItalian
    ? `CRITICAL LANGUAGE REQUIREMENT: The user has chosen Italian ('it'). You MUST respond strictly in natural, profound, and elegant Italian (Italiano). Use accurate Jungian terms in Italian (e.g., L'Ombra, L'Anima/L'Animus, Il Sé, L'Inconscio Collettivo, Immaginazione Attiva, Funzione Compensatoria).`
    : `Respond in English.`
}`;

    const rawHistory = Array.isArray(history) ? history : [];
    const chatContents: any[] = [];

    // Filter prior history to avoid trailing duplicate user message
    const priorHistory = rawHistory.filter((item: any) => item.text !== message);

    for (const item of priorHistory) {
      const role = item.sender === "user" ? "user" : "model";
      if (chatContents.length > 0 && chatContents[chatContents.length - 1].role === role) {
        chatContents[chatContents.length - 1].parts[0].text += `\n\n${item.text}`;
      } else {
        chatContents.push({
          role,
          parts: [{ text: item.text }],
        });
      }
    }

    // Gemini multi-turn must start with user turn
    if (chatContents.length > 0 && chatContents[0].role === "model") {
      chatContents.unshift({
        role: "user",
        parts: [{ text: isItalian ? "Vorrei iniziare a riflettere su questo sogno e sui suoi simboli." : "I would like to explore this dream and its symbolic meaning." }],
      });
    }

    // Add current user prompt
    const formattedPrompt = targetSymbol
      ? `[Inquiring specifically about symbol: "${targetSymbol}"]\n${message}`
      : message;

    if (chatContents.length > 0 && chatContents[chatContents.length - 1].role === "user") {
      chatContents[chatContents.length - 1].parts = [{ text: formattedPrompt }];
    } else {
      chatContents.push({
        role: "user",
        parts: [{ text: formattedPrompt }],
      });
    }

    const response = await generateContentWithRetryAndFallback(ai, {
      contents: chatContents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || "I am reflecting on your symbol... Please share what personal feelings it invokes in you.",
    });
  } catch (error: any) {
    const cleanError = formatErrorMessage(error);
    console.error("Symbol chat error:", cleanError);
    return res.status(500).json({
      error: cleanError || "Failed to process chat response",
    });
  }
});

// Explicit 404 for unhandled API routes so they do not return HTML
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler returning JSON
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }
  const cleanError = formatErrorMessage(err);
  console.error("[Server Error]", cleanError);
  res.status(err.status || 500).json({
    error: cleanError || "Internal server error occurred",
  });
});

// Vite middleware for development & static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dream Journal server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
