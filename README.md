# CodeCanvas - Universal AI-Native IDE

**OpenAI Build Week 2026 Submission**

CodeCanvas is a completely reimagined, browser-based IDE engineered from the ground up for the AI era. Built natively for the **OpenAI API (GPT-4o)**, it brings lightning-fast Ghost Text auto-completions and instant Auto-Debugging directly into your workflow.

However, true innovation requires true flexibility. 

CodeCanvas is the first IDE architecture designed to be a "Universal Client." While powered by OpenAI for maximum capability, I engineered the backbone to be so lightweight and optimized that **it runs smoothly even when tethered to a local 3B parameter model** (like Llama-3-3B or Phi-3 via Ollama). Furthermore, I've successfully stress-tested it using the Gemini Free API. 

You can literally plug *any* AI brain into this IDE.

## Features
- **OpenAI-Powered Ghost Text**: Inline code completions powered by GPT-4o-mini as you type.
- **Universal AI Adapter**: Switch seamlessly between OpenAI, Local Ollama (3B models), or Google Gemini in the settings.
- **Zero-Latency Live Preview**: The rendering engine instantly compiles your HTML/CSS/JS completely locally without a backend.
- **100% Offline Editor**: The Monaco Code Editor is fully bundled into the application, guaranteeing it never fails to load due to blocked CDNs or poor WiFi.
- **Neon Glassmorphism UI**: A gorgeous, ultra-modern VS Code-style layout designed for deep focus.

## Development Journey & Acknowledgements
During the frantic hours of this build week, I leveraged the **OpenAI GPT-5.6 Terra free tier**, alongside collaborative brainstorm sessions with AI agents **Luna** and **Sol**, to architect the core components.

We got *many* crucial brainstorms from GPT-5.6 Terra, but the most important problem it solved for us was the **Terminal Interceptor Architecture**. When building the Live Preview, we struggled with infinite loop re-renders when trying to pipe `console.log()` outputs from the sandboxed iframe back to the React parent window. GPT-5.6 Terra instantly provided the solution: injecting a lightweight IIFE directly into the `srcDoc` string to serialize the arguments and safely route them via `window.parent.postMessage()`.

## Installation & Setup

We have removed all messy dependencies to ensure a flawless installation.

1. **Clone and Install**
   ```bash
   git clone https://github.com/prashanth-karanam/CodeCanvas.git
   cd CodeCanvas
   npm install
   ```

2. **Start the IDE**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Configure OpenAI (Recommended)**
   - Click the **Settings (Gear Icon)** in the top right.
   - Select **OpenAI API (Build Week)** from the dropdown.
   - Enter your OpenAI API key (`sk-proj-...`).

4. **(Optional) Run with a Local 3B Model**
   To test the highly-optimized local architecture, install [Ollama](https://ollama.com) and pull a small model:
   ```bash
   ollama run phi3:mini
   ```
   *Note: If running on Windows, ensure your environment variables allow CORS by setting `OLLAMA_ORIGINS="*"` before starting Ollama.*

## Technical Execution (Build Week Criteria)
- **Innovation**: Eliminates the need for massive Electron-based desktop apps by running a full AI-IDE in the browser.
- **Optimization**: Proves that AI-native tools don't inherently require massive compute; the Ghost Text engine is optimized enough to remain useful even when paired with a highly constrained 3B local model.
- **Product Quality**: Built with `react-resizable-panels` and a custom-configured Monaco editor bundle to provide a flawless, professional-grade user experience.
