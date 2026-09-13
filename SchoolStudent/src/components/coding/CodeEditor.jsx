import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, RotateCcw, Sun, Moon, Type } from 'lucide-react';

export const CodeEditor = ({
  value,
  onChange,
  language = 'python',
  theme = 'vs-dark',
  onThemeChange,
  onReset,
  className = '',
  height = '100%'
}) => {
  const editorRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: "'Fira Code', 'Cascadia Code', Consolas, 'Courier New', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: language === 'python' ? 4 : 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      folding: true,
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      suggestOnTriggerCharacters: true
    });
  };

  const handleCopy = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cycleFontSize = () => {
    const sizes = [13, 14, 16, 18];
    const nextSize = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
    setFontSize(nextSize);
    if (editorRef.current) {
      editorRef.current.updateOptions({ fontSize: nextSize });
    }
  };

  return (
    <div className={`flex flex-col h-full border border-slate-300 rounded-xl overflow-hidden bg-slate-900 shadow-xs ${className}`}>
      {/* Editor Control Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 border-b border-slate-700 text-xs text-slate-300 select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            editor.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language === 'java' ? 'java' : language}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={cycleFontSize}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cycle Font Size"
          >
            <Type size={13} />
            <span className="text-[11px] font-mono">{fontSize}px</span>
          </button>

          {onThemeChange && (
            <button
              type="button"
              onClick={() => onThemeChange(theme === 'vs-dark' ? 'light' : 'vs-dark')}
              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'vs-dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
              title="Reset Code to Template"
            >
              <RotateCcw size={13} />
              <span className="text-[11px]">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 w-full min-h-[300px] overflow-hidden">
        <Editor
          height={height}
          language={language}
          value={value}
          onChange={onChange}
          theme={theme}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              <span className="animate-pulse">Loading Monaco Code Editor...</span>
            </div>
          }
          options={{
            automaticLayout: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            fontSize: fontSize,
            lineNumbers: 'on',
            roundedSelection: true,
            readOnly: false,
            cursorStyle: 'line'
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
