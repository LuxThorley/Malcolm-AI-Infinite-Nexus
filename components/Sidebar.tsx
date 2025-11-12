import React from 'react';
import { Conversation } from '../types';
import { MalcolmIcon, PlusIcon, TrashIcon, MessageSquareIcon } from './Icons';

interface SidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onNewChat: () => void;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversationId, onNewChat, onSelectConversation, onDeleteConversation, isOpen, setIsOpen }) => {
    
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onDeleteConversation(id);
    }
    
    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-20 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`absolute top-0 left-0 h-full bg-slate-200/70 dark:bg-slate-800/70 backdrop-blur-lg border-r border-slate-300/50 dark:border-slate-700/50 w-64 flex flex-col transition-transform z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex-shrink-0`}>
                <div className="p-4 border-b border-slate-300/50 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <MalcolmIcon className="h-7 w-7 text-indigo-400" />
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">History</h2>
                    </div>
                    <button 
                        onClick={onNewChat} 
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700 transition-colors"
                        aria-label="New chat"
                    >
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {conversations.map(convo => (
                        <button
                            key={convo.id}
                            onClick={() => onSelectConversation(convo.id)}
                            className={`w-full text-left p-2.5 rounded-md text-sm transition-colors flex items-center justify-between group ${activeConversationId === convo.id ? 'bg-indigo-500/20 text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-slate-700/50'}`}
                        >
                           <div className="flex items-center space-x-3 overflow-hidden">
                                <MessageSquareIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{convo.title}</span>
                           </div>
                           <button 
                                onClick={(e) => handleDelete(e, convo.id)}
                                className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-400/50 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Delete conversation"
                           >
                                <TrashIcon className="h-4 w-4" />
                           </button>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    );
};