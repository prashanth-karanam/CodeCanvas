import React, { useState } from 'react';
import { FileCode2, FilePlus, Edit2, Trash2, Check, X } from 'lucide-react';

export function FileExplorer({ files, setFiles, activeFileId, setActiveFileId }) {
  const [editingFileId, setEditingFileId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateFile = () => {
    const newId = Date.now().toString();
    const newFile = {
      id: newId,
      path: '/new-file.html',
      content: '',
      type: 'html'
    };
    setFiles([...files, newFile]);
    setActiveFileId(newId);
    setEditingFileId(newId);
    setEditName('new-file.html');
  };

  const handleRename = (id, newPath) => {
    if (!newPath.startsWith('/')) newPath = '/' + newPath;
    let type = 'html';
    if (newPath.endsWith('.css')) type = 'css';
    if (newPath.endsWith('.js')) type = 'js';

    setFiles(files.map(f => f.id === id ? { ...f, path: newPath, type } : f));
    setEditingFileId(null);
  };

  const handleDelete = (id) => {
    if (files.length <= 1) {
      alert("Cannot delete the last file.");
      return;
    }
    const newFiles = files.filter(f => f.id !== id);
    setFiles(newFiles);
    if (activeFileId === id) {
      setActiveFileId(newFiles[0].id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel">
      <div className="panel-header flex justify-between items-center text-accent-cyan">
        <span>Files</span>
        <button className="text-text-muted hover:text-text-main" onClick={handleCreateFile} title="New File">
          <FilePlus size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {files.map(file => (
          <div 
            key={file.id}
            className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${activeFileId === file.id ? 'bg-accent-cyan/10 text-text-main' : 'text-text-muted hover:bg-white/5 hover:text-text-main'}`}
            onClick={() => setActiveFileId(file.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FileCode2 size={16} className={activeFileId === file.id ? 'text-accent-cyan' : ''} />
              
              {editingFileId === file.id ? (
                <div className="flex items-center w-full gap-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 bg-obsidian border border-border-highlight rounded px-1 py-0.5 text-sm text-text-main min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(file.id, editName);
                      if (e.key === 'Escape') setEditingFileId(null);
                    }}
                    autoFocus
                  />
                  <button className="text-green-500 hover:text-green-400" onClick={() => handleRename(file.id, editName)}><Check size={14}/></button>
                  <button className="text-red-500 hover:text-red-400" onClick={() => setEditingFileId(null)}><X size={14}/></button>
                </div>
              ) : (
                <span className="truncate text-sm">{file.path}</span>
              )}
            </div>

            {editingFileId !== file.id && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 hover:opacity-100 ml-2">
                <button 
                  className="text-text-muted hover:text-accent-cyan"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFileId(file.id);
                    setEditName(file.path.startsWith('/') ? file.path.substring(1) : file.path);
                  }}
                  title="Rename"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  className="text-text-muted hover:text-accent-pink"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(file.id);
                  }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
