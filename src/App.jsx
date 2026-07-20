import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { LivePreview } from './components/LivePreview';
import { CommandPalette } from './components/CommandPalette';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Whiteboard } from './components/Whiteboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Settings, Download, LayoutTemplate, Palette, Zap, Code, Search, Wand2, FileCode2, Sun, Moon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEMPLATES } from './utils/templates';
import { CURRICULUM } from './utils/curriculum';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';

function App() {
  const [files, setFiles] = useState([
    { 
      id: '1', 
      path: '/index.html', 
      content: `<div class="welcome-box">
  <div class="glow-logo">CodeCanvas</div>
  <h1>Unleash Cosmic Code</h1>
  <p>Start editing these files to build stunning web apps. Click the glowing <strong>Auto-Debug</strong> button above to optimize your code with AI.</p>
  <div class="cosmic-line"></div>
  <div class="features">
    <span>✦ Live Preview</span>
    <span>✦ AI Tutor</span>
    <span>✦ Cyber Board</span>
  </div>
</div>`, 
      type: 'html' 
    },
    { 
      id: '2', 
      path: '/style.css', 
      content: `body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: radial-gradient(circle at center, #0c0d16 0%, #030305 100%);
  font-family: 'Outfit', -apple-system, sans-serif;
  color: #fff;
  overflow: hidden;
}

.welcome-box {
  text-align: center;
  padding: 40px;
  border-radius: 16px;
  background: rgba(8, 8, 12, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.02);
  max-width: 400px;
  animation: float 6s ease-in-out infinite;
}

.glow-logo {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 5px;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin-bottom: 12px;
  font-weight: 700;
}

h1 {
  font-size: 32px;
  margin: 10px 0;
  background: linear-gradient(90deg, #ffffff, #ff0055);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
}

p {
  color: #8b92a5;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 25px;
}

.cosmic-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.3), transparent);
  margin: 20px 0;
}

.features {
  display: flex;
  justify-content: center;
  gap: 15px;
  font-size: 12px;
  color: #a0a5b5;
  font-weight: 500;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}`, 
      type: 'css' 
    },
    { 
      id: '3', 
      path: '/script.js', 
      content: '// Write your JS here', 
      type: 'js' 
    }
  ]);
  
  const [activeFileId, setActiveFileId] = useState('1');
  const [activeActivity, setActiveActivity] = useState('explorer');
  const [showLanding, setShowLanding] = useState(true);
  const [theme, setTheme] = useState('dark');

  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiConfig, setAiConfig] = useState({ provider: 'openai', openaiKey: '', openaiModel: 'gpt-4o-mini', geminiKey: '', geminiModel: 'gemini-1.5-flash-latest', ollamaModel: 'phi3:mini' });
  const [isDebugging, setIsDebugging] = useState(false);
  
  const [ollamaModels, setOllamaModels] = useState(['phi3:mini']);
  const [openaiModels, setOpenaiModels] = useState(['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']);
  const [geminiModels, setGeminiModels] = useState(['gemini-1.5-flash-latest', 'gemini-1.5-pro-latest']);
  const [terminalLogs, setTerminalLogs] = useState([]);
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'CONSOLE_LOG') {
        setTerminalLogs(prev => [...prev, { level: e.data.level, message: e.data.payload, time: new Date().toLocaleTimeString() }]);
      }
    };
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    if (showSettings) {
      fetch('http://localhost:11434/api/tags')
        .then(res => res.json())
        .then(data => {
           if (data.models && data.models.length > 0) {
             setOllamaModels(data.models.map(m => m.name));
           }
        })
        .catch(err => console.error('Ollama fetch error', err));
    }
  }, [showSettings]);

  // Legacy Bridge
  const legacyFiles = useMemo(() => {
    return {
      html: files.filter(f => f.type === 'html').map(f => f.content).join('\n'),
      css: files.filter(f => f.type === 'css').map(f => f.content).join('\n'),
      js: files.filter(f => f.type === 'js').map(f => f.content).join('\n')
    };
  }, [files]);

  // Check Lesson Completion
  useEffect(() => {
    const lesson = CURRICULUM[currentLessonIndex];
    if (!lesson || lesson.tasks.length === 0) return;

    const completedTaskIds = lesson.tasks.filter(t => t.check(legacyFiles)).map(t => t.id);
    const isLessonComplete = completedTaskIds.length === lesson.tasks.length;

    if (isLessonComplete && !completedLessons.includes(currentLessonIndex)) {
      setCompletedLessons([...completedLessons, currentLessonIndex]);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }
  }, [legacyFiles, currentLessonIndex, completedLessons]);

  const handleCodeChange = (newCode, lang) => {
    if (lang) {
      // Find first file of type if specified (e.g. from AI Tutor)
      const target = files.find(f => f.type === lang);
      if (target) {
        setFiles(prev => prev.map(f => f.id === target.id ? { ...f, content: newCode } : f));
        setActiveFileId(target.id);
      } else {
        // Apply to current active file if type not found
        setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));
      }
    } else {
      setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: newCode } : f));
    }
  };

  const handleLoadTemplate = (template) => {
    if (window.confirm(`Are you sure you want to load "${template.name}"? This will overwrite your current code.`)) {
      setFiles([
        { id: '1', path: '/index.html', content: template.html, type: 'html' },
        { id: '2', path: '/style.css', content: template.css, type: 'css' },
        { id: '3', path: '/script.js', content: template.js, type: 'js' }
      ]);
      setActiveFileId('1');
      setShowTemplates(false);
    }
  };

  const handleDownload = () => {
    const combinedHTML = `<!DOCTYPE html><html><head><style>${legacyFiles.css}</style></head><body>${legacyFiles.html}<script>${legacyFiles.js}</script></body></html>`;
    const blob = new Blob([combinedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codecanvas-project.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAutoDebug = async () => {
    if (!aiConfig.geminiKey && aiConfig.provider === 'gemini') {
      alert("Please add your Gemini API Key in Settings first!");
      return;
    }
    if (!aiConfig.openaiKey && aiConfig.provider === 'openai') {
      alert("Please add your OpenAI API Key in Settings first!");
      return;
    }
    
    const activeFile = files.find(f => f.id === activeFileId);
    if (!activeFile) return;

    setIsDebugging(true);
    const prompt = `You are an auto-debugger. Review the following ${activeFile.type} code. Find any errors, syntax mistakes, or logical bugs and fix them. Return ONLY the fully fixed raw code. Do not include markdown formatting like \`\`\`html or explanations. Just the code.\n\nCode to fix:\n${activeFile.content}`;

    try {
      let fixedCode = '';
      if (aiConfig.provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.openaiKey}`
          },
          body: JSON.stringify({
            model: aiConfig.openaiModel || 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        fixedCode = data.choices[0].message.content;
      } else if (aiConfig.provider === 'gemini') {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.geminiModel || 'gemini-1.5-flash-latest'}:generateContent?key=${aiConfig.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        fixedCode = data.candidates[0].content.parts[0].text;
      } else {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: aiConfig.ollamaModel || 'phi3:mini', prompt: prompt, stream: false })
        });
        if (!response.ok) {
           const errText = await response.text();
           throw new Error(`Ollama Error (${response.status}): ${errText || 'Ensure OLLAMA_ORIGINS="*" is set'}`);
        }
        const data = await response.json();
        fixedCode = data.response;
      }
      fixedCode = fixedCode.replace(/```(?:html|css|js|javascript)?\n/gi, '').replace(/```$/g, '').trim();
      setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: fixedCode } : f));
    } catch (error) {
      alert(`Auto-Debug failed: ${error.message}`);
    } finally {
      setIsDebugging(false);
    }
  };

  const commands = [
    { name: 'Format / Auto-Debug Code', icon: <Wand2 size={16} />, action: handleAutoDebug },
    { name: 'Export Project to HTML', icon: <Download size={16} />, action: handleDownload },
    { name: 'Load Template: Neon Cyber Button', icon: <Palette size={16} />, action: () => handleLoadTemplate(TEMPLATES[1]) },
    { name: 'Load Template: Particle Canvas', icon: <Zap size={16} />, action: () => handleLoadTemplate(TEMPLATES[2]) },
    { name: 'Clear All Code', icon: <Code size={16} />, action: () => {
      if (window.confirm('Clear all files?')) {
        setFiles([
          { id: '1', path: '/index.html', content: '', type: 'html' },
          { id: '2', path: '/style.css', content: '', type: 'css' },
          { id: '3', path: '/script.js', content: '', type: 'js' }
        ]);
        setActiveFileId('1');
      }
    }},
    { name: 'Open Settings', icon: <Settings size={16} />, action: () => setShowSettings(true) },
  ];

  const activeFile = files.find(f => f.id === activeFileId);

  if (showLanding) {
    return <WelcomeScreen onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="app-container" data-theme={theme}>
      <header className="header flex justify-between items-center px-4 gap-3 bg-obsidian/80 backdrop-blur-md border-b border-border-glass h-16">
          <div className="flex items-center gap-4 flex-1">
            <div className="header-title text-xl">CodeCanvas</div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div 
              className="btn-primary flex items-center gap-2 cursor-text bg-black/40 text-text-muted text-sm w-full max-w-[300px] justify-between px-3 py-1.5"
              onClick={() => setShowCommandPalette(true)}
            >
              <div className="flex items-center gap-1.5"><Search size={14} /> Search...</div>
              <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[0.65rem]">Cmd+K</kbd>
            </div>
          </div>

          <div className="flex gap-2 items-center flex-1 justify-end">
            <div className="relative">
              <button className="btn-primary flex items-center gap-1.5 px-2.5 py-1.5 text-sm" onClick={() => setShowTemplates(!showTemplates)}>
                <LayoutTemplate size={14} /> <span className="hide-mobile">Templates</span>
              </button>
              {showTemplates && (
                <div className="glass-panel absolute top-[120%] right-0 w-[220px] z-50 p-2 rounded-lg flex flex-col gap-1">
                  {TEMPLATES.map(t => (
                    <div key={t.name} className="px-3 py-2 cursor-pointer rounded-md text-text-main text-sm transition-colors hover:bg-white/10"
                         onClick={() => handleLoadTemplate(t)}
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-primary flex items-center gap-1.5 px-2.5 py-1.5 text-sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Light/Dark Theme">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button className="btn-primary flex items-center gap-1.5 px-2.5 py-1.5 text-sm" onClick={handleDownload} title="Export HTML">
              <Download size={14} />
            </button>
            <button className="btn-primary flex items-center gap-1.5 px-2.5 py-1.5 text-sm" onClick={() => setShowSettings(true)} title="Settings">
              <Settings size={14} />
            </button>
          </div>
        </header>

        <main className="workspace flex flex-row flex-1 overflow-hidden">
          <ActivityBar activeActivity={activeActivity} setActiveActivity={setActiveActivity} onOpenSettings={() => setShowSettings(true)} />
          
          {activeActivity !== 'whiteboard' && (
            <Sidebar 
              activeActivity={activeActivity}
              files={files}
              setFiles={setFiles}
              activeFileId={activeFileId}
              setActiveFileId={setActiveFileId}
              aiConfig={aiConfig}
              currentLessonIndex={currentLessonIndex}
              setCurrentLessonIndex={setCurrentLessonIndex}
              legacyFiles={legacyFiles}
            />
          )}
          
          {activeActivity === 'whiteboard' ? (
            <div className="flex-1 h-full overflow-hidden relative">
              <Whiteboard />
            </div>
          ) : (
            <PanelGroup direction="vertical" className="flex-1">
            
            <Panel minSize={20} defaultSize={60}>
              <div className="panel editor-container h-full flex flex-col border-r-0 border-b border-border-glass">
                <div className="panel-header flex justify-between items-center px-0 pr-3 h-11 bg-black/40 border-b border-border-glass">
                  <div className="flex h-full">
                    <div className="px-5 flex items-center gap-2 h-full text-text-main border-b-2 border-accent-cyan bg-accent-cyan/5">
                       <FileCode2 size={14} /> {activeFile?.path}
                    </div>
                  </div>
                  
                  <button 
                    className="btn-primary px-3 py-1 text-xs flex items-center gap-1.5 border-none text-white transition-all"
                    style={{
                      background: 'linear-gradient(45deg, var(--accent-purple), var(--accent-pink))',
                      boxShadow: isDebugging ? '0 0 15px var(--accent-pink)' : 'none',
                      animation: isDebugging ? 'neonPulse 1s infinite' : 'none'
                    }}
                    onClick={handleAutoDebug}
                    disabled={isDebugging}
                  >
                    <Wand2 size={14} /> {isDebugging ? 'Fixing...' : 'Auto-Debug'}
                  </button>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  {activeFile && (
                    <CodeEditor 
                      code={activeFile.content} 
                      language={activeFile.type === 'js' ? 'javascript' : activeFile.type} 
                      onChange={handleCodeChange} 
                      aiConfig={aiConfig}
                      theme={theme}
                    />
                  )}
                  {!activeFile && (
                     <div className="flex items-center justify-center h-full text-text-muted">No file selected</div>
                  )}
                </div>
              </div>
            </Panel>

            <PanelResizeHandle className="resize-handle h-1 hover:bg-accent-cyan transition-colors" />

            <Panel minSize={20} defaultSize={40}>
              <div className="panel preview-container h-full flex flex-col">
                <div className="panel-header h-11 flex items-center px-5 bg-black/40 border-b border-border-glass text-xs font-bold text-text-main uppercase tracking-widest">Live Preview</div>
                <div className="flex-1 bg-transparent">
                  <LivePreview html={legacyFiles.html} css={legacyFiles.css} js={legacyFiles.js} />
                </div>
              </div>
            </Panel>
            
          </PanelGroup>
          )}
        </main>
        
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
        commands={commands} 
      />

      {showSettings && (
        <div className="modal-overlay flex items-center justify-center fixed inset-0 bg-black/80 z-[10000] backdrop-blur-md">
          <div className="glass-panel modal-content w-[440px] p-8 rounded-2xl flex flex-col gap-5">
            <h2 className="modal-title text-2xl font-bold">AI Provider Settings</h2>
            <p className="text-text-muted text-sm -mt-2">
              Select how you want the AI Tutor to generate feedback.
            </p>
            <select className="provider-select w-full bg-black/50 text-text-main border border-border-highlight p-3 rounded-lg font-sans text-sm" value={aiConfig.provider} onChange={(e) => setAiConfig({ ...aiConfig, provider: e.target.value })}>
              <option value="openai">OpenAI API (Build Week)</option>
              <option value="ollama">Local Ollama</option>
              <option value="gemini">Google Gemini API (Cloud)</option>
            </select>
            
            {aiConfig.provider === 'ollama' && (
              <div className="flex flex-col gap-1">
                <label className="text-sm text-text-muted flex justify-between"><span>Ollama Model</span><span className="text-accent-cyan cursor-pointer" onClick={() => fetch('http://localhost:11434/api/tags').then(r=>r.json()).then(d=>setOllamaModels(d.models.map(m=>m.name)))}>Refresh</span></label>
                <select className="provider-select w-full bg-black/50 text-text-main border border-border-highlight p-3 rounded-lg font-sans text-sm" value={aiConfig.ollamaModel} onChange={(e) => setAiConfig({ ...aiConfig, ollamaModel: e.target.value })}>
                  {ollamaModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
            
            {aiConfig.provider === 'openai' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text-muted">OpenAI API Key</label>
                  <input type="password" className="styled-input w-full bg-black/50 border border-border-highlight text-text-main p-3 rounded-lg outline-none text-sm transition-colors focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]" value={aiConfig.openaiKey} placeholder="sk-proj-..." onChange={(e) => setAiConfig({ ...aiConfig, openaiKey: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text-muted flex justify-between"><span>OpenAI Model</span><span className="text-accent-cyan cursor-pointer" onClick={() => {
                    if(!aiConfig.openaiKey) return alert('Enter API Key first');
                    fetch('https://api.openai.com/v1/models', { headers: { 'Authorization': `Bearer ${aiConfig.openaiKey}` } })
                      .then(r=>r.json()).then(d=>{
                        const models = d.data.map(m=>m.id).filter(id => id.startsWith('gpt'));
                        setOpenaiModels(models);
                        if (models.length > 0) setAiConfig(prev => ({ ...prev, openaiModel: models[0] }));
                      }).catch(e=>alert('Error fetching models: ' + e.message))
                  }}>Fetch Versions</span></label>
                  <select className="provider-select w-full bg-black/50 text-text-main border border-border-highlight p-3 rounded-lg font-sans text-sm" value={aiConfig.openaiModel} onChange={(e) => setAiConfig({ ...aiConfig, openaiModel: e.target.value })}>
                    {openaiModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            )}
            
            {aiConfig.provider === 'gemini' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text-muted">Gemini API Key</label>
                  <input type="password" className="styled-input w-full bg-black/50 border border-border-highlight text-text-main p-3 rounded-lg outline-none text-sm transition-colors focus:border-accent-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.1)]" value={aiConfig.geminiKey} placeholder="AIzaSy..." onChange={(e) => setAiConfig({ ...aiConfig, geminiKey: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-text-muted flex justify-between"><span>Gemini Model</span><span className="text-accent-cyan cursor-pointer" onClick={() => {
                    if(!aiConfig.geminiKey) return alert('Enter API Key first');
                    fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${aiConfig.geminiKey}`)
                      .then(r=>r.json()).then(d=>{
                        const models = d.models.map(m=>m.name.replace('models/', '')).filter(name => name.startsWith('gemini'));
                        setGeminiModels(models);
                        if (models.length > 0) setAiConfig(prev => ({ ...prev, geminiModel: models[0] }));
                      }).catch(e=>alert('Error fetching models: ' + e.message))
                  }}>Fetch Versions</span></label>
                  <select className="provider-select w-full bg-black/50 text-text-main border border-border-highlight p-3 rounded-lg font-sans text-sm" value={aiConfig.geminiModel} onChange={(e) => setAiConfig({ ...aiConfig, geminiModel: e.target.value })}>
                    {geminiModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            )}
            <button className="btn-primary mt-4" onClick={() => setShowSettings(false)}>Save & Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
