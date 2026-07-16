import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

export function CommandPalette({ isOpen, onClose, commands }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="glass-panel modal-content" 
        onClick={e => e.stopPropagation()}
        style={{ width: '500px', padding: '0', overflow: 'hidden', transform: 'translateY(-10vh)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-glass)' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Type a command or search..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ 
              flex: 1, 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: 'var(--text-main)', 
              fontSize: '1.1rem',
              marginLeft: '12px'
            }}
          />
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '12px' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>No commands found.</div>
          ) : (
            filteredCommands.map((cmd, i) => (
              <div 
                key={i} 
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '12px 16px', 
                  cursor: 'pointer',
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {cmd.icon}
                <span style={{ fontSize: '0.95rem' }}>{cmd.name}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
