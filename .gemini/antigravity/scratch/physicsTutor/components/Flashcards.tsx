
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

  // Deck Management State
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<{ index: number, card: Flashcard } | null>(null);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');

  // Form State for card creation/edit
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<number | null>(null);

  // Load decks from local storage
  useEffect(() => {
    const savedDecks = localStorage.getItem('physics_flashcard_decks');
    if (savedDecks) {
      try {
        setDecks(JSON.parse(savedDecks));
      } catch (e) {
        console.error("Failed to load decks", e);
      }
    } else {
      // Migrate old format if exists
      const oldFormat = localStorage.getItem('physics_custom_flashcards');
      if (oldFormat) {
        const legacyCards = JSON.parse(oldFormat);
        const legacyDeck: Deck = { id: 'legacy', name: 'Legacy Library', cards: legacyCards };
        setDecks([legacyDeck]);
        localStorage.setItem('physics_flashcard_decks', JSON.stringify([legacyDeck]));
      } else {
        // Initial default deck
        const defaultDeck: Deck = { id: 'default', name: 'My First Deck', cards: [] };
        setDecks([defaultDeck]);
        localStorage.setItem('physics_flashcard_decks', JSON.stringify([defaultDeck]));
      }
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
    if (confirm("Are you sure you want to delete this deck? All cards inside will be lost.")) {
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
    const deck = decks.find(d => d.id === selectedDeckId);
    return deck?.cards.some(c => activeCards[idx] && c.front === activeCards[idx].front);
  };

  const openEditMode = (index: number, card: Flashcard) => {
    setEditingCard({ index, card });
    setCardFront(card.front);
    setCardBack(card.back);
  };

  const openAddCardMode = () => {
    if (isAddingCard) {
      setIsAddingCard(false);
    } else {
      setCardFront('');
      setCardBack('');
      setIsAddingCard(true);
    }
  };

  const handleBack = () => {
    if (view === 'session' || view === 'deck-detail') {
      setView('selection');
      setTopic('');
      setIsAddingCard(false);
      setEditingCard(null);
    }
  };

  if (view === 'selection') {
    return (
      <div className="max-w-5xl mx-auto py-8 animate-in fade-in duration-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Active Recall Lab</h2>
          <div className="flex justify-center gap-4 mb-8 border-b border-gray-800 pb-4">
            <button 
              onClick={() => setSubView('syllabus')}
              className={`pb-2 px-4 text-sm font-bold transition-all border-b-2 ${subView === 'syllabus' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Syllabus Topics
            </button>
            <button 
              onClick={() => setSubView('library')}
              className={`pb-2 px-4 text-sm font-bold transition-all border-b-2 ${subView === 'library' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              My Decks ({decks.length})
            </button>
          </div>
        </div>

        {subView === 'syllabus' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center gap-3 mb-10 bg-gray-800/50 p-1.5 rounded-2xl w-fit mx-auto border border-gray-700 shadow-inner">
              {[1, 2].map(s => (
                <button 
                  key={s} 
                  onClick={() => setSem(s)} 
                  className={`px-10 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${sem === s ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-gray-500 hover:text-gray-300'}`}
                >
                  Semester {s}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => handleSyllabusGen(c.title)} 
                  className="group p-6 bg-gray-800/40 border border-gray-700 rounded-3xl hover:border-cyan-500/50 hover:bg-gray-800 transition-all text-left flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Topic {c.id}</span>
                  <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors leading-tight pr-8">{c.title}</h4>
                </button>
              ))}
            </div>
          </div>
        )}

        {subView === 'library' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-gray-200">Personal Study Decks</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsCreatingDeck(true)}
                    className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    + New Deck
                  </button>
                </div>
             </div>

             {isCreatingDeck && (
               <form onSubmit={handleCreateDeck} className="mb-8 p-6 bg-gray-800/50 border border-cyan-500/30 rounded-[2rem] flex items-center gap-4 animate-in zoom-in duration-300">
                  <input 
                    autoFocus
                    required
                    value={newDeckName}
                    onChange={e => setNewDeckName(e.target.value)}
                    placeholder="Enter deck name..."
                    className="flex-grow bg-gray-900 border border-gray-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setIsCreatingDeck(false)} className="px-4 py-2 text-gray-400 font-bold text-xs uppercase">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold text-xs uppercase shadow-lg shadow-cyan-900/40">Create</button>
                  </div>
               </form>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decks.map(deck => (
                  <div 
                    key={deck.id}
                    onClick={() => { setSelectedDeckId(deck.id); setView('deck-detail'); }}
                    className="group bg-gray-800/60 p-8 rounded-[2.5rem] border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h4 className="text-xl font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">{deck.name}</h4>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{deck.cards.length} Cards</p>
                    <div className="mt-6 flex gap-3">
                       <button 
                         onClick={(e) => { e.stopPropagation(); startDeckSession(deck.id); }}
                         disabled={deck.cards.length === 0}
                         className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-900/40 transition-all"
                       >
                         Study
                       </button>
                       <button 
                         onClick={(e) => handleDeleteDeck(deck.id, e)}
                         className="text-gray-600 hover:text-red-500 transition-colors p-2"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
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
            <button 
              onClick={handleBack}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-all"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="text-xs font-bold uppercase tracking-widest">Back to Library</span>
            </button>
            <div className="text-right">
                <h3 className="text-2xl font-black text-white">{activeDeck.name}</h3>
                <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em]">{activeDeck.cards.length} Cards</span>
            </div>
         </div>

         <div className="flex gap-4 mb-10">
            <button 
              onClick={() => startDeckSession(activeDeck.id)}
              disabled={activeDeck.cards.length === 0}
              className="flex-grow py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-cyan-900/40 transition-all"
            >
              Start Study Session
            </button>
            <button 
              onClick={openAddCardMode}
              className={`px-8 py-4 border rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isAddingCard ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300'}`}
            >
              {isAddingCard ? 'Cancel' : '+ Add Card'}
            </button>
         </div>

         {/* Inlined Add Card Form */}
         {isAddingCard && (
           <div className="mb-10 bg-gray-800/40 p-10 rounded-[2.5rem] border border-cyan-500/30 animate-in slide-in-from-top-4 duration-500 shadow-xl">
              <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">New Flashcard</h3>
              <form onSubmit={handleCreateCard} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-2">Front (Concept / Question)</label>
                  <textarea 
                    autoFocus
                    required
                    value={cardFront}
                    onChange={e => setCardFront(e.target.value)}
                    placeholder="e.g. Newton's Second Law"
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-24"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-2">Back (Definition / Answer)</label>
                  <textarea 
                    required
                    value={cardBack}
                    onChange={e => setCardBack(e.target.value)}
                    placeholder="e.g. F = ma"
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32"
                  />
                </div>
                <div className="flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingCard(false)} 
                    className="flex-1 py-4 text-gray-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-900/40 transition-all active:scale-[0.98]"
                  >
                    Add to {activeDeck.name}
                  </button>
                </div>
              </form>
           </div>
         )}

         {/* Card Editing Modal */}
         {editingCard && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="max-w-2xl w-full bg-gray-800 p-10 rounded-[2.5rem] border border-cyan-500/30 animate-in zoom-in duration-300 shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Edit Flashcard</h3>
                <form onSubmit={handleEditCard} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest block mb-2">Front</label>
                    <textarea 
                      required
                      value={cardFront}
                      onChange={e => setCardFront(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-24"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest block mb-2">Back</label>
                    <textarea 
                      required
                      value={cardBack}
                      onChange={e => setCardBack(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setEditingCard(null)} className="flex-grow py-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Cancel</button>
                    <button type="submit" className="flex-[2] bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-cyan-900/40 transition-all active:scale-[0.98]">Update Card</button>
                  </div>
                </form>
             </div>
           </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeDeck.cards.map((card, i) => (
              <div key={i} className="group bg-gray-800/40 p-6 rounded-3xl border border-gray-700 flex flex-col justify-between transition-all hover:bg-gray-800/60">
                 <div className="space-y-4 mb-6">
                    <div>
                        <span className="text-[9px] font-black text-cyan-500/50 uppercase tracking-widest block mb-2">Concept</span>
                        <div className="text-gray-100 font-bold leading-relaxed line-clamp-3">
                           <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.front}</ReactMarkdown>
                        </div>
                    </div>
                    <div className="border-t border-gray-700/50 pt-4">
                        <span className="text-[9px] font-black text-purple-500/50 uppercase tracking-widest block mb-2">Definition</span>
                        <div className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
                           <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{card.back}</ReactMarkdown>
                        </div>
                    </div>
                 </div>
                 <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => openEditMode(i, card)}
                      className="p-2 text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={() => deleteCard(i)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                 </div>
              </div>
            ))}
         </div>

         {activeDeck.cards.length === 0 && !isAddingCard && (
           <div className="text-center py-20 bg-gray-800/20 rounded-[3rem] border border-dashed border-gray-700">
             <p className="text-gray-500 italic">This deck has no cards. Add some manually or from the syllabus!</p>
           </div>
         )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={handleBack}
          className="group flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-all"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          <span className="text-xs font-bold uppercase tracking-widest">End Session</span>
        </button>
        <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-[0.2em]">{topic}</span>
      </div>

      <main className="flex flex-col items-center min-h-[500px]">
        {loading ? (
          <div className="mt-32 text-center space-y-6">
             <div className="flex justify-center"><LoadingSpinner /></div>
             <p className="text-gray-400 font-medium animate-pulse">Consulting the syllabus to craft your session...</p>
          </div>
        ) : activeCards.length > 0 ? (
          <div className="w-full flex flex-col items-center gap-8">
            <div className="w-full max-lg flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                <span>Card {idx + 1} of {activeCards.length}</span>
                <span className="text-cyan-500/70">{flipped ? 'The Answer' : 'The Concept'}</span>
            </div>
            
            <div className="w-full max-w-lg h-1.5 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                <div className="h-full bg-cyan-500 transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.4)]" style={{ width: `${((idx + 1) / activeCards.length) * 100}%` }} />
            </div>
            
            <div 
              onClick={() => setFlipped(!flipped)} 
              className="w-full max-w-lg h-[450px] cursor-pointer [perspective:1500px] group"
            >
              <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center [backface-visibility:hidden] shadow-2xl group-hover:border-cyan-500/30 transition-all">
                    <div className="absolute top-8 left-8">
                       <svg className="w-6 h-6 text-cyan-500/20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L14.017 3H21.017V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8C8.55228 16 9 15.5523 9 15V9C9 8.44772 8.55228 8 8 8H5C3.89543 8 3 7.10457 3 6V3L3 3H10V15C10 18.3137 7.31371 21 4 21H3Z" /></svg>
                    </div>
                    <div className="prose prose-invert prose-xl font-bold leading-relaxed text-gray-100">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{activeCards[idx].front}</ReactMarkdown>
                    </div>
                    <div className="absolute bottom-10 flex flex-col items-center gap-2 opacity-30 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500">Click to Flip</span>
                        <div className="w-8 h-1 bg-cyan-500/30 rounded-full" />
                    </div>
                </div>
                {/* Back */}
                <div className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-[3rem] flex items-center justify-center p-12 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-2xl">
                    <div className="prose prose-invert prose-lg leading-loose text-gray-300">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{activeCards[idx].back}</ReactMarkdown>
                    </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <button 
                disabled={idx === 0} 
                onClick={(e) => { e.stopPropagation(); setIdx(idx - 1); setFlipped(false); }} 
                className="w-14 h-14 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-10 border border-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button 
                onClick={() => setFlipped(!flipped)}
                className="px-12 h-14 bg-gray-800 hover:bg-gray-750 text-cyan-500 font-black text-xs uppercase tracking-widest rounded-2xl border border-cyan-500/20 transition-all shadow-lg active:scale-95"
              >
                Flip Card
              </button>

              <button 
                disabled={idx === activeCards.length - 1} 
                onClick={(e) => { e.stopPropagation(); setIdx(idx + 1); setFlipped(false); }} 
                className="w-14 h-14 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-10 shadow-xl shadow-cyan-900/40"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 mt-4 w-full max-w-lg">
              {/* Only show "Save to Deck" if we are in a Syllabus generation or random session not tied to a specific library view */}
              {subView === 'syllabus' && (
                <div className="w-full flex flex-col gap-2">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Save this card to:</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {decks.map(deck => (
                        <button 
                          key={deck.id}
                          onClick={() => saveCurrentCardToLibrary(deck.id)}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all
                            ${isCurrentCardSaved(deck.id) 
                              ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                              : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400'
                            }`}
                        >
                           {isCurrentCardSaved(deck.id) ? `In ${deck.name}` : `+ ${deck.name}`}
                        </button>
                      ))}
                   </div>
                </div>
              )}

              {idx === activeCards.length - 1 && flipped && (
                <button 
                  onClick={handleBack}
                  className="w-full py-4 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-cyan-400 rounded-2xl border border-gray-700 transition-all font-bold text-xs uppercase tracking-widest animate-in fade-in zoom-in duration-500"
                >
                  Finish Session
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-40 text-center animate-in fade-in duration-700">
             <p className="text-gray-500 italic">No cards available for this session.</p>
             <button onClick={handleBack} className="mt-4 text-cyan-500 font-bold hover:underline">Go back</button>
          </div>
        )}
      </main>
    </div>
  );
};
