import React from 'react';
import { Files, Bot, Presentation, Trophy, Settings } from 'lucide-react';

export function ActivityBar({ activeActivity, setActiveActivity, onOpenSettings }) {
  const activities = [
    { id: 'explorer', icon: <Files size={24} strokeWidth={1.5} />, title: 'File Explorer' },
    { id: 'tutor', icon: <Bot size={24} strokeWidth={1.5} />, title: 'AI Tutor' },
    { id: 'whiteboard', icon: <Presentation size={24} strokeWidth={1.5} />, title: 'Whiteboard' },
    { id: 'challenge', icon: <Trophy size={24} strokeWidth={1.5} />, title: 'Challenges' },
  ];

  return (
    <div className="w-12 h-full bg-obsidian border-r border-border-glass flex flex-col items-center py-4 z-20">
      <div className="flex flex-col gap-4 flex-1 w-full">
        {activities.map(activity => (
          <button
            key={activity.id}
            onClick={() => setActiveActivity(activity.id)}
            className={`w-full h-12 flex justify-center items-center relative transition-colors ${activeActivity === activity.id ? 'text-accent-cyan' : 'text-text-muted hover:text-text-main'}`}
            title={activity.title}
          >
            {activeActivity === activity.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent-cyan" />
            )}
            {activity.icon}
          </button>
        ))}
      </div>
      <button
        onClick={onOpenSettings}
        className="w-full h-12 flex justify-center items-center text-text-muted hover:text-text-main transition-colors mt-auto"
        title="Settings"
      >
        <Settings size={24} strokeWidth={1.5} />
      </button>
    </div>
  );
}
