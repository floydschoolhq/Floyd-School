import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const LANGUAGES = [
  { id: 71, name: 'Python', icon: '🐍', extension: 'python', version: '3.8.1', key: 'python' },
  { id: 63, name: 'JavaScript', icon: '🟨', extension: 'javascript', version: 'Node.js 12.14', key: 'javascript' },
  { id: 54, name: 'C++', icon: '⚙️', extension: 'cpp', version: 'GCC 9.2.0', key: 'cpp' },
  { id: 50, name: 'C', icon: '🔧', extension: 'c', version: 'GCC 9.2.0', key: 'c' },
  { id: 62, name: 'Java', icon: '☕', extension: 'java', version: 'OpenJDK 13', key: 'java' },
  { id: 98, name: 'HTML5', icon: '🌐', extension: 'html', version: 'Live DOM', key: 'html' },
  { id: 99, name: 'CSS3', icon: '🎨', extension: 'css', version: 'Live Engine', key: 'css' },
];

export const LanguageSelector = ({ selectedLanguageId, onLanguageChange, allowWeb = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableLanguages = allowWeb
    ? LANGUAGES
    : LANGUAGES.filter(l => l.id !== 98 && l.id !== 99);

  const currentLang = availableLanguages.find(l => l.id === Number(selectedLanguageId)) || availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
      >
        <span>{currentLang.icon}</span>
        <span>{currentLang.name}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 rounded-lg bg-white border border-slate-200 shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            Select Language
          </div>
          {availableLanguages.map((lang) => {
            const isSelected = lang.id === currentLang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  onLanguageChange(lang);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 text-slate-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{lang.icon}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && <Check size={14} className="text-slate-900" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
