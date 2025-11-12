import React, { useState, useEffect, useRef } from 'react';
import { CommandAction } from '../types';
import { SearchIcon } from './Icons';

interface CommandPaletteProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  actions: CommandAction[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, actions }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  const filteredActions = actions.filter(
    (action) =>
      action.name.toLowerCase().includes(query.toLowerCase()) ||
      action.description.toLowerCase().includes(query.toLowerCase())
  );
  
  const groupedActions = filteredActions.reduce((acc, action) => {
    const section = action.section;
    if (!acc[section]) {
        acc[section] = [];
    }
    acc[section].push(action);
    return acc;
  }, {} as Record<string, CommandAction[]>);
  
  const flattenedActions = [
    ...(groupedActions['Suggestions'] || []),
    ...(groupedActions['Actions'] || []),
    ...(groupedActions['Navigation'] || []),
  ];

  useEffect(() => {
      if (selectedIndex >= 0 && selectedIndex < flattenedActions.length) {
          const item = resultsRef.current?.querySelector(`[data-index='${selectedIndex}']`);
          item?.scrollIntoView({ block: 'nearest' });
      }
  }, [selectedIndex, flattenedActions.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flattenedActions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flattenedActions[selectedIndex]) {
        flattenedActions[selectedIndex].action();
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setIsOpen(false)}
      ></div>
      <div
        className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[90vw] max-w-xl bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50 flex flex-col overflow-hidden animate-fade-in-down"
        onKeyDown={handleKeyDown}
      >
        <div className="relative p-2 border-b border-white/10">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="What do you need?"
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 py-2 pl-10 pr-4 focus:outline-none"
          />
        </div>
        <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto p-2">
          {Object.entries(groupedActions).length > 0 ? (
            Object.entries(groupedActions).map(([section, sectionActions]) => (
                 <div key={section}>
                    <h3 className="px-2 pt-2 pb-1 text-xs font-semibold text-purple-300 tracking-wider">{section}</h3>
                    {sectionActions.map((action) => {
                        const index = flattenedActions.findIndex(a => a.id === action.id);
                        return (
                          <div
                            key={action.id}
                            data-index={index}
                            onClick={() => {
                              action.action();
                              setIsOpen(false);
                            }}
                            className={`p-3 flex items-center space-x-3 rounded-lg cursor-pointer transition-colors ${
                              selectedIndex === index
                                ? 'bg-white/10'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <action.icon className="h-5 w-5 text-slate-300" />
                            <div>
                              <p className="text-slate-100">{action.name}</p>
                              <p className="text-xs text-slate-400">{action.description}</p>
                            </div>
                          </div>
                        )
                    })}
                 </div>
            ))
          ) : (
            <p className="p-4 text-center text-slate-400">No results found.</p>
          )}
        </div>
      </div>
    </>
  );
};
