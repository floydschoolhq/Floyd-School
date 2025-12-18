import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import Split from 'react-split';
import { Play, Save, RotateCcw, Download, Upload, Settings } from 'lucide-react';
import { MonacoEditor } from '../../components/ide/MonacoEditor';
import { Terminal } from '../../components/ide/Terminal';
import { LanguageSelector, LANGUAGES } from '../../components/ide/LanguageSelector';
import { getTemplate } from '../../components/ide/CodeTemplates';
import { PortalContext } from '../../components/Context/PortalProvider';
import { useSocket } from '../../hooks/useSocket';
import api from '../../api/axios';

const CodingLabPage = () => {
  const { user } = useContext(PortalContext);
  const { isConnected } = useSocket(user?._id);

  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(getTemplate(LANGUAGES[0].id));
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stdin, setStdin] = useState('');

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setCode(getTemplate(language.id));
    setOutput([]);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput([
      { type: 'info', content: `Running ${selectedLanguage.name} code...` }
    ]);

    try {
      const response = await api.post('/code/execute', {
        sourceCode: code,
        languageId: selectedLanguage.id,
        stdin: stdin
      });

      const result = response.data;
      const newOutput = [
        { type: 'info', content: `Execution completed in ${result.time}s` }
      ];

      if (result.stdout) {
        newOutput.push({ type: 'output', content: '--- Output ---' });
        newOutput.push({ type: 'output', content: result.stdout });
      }

      if (result.stderr) {
        newOutput.push({ type: 'error', content: '--- Errors ---' });
        newOutput.push({ type: 'error', content: result.stderr });
      }

      if (result.compile_output) {
        newOutput.push({ type: 'error', content: '--- Compilation Output ---' });
        newOutput.push({ type: 'error', content: result.compile_output });
      }

      if (result.status.description !== 'Accepted') {
        newOutput.push({
          type: 'error',
          content: `Status: ${result.status.description}`
        });
      } else {
        newOutput.push({ type: 'success', content: 'Execution successful!' });
      }

      setOutput(newOutput);
    } catch (error) {
      setOutput([
        { type: 'error', content: 'Failed to execute code' },
        { type: 'error', content: error.response?.data?.message || error.message }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    const codeData = {
      language: selectedLanguage.name,
      code: code,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`code_${selectedLanguage.id}`, JSON.stringify(codeData));
    setOutput([{ type: 'success', content: 'Code saved successfully!' }]);
  };

  const handleLoadCode = () => {
    const savedCode = localStorage.getItem(`code_${selectedLanguage.id}`);
    if (savedCode) {
      const codeData = JSON.parse(savedCode);
      setCode(codeData.code);
      setOutput([{ type: 'success', content: 'Code loaded successfully!' }]);
    } else {
      setOutput([{ type: 'info', content: 'No saved code found for this language.' }]);
    }
  };

  const handleResetCode = () => {
    setCode(getTemplate(selectedLanguage.id));
    setOutput([{ type: 'info', content: 'Code reset to template.' }]);
  };

  const handleClearOutput = () => {
    setOutput([]);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Cloud-Based Coding Lab
            </h1>
            <p className="text-sm text-slate-400">
              Write, compile, and execute code in 12+ languages
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">Live</span>
              </div>
            )}
            <LanguageSelector
              selectedLanguage={selectedLanguage.id}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run Code'}
            </motion.button>

            <button
              onClick={handleSaveCode}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

            <button
              onClick={handleLoadCode}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              Load
            </button>

            <button
              onClick={handleResetCode}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>

          <div className="text-sm text-slate-400">
            Language: <span className="text-sky-400 font-semibold">{selectedLanguage.name}</span>
          </div>
        </div>
      </div>

      {/* Editor and Terminal Split View */}
      <div className="flex-1 overflow-hidden">
        <Split
          direction="vertical"
          sizes={[65, 35]}
          minSize={200}
          gutterSize={8}
          className="flex flex-col h-full"
          style={{ height: '100%' }}
        >
          {/* Code Editor */}
          <div className="bg-slate-950 overflow-hidden">
            <MonacoEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage.extension}
              theme="vs-dark"
            />
          </div>

          {/* Terminal/Output */}
          <div className="bg-slate-950">
            <Terminal
              output={output}
              onClear={handleClearOutput}
              isRunning={isRunning}
            />
          </div>
        </Split>
      </div>

      {/* Footer */}
      <div className="bg-slate-900/60 backdrop-blur-sm border-t border-slate-800 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            Powered by Judge0 API • Monaco Editor
          </div>
          <div>
            {user?.name} • {selectedLanguage.name}
          </div>
        </div>
      </div>

      {/* Custom Split Gutter Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
                .gutter {
                    background-color: #1e293b;
                    background-repeat: no-repeat;
                    background-position: 50%;
                }

                .gutter:hover {
                    background-color: #334155;
                }

                .gutter.gutter-vertical {
                    cursor: row-resize;
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
                }
            `}} />
    </div>
  );
};

export default CodingLabPage;

