
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ToolSelector, Tool } from './components/ToolSelector';
import { PhysicsTutor } from './components/PhysicsTutor';
import { QuizMaster } from './components/QuizMaster';
import { StudyNotes } from './components/StudyNotes';
import { Flashcards } from './components/Flashcards';

const App: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>('tutor');

  const renderTool = () => {
    switch (selectedTool) {
      case 'tutor':
        return <PhysicsTutor />;
      case 'quiz':
        return <QuizMaster />;
      case 'flashcards':
        return <Flashcards />;
      case 'notes':
        return <StudyNotes />;
      default:
        return <PhysicsTutor />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans overflow-hidden">
      <Header />
      <ToolSelector selectedTool={selectedTool} onToolSelect={setSelectedTool} />
      <div className="flex-grow overflow-auto relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
        <div className="container mx-auto p-4 md:p-6 lg:p-8 relative z-0">
            {renderTool()}
        </div>
      </div>
    </div>
  );
};

export default App;
