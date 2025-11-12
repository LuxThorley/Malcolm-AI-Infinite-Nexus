
import React, { useRef, useEffect } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSendMessage, isLoading }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [input]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="bg-slate-800 p-4 border-t border-slate-700">
      <div className="relative max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Malcolm AI..."
          rows={1}
          className="w-full bg-slate-700 text-slate-200 placeholder-slate-400 rounded-lg py-3 pl-4 pr-14 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
          disabled={isLoading}
        />
        <button
          onClick={onSendMessage}
          disabled={isLoading || !input.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-300 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
