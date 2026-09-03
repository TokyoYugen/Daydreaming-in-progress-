import { DreamEntry } from '../types';

export interface SurrealistPalette {
  name: string;
  bg1: string;
  bg2: string;
  accent: string;
  glow: string;
  light: string;
  highlight: string;
  atmosphere: string;
}

export const SURREALIST_PALETTES: SurrealistPalette[] = [
  {
    name: 'Oceanic Cathedral',
    bg1: '#050d1a',
    bg2: '#0d2238',
    accent: '#38bdf8',
    glow: '#818cf8',
    light: '#fde047',
    highlight: '#a5f3fc',
    atmosphere: 'Submerged Sanctuary & Silver Mirrors',
  },
  {
    name: 'Alchemical Clockwork',
    bg1: '#120d06',
    bg2: '#281a0e',
    accent: '#f59e0b',
    glow: '#d97706',
    light: '#fef08a',
    highlight: '#fde68a',
    atmosphere: 'Brass Mechanism & Celestial Gears',
  },
  {
    name: 'Cosmic Labyrinth',
    bg1: '#0f071a',
    bg2: '#240f38',
    accent: '#c084fc',
    glow: '#e879f9',
    light: '#fed7aa',
    highlight: '#f472b6',
    atmosphere: 'Midnight Astral & Floating Portals',
  },
  {
    name: 'Lucid Horizon',
    bg1: '#061317',
    bg2: '#132832',
    accent: '#2dd4bf',
    glow: '#5eead4',
    light: '#fef08a',
    highlight: '#99f6e4',
    atmosphere: 'Emerald Horizon & Metaphysical Sky',
  },
  {
    name: 'Shadow Realm',
    bg1: '#150810',
    bg2: '#2a0e1c',
    accent: '#fb7185',
    glow: '#f43f5e',
    light: '#fde68a',
    highlight: '#fda4af',
    atmosphere: 'Jungian Shadow & Alchemical Crucible',
  },
];

// Helper to convert UTF-8 string to Base64 in any JS environment (browser or node)
// Simple, reliable XML entity escaping for SVG text and attributes
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Convert string to base64 reliably across browser and node environments
export function utf8ToBase64(str: string): string {
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'utf-8').toString('base64');
    }
    if (typeof window !== 'undefined') {
      const bytes = new TextEncoder().encode(str);
      let binString = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binString += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binString);
    }
  } catch (e) {
    console.error('Base64 encoding failed:', e);
  }
  return '';
}

