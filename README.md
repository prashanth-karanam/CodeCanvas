# CodeCanvas

A browser-based code workspace combining a client-side code editor, real-time live preview, and an interactive whiteboard for architectural planning and UI mockups.

[Live Demo](https://prashanth-karanam.github.io/CodeCanvas/)

## Overview

CodeCanvas provides a unified environment for front-end prototyping. Instead of switching between separate whiteboarding tools, editors, and browser windows, CodeCanvas embeds a visual sketchpad directly alongside a live HTML, CSS, and JavaScript editor.

## Key Features

- **In-Browser Code Editor**: Write and edit HTML, CSS, and JavaScript with syntax highlighting and auto-formatting.
- **Instant Live Preview**: Client-side rendering engine that hot-reloads web code directly in an isolated iframe.
- **Interactive Sketchpad (Canvas)**: Built-in HTML5 canvas for drawing wireframes, architecture flowcharts, and component diagrams side-by-side with code.
- **AI-Assisted Debugging**: Optional OpenAI API integration (GPT-4o, GPT-4o-mini) for analyzing console errors, explaining code, and providing syntax patches.
- **Export Options**: Export canvas drawings as PNG images or copy HTML templates directly into your project.

## Tech Stack

- **Frontend**: React 18, Vite, JavaScript (ESNext)
- **Canvas Engine**: HTML5 2D Canvas API
- **AI Integration**: OpenAI API (Bring-Your-Own-Key client-side integration)
- **Styling**: Responsive CSS with Dark and Light themes

## Getting Started

### Run Online
Open the [Live Demo](https://prashanth-karanam.github.io/CodeCanvas/) directly in your browser.

### Run Locally

1. Clone the repository:
```bash
git clone https://github.com/prashanth-karanam/CodeCanvas.git
cd CodeCanvas
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## License
MIT
