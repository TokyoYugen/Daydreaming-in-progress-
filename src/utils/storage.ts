import { DreamEntry } from '../types';
import { SAMPLE_DREAMS } from '../data/sampleDreams';
import { Language } from './translations';
import { fetchJson } from './apiClient';
import { getSafeDreamArtwork } from './dreamArtwork';

const STORAGE_KEY = 'nocturne_dream_journal_entries';

function sanitizeDreams(dreams: DreamEntry[]): DreamEntry[] {
  return dreams.map((d) => {
    const safeUrl = getSafeDreamArtwork(d);
    if (d.imageUrl !== safeUrl && (!d.imageUrl || d.imageUrl.includes('unsplash.com') || d.imageUrl.startsWith('data:image/svg+xml;utf8,'))) {
      return { ...d, imageUrl: safeUrl };
    }
    return d;
  });
}

export function loadSavedDreams(): DreamEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with sample dreams on first load
      const seeded = sanitizeDreams(SAMPLE_DREAMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seeded = sanitizeDreams(SAMPLE_DREAMS);
      return seeded;
    }
    // Ensure all sample dreams are present or merged and sanitized
    const sanitized = sanitizeDreams(parsed);
    return sanitized;
  } catch (err) {
    console.error('Failed to load dreams from localStorage:', err);
    return sanitizeDreams(SAMPLE_DREAMS);
  }
}

export async function syncDreamsWithServer(): Promise<DreamEntry[]> {
  try {
    const local = loadSavedDreams();
    const serverData = await fetchJson<{ dreams: DreamEntry[] }>('/api/dreams');
    const serverDreams = Array.isArray(serverData.dreams) ? serverData.dreams : [];

    // Merge server dreams with local dreams
    const map = new Map<string, DreamEntry>();

    // Put sample dreams first
    SAMPLE_DREAMS.forEach((d) => map.set(d.id, d));

    // Put local dreams
    local.forEach((d) => map.set(d.id, d));

    // Put / overlay server dreams
    serverDreams.forEach((d) => map.set(d.id, d));

    const merged = Array.from(map.values()).sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    saveDreams(merged);

    // Also push any local user dreams to server if missing
    for (const d of local) {
      if (!d.id.startsWith('sample-dream') && !serverDreams.some((sd) => sd.id === d.id)) {
        fetchJson('/api/dreams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(d),
        }).catch(() => {});
      }
    }

    return merged;
  } catch (err) {
    console.warn('Server dream sync warning (offline/local fallback):', err);
    return loadSavedDreams();
  }
}

export function saveDreams(dreams: DreamEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dreams));
  } catch (err) {
    console.error('Failed to save dreams to localStorage:', err);
  }
}

export function saveSingleDream(dream: DreamEntry): DreamEntry[] {
  const existing = loadSavedDreams();
  const index = existing.findIndex((d) => d.id === dream.id);
  let updated: DreamEntry[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = dream;
  } else {
    updated = [dream, ...existing];
  }
  saveDreams(updated);

  // Asynchronously persist to server storage
  fetchJson('/api/dreams', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dream),
  }).catch((err) => {
    console.warn('Could not sync dream to server:', err);
  });

  return updated;
}

export function deleteDream(id: string): DreamEntry[] {
  const existing = loadSavedDreams();
  const filtered = existing.filter((d) => d.id !== id);
  saveDreams(filtered);

  // Asynchronously delete from server storage
  fetchJson(`/api/dreams/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).catch((err) => {
    console.warn('Could not delete dream on server:', err);
  });

  return filtered;
}

export function exportDreamsAsJSON(dreams: DreamEntry[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dreams, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `dream-journal-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportDreamAsMarkdown(dream: DreamEntry, language: Language = 'en'): void {
  const isIt = language === 'it';
  let md = `# ${dream.title}\n\n`;
  md += `**${isIt ? 'Data' : 'Date'}:** ${new Date(dream.createdAt).toLocaleDateString(isIt ? 'it-IT' : 'en-US')} | **${isIt ? 'Lucidità' : 'Lucidity'}:** ${dream.lucidityRating}/10\n\n`;
  md += `## ${isIt ? 'Racconto del Sogno' : 'Dream Narrative'}\n\n${dream.transcription}\n\n`;

  if (dream.interpretation) {
    const inter = dream.interpretation;
    md += `## ${isIt ? 'Interpretazione Psicologica' : 'Psychological Interpretation'}\n\n`;
    md += `**${isIt ? 'Atmosfera' : 'Atmosphere'}:** ${inter.surrealismAtmosphere}\n`;
    md += `**${isIt ? 'Emozione Dominante' : 'Dominant Emotion'}:** ${inter.dominantEmotion} (${isIt ? 'Intensità' : 'Intensity'}: ${inter.emotionIntensity}/10)\n\n`;
    md += `### ${isIt ? 'Sintesi Fondamentale' : 'Core Summary'}\n${inter.summary}\n\n`;

    md += `### ${isIt ? 'Archetipi Junghiani' : 'Jungian Archetypes'}\n`;
    inter.archetypes.forEach((arch) => {
      md += `- **${arch.archetype}**\n  - *${isIt ? 'Manifestazione' : 'Manifestation'}:* ${arch.presence}\n  - *${isIt ? 'Significato' : 'Meaning'}:* ${arch.psychologicalMeaning}\n  - *${isIt ? 'Integrazione' : 'Integration'}:* ${arch.integrationAdvice}\n`;
    });
    md += `\n`;

    md += `### ${isIt ? 'Simboli Principali' : 'Key Symbols'}\n`;
    inter.symbols.forEach((sym) => {
      md += `- **${sym.name}** (${sym.category}): ${sym.jungianMeaning}\n  - *${isIt ? 'Domanda di riflessione' : 'Prompt'}:* ${sym.inquiryPrompt}\n`;
    });
    md += `\n`;

    md += `### ${isIt ? 'Tensione Inconscia & Messaggio' : 'Subconscious Conflict & Message'}\n`;
    md += `**${isIt ? 'Tensione Inconscia' : 'Subconscious Conflict'}:** ${inter.subconsciousConflict}\n\n`;
    md += `**${isIt ? 'Messaggio Compensatorio' : 'Resolution/Message'}:** ${inter.resolutionOrMessage}\n\n`;

    md += `### ${isIt ? 'Domande di Riflessione per il Diario' : 'Waking Reflections'}\n`;
    inter.wakingReflections.forEach((ref) => {
      md += `- ${ref}\n`;
    });
    md += `\n`;

    md += `### ${isIt ? 'Esercizio di Immaginazione Attiva' : 'Active Imagination Exercise'}\n${inter.activeImaginationPrompt}\n\n`;
  }

  if (dream.imagePrompt) {
    md += `## ${isIt ? 'Prompt Opera Surrealista' : 'Surrealist Artwork Prompt'}\n_${dream.imagePrompt}_\n\n`;
  }

  const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `${dream.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
