import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Code, X } from 'lucide-react';

export function AIAssistant({ code, onChange, aiConfig, onClose, isSidebar }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your CodeCanvas AI Tutor. Need help fixing an error or want a coding challenge? Just ask!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userQuery = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setIsTyping(true);

    try {
      let replyText = '';
      const lowerQuery = userQuery.toLowerCase();
      const needsCode = ["debug", "write", "mistake", "fix", "overwrite", "error"].some(kw => lowerQuery.includes(kw));
      const codeContext = typeof code === 'string' ? code : JSON.stringify(code, null, 2);
      
      const SYSTEM_PROMPT = needsCode 
        ? `You are an expert AI coding tutor. Review this code:\n\n${codeContext}\n\nUser Question: ${userQuery}\n\nProvide a concise answer. If suggesting code, use markdown blocks. ONLY put valid code inside the markdown blocks, keep all conversational text outside them.`
        : `You are a helpful AI coding tutor. Answer concisely. User Question: ${userQuery}`;

      if (aiConfig.provider === 'gemini') {
        if (!aiConfig.geminiKey) throw new Error("Gemini API key is missing. Please add it in Settings.");
        
        const model = aiConfig.geminiModel || 'gemini-1.5-flash';
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${aiConfig.geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: SYSTEM_PROMPT }] }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        replyText = data.candidates[0].content.parts[0].text;

      } else if (aiConfig.provider === 'openai') {
        if (!aiConfig.openaiKey) throw new Error("OpenAI API key is missing. Please add it in Settings.");
        
        const model = aiConfig.openaiModel || 'gpt-3.5-turbo';
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiConfig.openaiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: SYSTEM_PROMPT }]
          })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        replyText = data.choices[0].message.content;

      } else {
        // Local Ollama
        const model = aiConfig.ollamaModel || 'phi3:mini';
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            prompt: SYSTEM_PROMPT,
            stream: false
          })
        });
        if (!response.ok) {
           const errText = await response.text();
           throw new Error(`Ollama Error (${response.status}): ${errText || 'Ensure OLLAMA_ORIGINS="*" is set'}`);
        }
        const data = await response.json();
        replyText = data.response;
      }

      setMessages(prev => [...prev, { role: 'assistant', text: replyText }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `Error: ${error.message}` 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to extract all code blocks from markdown
  const extractAllCodeBlocks = (text) => {
    const regex = /```(html|css|js|javascript)?\n([\s\S]*?)\n```/g;
    const blocks = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      let lang = match[1] || 'js';
      if (lang === 'javascript') lang = 'js';
      blocks.push({ lang, code: match[2] });
    }
    return blocks;
  };

  return (
    <div className={isSidebar ? "flex flex-col h-full bg-panel" : "ai-panel"}>
      <div className="panel-header" style={{ borderLeft: 'none', borderRight: 'none', color: 'var(--accent-cyan)', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Sparkles size={16} style={{ marginRight: '8px' }} /> AI Tutor
        </div>
        {onClose && (
          <button className="btn-primary" style={{ padding: '4px', background: 'transparent', color: 'var(--text-muted)' }} onClick={onClose} title="Close AI">
            <X size={16} />
          </button>
        )}
      </div>
      
      <div className="ai-messages">
        {messages.map((msg, idx) => {
          const codeBlocks = msg.role === 'assistant' ? extractAllCodeBlocks(msg.text) : [];
          
          return (
            <div key={idx} className="ai-message" style={{
              borderColor: msg.role === 'user' ? 'var(--border-color)' : 'var(--accent-purple)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                {msg.role === 'assistant' ? <Bot size={14} color="var(--accent-purple)"/> : null}
                {msg.role}
              </div>
              
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text}
              </div>

              {codeBlocks.map((block, i) => (
                <button 
                  key={i}
                  className="btn-primary" 
                  style={{ 
                    marginTop: '8px', 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '0.85rem'
                  }}
                  onClick={() => onChange(block.code, block.lang)}
                >
                  <Code size={14} /> Apply {block.lang.toUpperCase()} to Editor
                </button>
              ))}
            </div>
          );
        })}
        
        {isTyping && (
          <div className="ai-message ai-thinking">
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-area">
        <input 
          type="text" 
          className="styled-input" 
          placeholder="Ask me anything..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-primary" onClick={handleSend} disabled={isTyping} style={{ padding: '8px' }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
