# Nocturne — Daydreaming 🌙

A multimodal, Jungian dream journal and active imagination web application powered by **Gemini 3.8 Flash** and **Google GenAI SDK**. 

Capture waking dreams immediately through voice or text, explore subconscious motifs with deep Jungian archetypal analysis, engage in active imagination dialogues with dream symbols, and generate surrealist artwork inspired by Salvador Dalí, René Magritte, Giorgio de Chirico, Remedios Varo, and Max Ernst.

---

## ✨ Key Features

- 🎙️ **Waking Voice Recording**: Direct browser-based audio capture with ambient waveform visualizer and automatic AI transcription via `gemini-3.8-flash`.
- 🧠 **Jungian Archetype & Symbol Analysis**: Structured psychological dream interpretations (The Self, Shadow, Anima/Animus, Persona, Wise Guide, Psychopomp) paired with inquiry prompts and personal integration advice.
- 🎨 **Surrealist Dream Art & Resilient Pipeline**:
  - Fine art generation reflecting the specific imagery and symbolic motifs of each dream.
  - **Zero-Failure Architecture**: Uses Imagen 3 with a smart fallback to **standalone generative SVGs created by Gemini 3.8 Flash** and deterministic client-side rendering (ensuring no blank or broken artwork if image quotas are exceeded).
- 💬 **Active Imagination & Symbol Chat**: Interactive AI dialogue directly with individual dream characters and symbols to explore unconscious meanings.
- 🗺️ **Archetype & Emotion Frequency Map**: Visual breakdown of your recurring psychological symbols, emotional climates, and lucidity levels over time.
- 🌐 **Native Bilingual Support (IT / EN)**: Seamless, one-click switching between Italian and English across all UI elements, sample entries, and analytical charts.
- 📱 **Mobile & PWA Ready**: Fully responsive layout designed for bedtime and morning bedside use, installable directly from your mobile browser without app store friction.
- 💾 **Safe Local & Server Persistence**: Instant caching in `localStorage` with server-side JSON synchronization and one-click JSON/Markdown backup export.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend (BFF)**: Express.js proxying requests securely to protect API keys from browser exposure.
- **AI & Models**:
  - `@google/genai` TypeScript SDK
  - `gemini-3.8-flash` (Audio transcription, Jungian psychological extraction, Active Imagination chat, Generative SVG paintings)
  - `imagen-3.0-generate-002` (Surrealist canvas generation)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun / pnpm)
- A Google Gemini API key ([Get one on Google AI Studio](https://aistudio.google.com/))

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vincenzoboellis/Daydreaming.git
   cd Daydreaming
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key inside `.env`:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
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

---

## 📱 Mobile Installation (PWA)

No need for App Stores. You can install **Nocturne** directly to your phone's home screen:
1. Open the hosted web application on your phone's browser (Safari on iOS, Chrome on Android).
2. Tap the **Share** button (iOS) or the **Three dots** menu (Android).
3. Select **"Add to Home Screen"** (*Aggiungi alla schermata Home*).
4. Launch it anytime like a native full-screen app right next to your bed upon waking.

---

## 🛡️ Privacy & Security

Dreams are deeply personal. The backend acts strictly as an API proxy for model inference. All dream logs, voice transcripts, and interpretations are stored locally in your environment and never shared with third-party tracking services.

---

## 📄 License

MIT License — feel free to explore, fork, and expand your own dream explorations.
