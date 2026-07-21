import React from 'react';
import { FileExplorer } from './FileExplorer';
import { AIAssistant } from './AIAssistant';
import { Whiteboard } from './Whiteboard';
import { ChallengePanel } from './ChallengePanel';

export function Sidebar({ 
  activeActivity, 
  files, 
  setFiles, 
  activeFileId, 
  setActiveFileId,
  aiConfig,
  currentLessonIndex,
  setCurrentLessonIndex,
  legacyFiles,
  onChange
}) {
  return (
    <div className="w-64 h-full bg-panel border border-border-glass rounded-xl flex flex-col z-10 overflow-hidden shadow-lg">
      {activeActivity === 'explorer' && (
        <FileExplorer 
          files={files} 
          setFiles={setFiles} 
          activeFileId={activeFileId} 
          setActiveFileId={setActiveFileId} 
        />
      )}
      {activeActivity === 'tutor' && (
        <AIAssistant 
          code={legacyFiles}
          onChange={onChange}
          aiConfig={aiConfig} 
          isSidebar={true}
        />
      )}
      {activeActivity === 'challenge' && (
        <ChallengePanel 
          currentLessonIndex={currentLessonIndex} 
          setCurrentLessonIndex={setCurrentLessonIndex} 
          files={legacyFiles} 
        />
      )}
    </div>
  );
}
