import React, { useRef, useEffect, useState } from 'react';
import { SendIcon, PaperclipIcon, MicrophoneIcon } from './Icons';

// FIX: Add type declarations for Web Speech API to resolve TypeScript errors.
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly [index: number]: SpeechRecognitionAlternative;
  readonly length: number;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionResultList {
  readonly [index: number]: SpeechRecognitionResult;
  readonly length: number;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}


interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  file: File | null;
  setFile: (file: File | null) => void;
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
}


export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSendMessage, isLoading, file, setFile }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;
      el.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [input]);
  
  useEffect(() => {
    if (file) {
      if(file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview('file'); // non-null value to indicate a file is present
      }
    } else {
      setFilePreview(null);
    }
  }, [file]);

  useEffect(() => {
      if (!recognition) return;
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                  finalTranscript += event.results[i][0].transcript;
              } else {
                  interimTranscript += event.results[i][0].transcript;
              }
          }
          setInput(input + finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      }
      
      return () => {
        if (!recognition) return;
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
      }

  }, [input, setInput]);

  const handleMicClick = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      setInput('');
      recognition.start();
    }
    setIsListening(!isListening);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (!!input.trim() || !!file)) {
        onSendMessage();
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-4 border-t border-slate-200 dark:border-slate-700">
       <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*, video/*, audio/*"
        />
      <div className="max-w-4xl mx-auto">
         {filePreview && (
          <div className="mb-2 p-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg relative w-fit">
            {file?.type.startsWith('image/') && filePreview !== 'file' && (
              <img src={filePreview} alt="Preview" className="max-h-24 rounded-md" />
            )}
            {file?.type.startsWith('video/') && filePreview !== 'file' && (
              <video src={filePreview} muted className="max-h-24 rounded-md" />
            )}
            {(file?.type.startsWith('audio/') || filePreview === 'file') && (
              <div className="p-4 text-slate-600 dark:text-slate-300 text-sm">{file?.name}</div>
            )}
            <button
              onClick={handleRemoveFile}
              className="absolute -top-2 -right-2 bg-slate-500 dark:bg-slate-600 rounded-full h-6 w-6 flex items-center justify-center text-white hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
              aria-label="Remove file"
            >
              &times;
            </button>
          </div>
        )}
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Malcolm AI..."
            rows={1}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 rounded-lg py-3 pl-12 pr-24 resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow"
            disabled={isLoading || isListening}
          />
           <div className="absolute left-2 flex items-center">
             <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isListening}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-600/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                aria-label="Attach file"
             >
                <PaperclipIcon className="h-5 w-5" />
             </button>
           </div>
          <div className="absolute right-3 flex items-center">
            {recognition && (
              <button
                onClick={handleMicClick}
                disabled={isLoading}
                className={`p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-300/50 dark:hover:bg-slate-600/50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${isListening ? 'text-red-500 animate-pulse' : ''}`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
              >
                <MicrophoneIcon className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={onSendMessage}
              disabled={isLoading || (!input.trim() && !file)}
              className="ml-2 p-2 rounded-full text-slate-100 dark:text-slate-300 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};