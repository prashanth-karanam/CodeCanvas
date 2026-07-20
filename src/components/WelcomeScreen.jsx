import React, { useState } from 'react';
import { Rocket, Info, BookOpen, Star, X, ChevronRight, Sun, Moon } from 'lucide-react';
import './WelcomeScreen.css';

const FLOATING_SNIPPETS = [
  { text: 'const [code, setCode] = useState()', top: '12%', left: '8%', delay: '0s', duration: '14s', size: 'text-xs' },
  { text: '<html>', top: '22%', left: '78%', delay: '1s', duration: '12s', size: 'text-sm' },
  { text: 'background: radial-gradient(...)', top: '78%', left: '12%', delay: '2.5s', duration: '16s', size: 'text-xs' },
  { text: '<LivePreview html={html} />', top: '65%', left: '74%', delay: '0.5s', duration: '15s', size: 'text-sm' },
  { text: 'canvas.getContext("2d")', top: '48%', left: '82%', delay: '3.5s', duration: '18s', size: 'text-xs' },
  { text: '✦ AI Auto-Debug', top: '82%', left: '42%', delay: '2s', duration: '20s', size: 'text-sm font-semibold' },
  { text: '<div>', top: '8%', left: '55%', delay: '4s', duration: '11s', size: 'text-sm' },
  { text: 'border-radius: 12px', top: '52%', left: '6%', delay: '1.8s', duration: '13s', size: 'text-xs' },
  { text: 'npm run dev', top: '32%', left: '16%', delay: '3s', duration: '17s', size: 'text-xs' },
  { text: '✦ Cyber Board', top: '28%', left: '84%', delay: '4.5s', duration: '22s', size: 'text-sm font-semibold' },
  { text: '✦ Real-time Live Preview', top: '68%', left: '10%', delay: '1.2s', duration: '19s', size: 'text-sm font-semibold' },
];

export function WelcomeScreen({ onEnter, theme, setTheme }) {
  const [activeModal, setActiveModal] = useState(null);

  const ModalContent = () => {
    if (!activeModal) return null;

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className={`glass-modal max-w-2xl w-full rounded-2xl border p-8 relative overflow-hidden transition-all duration-300 ${
          theme === 'light' 
            ? 'border-black/10 bg-white shadow-2xl text-black' 
            : 'border-accent-cyan/30 bg-[#0a0a0f]/90 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-white'
        }`}>
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

          <button 
            onClick={() => setActiveModal(null)}
            className={`absolute top-4 right-4 transition-colors p-2 rounded-full ${theme === 'light' ? 'text-gray-500 hover:text-black hover:bg-gray-100' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
          >
            <X size={24} />
          </button>

          {activeModal === 'about' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                  <Info size={28} />
                </div>
                <h2 className={`text-3xl font-bold tracking-tight ${theme === 'light' ? 'text-black' : 'text-white'}`}>About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">CodeCanvas</span></h2>
              </div>
              
              <div className={`text-lg leading-relaxed font-light space-y-4 ${theme === 'light' ? 'text-gray-700' : 'text-text-muted'}`}>
                <p>
                  CodeCanvas is a next-generation, browser-based cosmic development environment. Designed for speed, aesthetics, and intelligence, it merges a powerful code editor, a real-time live preview, and an AI-driven coding tutor into one seamless workspace.
                </p>
                <p>
                  Built to empower developers, learners, and creators. Whether you are building rapid prototypes during a hackathon or sketching out UI layouts on our infinite Cyber Board, CodeCanvas equips you with the tools you need—right in your browser.
                </p>
              </div>

              <div className="mt-4 flex gap-4">
                <button onClick={() => setActiveModal(null)} className={`px-6 py-3 rounded-lg font-medium transition-colors border ${
                  theme === 'light' 
                    ? 'bg-gray-100 hover:bg-gray-200 text-black border-gray-300' 
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}>
                  Close
                </button>
                <button onClick={() => setActiveModal('howto')} className="px-6 py-3 rounded-lg bg-accent-cyan hover:bg-accent-cyan/80 text-white font-medium transition-colors shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center gap-2">
                  Learn How to Use <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {activeModal === 'howto' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                  <BookOpen size={28} />
                </div>
                <h2 className={`text-3xl font-bold tracking-tight ${theme === 'light' ? 'text-black' : 'text-white'}`}>How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-500">Use</span></h2>
              </div>
              
              <div className="grid gap-4 mt-2">
                {[
                  { step: '01', title: 'Write Code', desc: 'Select your project files (HTML, CSS, JS) from the Sidebar and write code in the glowing editor.' },
                  { step: '02', title: 'Live Preview', desc: 'Watch your code instantly render in the Live Preview panel on the right in real-time.' },
                  { step: '03', title: 'AI Auto-Debug', desc: 'Stuck on a bug? Click the glowing Auto-Debug wand to have our AI magically fix your code!' },
                  { step: '04', title: 'Cyber Board', desc: 'Switch to the Whiteboard tab to draw full-screen diagrams and mockups using neon tools.' },
                  { step: '05', title: 'Export', desc: 'Export your finished masterpiece as a single HTML file with the click of a button.' }
                ].map((item, i) => (
                  <div key={i} className={`flex gap-4 items-start p-4 rounded-xl border transition-colors group ${
                    theme === 'light' 
                      ? 'bg-gray-50 border-gray-200 hover:border-accent-cyan/50' 
                      : 'bg-black/40 border-white/5 hover:border-accent-cyan/30'
                  }`}>
                    <div className="font-mono text-xl font-bold text-accent-cyan/50 group-hover:text-accent-cyan transition-colors">{item.step}</div>
                    <div>
                      <h4 className={`font-medium text-lg ${theme === 'light' ? 'text-black' : 'text-white'}`}>{item.title}</h4>
                      <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-text-muted'}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="welcome-screen-container fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden" data-theme={theme}>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`absolute top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 shadow-lg border ${theme === 'light' ? 'bg-white text-black border-gray-200 hover:bg-gray-100 hover:shadow-xl' : 'bg-black text-white border-white/10 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]'}`}
        title="Toggle Light/Dark Mode"
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Floating background snippets */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {FLOATING_SNIPPETS.map((snippet, index) => (
          <div
            key={index}
            className={`floating-code-snippet absolute ${snippet.size}`}
            style={{
              top: snippet.top,
              left: snippet.left,
              animationDelay: snippet.delay,
              animationDuration: snippet.duration,
            }}
          >
            {snippet.text}
          </div>
        ))}
      </div>

      {/* Dynamic Cosmic Background (Dark Mode Only) */}
      {theme === 'dark' && (
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[150px] mix-blend-screen"></div>
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>
      )}

      <div className="z-10 perspective-1000">
        <div className="cosmic-card">
          <div className="heading">Welcome to <span>CodeCanvas</span></div>
          <div className="content">
            
            <div className="item item--create" onClick={() => setActiveModal('about')}>
              <Info size={24} />
              <span>About CodeCanvas</span>
            </div>
            
            <div className="item item--post" onClick={() => setActiveModal('howto')}>
              <BookOpen size={24} />
              <span>How to Use</span>
            </div>
            
            <a href="https://github.com/prashanth-karanam/CodeCanvas" target="_blank" rel="noreferrer" className="item item--inspire no-underline">
              <Star size={24} />
              <span>Star on GitHub</span>
            </a>
          </div>
          
          <button onClick={onEnter} className="flex items-center justify-center gap-2">
            Go into App <Rocket size={18} />
          </button>
        </div>
      </div>

      <ModalContent />

    </div>
  );
}
