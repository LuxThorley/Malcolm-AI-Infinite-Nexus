
import React from 'react';
import { MalcolmIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <MalcolmIcon className="h-8 w-8 text-indigo-400" />
          <h1 className="text-xl font-bold tracking-wider text-slate-100">
            Malcolm <span className="font-light text-slate-300">AI</span>
          </h1>
        </div>
      </div>
    </header>
  );
};
