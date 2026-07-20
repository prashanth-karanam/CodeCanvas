import React, { useState } from 'react';
import { Rocket, Info, BookOpen, Star, X, ChevronRight } from 'lucide-react';
import './WelcomeScreen.css';

export function WelcomeScreen({ onEnter }) {
  const [activeModal, setActiveModal] = useState(null);

  const ModalContent = () => {
    if (!activeModal) return null;

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="glass-modal max-w-2xl w-full rounded-2xl border border-accent-pink/30 bg-[#0a0a0f]/90 p-8 shadow-[0_0_50px_rgba(219,15,90,0.15)] relative overflow-hidden">
          
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

          <button 
            onClick={() => setActiveModal(null)}
            className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X size={24} />
          </button>

          {activeModal === 'about' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-accent-pink/10 text-accent-pink">
                  <Info size={28} />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">CodeCanvas</span></h2>
              </div>
              
              <div className="text-lg text-text-muted leading-relaxed font-light space-y-4">
                <p>
                  CodeCanvas is a next-generation, browser-based cosmic development environment. Designed for speed, aesthetics, and intelligence, it merges a powerful code editor, a real-time live preview, and an AI-driven coding tutor into one seamless workspace.
                </p>
                <p>
                  Built to empower developers, learners, and creators. Whether you are building rapid prototypes during a hackathon or sketching out UI layouts on our infinite Cyber Board, CodeCanvas equips you with the tools you need—right in your browser.
                </p>
              </div>

              <div className="mt-4 flex gap-4">
                <button onClick={() => setActiveModal(null)} className="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
                  Close
                </button>
                <button onClick={() => setActiveModal('howto')} className="px-6 py-3 rounded-lg bg-accent-pink hover:bg-accent-pink-hover text-white font-medium transition-colors shadow-[0_0_20px_rgba(219,15,90,0.4)] flex items-center gap-2">
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
                <h2 className="text-3xl font-bold text-white tracking-tight">How to <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-blue-500">Use</span></h2>
              </div>
              
              <div className="grid gap-4 mt-2">
                {[
                  { step: '01', title: 'Write Code', desc: 'Select your project files (HTML, CSS, JS) from the Sidebar and write code in the glowing editor.' },
                  { step: '02', title: 'Live Preview', desc: 'Watch your code instantly render in the Live Preview panel on the right in real-time.' },
                  { step: '03', title: 'AI Auto-Debug', desc: 'Stuck on a bug? Click the glowing Auto-Debug wand to have our AI magically fix your code!' },
                  { step: '04', title: 'Cyber Board', desc: 'Switch to the Whiteboard tab to draw full-screen diagrams and mockups using neon tools.' },
                  { step: '05', title: 'Export', desc: 'Export your finished masterpiece as a single HTML file with the click of a button.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-black/40 border border-white/5 hover:border-accent-cyan/30 transition-colors group">
                    <div className="font-mono text-xl font-bold text-accent-cyan/50 group-hover:text-accent-cyan transition-colors">{item.step}</div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{item.title}</h4>
                      <p className="text-text-muted text-sm mt-1">{item.desc}</p>
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
    <div className="welcome-screen-container fixed inset-0 z-[1000] flex items-center justify-center bg-[#050508] overflow-hidden">
      
      {/* Dynamic Cosmic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-accent-pink/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

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
