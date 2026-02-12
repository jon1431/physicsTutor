
export interface ChatMessage {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
    hint: string;
}

export interface SubjectiveQuestion {
    question: string;
    idealAnswer: string;
    explanation: string;
    hint: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  name: string;
  cards: Flashcard[];
}

export interface Chapter {
    id: number;
    title: string;
    content: string;
}

export interface Semester {
    semester: number;
    chapters: Chapter[];
}

export interface Subject {
    name: 'Physics';
    semesters: Semester[];
}
