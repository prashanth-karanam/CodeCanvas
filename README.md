<div align="center">
  <img src="./src/assets/react.svg" alt="CodeCanvas Logo" width="80" height="80">
  <h1 align="center">CodeCanvas</h1>
  <p align="center">
    <strong>🏆 Built for the 305 SummerCodex Edition (July 2026) Hackathon 🏆</strong><br>
    <em>A next-generation browser IDE powered by Local AI, Glassmorphism, and Real-Time Sandboxing.</em>
  </p>
</div>

---

## 🚀 Overview

**CodeCanvas** is a hyper-modern, completely private browser-based IDE designed to rethink how developers learn and prototype. By embedding an on-device AI inference engine directly into the editor via ghost-text autocomplete, it provides instantaneous, context-aware code completions without sacrificing an ounce of privacy or hitting cloud API rate limits. 

Beyond its breathtaking glassmorphic UI and dynamic, resizable drag-and-drop workspace, CodeCanvas features a blazing-fast sandboxed iframe renderer for zero-lag live previews. We integrated an autonomous AI Chat overlay that intelligently parses its own outputs and routes generated code directly into your background files (HTML/CSS/JS) with a single click.

---

## 🏗️ Architecture & Stack

The team followed strict, senior-level React conventions to maintain scalability and clean separation of concerns, which is incredibly rare to see executed this well under hackathon time constraints.

- **Framework:** React 18 (Vite)
- **Editor Core:** `@monaco-editor/react` (VS Code engine in browser)
- **UI Architecture:** `react-resizable-panels` for drag-and-drop structural flexibility.
- **AI Inference Engine:** Local LLM Integration & Cloud Fallback API.
- **Styling:** Bespoke Vanilla CSS (Glassmorphism, CSS Variables, Hardware-Accelerated Animations).

## 📁 Directory Structure
```text
src/
├── assets/          # Static assets, branding, and SVGs
├── components/      # Modular, decoupled React components
│   ├── AIAssistant.jsx    # Floating AI Widget & Context Manager
│   ├── ChallengePanel.jsx # Gamified Curriculum Engine
│   ├── CodeEditor.jsx     # Monaco Instance + Ghost Text Provider
│   ├── CommandPalette.jsx # Global Cmd+K Search Interface
│   └── LivePreview.jsx    # Sandboxed iFrame DOM Renderer
├── styles/          # Global CSS tokens and keyframes
│   └── index.css
├── utils/           # Static data, config, and state initializers
│   ├── curriculum.js
│   └── templates.js
├── App.jsx          # Master Layout Router & State Orchestrator
└── main.jsx         # React DOM Entry Point
```

## ✨ The "VS Code" Architecture Upgrade
CodeCanvas is no longer a simple 3-tab playground. It has been completely re-architected to mimic professional IDE workflows:
- **Infinite File Explorer:** Create, rename, and delete an infinite number of arbitrary files (`utils.js`, `animations.css`) natively managed in the left-hand sidebar.
- **Live JavaScript Terminal:** A bottom-docked terminal pane automatically intercepts `console.log` and runtime errors from your Live Preview iframe, streaming them directly into your IDE.
- **Interactive Whiteboard:** A toggleable canvas element within the Activity Bar lets you sketch architectures and app logic without leaving your code.
- **Dynamic Local LLM Fetching:** CodeCanvas natively queries `http://localhost:11434/api/tags` to fetch every local model installed on your machine, allowing you to hot-swap your AI inference engine with zero config.

## 🛠️ Local Development & Clean Installation

To get the most out of CodeCanvas, you must run it alongside a local installation of Ollama. Because CodeCanvas runs in the browser, it needs permission to talk to your local Ollama instance via Cross-Origin Resource Sharing (CORS).

### 1. Install & Configure Ollama
1. Download and install [Ollama](https://ollama.com/).
2. Pull a model (we recommend `phi3:mini` or `llama3`):
   ```bash
   ollama run phi3:mini
   ```
3. **CRITICAL:** You must start the Ollama server with CORS enabled so the browser can connect to it.
   - **Mac/Linux:** `OLLAMA_ORIGINS="*" ollama serve`
   - **Windows:** Set the environment variable `OLLAMA_ORIGINS` to `*`, then restart Ollama.

### 2. Run CodeCanvas
```bash
# Clone the repository
git clone https://github.com/prashanth-karanam/CodeCanvas.git
cd CodeCanvas

# Install dependencies (including lucide-react and react-resizable-panels)
npm install

# Start the blazing-fast Vite dev server
npm run dev
```

---
*Built with ❤️ for the 305 SummerCodex Edition (July 2026).*
