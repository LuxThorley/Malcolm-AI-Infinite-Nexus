import React, { useRef, useEffect, useState } from 'react';
import { SendIcon, PaperclipIcon, MicrophoneIcon, StopCircleIcon } from './Icons';

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
  onStop: () => void;
  file: File | null;
  setFile: (file: File | null) => void;
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
}


export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSendMessage, isLoading, onStop, file, setFile }) => {
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
    <div className="bg-transparent px-4 pb-4">
       <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*, video/*, audio/*"
        />
      <div className="max-w-4xl mx-auto bg-slate-200/30 dark:bg-slate-900/30 backdrop-blur-lg border border-white/10 dark:border-white/5 rounded-2xl p-2 shadow-2xl shadow-black/20">
         {filePreview && (
          <div className="mb-2 p-2 bg-black/10 dark:bg-black/20 rounded-lg relative w-fit">
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
              className="absolute -top-2 -right-2 bg-slate-500 dark:bg-slate-800 rounded-full h-6 w-6 flex items-center justify-center text-white hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors border border-white/10"
              aria-label="Remove file"
            >
              &times;
            </button>
          </div>
        )}
        <div className="relative flex items-center">
            {isLoading ? (
                <div className="w-full flex flex-col items-center justify-center p-3 h-[52px]">
                    <button onClick={onStop} className="flex items-center space-x-2 px-4 py-2 border border-white/20 rounded-lg text-slate-300 bg-white/5 hover:bg-white/10 transition-colors">
                        <StopCircleIcon className="h-5 w-5"/>
                        <span>Stop generating</span>
                    </button>
                </div>
            ) : (
                <>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Malcolm AI..."
                    rows={1}
                    className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 rounded-lg py-3 pl-12 pr-28 resize-none focus:ring-2 focus:ring-purple-500/50 focus:outline-none transition-shadow duration-300 shadow-inner dark:shadow-black/50"
                    disabled={isListening}
                />
                <div className="absolute left-2 flex items-center">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isListening}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-white/20 dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        aria-label="Attach file"
                    >
                        <PaperclipIcon className="h-5 w-5" />
                    </button>
                </div>
                <div className="absolute right-3 flex items-center">
                    {recognition && (
                    <button
                        onClick={handleMicClick}
                        className={`p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 hover:bg-white/20 dark:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${isListening ? 'text-pink-500 animate-pulse' : ''}`}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    >
                        <MicrophoneIcon className="h-5 w-5" />
                    </button>
                    )}
                    <button
                    onClick={onSendMessage}
                    disabled={!input.trim() && !file}
                    className="ml-2 p-3 rounded-full text-white bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-600 dark:disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-300 transform enabled:hover:scale-110 shadow-lg enabled:hover:shadow-purple-500/50"
                    aria-label="Send message"
                    >
                    <SendIcon className="h-5 w-5" />
                    </button>
                </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};