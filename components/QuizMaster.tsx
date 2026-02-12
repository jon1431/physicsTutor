
import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateQuizSession, generateSubjectiveQuiz } from '../services/geminiService';
import type { QuizQuestion, SubjectiveQuestion } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { MATRICULATION_NOTES } from '../data/matriculationNotes';

type QuizState = 'mode' | 'topic' | 'loading' | 'active' | 'completed';

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
    </svg>
);

export const QuizMaster: React.FC = () => {
    const [state, setState] = useState<QuizState>('mode');
    const [type, setType] = useState<'mcq' | 'sub'>('mcq');
    const [topic, setTopic] = useState('All Topics');
    const [sem, setSem] = useState(1);
    const [qs, setQs] = useState<any[]>([]);
    const [idx, setIdx] = useState(0);
    const [ans, setAns] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showHint, setShowHint] = useState(false);

    const chapters = useMemo(() => 
        MATRICULATION_NOTES.find(s => s.name === 'Physics')?.semesters.find(s => s.semester === sem)?.chapters || [], 
    [sem]);

    const startQuiz = async (t: string) => {
        setTopic(t);
        setState('loading');
        setShowHint(false);
        try {
            const data = type === 'mcq' ? await generateQuizSession(5, t) : await generateSubjectiveQuiz(5, t);
            setQs(data);
            setIdx(0);
            setScore(0);
            setAns(null);
            setState('active');
        } catch {
            setState('mode');
        }
    };

    const handleAnswer = (i: number) => {
        if (ans !== null) return;
        setAns(i);
        setShowHint(false);
        if (i === (qs[idx] as QuizQuestion).answerIndex) setScore(s => s + 1);
    };

    const nextQuestion = () => {
        if (idx < qs.length - 1) {
            setIdx(idx + 1);
            setAns(null);
            setShowHint(false);
        } else {
            setState('completed');
        }
    };

    if (state === 'completed') return (
        <div className="max-w-xl mx-auto text-center p-12 bg-gray-800 rounded-3xl border border-cyan-500/20 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-4xl font-bold mb-4">Quiz Finished!</h2>
            <div className="text-6xl font-black text-cyan-400 mb-8">{score} / {qs.length}</div>
            <button onClick={() => setState('mode')} className="bg-cyan-600 px-8 py-3 rounded-xl font-bold hover:bg-cyan-500 transition-colors">Return to Menu</button>
        </div>
    );

    if (state === 'mode') return (
        <div className="flex flex-col items-center gap-8 py-12 animate-in fade-in duration-500">
            <h2 className="text-3xl font-bold text-gray-100">Select Quiz Mode</h2>
            <div className="flex flex-col md:flex-row gap-6">
                <button onClick={() => { setType('mcq'); setState('topic'); }} className="group p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-cyan-500 w-72 text-center transition-all">
                    <div className="w-12 h-12 bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-cyan-400 font-bold">MCQ</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Multiple Choice</h3>
                    <p className="text-sm text-gray-400">Test your conceptual knowledge with quick-fire options.</p>
                </button>
                <button onClick={() => { setType('sub'); setState('topic'); }} className="group p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-purple-500 w-72 text-center transition-all">
                    <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-purple-400 font-bold">SUB</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Subjective</h3>
                    <p className="text-sm text-gray-400">Focus on derivations and step-by-step problem solving.</p>
                </button>
            </div>
        </div>
    );

    if (state === 'topic') return (
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center gap-2 mb-10 bg-gray-800 p-1.5 rounded-2xl w-fit mx-auto border border-gray-700 shadow-inner">
                {[1, 2].map(s => (
                    <button key={s} onClick={() => setSem(s)} className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${sem === s ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-gray-400 hover:text-gray-200'}`}>Semester {s}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button onClick={() => startQuiz('All Topics')} className="p-6 bg-cyan-900/10 border border-cyan-500/30 rounded-2xl font-bold text-cyan-400 hover:bg-cyan-900/20 transition-all">Randomized Review</button>
                {chapters.map(c => (
                    <button key={c.id} onClick={() => startQuiz(c.title)} className="p-6 bg-gray-800 border border-gray-700 rounded-2xl hover:border-cyan-500/50 hover:bg-gray-750 text-sm font-semibold text-gray-300 transition-all text-left flex items-center gap-3">
                        <span className="text-xs opacity-30">#{c.id}</span> {c.title}
                    </button>
                ))}
            </div>
        </div>
    );

    if (state === 'loading') return (
        <div className="text-center py-32 space-y-4">
            <div className="flex justify-center"><LoadingSpinner /></div>
            <p className="text-gray-400 animate-pulse">Assembling high-quality physics problems...</p>
        </div>
    );

    const q = qs[idx];
    return (
        <div className="max-w-3xl mx-auto bg-gray-800/80 p-8 sm:p-12 rounded-[2.5rem] border border-gray-700 shadow-2xl animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-900/20 px-3 py-1 rounded-full border border-cyan-500/20">
                    Question {idx + 1} of {qs.length}
                </span>
                <div className="flex items-center gap-3">
                    {ans === null && (
                        <button 
                            onClick={() => setShowHint(!showHint)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${showHint ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-yellow-400 hover:border-yellow-500/30'}`}
                        >
                            <LightbulbIcon />
                            {showHint ? 'Hide Hint' : 'Show Hint'}
                        </button>
                    )}
                    <span className="text-xs text-gray-500 font-mono italic">Topic: {topic}</span>
                </div>
            </div>

            <div className="quiz-question text-xl sm:text-2xl font-semibold text-gray-100 mb-6 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {q.question}
                </ReactMarkdown>
            </div>

            {showHint && (
                <div className="mb-8 p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase text-yellow-500/70 tracking-widest">Helpful Hint</span>
                    </div>
                    <div className="text-sm text-yellow-200/80 leading-relaxed italic">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {q.hint}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {type === 'mcq' && q.options.map((opt, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleAnswer(i)} 
                        disabled={ans !== null} 
                        className={`w-full text-left p-6 rounded-2xl border transition-all flex items-center gap-4
                            ${ans === null 
                                ? 'bg-gray-900/50 border-gray-700 hover:border-cyan-500/50 hover:bg-gray-900' 
                                : i === q.answerIndex 
                                    ? 'border-green-500 bg-green-500/10 text-green-400' 
                                    : i === ans 
                                        ? 'border-red-500 bg-red-500/10 text-red-400' 
                                        : 'opacity-40 border-gray-800'
                            }`}
                    >
                        <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-colors ${ans === null ? 'bg-gray-800 border-gray-700 text-gray-400' : i === q.answerIndex ? 'bg-green-500 text-white border-green-400' : 'bg-gray-900 border-gray-800 text-gray-600'}`}>
                            {String.fromCharCode(65 + i)}
                        </span>
                        <div className="flex-grow quiz-option-text prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {opt}
                            </ReactMarkdown>
                        </div>
                    </button>
                ))}
            </div>

            {ans !== null && (
                <div className="mt-12 p-8 bg-gray-900/80 rounded-[2rem] border border-gray-700/50 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-bold text-cyan-400 text-sm uppercase tracking-wider">Solution Insights</span>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-loose">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {q.explanation}
                        </ReactMarkdown>
                    </div>
                    <button 
                        onClick={nextQuestion} 
                        className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        {idx < qs.length - 1 ? 'Next Question' : 'View Results'}
                    </button>
                </div>
            )}
        </div>
    );
};
