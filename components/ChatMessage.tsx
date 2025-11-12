
import React, { useEffect, useRef, useState } from 'react';
import { Role, Message } from '../types';
import { MalcolmIcon, UserIcon, CopyIcon, CheckIcon } from './Icons';

// Make sure marked and hljs are available globally
declare const marked: any;
declare const hljs: any;

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
    const [isCopied, setIsCopied] = useState(false);
    const textToCopy = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        if (textToCopy.current) {
            navigator.clipboard.writeText(textToCopy.current.innerText).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return (
        <div className="relative group">
            <pre>
                <code ref={textToCopy} className={`language-${language}`}>
                    {code}
                </code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 bg-slate-700 rounded-md text-slate-300 hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-all"
            >
                {isCopied ? <CheckIcon className="h-4 w-4 text-green-400" /> : <CopyIcon className="h-4 w-4" />}
            </button>
        </div>
    );
};

const MemoizedCodeBlock = React.memo(CodeBlock);


export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUserModel = message.role === Role.USER;
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        if (!block.hasAttribute('data-highlighted')) {
             hljs.highlightElement(block as HTMLElement);
             block.setAttribute('data-highlighted', 'true');
        }
      });
    }
  }, [message.text]);

  const renderContent = () => {
    if (message.role === Role.USER) {
        return <div className="whitespace-pre-wrap break-words">{message.text}</div>;
    }
     if (message.text) {
        const html = marked.parse(message.text, { gfm: true, breaks: true });
        return <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />;
     }
     return <div className="h-5 w-2 animate-pulse bg-slate-400 rounded-full"></div>;
  }
  
  const renderFile = () => {
    if (!message.file) return null;
    
    if (message.file.type.startsWith('image/')) {
        return (
            <div className="mt-2">
              <img src={message.file.url} alt="User upload" className="max-w-xs rounded-lg border border-slate-200 dark:border-slate-700" />
            </div>
        );
    }
    
    if (message.file.type.startsWith('video/')) {
        return (
             <div className="mt-2">
                <video src={message.file.url} controls className="max-w-xs rounded-lg border border-slate-200 dark:border-slate-700" />
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
  if (!message.text && message.role === Role.MODEL) {
      return (
        <div className="flex items-start space-x-4 p-4">
          <div className="flex-shrink-0">
             <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/50">
                <MalcolmIcon className="h-6 w-6" />
             </div>
          </div>
          <div className="flex-1 overflow-hidden animate-pulse">
            <p className="font-semibold text-slate-700 dark:text-slate-200">Malcolm AI</p>
             <div className="pt-2 space-y-2">
                <div className="h-3 w-3/4 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <div className="h-3 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className={`flex items-start space-x-4 p-4`}>
      <div className="flex-shrink-0">
        {isUserModel ? (
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/50">
             <MalcolmIcon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-slate-700 dark:text-slate-200">{isUserModel ? 'You' : 'Malcolm AI'}</p>
        {renderFile()}
        <div className="prose prose-slate dark:prose-invert prose-p:text-slate-600 dark:prose-p:text-slate-300 max-w-none pt-1">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};