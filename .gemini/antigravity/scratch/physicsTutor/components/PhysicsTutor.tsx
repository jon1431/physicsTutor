
import React, { useState, useEffect, useRef } from 'react';
import { getTutorStream } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { InputForm } from './InputForm';
import { ChatBubble } from './ChatBubble';
import { ExamplePrompts } from './ExamplePrompts';
import { LoadingSpinner } from './LoadingSpinner';

export const PhysicsTutor: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (text: string, image?: string) => {
    if (!text.trim() && !image) return;

    const userMsg: ChatMessage = { role: 'user', parts: [] };
    if (text.trim()) userMsg.parts.push({ text });
    if (image) {
      const [header, data] = image.split(',');
      userMsg.parts.push({ inlineData: { mimeType: header.match(/:(.*?);/)?.[1] || 'image/png', data } });
    }

    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const stream = await getTutorStream(text, chatHistory, image);
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "" }] }]);
      
      let full = "";
      for await (const chunk of stream) {
        if (chunk.text) {
          full += chunk.text;
          setChatHistory(prev => {
            const next = [...prev];
            next[next.length - 1].parts[0].text = full;
            return next;
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <main ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {chatHistory.length === 0 && <ExamplePrompts onPromptClick={handleSendMessage} />}
        {chatHistory.map((msg, i) => <ChatBubble key={i} message={msg} />)}
        {isLoading && chatHistory[chatHistory.length - 1]?.role !== 'model' && (
          <div className="flex justify-center p-4">
            <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-2xl border border-gray-700">
              <LoadingSpinner />
              <span className="text-gray-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        {error && <div className="text-center text-red-400 p-4">{error}</div>}
      </main>
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <InputForm onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
