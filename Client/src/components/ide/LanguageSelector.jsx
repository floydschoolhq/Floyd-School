import React from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const LANGUAGES = [
    { id: 71, name: 'Python', icon: '🐍', extension: 'py' },
    { id: 63, name: 'JavaScript', icon: '🟨', extension: 'js' },
    { id: 98, name: 'HTML', icon: '🌐', extension: 'html' },
    { id: 99, name: 'CSS', icon: '🎨', extension: 'css' },
    { id: 50, name: 'C', icon: '🔧', extension: 'c' },
    { id: 54, name: 'C++', icon: '⚙️', extension: 'cpp' },
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
                    className="flex items-center gap-2 px-4 py-2 bg-surface-soft hover:bg-surface-el border border-surface-el rounded-xl text-text-main font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-sm"
                >
                    <span className="text-lg">{selected.icon}</span>
                    <span className="font-bold">{selected.name}</span>
                    <ChevronDown className={cn(
                        "w-4 h-4 transition-transform text-text-muted",
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
                        className="fixed bg-surface-base border border-surface-el rounded-2xl shadow-2xl z-[9999] max-h-96 overflow-y-auto p-1.5 transition-colors duration-500"
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
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left cursor-pointer hover:bg-surface-soft",
                                    lang.id === selectedLanguage
                                        ? "bg-accent-primary/10 text-accent-primary font-black border-l-4 border-accent-primary"
                                        : "text-text-muted hover:text-text-main"
                                )}
                            >
                                <span className="text-lg">{lang.icon}</span>
                                <div>
                                    <div className="font-bold text-xs uppercase tracking-wider">{lang.name}</div>
                                    <div className="text-[10px] font-medium opacity-60">.{lang.extension}</div>
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

