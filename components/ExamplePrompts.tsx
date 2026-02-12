
import React from 'react';
import { EXAMPLE_PROMPTS } from '../constants';

interface ExamplePromptsProps {
  onPromptClick: (prompt: string) => void;
}

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.657a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 14.95a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM4 10a1 1 0 01-1-1V7a1 1 0 012 0v2a1 1 0 01-1 1zM15 12a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1z" />
        <path fillRule="evenodd" d="M9 17a1 1 0 011-1h0a1 1 0 011 1v1a1 1 0 11-2 0v-1z" clipRule="evenodd" />
        <path d="M4.343 4.343a1 1 0 001.414 1.414l.707-.707a1 1 0 00-1.414-1.414l-.707.707zM10 18a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
);


export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onPromptClick }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold text-gray-300 mb-4">How can I help you with physics today?</h2>
        <p className="text-gray-400 mb-8 max-w-lg">
            You can ask me to explain concepts, solve problems, or dive into specific topics. Here are some examples to get you started:
        </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        {EXAMPLE_PROMPTS.map((item, index) => (
          <button
            key={index}
            onClick={() => onPromptClick(item.prompt)}
            className="bg-gray-800 p-4 rounded-lg text-left hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <p className="font-semibold text-gray-200">{item.title}</p>
            <p className="text-sm text-gray-400 mt-1">{item.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
