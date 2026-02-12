
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, SubjectiveQuestion, Flashcard, ChatMessage } from '../types';

/**
 * Standard system instructions and configuration for the Physics Tutor.
 */
const SYSTEM_PROMPT = `You are an elite Physics Tutor for the Malaysian Matriculation syllabus. 
Your goal is to provide responses that look like professional Study Notes.

FORMATTING RULES:
1. STRUCTURE: Use "###" for main headers and "---" for thematic dividers between sections.
2. LISTS: Use clear, spaced-out bullet points for definitions and steps.
3. MATH: Use LaTeX $...$ for all inline math and $$...$$ for block equations. 
4. FRACTIONS: Always use strict LaTeX syntax: \\frac{numerator}{denominator}. Never omit the backslash or the curly braces.
5. SYMBOLS: Strictly use the letter "w" for angular frequency instead of the Greek letter omega.
6. TONE: Professional, technical, and exam-oriented.
7. ESCAPING: Use single backslashes for LaTeX in your response (e.g. \frac, \lambda, \theta). The rendering engine will handle them correctly.`;

const MATH_STANDARD = "MANDATORY: Use strict LaTeX for all math. For fractions, use \\frac{a}{b} syntax only. Use the letter 'w' for angular frequency (NOT the Greek omega). Ensure clear step-by-step logic.";

export const getTutorStream = async (message: string, history: ChatMessage[], imageBase64?: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const contents = history.map(msg => ({
    role: msg.role,
    parts: msg.parts.map(p => p.inlineData ? { inlineData: p.inlineData } : { text: p.text })
  }));

  const parts: any[] = [{ text: message }];
  if (imageBase64) {
    const [header, data] = imageBase64.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    parts.push({ inlineData: { mimeType, data } });
  }
  contents.push({ role: 'user', parts });

  return await ai.models.generateContentStream({
    model: 'gemini-3-flash-preview',
    contents,
    config: { systemInstruction: SYSTEM_PROMPT }
  });
};

export const generateQuizSession = async (count: number = 5, topic: string): Promise<QuizQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} Physics MCQs for "${topic}". ${MATH_STANDARD}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            hint: { type: Type.STRING }
          },
          required: ['question', 'options', 'answerIndex', 'explanation', 'hint']
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateSubjectiveQuiz = async (count: number = 5, topic: string): Promise<SubjectiveQuestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate ${count} subjective Physics questions for "${topic}". ${MATH_STANDARD}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            idealAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            hint: { type: Type.STRING }
          },
          required: ['question', 'idealAnswer', 'explanation', 'hint']
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateFlashcards = async (topic: string): Promise<Flashcard[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate 6 Physics flashcards for "${topic}". ${MATH_STANDARD} Return as JSON array.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ['front', 'back']
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const condenseNotes = async (notes: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Condense the following physics notes into a structured summary with key points, definitions, and essential formulas. ${MATH_STANDARD}\n\nNotes:\n${notes}`,
  });
  return response.text || '';
};

export const analyzePhysicsProblem = async (imageBase64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const [header, data] = imageBase64.split(',');
  const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { mimeType, data } },
        { text: `Analyze this physics problem. Provide a detailed, step-by-step solution. Identify its topic and relevant learning outcomes in the Malaysian Matriculation Physics syllabus. ${MATH_STANDARD}` }
      ]
    }
  });
  return response.text || '';
};
