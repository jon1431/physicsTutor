
import React, { useState, useRef } from 'react';

interface InputFormProps {
  onSendMessage: (message: string, image?: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((inputValue.trim() || selectedImage) && !isLoading) {
      onSendMessage(inputValue, selectedImage || undefined);
      setInputValue('');
      setSelectedImage(null);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      {selectedImage && (
        <div className="relative w-20 h-20 animate-in fade-in zoom-in duration-200 ml-12 mb-1">
          <img 
            src={selectedImage} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-lg border border-cyan-500/50 shadow-lg"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 4.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isLoading}
          className="p-3 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-50"
          title="Upload image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a physics question..."
          className="flex-grow p-3 bg-gray-800 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none min-h-[48px]"
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (!inputValue.trim() && !selectedImage)}
          className="p-3 bg-cyan-600 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-700 transition-colors focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        >
          {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          ) : (
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
          )}
        </button>
      </form>
    </div>
  );
};
