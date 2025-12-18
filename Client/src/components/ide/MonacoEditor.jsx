import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { cn } from '../../lib/utils';

export const MonacoEditor = ({
    value,
    onChange,
    language = 'javascript',
    theme = 'vs-dark',
    className
}) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;

        // Configure editor options
        editor.updateOptions({
            fontSize: 14,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
        });

        // Add custom keybindings
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            // Save functionality (can be customized)
            console.log('Save triggered');
        });
    };

    return (
        <div className={cn("h-full w-full", className)}>
            <Editor
                height="100%"
                language={language}
                value={value}
                onChange={onChange}
                theme={theme}
                onMount={handleEditorDidMount}
                options={{
                    selectOnLineNumbers: true,
                    roundedSelection: false,
                    readOnly: false,
                    cursorStyle: 'line',
                    automaticLayout: true,
                }}
            />
        </div>
    );
};
