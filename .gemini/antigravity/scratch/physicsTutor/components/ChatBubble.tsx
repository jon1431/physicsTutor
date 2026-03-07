
import React from 'react';
import type { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatBubbleProps {
  message: ChatMessage;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const ModelIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <path d="M20.2 20.2c2.04-2.03.02-5.91-2.81-8.74s-6.7-4.85-8.74-2.81"></path>
        <path d="M3.8 3.8c-2.04 2.03-.02 5.91 2.81 8.74s6.7 4.85 8.74 2.81"></path>
        <path d="M3.8 20.2c2.03-2.04 5.91-.02 8.74-2.81s4.85-6.7 2.81-8.74"></path>
        <path d="M20.2 3.8c-2.03 2.04-5.91.02-8.74 2.81s-4.85 6.7-2.81 8.74"></path>
    </svg>
);

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const bubbleClasses = isUser ? 'bg-gray-700/80' : 'bg-gray-800/60 backdrop-blur-md border border-gray-700/50';
  const alignmentClasses = isUser ? 'items-end' : 'items-start';

  return (
    <div className={`flex flex-col ${alignmentClasses} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`flex items-start max-w-2xl w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 p-2 rounded-full shadow-lg ${isUser ? 'ml-3 bg-gray-600' : 'mr-3 bg-gray-700'}`}>
            {isUser ? <UserIcon /> : <ModelIcon />}
        </div>
        <div className={`p-5 rounded-[1.5rem] shadow-xl overflow-hidden ${bubbleClasses}`}>
          {message.parts.map((part, i) => {
            if (part.inlineData) {
              return (
                <div key={i} className="mb-3 last:mb-0">
                  <img 
                    src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} 
                    alt="User Upload" 
                    className="max-w-full rounded-lg border border-gray-600 shadow-sm"
                  />
                </div>
              );
            }
            if (part.text) {
              return isUser ? (
                <p key={i} className="text-gray-200 whitespace-pre-wrap leading-relaxed">{part.text}</p>
              ) : (
                <article key={i} className="tutor-article prose prose-invert prose-sm md:prose-base max-w-none">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                    >
                        {part.text}
                    </ReactMarkdown>
                </article>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
