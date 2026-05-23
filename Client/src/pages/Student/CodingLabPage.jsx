import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import Split from 'react-split';
import { Play, Save, RotateCcw, Download, Upload, Settings, Lock } from 'lucide-react';
import { MonacoEditor } from '../../components/ide/MonacoEditor';
import { Terminal } from '../../components/ide/Terminal';
import { LanguageSelector, LANGUAGES } from '../../components/ide/LanguageSelector';
import { getTemplate } from '../../components/ide/CodeTemplates';
import { PortalContext } from '../../contexts/PortalProvider';
import { useSocket } from '../../contexts/SocketProvider';
import api from '../../api/axios';

const CodingLabPage = () => {
  const { user } = useContext(PortalContext);
  const { isConnected } = useSocket();
  const { theme } = useTheme();

  const isClassroomUser = user?.isClassroomAccess === true;
  // Classroom users still need admin approval for labs
  const canAccessLabs = user?.permissions?.canAccessLabs;

  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(getTemplate(LANGUAGES[0].id));
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stdin, setStdin] = useState('');
  const [requestingAccess, setRequestingAccess] = useState(false);

  useEffect(() => {
    if (!user?._id || !canAccessLabs) return;

    let isActive = true;

    const loadSavedCode = async () => {
      try {
        const response = await api.get(`/code-snippets/${selectedLanguage.id}`);
        if (!isActive) return;

        const savedSnippet = response.data?.data || response.data?.snippet || response.data;
        if (savedSnippet && typeof savedSnippet.code === 'string') {
          setCode(savedSnippet.code);
        } else {
          setCode(getTemplate(selectedLanguage.id));
        }
      } catch (error) {
        if (isActive) {
          setCode(getTemplate(selectedLanguage.id));
        }
      }
    };

    loadSavedCode();

    return () => {
      isActive = false;
    };
  }, [selectedLanguage.id, user?._id, canAccessLabs]);

  const handleRequestAccess = async () => {
    setRequestingAccess(true);
    try {
      await api.post('/students/request-access', {
        permission: 'canAccessLabs',
        message: 'Requesting access to coding laboratory'
      });
      alert('Access request submitted! An administrator will review your request shortly.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit access request');
    } finally {
      setRequestingAccess(false);
    }
  };

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

  const handleSaveCode = async () => {
    try {
      const response = await api.put(`/code-snippets/${selectedLanguage.id}`, {
        code,
        languageName: selectedLanguage.name
      });

      const savedSnippet = response.data?.data || response.data;
      setOutput([{ type: 'success', content: `${savedSnippet.languageName || selectedLanguage.name} saved to cloud successfully!` }]);
    } catch (error) {
      setOutput([
        { type: 'error', content: 'Failed to save code to cloud' },
        { type: 'error', content: error.response?.data?.message || error.message }
      ]);
    }
  };

  const handleLoadCode = async () => {
    try {
      const response = await api.get(`/code-snippets/${selectedLanguage.id}`);
      const savedSnippet = response.data?.data || response.data;

      if (savedSnippet && typeof savedSnippet.code === 'string') {
        setCode(savedSnippet.code);
        setOutput([{ type: 'success', content: 'Code loaded from cloud successfully!' }]);
      } else {
        setOutput([{ type: 'info', content: 'No saved code found for this language.' }]);
      }
    } catch (error) {
      setOutput([
        { type: 'error', content: 'Failed to load code from cloud' },
        { type: 'error', content: error.response?.data?.message || error.message }
      ]);
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
    <div className="h-screen bg-surface-base text-text-main flex flex-col relative transition-colors duration-500">
      {/* Access Lock Overlay */}
      {!canAccessLabs && (
        <div className="absolute inset-0 z-[100] bg-surface-base/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-accent-primary rounded-[2.5rem] flex items-center justify-center mb-8 shadow-lg shadow-accent-primary/20">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-black text-text-main mb-3 tracking-tighter">
            Laboratory <span className="text-accent-primary">Locked</span>
          </h2>
          <p className="text-text-muted max-w-sm font-medium mb-10 text-sm leading-relaxed">
            The coding environment is currently restricted. <br />
            Please request official access to the laboratory to begin your development sessions.
          </p>
          <button
            onClick={handleRequestAccess}
            disabled={requestingAccess}
            className="px-12 py-6 bg-accent-primary text-white text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-accent-primary/80 transition-all shadow-2xl shadow-accent-primary/20 disabled:opacity-50 cursor-pointer"
          >
            {requestingAccess ? 'Submitting...' : 'Request Lab Access'}
          </button>
        </div>
      )}
      {/* Header */}
      <div className="bg-surface-soft border-b border-surface-el px-6 py-4 transition-colors duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-text-main mb-1 tracking-tight">
              Elite <span className="text-accent-primary">Coding Laboratory</span>
            </h1>
            <p className="text-[13px] font-black text-text-muted uppercase tracking-[0.2em]"> High-Performance Cloud Execution Environment </p>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[13px] font-black text-emerald-500 uppercase tracking-widest">Compiler Edge</span>
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
      <div className="bg-surface-soft/50 backdrop-blur-md border-b border-surface-el px-6 py-3 transition-colors duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-surface-el disabled:text-text-muted disabled:cursor-not-allowed text-white rounded-xl font-bold text-base uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              {isRunning ? 'Executing...' : 'Run Integration'}
            </motion.button>

            <button
              onClick={handleSaveCode}
              className="flex items-center gap-2 px-5 py-2 bg-surface-el hover:bg-surface-el/80 text-text-main rounded-xl font-bold text-base uppercase tracking-widest transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Store
            </button>

            <button
              onClick={handleLoadCode}
              className="flex items-center gap-2 px-5 py-2 bg-surface-el hover:bg-surface-el/80 text-text-main rounded-xl font-bold text-base uppercase tracking-widest transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Restore
            </button>

            <button
              onClick={handleResetCode}
              className="flex items-center gap-2 px-5 py-2 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-xl font-bold text-base uppercase tracking-widest transition-all border border-accent-primary/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Revert
            </button>
          </div>

          <div className="text-[13px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
            Active Engine: <span className="text-accent-primary">{selectedLanguage.name}</span>
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
          <div className="bg-surface-base overflow-hidden h-full">
            <MonacoEditor
              value={code}
              onChange={setCode}
              language={selectedLanguage.extension}
              theme={theme === 'modern' ? 'vs' : 'vs-dark'}
            />
          </div>

          {/* Terminal/Output */}
          <div className="bg-surface-base border-t border-surface-el h-full">
            <Terminal
              output={output}
              onClear={handleClearOutput}
              isRunning={isRunning}
            />
          </div>
        </Split>
      </div>

      {/* Footer */}
      <div className="bg-surface-soft border-t border-surface-el px-6 py-2 transition-colors duration-500">
        <div className="flex items-center justify-between text-[13px] font-black uppercase tracking-widest text-text-muted">
          <div className="flex items-center gap-4">
            <span>Powered by Judge0 Core</span>
            <span className="w-1 h-1 bg-surface-el rounded-full" />
            <span>Monaco Enterprise Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent-primary">{user?.name}</span>
            <span className="text-text-muted">/</span>
            <span>{selectedLanguage.name}</span>
          </div>
        </div>
      </div>

      {/* Custom Split Gutter Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
                .gutter {
                    background-color: var(--surface-el);
                    background-repeat: no-repeat;
                    background-position: 50%;
                }

                .gutter:hover {
                    background-color: var(--accent-primary);
                    opacity: 0.8;
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