// Check if a base64 string is a valid SVG without unescaped XML entity bugs
export function isValidSvgBase64(base64: string): boolean {
  try {
    const raw = typeof window !== 'undefined'
      ? (() => {
          const bin = window.atob(base64);
          const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
          return new TextDecoder().decode(bytes);
        })()
      : Buffer.from(base64, 'base64').toString('utf-8');

    if (!raw.includes('<svg') || !raw.includes('</svg>')) {
      return false;
    }

    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const doc = new window.DOMParser().parseFromString(raw, 'image/svg+xml');
      return !doc.querySelector('parsererror');
    }

    // Strip comments before checking for stray ampersands in fallback environments
    const stripped = raw.replace(/<!--[\s\S]*?-->/g, '');
    return !/&(?!(amp|lt|gt|quot|apos|#\d+|#x[a-f0-9]+);)/i.test(stripped);
  } catch {
    return false;
  }
}

// Generates high-resolution Surrealist Artwork as a Base64 SVG Data-URI
export function generateDreamSvgArtwork(
  title: string = 'Visione Onirica',
  styleName: string = 'Surrealismo Magritte & Dalí',
  emotion: string = 'Mistero & Trascendenza'
): string {
  let hash = 0;
  const str = `${title}-${styleName}-${emotion}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
  }
  const positiveHash = Math.abs(hash);
  const palette = SURREALIST_PALETTES[positiveHash % SURREALIST_PALETTES.length];
  const motifType = positiveHash % 3; // 0 = Portal & Mirrors, 1 = Clockwork & Astronomy, 2 = Sacred Monolith

  const safeTitle = escapeXml((title || 'Visione Onirica').slice(0, 42));
  const safeStyle = escapeXml((styleName || 'Surrealist Fine Art').slice(0, 36));
  const safeEmotion = escapeXml((emotion || palette.atmosphere).toUpperCase().slice(0, 32));

  // Dynamic SVG based on motif
  let centerMotif = '';
  if (motifType === 0) {
    // Portal & Silver Mirror Motif (Magritte style)
    centerMotif = `
      <!-- Surrealist Floating Arch & Portal -->
      <polygon points="400,120 460,370 400,410 340,370" fill="url(#portalGrad)" stroke="${palette.accent}" stroke-width="2" filter="url(#surrealGlow)" />
      <circle cx="400" cy="260" r="32" fill="${palette.light}" fill-opacity="0.8" />
      <circle cx="400" cy="260" r="14" fill="${palette.bg1}" />
      <!-- Floating Mirrors -->
      <ellipse cx="230" cy="220" rx="26" ry="42" fill="${palette.bg2}" stroke="${palette.highlight}" stroke-width="1.5" fill-opacity="0.7" transform="rotate(-15 230 220)" />
      <ellipse cx="570" cy="200" rx="26" ry="42" fill="${palette.bg2}" stroke="${palette.highlight}" stroke-width="1.5" fill-opacity="0.7" transform="rotate(15 570 200)" />
    `;
  } else if (motifType === 1) {
    // Clockwork & Celestial Gears (Varo/Dalí style)
    centerMotif = `
      <!-- Alchemical Gear & Golden Key -->
      <circle cx="400" cy="250" r="70" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-dasharray="12 6" filter="url(#surrealGlow)" />
      <circle cx="400" cy="250" r="45" fill="none" stroke="${palette.light}" stroke-width="1.5" stroke-dasharray="6 4" />
      <circle cx="400" cy="250" r="18" fill="${palette.accent}" fill-opacity="0.6" />
      <!-- Golden Key Motif -->
      <path d="M 395 240 L 405 240 L 405 350 L 418 350 L 418 362 L 405 362 L 405 372 L 415 372 L 415 382 L 395 382 Z" fill="${palette.light}" stroke="${palette.accent}" stroke-width="1" filter="url(#surrealGlow)" />
    `;
  } else {
    // Sacred Monolith & Cosmic Eye (De Chirico/Ernst style)
    centerMotif = `
      <!-- Metaphysical Monolith Tower -->
      <polygon points="400,100 445,390 400,430 355,390" fill="url(#portalGrad)" stroke="${palette.accent}" stroke-width="2" filter="url(#surrealGlow)" />
      <!-- Eye of the Unconscious -->
      <path d="M 350 250 Q 400 215 450 250 Q 400 285 350 250 Z" fill="${palette.bg1}" stroke="${palette.light}" stroke-width="2" />
      <circle cx="400" cy="250" r="16" fill="${palette.accent}" />
      <circle cx="400" cy="250" r="6" fill="${palette.light}" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <radialGradient id="skyGrad" cx="50%" cy="32%" r="85%">
        <stop offset="0%" stop-color="${palette.glow}" stop-opacity="0.45" />
        <stop offset="50%" stop-color="${palette.bg2}" />
        <stop offset="100%" stop-color="${palette.bg1}" />
      </radialGradient>
      <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${palette.light}" stop-opacity="0.9" />
        <stop offset="50%" stop-color="${palette.accent}" stop-opacity="0.65" />
        <stop offset="100%" stop-color="${palette.bg1}" stop-opacity="0.95" />
      </linearGradient>
      <filter id="surrealGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="16" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Canvas Deep Twilight Background -->
    <rect width="800" height="600" fill="url(#skyGrad)" />

    <!-- Luminous Celestial Sphere / Sun-Moon -->
    <circle cx="400" cy="200" r="130" fill="${palette.glow}" fill-opacity="0.25" filter="url(#surrealGlow)" />
    <circle cx="400" cy="200" r="85" fill="${palette.light}" fill-opacity="0.85" />
    <circle cx="400" cy="200" r="80" fill="url(#skyGrad)" fill-opacity="0.92" />

    <!-- Dream Horizon / Fluid Surrealist Dunes & Oceans -->
    <path d="M 0 360 Q 200 310 400 370 T 800 340 L 800 600 L 0 600 Z" fill="${palette.bg2}" fill-opacity="0.85" />
    <path d="M 0 420 Q 280 370 540 430 T 800 400 L 800 600 L 0 600 Z" fill="${palette.bg1}" />

    <!-- Surrealist Perspective Rays -->
    <line x1="400" y1="200" x2="40" y2="600" stroke="${palette.glow}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="6 4" />
    <line x1="400" y1="200" x2="760" y2="600" stroke="${palette.glow}" stroke-width="1.2" stroke-opacity="0.35" stroke-dasharray="6 4" />
    <line x1="400" y1="200" x2="400" y2="600" stroke="${palette.accent}" stroke-width="1.5" stroke-opacity="0.5" />

    <!-- Centerpiece Motif -->
    ${centerMotif}

    <!-- Floating Oneiric Geometries -->
    <polygon points="170,160 200,210 140,210" fill="${palette.accent}" fill-opacity="0.4" stroke="${palette.light}" stroke-width="1" />
    <polygon points="630,150 665,205 595,205" fill="${palette.accent}" fill-opacity="0.4" stroke="${palette.light}" stroke-width="1" />
    <circle cx="130" cy="310" r="14" fill="${palette.glow}" fill-opacity="0.5" />
    <circle cx="670" cy="300" r="18" fill="${palette.light}" fill-opacity="0.5" />

    <!-- Surrealist Museum Gallery Frame -->
    <rect x="18" y="18" width="764" height="564" fill="none" stroke="${palette.accent}" stroke-opacity="0.4" stroke-width="1.5" />
    <rect x="24" y="24" width="752" height="552" fill="none" stroke="${palette.light}" stroke-opacity="0.2" stroke-width="0.75" />

    <!-- Museum Typography Placard -->
    <rect x="120" y="495" width="560" height="70" rx="10" fill="#030712" fill-opacity="0.88" stroke="${palette.accent}" stroke-opacity="0.35" />
    <text x="400" y="527" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="18" font-weight="700" fill="${palette.accent}" letter-spacing="2.5">${safeTitle}</text>
    <text x="400" y="549" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="${palette.light}" letter-spacing="1.5" opacity="0.85">${safeEmotion} • ${safeStyle}</text>
  </svg>`;

  const base64 = utf8ToBase64(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

// Preset Artwork for Sample 1: The Submerged Cathedral of Mirrors
export const SUBMERGED_CATHEDRAL_ARTWORK = '/artwork/cathedral_of_mirrors.jpg';

// Preset Artwork for Sample 2: The Clockwork Forest of Brass Owls
export const CLOCKWORK_FOREST_ARTWORK = '/artwork/clockwork_forest_owl.jpg';

// Helper to get safe artwork URL
export function getSafeDreamArtwork(dream: DreamEntry): string {
  // If it's sample dream 1 or 2, always guarantee the authentic surrealist paintings
  if (dream.id === 'sample-dream-1') {
    return SUBMERGED_CATHEDRAL_ARTWORK;
  }
  if (dream.id === 'sample-dream-2') {
    return CLOCKWORK_FOREST_ARTWORK;
  }

  if (dream.imageUrl && typeof dream.imageUrl === 'string' && dream.imageUrl.trim() !== '') {
    const url = dream.imageUrl.trim();
    if (url.startsWith('/artwork/')) {
      return url;
    }
    // If it's the broken data:image/svg+xml;utf8, format, repair it immediately
    if (url.startsWith('data:image/svg+xml;utf8,')) {
      try {
        const decodedSvg = decodeURIComponent(url.replace('data:image/svg+xml;utf8,', ''));
        return `data:image/svg+xml;base64,${utf8ToBase64(decodedSvg)}`;
      } catch {
        // regenerate below
      }
    } else if (url.startsWith('data:image/svg+xml;base64,')) {
      const b64 = url.replace('data:image/svg+xml;base64,', '');
      if (isValidSvgBase64(b64)) {
        return url;
      }
      // If SVG XML was invalid (e.g. unescaped & from previous version), regenerate cleanly below
    } else if (url.startsWith('data:image/') && !url.includes('undefined')) {
      // Valid data uri (jpeg, png)
      return url;
    } else if (url.startsWith('http') && !url.includes('unsplash.com')) {
      // Valid remote image url
      return url;
    }
  }

  // Otherwise generate custom SVG for this dream
  const style = dream.interpretation?.artStyle || 'Surrealist Masterpiece';
  const emotion = dream.interpretation?.dominantEmotion || 'Oneiric Vision';
  return generateDreamSvgArtwork(dream.title, style, emotion);
}
