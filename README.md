# CodeCanvas - Universal AI-Native IDE

**OpenAI Build Week 2026 Submission**

> [!TIP]
> **[⚡ Launch Live Demo on GitHub Pages](https://prashanth-karanam.github.io/CodeCanvas/)**  
> Run the full client-side IDE in your browser with zero installs or downloads.

CodeCanvas is a completely reimagined, browser-based IDE engineered from the ground up for the AI era. Built natively for the **OpenAI API (GPT-4o)**, it brings lightning-fast Ghost Text auto-completions and instant Auto-Debugging directly into your workflow.

However, true innovation requires true flexibility. 

CodeCanvas is the first IDE architecture designed to be a "Universal Client." While powered by OpenAI for maximum capability, the backbone is engineered to be so lightweight and optimized that **it runs smoothly even when tethered to a local 3B parameter model** (like Llama-3-3B or Phi-3 via Ollama) or Gemini's API.

---

## 🎨 Key Features

*   **OpenAI-Powered Ghost Text**: Inline code completions powered by GPT-4o-mini as you type.
*   **Universal AI Adapter**: Switch seamlessly between OpenAI, Local Ollama (3B models), or Google Gemini in the settings panel.
*   **Zero-Latency Live Preview**: The rendering engine instantly compiles HTML/CSS/JS completely locally without a backend.
*   **100% Offline Editor**: The Monaco Code Editor is fully bundled into the application, guaranteeing it never fails to load due to blocked CDNs.
*   **Interactive Cyber Board (Whiteboard)**: A fully custom-built drawing board designed to sketch UI layouts, system architectures, or flowcharts:
    *   Drawing modes: Freehand brush, lines, rectangles, circles, arrows, and text annotations.
    *   Neon Cyberpunk palettes with glow-toggle support.
    *   Undo / Redo memory stacks.
    *   One-click download as PNG.
    *   Copy directly as an HTML `<img>` tag containing the base64 string to paste it instantly into your code files.
    *   Fullscreen modal overlay for large-scale sketching.
*   **Built-in Interactive Curriculum**: Code challenges with live validation tests (and confetti rewards!) to teach web design steps in real-time.
*   **Neon Glassmorphism UI**: A gorgeous, ultra-modern VS Code-style layout designed for deep focus.

---

## 🛠️ Development Journey & Technical Highlights

During the build week, we leveraged collaborative brainstorm sessions with AI agents to architect the core components:
1.  **Terminal Interceptor Architecture**: We solved infinite-loop console forwarding by injecting a lightweight IIFE directly into the preview `srcDoc` iframe to serialize arguments and route them securely via `window.parent.postMessage()`.
2.  **State-Preserving Responsive Canvas**: The Cyber Board dynamically shifts sizes between sidebar mode and full-screen overlay while programmatically caching and restoring the context drawings.

---

## 🚀 Installation & Setup

We have removed all messy dependencies to ensure a flawless installation.

1.  **Clone and Install**
    ```bash
    git clone https://github.com/prashanth-karanam/CodeCanvas.git
    cd CodeCanvas
    npm install
    ```

2.  **Start the IDE**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

3.  **Configure API Keys (Optional)**
    *   Click the **Settings (Gear Icon)** in the top right.
    *   Select **OpenAI API** or **Gemini API** from the dropdown and add your key.
    *   To test the offline local architecture, install [Ollama](https://ollama.com) and run a small model:
        ```bash
        ollama run phi3:mini
        ```
        *(Windows note: Ensure CORS is enabled by setting `OLLAMA_ORIGINS="*"` in environment variables).*

4.  **Deploy to GitHub Pages**
    ```bash
    npm run build
    ```
    This project is pre-configured with a `gh-pages` script inside `package.json` for fast deployment.
