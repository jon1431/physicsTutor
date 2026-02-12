
import React from 'react';

const AtomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <path d="M20.2 20.2c2.04-2.03.02-5.91-2.81-8.74s-6.7-4.85-8.74-2.81"></path>
        <path d="M3.8 3.8c-2.04 2.03-.02 5.91 2.81 8.74s6.7 4.85 8.74 2.81"></path>
        <path d="M3.8 20.2c2.03-2.04 5.91-.02 8.74-2.81s4.85-6.7 2.81-8.74"></path>
        <path d="M20.2 3.8c-2.03 2.04-5.91.02-8.74 2.81s-4.85 6.7-2.81 8.74"></path>
    </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md">
      <AtomIcon />
      <h1 className="ml-3 text-xl font-bold text-gray-100">Gemini Physics Tutor</h1>
    </header>
  );
};
