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

      const result = response.data.data || response.data;
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
    <div className="h-screen bg-slate-950 flex flex-col font-['Inter']">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white mb-1 tracking-tight font-['Outfit']">
              Elite <span className="text-[#fca96d]">Coding Laboratory</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] font-['Outfit']"> High-Performance Cloud Execution Environment </p>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg font-['Outfit']">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Compiler Edge</span>
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
      <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 font-['Outfit']"
            >
              <Play className="w-4 h-4 fill-white" />
              {isRunning ? 'Executing...' : 'Run Integration'}
            </motion.button>

            <button
              onClick={handleSaveCode}
              className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
            >
              <Save className="w-4 h-4" />
              Store
            </button>

            <button
              onClick={handleLoadCode}
              className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
            >
              <Upload className="w-4 h-4" />
              Restore
            </button>

            <button
              onClick={handleResetCode}
              className="flex items-center gap-2 px-5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-rose-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              Revert
            </button>
          </div>

          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 font-['Outfit']">
            Active Engine: <span className="text-[#fca96d]">{selectedLanguage.name}</span>
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
      <div className="bg-slate-900 border-t border-slate-800 px-6 py-2 font-['Outfit']">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-4">
            <span>Powered by Judge0 Core</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>Monaco Enterprise Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#fca96d] font-['Outfit']">{user?.name}</span>
            <span className="text-slate-700">/</span>
            <span>{selectedLanguage.name}</span>
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

