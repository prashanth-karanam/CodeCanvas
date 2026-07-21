# CodeCanvas - Universal AI-Native IDE

**OpenAI Build Week 2026 Submission**

> [!TIP]
> **[⚡ Launch Live Demo on GitHub Pages](https://prashanth-karanam.github.io/CodeCanvas/)**  
> Run the full client-side IDE in your browser with zero installs or downloads.

CodeCanvas is a completely reimagined, browser-based IDE engineered from the ground up for the AI era. Built natively for the **OpenAI API (GPT-4o, GPT-4o-mini, GPT-4-turbo)**, it brings intelligent AI Tutoring, instant Auto-Debugging, and single-click code application directly into your workspace.

---

## 🎨 Key Features

*   **OpenAI API First Class Support**: Built for **GPT-4o**, **GPT-4o-mini**, and any OpenAI model. Enter your OpenAI API key to automatically fetch and select your preferred OpenAI model dynamically.
*   **Universal AI Provider**: Seamlessly toggle between **OpenAI API**, **Local Ollama** (3B models like Phi-3), or **Google Gemini** in the AI Settings panel.
*   **AI Tutor & Apply-to-Editor**: Ask the AI Tutor questions or request fixes. With one click on "Apply to Editor", the generated code drop-in replaces your active file automatically.
*   **One-Click Auto-Debug**: A glowing header button that scans your active file for syntax and logic errors, fixing them automatically.
*   **Zero-Latency Live Preview**: The client-side rendering engine instantly compiles HTML/CSS/JS locally without any backend requirement.
*   **Interactive Cyber Board (Whiteboard)**: A fully integrated drawing canvas to sketch UI layouts, flowcharts, or system architecture right inside the editor:
    *   Drawing modes: Freehand brush, lines, rectangles, circles, arrows, and text.
    *   Neon Cyberpunk & Light mode palettes with glow effects.
    *   One-click copy as HTML `<img>` tag or download as PNG.
*   **Built-in Project Templates**: Jumpstart development instantly with pre-configured templates for portfolios, landing pages, interactive apps, and games.
*   **Pure Light & Dark Cosmic Themes**: Toggle between a high-contrast Cyber Dark mode and a clean Pure White Light mode across all editor components.

---

## 🛠️ Setup & Usage

1.  **Launch Web Version**: Open the [Live GitHub Pages Demo](https://prashanth-karanam.github.io/CodeCanvas/).
2.  **Add OpenAI API Key**:
    *   Click the **Gear Icon (Settings)** in the top right.
    *   Select **OpenAI API (Build Week)** as the provider.
    *   Paste your OpenAI API key (`sk-proj-...`).
    *   Click **Fetch Versions** to auto-load available models (e.g. `gpt-4o`, `gpt-4o-mini`), select your model, and click **Save & Close**.
3.  **Local Development**:
    ```bash
    git clone https://github.com/prashanth-karanam/CodeCanvas.git
    cd CodeCanvas
    npm install
    npm run dev
    ```

---

## 📜 Built For OpenAI Build Week 2026
CodeCanvas demonstrates how AI can serve as an intuitive partner for developers, combining interactive visualization, instant code application, and multi-model flexibility into one sleek, web-based workspace.
