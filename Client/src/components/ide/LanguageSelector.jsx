import React from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const LANGUAGES = [
    { id: 63, name: 'JavaScript', icon: '🟨', extension: 'js' },
    { id: 71, name: 'Python', icon: '🐍', extension: 'py' },
    { id: 62, name: 'Java', icon: '☕', extension: 'java' },
    { id: 54, name: 'C++', icon: '⚙️', extension: 'cpp' },
    { id: 50, name: 'C', icon: '🔧', extension: 'c' },
    { id: 51, name: 'C#', icon: '💜', extension: 'cs' },
    { id: 72, name: 'Ruby', icon: '💎', extension: 'rb' },
    { id: 68, name: 'PHP', icon: '🐘', extension: 'php' },
    { id: 60, name: 'Go', icon: '🔵', extension: 'go' },
    { id: 78, name: 'Kotlin', icon: '🟣', extension: 'kt' },
    { id: 74, name: 'TypeScript', icon: '🔷', extension: 'ts' },
    { id: 83, name: 'Swift', icon: '🍎', extension: 'swift' },
];

export const LanguageSelector = ({ selectedLanguage, onLanguageChange, className }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [buttonRect, setButtonRect] = React.useState(null);
    const buttonRef = React.useRef(null);
    const selected = LANGUAGES.find(lang => lang.id === selectedLanguage) || LANGUAGES[0];

    const handleToggle = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonRect(rect);
        }
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
        setButtonRect(null);
    };

    return (
        <>
            <div className={cn("relative", className)}>
                <button
                    ref={buttonRef}
                    onClick={handleToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white transition-colors"
                >
                    <span className="text-lg">{selected.icon}</span>
                    <span className="font-medium">{selected.name}</span>
                    <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        isOpen && "rotate-180"
                    )} />
                </button>
            </div>

            {isOpen && buttonRect && ReactDOM.createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998]"
                        onClick={handleClose}
                    />
                    <div
                        className="fixed bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-[9999] max-h-96 overflow-y-auto"
                        style={{
                            top: `${buttonRect.bottom + 8}px`,
                            right: `${window.innerWidth - buttonRect.right}px`,
                            width: '256px'
                        }}
                    >
                        {LANGUAGES.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => {
                                    onLanguageChange(lang);
                                    handleClose();
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left",
                                    lang.id === selectedLanguage && "bg-slate-800 border-l-2 border-sky-500"
                                )}
                            >
                                <span className="text-xl">{lang.icon}</span>
                                <div>
                                    <div className="font-medium text-white">{lang.name}</div>
                                    <div className="text-xs text-slate-400">.{lang.extension}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </>,
                document.body
            )}
        </>
    );
};

export { LANGUAGES };