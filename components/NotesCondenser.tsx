
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { condenseNotes } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

export const NotesCondenser: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [condensedText, setCondensedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCondense = async () => {
    if (!inputText.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await condenseNotes(inputText);
      setCondensedText(result);
    } catch (err) {
      setError("Failed to condense notes. Please try a shorter text or try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Notes Condenser</h2>
        <p className="text-gray-400">Paste your long physics notes below and I'll distill them into key points and formulas.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Input Notes</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your notes here (e.g. from a textbook or lecture)..."
            className="w-full h-[400px] p-6 bg-gray-800/50 border border-gray-700 rounded-3xl text-gray-200 outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none shadow-inner"
            disabled={isLoading}
          />
          <button
            onClick={handleCondense}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? <LoadingSpinner /> : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Condense Now
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Condensed Summary</label>
          <div className="w-full h-[460px] p-6 bg-gray-900/50 border border-gray-800 rounded-3xl overflow-y-auto custom-scrollbar shadow-2xl">
            {condensedText ? (
              <article className="prose prose-invert prose-cyan max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:text-cyan-400 prose-strong:text-cyan-400">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {condensedText}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-40 italic">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <p>Your distilled notes will appear here.</p>
              </div>
            )}
          </div>
          {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
      `}</style>
    </div>
  );
};
