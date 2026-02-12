
import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { generateFlashcards } from '../services/geminiService';
import type { Flashcard, Deck } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { MATRICULATION_NOTES } from '../data/matriculationNotes';

type FlashcardView = 'selection' | 'session' | 'deck-detail';
type FlashcardSubView = 'syllabus' | 'library';

export const Flashcards: React.FC = () => {
  const [view, setView] = useState<FlashcardView>('selection');
  const [subView, setSubView] = useState<FlashcardSubView>('syllabus');
  const [sem, setSem] = useState(1);
  const [topic, setTopic] = useState('');
  const [activeCards, setActiveCards] = useState<Flashcard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<{ index: number, card: Flashcard } | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<number | null>(null);

  useEffect(() => {
    const savedDecks = localStorage.getItem('physics_flashcard_decks');
    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch (e) {
        console.error("Failed to load decks", e);
      }
    } else {
      const defaultDeck: Deck = { id: 'default', name: 'My First Deck', cards: [] };
      setDecks([defaultDeck]);
      localStorage.setItem('physics_flashcard_decks', JSON.stringify([defaultDeck]));
    }
  }, []);

  const saveDecksToStorage = (updated: Deck[]) => {
    setDecks(updated);
    localStorage.setItem('physics_flashcard_decks', JSON.stringify(updated));
  };

  const chapters = useMemo(() => 
    MATRICULATION_NOTES.find(s => s.name === 'Physics')?.semesters.find(s => s.semester === sem)?.chapters || [], 
  [sem]);

  const activeDeck = useMemo(() => decks.find(d => d.id === selectedDeckId), [decks, selectedDeckId]);

  const handleSyllabusGen = async (t: string) => {
    setTopic(t);
    setLoading(true);
    setView('session');
    setActiveCards([]);
    try {
      const data = await generateFlashcards(t);
      setActiveCards(data);
      setIdx(0);
      setFlipped(false);
    } catch (err) {
      console.error("Flashcard generation failed", err);
      setView('selection');
    } finally {
      setLoading(false);
    }
  };

  const startDeckSession = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck || deck.cards.length === 0) return;
    setTopic(deck.name);
    setActiveCards(deck.cards);
    setIdx(0);
    setFlipped(false);
    setView('session');
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;
    const newDeck: Deck = {
      id: Date.now().toString(),
      name: newDeckName,
      cards: []
    };
    saveDecksToStorage([...decks, newDeck]);
    setNewDeckName('');
    setIsCreatingDeck(false);
  };

  const handleDeleteDeck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this deck?")) {
      const updated = decks.filter(d => d.id !== id);
      saveDecksToStorage(updated);
      if (selectedDeckId === id) setView('selection');
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim() || !selectedDeckId) return;
    const newCard: Flashcard = { front: cardFront, back: cardBack };
    const updatedDecks = decks.map(d => 
      d.id === selectedDeckId ? { ...d, cards: [...d.cards, newCard] } : d
    );
    saveDecksToStorage(updatedDecks);
    setCardFront('');
    setCardBack('');
    setIsAddingCard(false);
  };

  const handleEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim() || !selectedDeckId || editingCard === null) return;
    const updatedDecks = decks.map(d => {
      if (d.id === selectedDeckId) {
        const newCards = [...d.cards];
        newCards[editingCard.index] = { front: cardFront, back: cardBack };
        return { ...d, cards: newCards };
      }
      return d;
    });
    saveDecksToStorage(updatedDecks);
    setEditingCard(null);
    setCardFront('');
    setCardBack('');
  };

  const deleteCard = (index: number) => {
    if (!selectedDeckId) return;
    const updatedDecks = decks.map(d => 
      d.id === selectedDeckId ? { ...d, cards: d.cards.filter((_, i) => i !== index) } : d
    );
    saveDecksToStorage(updatedDecks);
  };

  const saveCurrentCardToLibrary = (deckId: string) => {
    const currentCard = activeCards[idx];
    const updatedDecks = decks.map(d => {
      if (d.id === deckId) {
        const exists = d.cards.some(c => c.front === currentCard.front);
        if (!exists) return { ...d, cards: [...d.cards, currentCard] };
      }
      return d;
    });
    saveDecksToStorage(updatedDecks);
    setSaveFeedback(idx);
    setTimeout(() => setSaveFeedback(null), 1500);
  };

  const isCurrentCardSaved = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    return deck?.cards.some(c => activeCards[idx] && c.front === activeCards[idx].front);
  };

  const handleBack = () => {
    setView('selection');
    setTopic('');
    setIsAddingCard(false);
    setEditingCard(null);
  };

  if (view === 'selection') {
    return (
      <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Active Recall Lab</h2>
          <div className="flex justify-center gap-4 mb-8 border-b border-gray-800 pb-4">
            <button onClick={() => setSubView('syllabus')} className={`pb-2 px-4 text-sm font-bold transition-all border-b-2 ${subView === 'syllabus' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Syllabus Topics</button>
            <button onClick={() => setSubView('library')} className={`pb-2 px-4 text-sm font-bold transition-all border-b-2 ${subView === 'library' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>My Decks ({decks.length})</button>
          </div>
        </div>
        {subView === 'syllabus' ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center gap-3 mb-10 bg-gray-800/50 p-1.5 rounded-2xl w-fit mx-auto border border-gray-700 shadow-inner">
              {[1, 2].map(s => (
                <button key={s} onClick={() => setSem(s)} className={`px-10 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sem === s ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-gray-500 hover:text-gray-300'}`}>Semester {s}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map(c => (
                <button key={c.id} onClick={() => handleSyllabusGen(c.title)} className="group p-6 bg-gray-800/40 border border-gray-700 rounded-3xl hover:border-cyan-500/50 hover:bg-gray-800 transition-all text-left flex flex-col gap-3 relative overflow-hidden">
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Topic {c.id}</span>
                  <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors leading-tight pr-8">{c.title}</h4>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-200">Personal Study Decks</h3>
                <button onClick={() => setIsCreatingDeck(true)} className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">+ New Deck</button>
             </div>
             {isCreatingDeck && (
               <form onSubmit={handleCreateDeck} className="mb-8 p-6 bg-gray-800/50 border border-cyan-500/30 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-300">
                  <input autoFocus required value={newDeckName} onChange={e => setNewDeckName(e.target.value)} placeholder="Enter deck name..." className="flex-grow bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none" />
                  <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-cyan-900/40">Create</button>
               </form>
             )}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map(deck => (
                  <div key={deck.id} onClick={() => { setSelectedDeckId(deck.id); setView('deck-detail'); }} className="group bg-gray-800/60 p-8 rounded-[2.5rem] border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden">
                    <h4 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">{deck.name}</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{deck.cards.length} Cards</p>
                    <div className="mt-6 flex gap-3">
                       <button onClick={(e) => { e.stopPropagation(); startDeckSession(deck.id); }} disabled={deck.cards.length === 0} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-900/40 transition-all">Study</button>
                       <button onClick={(e) => handleDeleteDeck(deck.id, e)} className="text-gray-600 hover:text-red-500 transition-colors p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'deck-detail' && activeDeck) {
    return (
      <div className="max-w-5xl mx-auto py-8 animate-in slide-in-from-bottom-8 duration-700">
         <div className="flex items-center justify-between mb-8">
            <button onClick={handleBack} className="group flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg><span className="text-xs font-bold uppercase tracking-widest">Back</span></button>
            <h3 className="text-2xl font-black text-white">{activeDeck.name}</h3>
         </div>
         <div className="flex gap-4 mb-10">
            <button onClick={() => startDeckSession(activeDeck.id)} disabled={activeDeck.cards.length === 0} className="flex-grow py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-900/40 transition-all">Start Study</button>
            <button onClick={() => setIsAddingCard(!isAddingCard)} className="px-8 py-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">{isAddingCard ? 'Cancel' : '+ Add Card'}</button>
         </div>
         {isAddingCard && (
           <form onSubmit={handleCreateCard} className="mb-10 bg-gray-800/40 p-10 rounded-[2.5rem] border border-cyan-500/30 animate-in slide-in-from-top-4 duration-500 shadow-xl space-y-6">
              <textarea required value={cardFront} onChange={e => setCardFront(e.target.value)} placeholder="Front Side" className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-24" />
              <textarea required value={cardBack} onChange={e => setCardBack(e.target.value)} placeholder="Back Side" className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32" />
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-900/40 transition-all">Add Card</button>
           </form>
         )}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeck.cards.map((card, i) => (
              <div key={i} className="group bg-gray-800/40 p-6 rounded-3xl border border-gray-700 flex flex-col justify-between transition-all hover:bg-gray-800/60">
                 <div className="space-y-4 mb-6"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.front}</ReactMarkdown></div>
                 <div className="flex justify-end gap-2"><button onClick={() => deleteCard(i)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></div>
              </div>
            ))}
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-8">
        <button onClick={handleBack} className="group flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg><span className="text-xs font-bold uppercase tracking-widest">End Session</span></button>
        <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em]">{topic}</span>
      </div>
      <main className="flex flex-col items-center min-h-[500px]">
        {loading ? (
          <div className="mt-32 text-center space-y-6"><div className="flex justify-center"><LoadingSpinner /></div><p className="text-gray-400 font-medium animate-pulse">Generating your session...</p></div>
        ) : activeCards.length > 0 ? (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="w-full flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"><span>Card {idx + 1} of {activeCards.length}</span><span>{flipped ? 'Back' : 'Front'}</span></div>
            <div onClick={() => setFlipped(!flipped)} className="w-full max-w-lg h-[400px] cursor-pointer [perspective:1500px] group">
              <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                <div className="absolute inset-0 bg-gray-800/80 border border-gray-700 rounded-[3rem] flex items-center justify-center p-12 text-center [backface-visibility:hidden] shadow-2xl">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{activeCards[idx].front}</ReactMarkdown>
                </div>
                <div className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-[3rem] flex items-center justify-center p-12 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{activeCards[idx].back}</ReactMarkdown>
                </div>
              </div>
            </div>
            <div className="flex gap-4"><button disabled={idx === 0} onClick={() => { setIdx(idx - 1); setFlipped(false); }} className="w-14 h-14 bg-gray-800 text-gray-400 rounded-2xl border border-gray-700 flex items-center justify-center"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button><button onClick={() => setFlipped(!flipped)} className="px-12 h-14 bg-gray-800 text-cyan-500 font-black text-xs uppercase tracking-widest rounded-2xl border border-cyan-500/20 shadow-lg">Flip Card</button><button disabled={idx === activeCards.length - 1} onClick={() => { setIdx(idx + 1); setFlipped(false); }} className="w-14 h-14 bg-cyan-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-900/40"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg></button></div>
          </div>
        ) : <p className="mt-40 text-gray-500 italic">No cards available.</p>}
      </main>
    </div>
  );
};
