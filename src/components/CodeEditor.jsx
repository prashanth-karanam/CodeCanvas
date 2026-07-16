import React, { useRef } from 'react';
import * as monaco from 'monaco-editor';
import Editor, { loader } from '@monaco-editor/react';

loader.config({ monaco });

// Removed explicit loader config to use the default jsDelivr CDN

let providersRegistered = false;

export function CodeEditor({ code, language, onChange }) {
  const debounceTimer = useRef(null);

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('glass-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000',
        'editor.lineHighlightBackground': '#ffffff0a',
        'editorGutter.background': '#00000000',
        'editorLineNumber.foreground': '#5c6370'
      }
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Only register the global providers once
    if (providersRegistered) return;
    providersRegistered = true;

    const langs = ['html', 'css', 'javascript'];
    
    langs.forEach(lang => {
      monaco.languages.registerInlineCompletionsProvider(lang, {
        provideInlineCompletions: async (model, position, context, token) => {
          // Grab last 10 lines of context for the AI
          const textUntilPosition = model.getValueInRange({
            startLineNumber: Math.max(1, position.lineNumber - 10),
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column
          });
          
          if (textUntilPosition.trim().length < 3) return { items: [] };

          return new Promise((resolve) => {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(async () => {
              if (token.isCancellationRequested) return resolve({ items: [] });
              
              try {
                const response = await fetch('http://localhost:11434/api/generate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    model: 'phi3:mini',
                    prompt: `Provide ONLY the raw code completion for the following snippet (do not wrap in markdown blocks, do not explain). Start exactly where the snippet leaves off:\n\n${textUntilPosition}`,
                    stream: false,
                    options: { num_predict: 24, stop: ['\n'] }
                  })
                });
                
                if (!response.ok) return resolve({ items: [] });
                const data = await response.json();
                let completion = data.response;
                
                // Cleanup AI markdown artifacts if it ignores instructions
                completion = completion.replace(/^`{1,3}\w*\n?/g, '').replace(/`{1,3}$/g, '').trimEnd();
                
                // Fix duplication glitch: If the AI repeats the line we just typed, strip the overlapping prefix
                const currentLineMatch = textUntilPosition.match(/[^\n]*$/);
                const currentLine = currentLineMatch ? currentLineMatch[0] : '';
                
                let overlapLength = 0;
                for (let i = 1; i <= currentLine.length; i++) {
                  const suffix = currentLine.slice(-i);
                  if (completion.startsWith(suffix)) {
                    overlapLength = i;
                  }
                }
                
                if (overlapLength > 0) {
                  completion = completion.slice(overlapLength);
                }

                if (completion && !token.isCancellationRequested) {
                  resolve({
                    items: [{
                      insertText: completion,
                      range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column)
                    }]
                  });
                } else {
                  resolve({ items: [] });
                }
              } catch (e) {
                resolve({ items: [] });
              }
            }, 600); // 600ms debounce to prevent Ollama spam
          });
        },
        freeInlineCompletions: () => {}
      });
    });
  };

  return (
    <Editor
      height="100%"
      language={language}
      theme="glass-theme"
      value={code}
      beforeMount={handleEditorWillMount}
      onMount={handleEditorDidMount}
      onChange={(value) => onChange(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: 'var(--font-mono)',
        wordWrap: 'on',
        padding: { top: 20 },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        inlineSuggest: { enabled: true } // Enable Ghost Text UI
      }}
    />
  );
}
