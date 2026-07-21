import React, { useState, useEffect, useRef } from 'react';
import { 
  Presentation, Maximize2, Minimize2, Undo, Redo, 
  Trash2, Download, Brush, Square, Circle, 
  Minus, Type, Eraser, Sparkles, Copy, Check, ArrowRight,
  Lock, Unlock
} from 'lucide-react';

export function Whiteboard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tool, setTool] = useState('brush'); // brush, line, arrow, rect, circle, eraser, text
  const [color, setColor] = useState('#00f0ff'); // Neon cyan
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isLockedMode, setIsLockedMode] = useState(false);

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const snapshot = useRef(null); // To store image snapshot for live shape drawing

  // Undo/Redo Stacks
  const history = useRef([]);
  const historyIndex = useRef(-1);

  // Floating text input state
  const [textInput, setTextInput] = useState({ visible: false, x: 0, y: 0, value: '' });
  const textInputRef = useRef(null);

  // Neon colors palette
  const neonColors = [
    { name: 'Cyan', hex: '#00f0ff' },
    { name: 'Pink', hex: '#ff0055' },
    { name: 'Purple', hex: '#b026ff' },
    { name: 'Lime', hex: '#39ff14' },
    { name: 'Yellow', hex: '#fffb00' },
    { name: 'White', hex: '#ffffff' }
  ];

  // Initialize Canvas
  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    // Get parent dimensions
    const rect = canvas.parentElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      setTimeout(initCanvas, 50);
      return;
    }
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Clear background to dark obsidian
    clearCanvasBg();

    // If there is history, restore the latest state after resize
    if (history.current.length > 0 && historyIndex.current >= 0) {
      const img = new Image();
      img.src = history.current[historyIndex.current];
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    } else {
      saveState();
    }
  };

  const handleResize = () => {
    // Preserve current canvas state URL
    const tempUrl = canvasRef.current?.toDataURL();
    initCanvas();
    if (tempUrl) {
      const img = new Image();
      img.src = tempUrl;
      img.onload = () => {
        contextRef.current?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
    }
  };

  const clearCanvasBg = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    const isLight = document.querySelector('.app-container')?.getAttribute('data-theme') === 'light';
    
    ctx.fillStyle = isLight ? '#f8fafc' : '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const saveState = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    
    // Truncate stack if we had undone actions
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }
    
    history.current.push(dataUrl);
    historyIndex.current = history.current.length - 1;
  };

  const handleUndo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current -= 1;
      restoreHistoryState();
    }
  };

  const handleRedo = () => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current += 1;
      restoreHistoryState();
    }
  };

  const restoreHistoryState = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = history.current[historyIndex.current];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  // Configure stroke style (colors, width, neon glow)
  const configureStroke = (ctx) => {
    const isLight = document.querySelector('.app-container')?.getAttribute('data-theme') === 'light';
    const eraserColor = isLight ? '#f8fafc' : '#0a0a0f';
    ctx.strokeStyle = tool === 'eraser' ? eraserColor : color;
    ctx.lineWidth = strokeWidth;

    if (glowEnabled && tool !== 'eraser') {
      ctx.shadowBlur = strokeWidth * 2.5;
      ctx.shadowColor = color;
    } else {
      ctx.shadowBlur = 0;
    }
  };

  // Drawing Event Handlers
  const startDrawing = (e) => {
    if (textInput.visible) {
      commitText();
      return;
    }

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    isDrawing.current = true;
    startX.current = x;
    startY.current = y;

    // Save snapshot of canvas before starting the drag (critical for shape previews)
    snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(x, y);

    configureStroke(ctx);

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    configureStroke(ctx);

    if (tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Shape tools: restore canvas snapshot and redraw current shape draft
      ctx.putImageData(snapshot.current, 0, 0);
      ctx.beginPath();

      if (tool === 'line') {
        ctx.moveTo(startX.current, startY.current);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        drawArrow(ctx, startX.current, startY.current, x, y);
      } else if (tool === 'rect') {
        const width = x - startX.current;
        const height = y - startY.current;
        ctx.strokeRect(startX.current, startY.current, width, height);
      } else if (tool === 'circle') {
        const radius = Math.sqrt(Math.pow(x - startX.current, 2) + Math.pow(y - startY.current, 2));
        ctx.arc(startX.current, startY.current, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLength = 15; // length of head in pixels
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    // Draw shaft
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
  };

  const endDrawing = (e) => {
    if (isLockedMode) return;
    if (!isDrawing.current) return;
    isDrawing.current = false;
    
    // Handle Text tool selection on click
    if (tool === 'text') {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.changedTouches?.[0]?.clientX) - rect.left;
      const y = (e.clientY || e.changedTouches?.[0]?.clientY) - rect.top;
      
      // Check if they actually dragged or just clicked
      const distance = Math.sqrt(Math.pow(x - startX.current, 2) + Math.pow(y - startY.current, 2));
      if (distance < 5) {
        setTextInput({ visible: true, x, y, value: '' });
        setTimeout(() => textInputRef.current?.focus(), 50);
        return;
      }
    }

    saveState();
  };

  const commitText = () => {
    if (!textInput.value.trim()) {
      setTextInput({ visible: false, x: 0, y: 0, value: '' });
      return;
    }

    const ctx = contextRef.current;
    if (ctx) {
      configureStroke(ctx);
      ctx.font = `bold ${strokeWidth * 4 + 12}px var(--font-sans)`;
      ctx.fillStyle = color;
      
      // Glow support for text
      if (glowEnabled) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.fillText(textInput.value, textInput.x, textInput.y + 5);
      
      // Clean shadows after drawing
      ctx.shadowBlur = 0;
      saveState();
    }

    setTextInput({ visible: false, x: 0, y: 0, value: '' });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const newLock = !isLockedMode;
    setIsLockedMode(newLock);

    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    if (newLock) {
      if (!isDrawing.current && tool !== 'text') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        isDrawing.current = true;
        startX.current = x;
        startY.current = y;
        snapshot.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(x, y);
        configureStroke(ctx);
        if (tool === 'brush' || tool === 'eraser') {
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    } else {
      if (isDrawing.current) {
        isDrawing.current = false;
        if (tool !== 'text') saveState();
      }
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the whiteboard?')) {
      clearCanvasBg();
      saveState();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = 'codecanvas-sketch.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const handleCopyImgTag = () => {
    if (!canvasRef.current) return;
    const base64Url = canvasRef.current.toDataURL();
    const imgTag = `<img src="${base64Url}" alt="CodeCanvas Sketch" style="max-width: 100%; border-radius: 8px;" />`;
    
    navigator.clipboard.writeText(imgTag).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`flex flex-col h-full bg-panel border border-border-glass ${isFullscreen ? 'fixed inset-0 z-50 p-6 backdrop-blur-2xl' : 'w-full'}`}>
      
      {/* Header Panel */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-border-glass bg-[var(--panel-header-bg)] h-12">
        <div className="flex items-center gap-2">
          <Presentation className="text-accent-pink" size={18} />
          <span className="font-bold text-xs uppercase tracking-widest text-text-main">
            Cyber Board
          </span>
          <span className="bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-[0.65rem] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
            <Sparkles size={10} /> Live Canvas
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            onClick={handleUndo}
            title="Undo"
          >
            <Undo size={15} />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            onClick={handleRedo}
            title="Redo"
          >
            <Redo size={15} />
          </button>
          <div className="w-px h-4 bg-border-glass mx-1" />
          <button 
            className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            onClick={handleClear}
            title="Clear Board"
          >
            <Trash2 size={15} />
          </button>
          <button 
            className={`p-1.5 rounded hover:bg-white/10 transition-colors flex items-center gap-1 ${copied ? 'text-accent-cyan' : 'text-text-muted hover:text-text-main'}`}
            onClick={handleCopyImgTag}
            title="Copy as HTML Image tag to Clipboard"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <button 
            className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            onClick={handleDownload}
            title="Save PNG"
          >
            <Download size={15} />
          </button>
          <button 
            className="p-1.5 rounded hover:bg-white/10 text-text-muted hover:text-text-main transition-colors"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Draft'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <div className="w-px h-4 bg-border-glass mx-1" />
          <button 
            className={`px-2 py-1.5 rounded transition-colors flex items-center gap-1.5 ${isLockedMode ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30' : 'text-text-muted hover:bg-white/10 hover:text-text-main border border-transparent'}`}
            onClick={() => setIsLockedMode(!isLockedMode)}
            title="Toggle Draw Lock (Right Click Canvas)"
          >
            {isLockedMode ? <Lock size={14} /> : <Unlock size={14} />}
            <span className="text-[0.65rem] font-mono hidden md:inline">
              {isLockedMode ? 'LOCKED' : 'UNLOCKED'}
            </span>
          </button>
        </div>
      </div>

      {/* Workspace Wrapper */}
      <div className="flex-1 flex flex-row min-h-0 relative">
        
        {/* Left Toolbar (Colors, Tools, Size/Glow) */}
        <div className="flex flex-col bg-[var(--panel-header-bg)] border-r border-border-glass items-center py-4 gap-4 z-10 w-16 overflow-y-auto overflow-x-hidden" style={{ minWidth: '4rem' }}>
          
          {/* Cyber Color Palette (ABOVE tools) */}
          <div className="flex flex-col gap-2 items-center">
            {tool !== 'eraser' && neonColors.map(c => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-5 h-5 rounded-full border transition-transform ${color === c.hex ? 'scale-125 border-white shadow-lg' : 'border-transparent hover:scale-110'}`}
                style={{ 
                  backgroundColor: c.hex,
                  boxShadow: color === c.hex ? `0 0 10px ${c.hex}` : 'none' 
                }}
                title={c.name}
              />
            ))}
          </div>

          <div className="w-8 h-px bg-border-glass my-1" />

          {/* Drawing Tools */}
          <div className="flex flex-col gap-1 items-center">
            {[
              { id: 'brush', icon: <Brush size={14} />, label: 'Brush' },
              { id: 'line', icon: <Minus size={14} className="rotate-45" />, label: 'Line' },
              { id: 'arrow', icon: <ArrowRight size={14} className="-rotate-45" />, label: 'Arrow' },
              { id: 'rect', icon: <Square size={14} />, label: 'Rectangle' },
              { id: 'circle', icon: <Circle size={14} />, label: 'Circle' },
              { id: 'text', icon: <Type size={14} />, label: 'Text' },
              { id: 'eraser', icon: <Eraser size={14} />, label: 'Eraser' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded transition-all ${tool === t.id ? 'bg-accent-pink/20 text-accent-pink border border-accent-pink/30' : 'text-text-muted hover:text-text-main'}`}
                title={t.label}
              >
                {t.icon}
              </button>
            ))}
          </div>

          <div className="w-8 h-px bg-border-glass my-1" />

          {/* Brush Size / Glow */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.55rem] text-text-muted font-mono uppercase">Size</span>
              <input 
                type="range" 
                min="1" 
                max="25" 
                value={strokeWidth} 
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-12 accent-accent-pink cursor-pointer h-1 rounded-lg"
              />
            </div>
            
            <button
              onClick={() => setGlowEnabled(!glowEnabled)}
              className={`text-[0.6rem] font-mono px-2 py-1 rounded border transition-all ${glowEnabled ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan shadow-[0_0_8px_rgba(0,240,255,0.15)]' : 'border-border-glass text-text-muted'}`}
            >
              GLOW
            </button>
          </div>

        </div>

        {/* Canvas Render Panel */}
        <div className="flex-1 min-h-0 bg-transparent relative overflow-hidden">
          <canvas
            ref={canvasRef}
            onContextMenu={handleContextMenu}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
            className="block w-full h-full cursor-crosshair touch-none"
          />

          {/* Floating input for the Text tool annotation */}
          {textInput.visible && (
            <div 
              className="absolute z-40 bg-black/90 border border-accent-pink p-1 rounded shadow-2xl"
              style={{ top: textInput.y - 20, left: textInput.x }}
            >
              <input
                ref={textInputRef}
                type="text"
                value={textInput.value}
                onChange={(e) => setTextInput({ ...textInput, value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitText();
                  if (e.key === 'Escape') setTextInput({ visible: false, x: 0, y: 0, value: '' });
                }}
                onBlur={commitText}
                className="bg-transparent text-text-main border-none outline-none font-sans font-bold py-1 px-2 text-sm w-[180px]"
                placeholder="Press Enter to add..."
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Helper */}
      {!isFullscreen && (
        <div className="bg-black/20 text-[0.65rem] font-mono text-text-muted px-3 py-1.5 border-t border-border-glass flex justify-between">
          <span>Tool: {tool.toUpperCase()}</span>
          <span>Click Maximize to sketch layout diagrams</span>
        </div>
      )}
    </div>
  );
}
