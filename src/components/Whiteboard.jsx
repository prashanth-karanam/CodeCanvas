import React from 'react';
import { Presentation } from 'lucide-react';

export function Whiteboard() {
  return (
    <div className="flex flex-col h-full bg-panel">
      <div className="panel-header flex justify-between items-center text-accent-pink">
        <span>Whiteboard</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted p-4 text-center">
        <Presentation size={48} className="mb-4 opacity-50" />
        <h3 className="text-lg text-text-main mb-2">Excalidraw Integration</h3>
        <p className="text-sm">Whiteboard functionality will be available in Milestone 3.</p>
      </div>
    </div>
  );
}
