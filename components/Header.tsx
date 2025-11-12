import React from 'react';
import { MalcolmIcon, SpeakerOnIcon, SpeakerOffIcon, MenuIcon, SunIcon, MoonIcon, FileTextIcon, DownloadIcon, WandSparklesIcon } from './Icons';

interface HeaderProps {
    isTtsEnabled: boolean;
    onToggleTts: () => void;
    onToggleSidebar: () => void;
    conversationTitle: string;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    onSummarize: () => void;
    onExport: () => void;
    onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isTtsEnabled, onToggleTts, onToggleSidebar, conversationTitle, theme, onToggleTheme, onSummarize, onExport, onOpenCommandPalette }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 bg-slate-100/30 dark:bg-slate-950/30 backdrop-blur-lg border-b border-white/10 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
                 <button onClick={onToggleSidebar} className="p-2 md:hidden rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors" aria-label="Toggle sidebar">
                    <MenuIcon className="h-6 w-6"/>
                </button>
                <div className="flex items-center space-x-3">
                    <MalcolmIcon className="h-8 w-8 hidden sm:block" />
                    <h1 className="text-lg font-medium tracking-wide text-slate-800 dark:text-slate-100 truncate">
                        {conversationTitle}
                    </h1>
                </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
                 <button
                    onClick={onOpenCommandPalette}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    aria-label="Open command palette"
                >
                    <WandSparklesIcon className="h-5 w-5" />
                </button>
                 <button
                    onClick={onSummarize}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    aria-label="Summarize conversation"
                >
                    <FileTextIcon className="h-5 w-5" />
                </button>
                 <button
                    onClick={onExport}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    aria-label="Export conversation"
                >
                    <DownloadIcon className="h-5 w-5" />
                </button>
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                </button>
                <button
                    onClick={onToggleTts}
                    className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                    aria-label={isTtsEnabled ? 'Disable voice response' : 'Enable voice response'}
                >
                    {isTtsEnabled ? <SpeakerOnIcon className="h-5 w-5" /> : <SpeakerOffIcon className="h-5 w-5" />}
                </button>
            </div>
        </div>
      </div>
    </header>
  );
};