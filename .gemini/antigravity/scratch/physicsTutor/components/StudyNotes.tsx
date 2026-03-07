
import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { MATRICULATION_NOTES } from '../data/matriculationNotes';
import type { Subject } from '../types';

export const StudyNotes: React.FC = () => {
    const [selectedSubject] = useState<Subject['name']>('Physics');
    const [selectedSemester, setSelectedSemester] = useState<number>(1);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

    const subjectData = useMemo(() => 
        MATRICULATION_NOTES.find(s => s.name === selectedSubject), 
    [selectedSubject]);

    const semesterData = useMemo(() => 
        subjectData?.semesters.find(s => s.semester === selectedSemester),
    [subjectData, selectedSemester]);

    const chapterData = useMemo(() => 
        semesterData?.chapters.find(c => c.id === selectedChapter),
    [semesterData, selectedChapter]);
    
    const handleSemesterChange = (semester: number) => {
        setSelectedSemester(semester);
        setSelectedChapter(null);
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            <div className="mb-12 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-100 mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-white to-gray-500">
                        Physics Syllabus Mastery
                    </h2>
                    <p className="text-gray-400 max-w-2xl text-lg leading-relaxed font-medium">
                        Structured, exam-ready study materials optimized for the Malaysian Matriculation Physics syllabus.
                    </p>
                </div>

                <div className="flex bg-gray-800/80 p-1.5 rounded-2xl border border-gray-700 shadow-inner self-center lg:self-end">
                    {[1, 2].map(sem => (
                        <button 
                            key={sem}
                            onClick={() => handleSemesterChange(sem)}
                            className={`py-2 px-8 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedSemester === sem ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Semester {sem}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
                <aside className="lg:col-span-3 bg-gray-800/30 backdrop-blur-md p-5 rounded-[2.5rem] border border-gray-700/50 shadow-xl sticky top-24">
                    <div className="flex items-center justify-between px-2 mb-6 border-b border-gray-700/50 pb-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Chapters</h3>
                        <span className="text-[10px] font-bold text-cyan-500/50">{semesterData?.chapters.length || 0} Topics</span>
                    </div>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                        {semesterData?.chapters.map(chapter => (
                            <button 
                                key={chapter.id}
                                onClick={() => setSelectedChapter(chapter.id)}
                                className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-4 group border
                                    ${selectedChapter === chapter.id 
                                        ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/20' 
                                        : 'bg-transparent border-transparent hover:bg-gray-800/80 text-gray-400 hover:text-gray-200 hover:border-gray-700'}`}
                            >
                                <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs transition-colors
                                    ${selectedChapter === chapter.id ? 'bg-white/20 text-white' : 'bg-gray-900 group-hover:bg-gray-700 text-cyan-500'}`}>
                                    {chapter.id}
                                </span>
                                <span className="font-bold text-sm leading-tight">{chapter.title}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <main className="lg:col-span-9">
                    {chapterData ? (
                        <div className="bg-gray-800/40 backdrop-blur-sm p-8 sm:p-16 rounded-[3rem] shadow-2xl border border-gray-700/50 animate-in slide-in-from-right-8 duration-700 ease-out relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            
                            <header className="mb-16 relative">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-cyan-900/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-cyan-500/20">
                                        Physics Core
                                    </span>
                                    <span className="px-3 py-1 bg-purple-900/30 text-purple-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-purple-500/20">
                                        Chapter {chapterData.id}
                                    </span>
                                </div>
                                <h3 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                                    {chapterData.title}
                                </h3>
                                <div className="w-24 h-2 bg-gradient-to-r from-cyan-500 to-transparent rounded-full" />
                            </header>

                            <article className="notes-article prose prose-invert prose-lg max-w-none">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                >
                                    {chapterData.content}
                                </ReactMarkdown>
                            </article>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-gray-800/20 rounded-[3rem] border-2 border-dashed border-gray-700/50 group transition-all duration-500 hover:border-gray-600/50">
                            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-600 group-hover:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-400 mb-2 font-mono">Select a Topic</h4>
                            <p className="text-gray-500 font-medium px-4 text-center max-w-xs leading-relaxed">Choose a chapter from the sidebar to access comprehensive physics notes with standard mathematical notation.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
