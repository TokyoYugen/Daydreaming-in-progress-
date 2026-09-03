# Dream Journal — Nocturne

A multimodal dream journal application powered by **Gemini 3.8 Flash**, featuring waking voice recording with automatic transcription, in-depth Jungian archetype analysis, symbolic chat inquiry, and rich surrealist artwork generation (inspired by Salvador Dalí, René Magritte, Remedios Varo, and Max Ernst).

## Features

- 🎙️ **Waking Voice Recording**: Direct browser-based audio capture with ambient waveform visualizer and automatic AI transcription via `gemini-3.8-flash`.
- 🧠 **Jungian Archetype & Symbol Analysis**: Deep psychological dream interpretation (The Self, Shadow, Anima/Animus, Persona, Psychopomp) with inquiry prompts and integration advice.
- 🎨 **Surrealist Dream Art**: Fine art generation reflecting the specific imagery and symbolic motifs of each dream.
- 💬 **Active Imagination & Symbol Chat**: Conversational AI dialog with individual dream symbols to uncover subconscious meanings.
- 🌐 **Bilingual (Italian & English)**: Full localization with dynamic language switching.
- 💾 **Local & Server Persistence**: Instant caching in `localStorage` with server-side synchronization.

## Getting Started

### Prerequisites
- Node.js 18+ (or Bun)
- A Google Gemini API key (`GEMINI_API_KEY`)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd dream-journal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

### Using with Antigravity 2.0
- This project follows standard modern full-stack Vite + Express + TypeScript architecture.
- Open the project folder directly in Antigravity 2.0.
- All API routes are located in `server.ts` and proxy requests to Gemini API securely.
