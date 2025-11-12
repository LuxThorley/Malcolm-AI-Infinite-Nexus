
import React from 'react';
import { Role, Message } from '../types';
import { MalcolmIcon, UserIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUserModel = message.role === Role.USER;

  return (
    <div className={`flex items-start space-x-4 p-4 ${isUserModel ? '' : 'bg-slate-800/50 rounded-lg'}`}>
      <div className="flex-shrink-0">
        {isUserModel ? (
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
            <UserIcon className="h-5 w-5 text-slate-300" />
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center ring-1 ring-indigo-500/50">
             <MalcolmIcon className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-semibold text-slate-200">{isUserModel ? 'You' : 'Malcolm AI'}</p>
        <div className="prose prose-invert prose-p:text-slate-300 max-w-none whitespace-pre-wrap break-words">
           {message.text}
           {!message.text && message.role === Role.MODEL && (
              <div className="h-4 w-2 animate-pulse bg-slate-400 rounded-full"></div>
           )}
        </div>
      </div>
    </div>
  );
};
