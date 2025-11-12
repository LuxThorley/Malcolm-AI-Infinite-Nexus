import React from 'react';
import { MalcolmIcon, SpeakerOnIcon, SpeakerOffIcon, MenuIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
    isTtsEnabled: boolean;
    onToggleTts: () => void;
    onToggleSidebar: () => void;
    conversationTitle: string;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isTtsEnabled, onToggleTts, onToggleSidebar, conversationTitle, theme, onToggleTheme }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                 <button onClick={onToggleSidebar} className="p-2 md:hidden rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Toggle sidebar">
                    <MenuIcon className="h-6 w-6"/>
                </button>
                <div className="flex items-center space-x-2">
                    <MalcolmIcon className="h-8 w-8 text-indigo-400 hidden sm:block" />
                    <h1 className="text-lg font-semibold tracking-wider text-slate-800 dark:text-slate-100 truncate">
                        {conversationTitle}
                    </h1>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                </button>
                <button
                    onClick={onToggleTts}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label={isTtsEnabled ? 'Disable voice response' : 'Enable voice response'}
                >
                    {isTtsEnabled ? <SpeakerOnIcon className="h-6 w-6" /> : <SpeakerOffIcon className="h-6 w-6" />}
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};