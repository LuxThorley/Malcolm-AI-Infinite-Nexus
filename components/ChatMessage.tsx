
import React, { useEffect, useRef, useState } from 'react';
import { Role, Message } from '../types';
import { MalcolmIcon, UserIcon, CopyIcon, CheckIcon, RefreshCwIcon, AlertTriangleIcon, CpuIcon } from './Icons';

// Make sure marked and hljs are available globally
declare const marked: any;
declare const hljs: any;

interface ChatMessageProps {
    message: Message;
    isLastMessage: boolean;
    isLoading: boolean;
    onRegenerate: () => void;
    onRetry: () => void;
}

const ActionCard: React.FC<{ card: Message['actionCard'] }> = ({ card }) => {
    if (!card) return null;
    return (
        <div className="mt-3 border border-purple-500/30 bg-black/20 rounded-lg overflow-hidden">
            <div className="p-3 bg-black/20 flex items-center space-x-2">
                <CpuIcon className="h-5 w-5 text-purple-400"/>
                <h3 className="font-semibold text-purple-300">{card.title}</h3>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 text-sm">
                {Object.entries(card.data).map(([key, value]) => (
                    <div key={key}>
                        <p className="capitalize text-slate-400 text-xs">{key.replace(/_/g, ' ')}</p>
                        <p className="text-slate-200">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLastMessage, isLoading, onRegenerate, onRetry }) => {
  const isUserModel = message.role === Role.USER;
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current && !message.error) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        if (!block.hasAttribute('data-highlighted')) {
             hljs.highlightElement(block as HTMLElement);
             block.setAttribute('data-highlighted', 'true');
        }
      });
    }
  }, [message.text, message.error]);
  
  const ThinkingLoader = () => (
     <div className="pt-2 flex items-center space-x-2">
         <p className="text-slate-400 font-medium">Malcolm is thinking</p>
         <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></span>
         </div>
     </div>
  );

  const renderContent = () => {
    if (message.error) {
        return (
            <div className="text-red-500 dark:text-red-400 flex items-center space-x-2">
                <AlertTriangleIcon className="h-5 w-5" />
                <span>{message.text}</span>
            </div>
        );
    }
    if (message.role === Role.USER) {
        return <div className="whitespace-pre-wrap break-words">{message.text}</div>;
    }
     if (message.text) {
        const html = marked.parse(message.text, { gfm: true, breaks: true });
        return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />;
     }
     return null;
  }
  
  const renderFile = () => {
    if (!message.file) return null;
    
    if (message.file.type.startsWith('image/')) {
        return (
            <div className="mt-2">
              <img src={message.file.url} alt="User upload" className="max-w-xs rounded-lg border border-white/10" />
            </div>
        );
    }
    
    if (message.file.type.startsWith('video/')) {
        return (
             <div className="mt-2">
                <video src={message.file.url} controls className="max-w-xs rounded-lg border border-white/10" />
             </div>
        );
    }
    
    if (message.file.type.startsWith('audio/')) {
        return (
             <div className="mt-2">
                <audio src={message.file.url} controls className="w-full max-w-xs" />
             </div>
        );
    }
    
    return null;
  }
  
  // Loading skeleton
  if (!message.text && message.role === Role.MODEL && !message.error && !message.actionCard) {
      return (
        <div className="flex items-start space-x-4 p-4 my-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center filter drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
             <MalcolmIcon className="h-8 w-8" />
          </div>
          <div className="flex-1 overflow-hidden p-4 rounded-xl shadow-lg bg-gradient-to-br from-slate-800/40 to-slate-900/20 rounded-bl-none border border-slate-700/30">
            <p className="font-semibold text-purple-300">Malcolm AI</p>
             <ThinkingLoader />
          </div>
        </div>
      );
  }

  const messageWrapperClasses = `group flex items-start space-x-4 p-4 my-2 ${isUserModel ? 'flex-row-reverse space-x-reverse' : ''}`;

  return (
    <div className={messageWrapperClasses}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center filter ${isUserModel ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'}`}>
        {isUserModel ? (
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center ring-2 ring-indigo-400/50">
            <UserIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
        ) : (
             <MalcolmIcon className="h-8 w-8" />
        )}
      </div>
      
      <div className={`flex-1 overflow-hidden p-4 rounded-xl shadow-lg ${isUserModel 
          ? 'bg-gradient-to-br from-indigo-700/40 to-indigo-800/20 rounded-br-none border border-indigo-500/30 text-slate-100' 
          : 'bg-gradient-to-br from-slate-800/40 to-slate-900/20 rounded-bl-none border border-slate-700/30'}`
      }>
        <p className={`font-semibold ${isUserModel ? 'text-indigo-300' : 'text-purple-300'}`}>{isUserModel ? 'You' : 'Malcolm AI'}</p>
        {renderFile()}
        <div className="prose prose-sm prose-slate dark:prose-invert prose-p:text-slate-300 dark:prose-p:text-slate-200 max-w-none pt-1">
           {renderContent()}
        </div>
        {!isUserModel && <ActionCard card={message.actionCard} />}
        {!isUserModel && isLastMessage && !isLoading && (
            <div className="pt-2 -mb-2 -ml-2">
                <button 
                    onClick={message.error ? onRetry : onRegenerate}
                    className="p-1.5 rounded-full text-slate-400 hover:text-purple-300 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    aria-label={message.error ? "Retry generation" : "Regenerate response"}
                >
                    <RefreshCwIcon className="h-4 w-4" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
