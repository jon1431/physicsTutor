
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { analyzePhysicsProblem } from '../services/geminiService';
import { LoadingSpinner } from './LoadingSpinner';

export const ExamAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysis('');
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzePhysicsProblem(selectedImage);
      setAnalysis(result);
    } catch (err) {
      setError("Failed to analyze the image. Make sure the text is clear.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-100 mb-2">Problem Analyzer</h2>
        <p className="text-gray-400">Upload a photo of a physics problem for a detailed, step-by-step solution and conceptual breakdown.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-gray-800/30 group
              ${selectedImage ? 'border-cyan-500/50' : 'border-gray-700 hover:border-cyan-500/50'}
            `}
          >
            {selectedImage ? (
              <>
                <img src={selectedImage} alt="Physics Problem" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-bold bg-gray-900/80 px-4 py-2 rounded-full text-xs">Change Image</span>
                </div>
              </>
            ) : (
              <div className="text-center p-10">
                <svg className="w-16 h-16 text-gray-600 mb-4 mx-auto group-hover:text-cyan-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-gray-500 font-medium">Click to upload a problem image</p>
                <p className="text-xs text-gray-600 mt-2">Supports JPG, PNG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || isLoading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? <LoadingSpinner /> : "Analyze Problem"}
          </button>
          
          {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
        </div>

        <div className="lg:col-span-7">
          <div className="bg-gray-800 rounded-[2.5rem] border border-gray-700 p-8 sm:p-10 shadow-2xl h-full min-h-[500px] overflow-y-auto custom-scrollbar">
            {analysis ? (
              <article className="prose prose-invert prose-cyan max-w-none prose-headings:text-purple-400 prose-headings:font-bold prose-p:text-gray-300 prose-strong:text-cyan-400">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {analysis}
                </ReactMarkdown>
              </article>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center opacity-40">
                <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="max-w-xs">Analysis results and step-by-step solutions will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
