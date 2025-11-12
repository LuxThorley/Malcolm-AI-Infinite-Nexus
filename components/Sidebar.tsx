import React from 'react';
import { Conversation } from '../types';
import { MalcolmIcon, PlusIcon, TrashIcon, MessageSquareIcon, SearchIcon } from './Icons';

interface SidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onNewChat: () => void;
    onSelectConversation: (id: string) => void;
    onDeleteConversation: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ conversations, activeConversationId, onNewChat, onSelectConversation, onDeleteConversation, isOpen, setIsOpen, searchQuery, setSearchQuery }) => {
    
    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onDeleteConversation(id);
    }
    
    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-30 md:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
            <aside className={`absolute top-0 left-0 h-full bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-xl border-r border-white/10 dark:border-white/5 w-64 flex flex-col transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex-shrink-0`}>
                <div className="p-4 h-20 border-b border-white/10 dark:border-white/5 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-2">
                        <MalcolmIcon className="h-7 w-7" />
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">History</h2>
                    </div>
                    <button 
                        onClick={onNewChat} 
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                        aria-label="New chat"
                    >
                        <PlusIcon className="h-5 w-5" />
                    </button>
                </div>
                 <div className="p-2 border-b border-white/10 dark:border-white/5">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/10 dark:bg-black/20 rounded-md py-1.5 pl-8 pr-2 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                    </div>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {conversations.map(convo => (
                        <button
                            key={convo.id}
                            onClick={() => onSelectConversation(convo.id)}
                            className={`w-full text-left p-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group relative overflow-hidden ${activeConversationId === convo.id ? 'bg-white/10 dark:bg-white/5 shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-white/5'}`}
                        >
                           {activeConversationId === convo.id && <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-500 to-pink-500"></div>}
                           <div className="flex items-center space-x-3 overflow-hidden pl-2">
                                <MessageSquareIcon className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{convo.title}</span>
                           </div>
                           <button 
                                onClick={(e) => handleDelete(e, convo.id)}
                                className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-black/20 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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
