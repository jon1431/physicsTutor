
import React from 'react';

export type Tool = 'tutor' | 'quiz' | 'notes' | 'flashcards';

interface ToolSelectorProps {
  selectedTool: Tool;
  onToolSelect: (tool: Tool) => void;
}

const tools: { id: Tool; label: string; icon: React.ReactNode }[] = [
  { 
    id: 'tutor', 
    label: 'Physics Tutor',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
  },
  { 
    id: 'quiz', 
    label: 'Quiz Master',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  },
  { 
    id: 'flashcards', 
    label: 'Flashcards',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
  },
  { 
    id: 'notes', 
    label: 'Study Notes',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  },
];

export const ToolSelector: React.FC<ToolSelectorProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="flex justify-center p-3 bg-gray-900/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-10">
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`group flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50
              ${selectedTool === tool.id
                ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700/50'
              }`
            }
          >
            <span className={selectedTool === tool.id ? 'text-white' : 'text-cyan-500/70 group-hover:text-cyan-400'}>
              {tool.icon}
            </span>
            {tool.label}
          </button>
        ))}
      </div>
    </div>
  );
};
