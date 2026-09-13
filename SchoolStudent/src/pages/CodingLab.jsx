import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CodeEditor from '../components/coding/CodeEditor';
import LanguageSelector, { LANGUAGES } from '../components/coding/LanguageSelector';
import TestCasesPanel from '../components/coding/TestCasesPanel';
import SubmissionModal from '../components/coding/SubmissionModal';
import {
  Code,
  CheckCircle2,
  Clock,
  Award,
  Search,
  ArrowLeft,
  Play,
  Send,
  Sparkles,
  BookOpen,
  ChevronRight,
  Terminal,
  Layers,
  Filter
} from 'lucide-react';

const CATEGORIES = [
  'All Topics',
  'Variables',
  'Conditions',
  'Loops',
  'Functions',
  'Arrays',
  'Strings',
  'Basic Problem Solving'
];

const DIFFICULTIES = ['All Difficulties', 'Beginner', 'Intermediate', 'Advanced'];

export const CodingLab = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dashboard state
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ totalProblems: 0, solved: 0, attempted: 0, points: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Topics');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');

  // Problem Workspace state
  const [currentProblem, setCurrentProblem] = useState(null);
  const [problemLoading, setProblemLoading] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState('description');
  const [pastSubmissions, setPastSubmissions] = useState([]);

  // Editor & Execution state
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [code, setCode] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [customInput, setCustomInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResults, setRunResults] = useState(null);
  const [rawOutput, setRawOutput] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Free Playground mode state
  const [isPlaygroundMode, setIsPlaygroundMode] = useState(false);

  // Load problem list on mount
  useEffect(() => {
    fetchProblems();
  }, []);

  // Load specific problem when slug changes
  useEffect(() => {
    if (slug) {
      fetchProblemDetails(slug);
    } else {
      setCurrentProblem(null);
    }
  }, [slug]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/coding-lab/problems');
      if (res.data.success) {
        setProblems(res.data.data || []);
        setStats(res.data.stats || { totalProblems: 0, solved: 0, attempted: 0, points: 0 });
      }
    } catch (err) {
      console.error('Failed to load coding problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProblemDetails = async (problemSlug) => {
    try {
      setProblemLoading(true);
      const res = await api.get('/coding-lab/problems/' + problemSlug);
      if (res.data.success) {
        const prob = res.data.data;
        setCurrentProblem(prob);

        const defaultLang = LANGUAGES[0];
        setSelectedLanguage(defaultLang);

        if (prob.latestCode && prob.latestLanguageId) {
          const matchedLang = LANGUAGES.find(l => l.id === prob.latestLanguageId) || defaultLang;
          setSelectedLanguage(matchedLang);
          setCode(prob.latestCode);
        } else {
          const starter = prob.starterTemplates?.[defaultLang.key] || '# Write your solution below\n';
          setCode(starter);
        }

        setRunResults(null);
        setRawOutput(null);
        fetchPastSubmissions(prob._id);
      }
    } catch (err) {
      console.error('Failed to load problem details:', err);
    } finally {
      setProblemLoading(false);
    }
  };

  const fetchPastSubmissions = async (problemId) => {
    try {
      const res = await api.get('/coding-lab/submissions/' + problemId);
      if (res.data.success) {
        setPastSubmissions(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch past submissions:', err);
    }
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    if (currentProblem?.starterTemplates?.[newLang.key]) {
      setCode(currentProblem.starterTemplates[newLang.key]);
    } else {
      setCode(newLang.key === 'python' ? '# Write your solution here\n' : '// Write your solution here\n');
    }
  };

  const handleResetCode = () => {
    if (currentProblem?.starterTemplates?.[selectedLanguage.key]) {
      setCode(currentProblem.starterTemplates[selectedLanguage.key]);
    } else {
      setCode('');
    }
  };

  const handleRunCode = async () => {
    if (!code || isRunning) return;

    try {
      setIsRunning(true);
      setRunResults(null);
      setRawOutput(null);

      const payload = {
        sourceCode: code,
        languageId: selectedLanguage.id,
        testCases: customInput.trim() ? [] : currentProblem?.sampleTestCases || [],
        customInput: customInput.trim() ? customInput : undefined
      };

      const res = await api.post('/coding-lab/run', payload);
      if (res.data.success) {
        if (customInput.trim()) {
          setRawOutput(res.data.data);
        } else {
          setRunResults(res.data.data.results || []);
          setRawOutput({
            stdout: res.data.data.results?.map(r => 'Case ' + r.testCaseIndex + ': ' + r.actualOutput).join('\n'),
            status: res.data.data.allPassed ? 'All Sample Cases Passed' : 'Some Cases Failed'
          });
        }
      }
    } catch (err) {
      setRawOutput({
        stderr: err.response?.data?.message || err.message || 'Execution failed',
        status: 'Error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!code || !currentProblem || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/coding-lab/submit', {
        problemId: currentProblem._id,
        sourceCode: code,
        languageId: selectedLanguage.id,
        languageName: selectedLanguage.name
      });

      if (res.data.success) {
        setSubmissionResult(res.data.data);
        setShowSubmissionModal(true);
        fetchPastSubmissions(currentProblem._id);
        fetchProblems();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed. Please check your code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextProblem = () => {
    setShowSubmissionModal(false);
    if (!currentProblem || problems.length === 0) return;
    const currentIndex = problems.findIndex(p => p.slug === currentProblem.slug);
    if (currentIndex !== -1 && currentIndex + 1 < problems.length) {
      const nextSlug = problems[currentIndex + 1].slug;
      navigate('/coding-lab/' + nextSlug);
    } else {
      navigate('/coding-lab');
    }
  };

  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Topics' || p.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All Difficulties' || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // ==========================================
  // RENDER 1: PROBLEM SOLVING WORKSPACE
  // ==========================================
  if (slug && currentProblem) {
    return (
      <div className="space-y-4 pb-12">
        {/* Workspace Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/coding-lab')}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Return to Problem List"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {currentProblem.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className={`text-[11px] font-bold px-2 py-0.2 rounded-full ${
                  currentProblem.difficulty === 'Beginner'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentProblem.difficulty === 'Intermediate'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {currentProblem.difficulty}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {currentProblem.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
              <Award size={14} className="text-amber-500" />
              <span>{currentProblem.points || 100} Points</span>
            </div>

            {currentProblem.isSolved && (
              <div className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
                <CheckCircle2 size={13} />
                <span>Solved</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Split Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Problem Description & Test Case Info (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col min-h-[580px]">
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setWorkspaceTab('description')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors cursor-pointer ${
                  workspaceTab === 'description'
                    ? 'bg-white text-slate-900 border-b-2 border-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Problem Statement
              </button>
              <button
                type="button"
                onClick={() => setWorkspaceTab('submissions')}
                className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors cursor-pointer ${
                  workspaceTab === 'submissions'
                    ? 'bg-white text-slate-900 border-b-2 border-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Submissions ({pastSubmissions.length})
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto max-h-[600px] text-xs leading-relaxed space-y-4">
              {workspaceTab === 'description' ? (
                <>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
                    <div className="text-slate-700 whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {currentProblem.description}
                    </div>
                  </div>

                  {currentProblem.inputFormat && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Input Format</h4>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                        {currentProblem.inputFormat}
                      </p>
                    </div>
                  )}

                  {currentProblem.outputFormat && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Output Format</h4>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                        {currentProblem.outputFormat}
                      </p>
                    </div>
                  )}

                  {currentProblem.constraints && (
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Constraints</h4>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                        {currentProblem.constraints}
                      </p>
                    </div>
                  )}

                  {currentProblem.sampleTestCases?.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-slate-900">Sample Test Cases</h4>
                      {currentProblem.sampleTestCases.map((tc, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                          <div className="font-semibold text-slate-800">Sample {idx + 1}</div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Input</span>
                            <pre className="font-mono text-[11px] text-slate-800 bg-white p-1.5 rounded border border-slate-200">
                              {tc.input || '<no input>'}
                            </pre>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Expected Output</span>
                            <pre className="font-mono text-[11px] text-slate-800 bg-white p-1.5 rounded border border-slate-200">
                              {tc.expectedOutput}
                            </pre>
                          </div>
                          {tc.explanation && (
                            <p className="text-[11px] text-slate-500 italic">
                              {tc.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-2.5">
                  {pastSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Code size={32} className="mx-auto mb-2 opacity-50" />
                      <p>No submissions recorded yet for this challenge.</p>
                      <p className="text-[11px] mt-1">Submit your code to see your historical evaluations here.</p>
                    </div>
                  ) : (
                    pastSubmissions.map((sub) => (
                      <div
                        key={sub._id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              sub.status === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {sub.status}
                            </span>
                            <span className="font-semibold text-slate-800">{sub.languageName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-slate-900 block text-xs">
                            {sub.passedTestCases}/{sub.totalTestCases} Passed
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {sub.executionTime}s
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Editor & Execution Runner (7 cols) */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <LanguageSelector
                selectedLanguageId={selectedLanguage.id}
                onLanguageChange={handleLanguageChange}
              />

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                  title="Test solution against sample test cases"
                >
                  <Play size={13} className="fill-slate-800" />
                  <span>{isRunning ? 'Testing...' : 'Run Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitSolution}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                  title="Submit solution for full evaluation"
                >
                  <Send size={13} />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
                </button>
              </div>
            </div>

            <div className="h-[380px] w-full">
              <CodeEditor
                value={code}
                onChange={(val) => setCode(val || '')}
                language={selectedLanguage.extension}
                theme={editorTheme}
                onThemeChange={setEditorTheme}
                onReset={handleResetCode}
              />
            </div>

            <TestCasesPanel
              testCases={currentProblem.sampleTestCases}
              results={runResults}
              customInput={customInput}
              onCustomInputChange={setCustomInput}
              isRunning={isRunning}
              rawOutput={rawOutput}
            />
          </div>
        </div>

        <SubmissionModal
          isOpen={showSubmissionModal}
          onClose={() => setShowSubmissionModal(false)}
          submissionResult={submissionResult}
          problemTitle={currentProblem.title}
          onNextProblem={handleNextProblem}
        />
      </div>
    );
  }

  // ==========================================
  // RENDER 2: FREE PLAYGROUND SCRATCHPAD MODE
  // ==========================================
  if (isPlaygroundMode) {
    return (
      <div className="space-y-4 pb-12">
        <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaygroundMode(false)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open Sandbox</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">Coding Lab Playground</h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <LanguageSelector
              selectedLanguageId={selectedLanguage.id}
              onLanguageChange={handleLanguageChange}
              allowWeb={true}
            />

            <button
              type="button"
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Play size={13} className="fill-white" />
              <span>{isRunning ? 'Running...' : 'Execute'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 h-[520px]">
            <CodeEditor
              value={code}
              onChange={(val) => setCode(val || '')}
              language={selectedLanguage.extension}
              theme={editorTheme}
              onThemeChange={setEditorTheme}
              onReset={() => setCode('')}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Standard Input (stdin)</label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type runtime input here..."
                rows={4}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-300 font-mono text-xs text-slate-800"
              />
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-2xs flex-1 flex flex-col text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 font-sans">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Output Terminal</span>
                {rawOutput?.time && (
                  <span className="text-[10px] text-slate-500">{rawOutput.time}s</span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto whitespace-pre-wrap">
                {rawOutput ? (
                  <>
                    {rawOutput.stdout && <div className="text-emerald-400">{rawOutput.stdout}</div>}
                    {rawOutput.stderr && <div className="text-red-400 mt-1">{rawOutput.stderr}</div>}
                    {rawOutput.compile_output && <div className="text-red-400 mt-1">{rawOutput.compile_output}</div>}
                    {!rawOutput.stdout && !rawOutput.stderr && !rawOutput.compile_output && (
                      <span className="text-slate-500 italic">Code executed with no output.</span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-500 italic">Click Execute to run your code online.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 3: CODING LAB DASHBOARD
  // ==========================================
  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold tracking-wide text-indigo-200 uppercase">
            <Sparkles size={12} className="text-amber-400" />
            <span>Floyd School Coding Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Master Programming Hands-On
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Solve curriculum-aligned challenges in Python, JavaScript, C++, C, or Java. Run test cases in real-time, get instant feedback, and sharpen your algorithmic skills.
          </p>

          <div className="pt-2 flex items-center space-x-3">
            <button
              onClick={() => {
                setIsPlaygroundMode(true);
                setCode('print("Hello from Floyd Coding Playground!")\n');
              }}
              className="px-4 py-2 bg-white text-slate-900 rounded-xl font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Terminal size={14} />
              <span>Open Free Playground</span>
            </button>
          </div>
        </div>

        <Code size={180} className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none" />
      </div>

      {/* Telemetry Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Solved</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {stats.solved} <span className="text-xs font-normal text-slate-400">/ {stats.totalProblems}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: (stats.totalProblems > 0 ? (stats.solved / stats.totalProblems) * 100 : 0) + '%' }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Points</span>
            <Award size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {stats.points} <span className="text-xs font-normal text-slate-400">XP</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Earned through accepted submissions</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Attempted</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {stats.attempted}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Challenges in progress</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available</span>
            <Layers size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {stats.totalProblems}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Curriculum coding problems</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search challenges by name or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 pb-0.5">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Problems Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs animate-pulse">
          Loading coding challenges...
        </div>
      ) : filteredProblems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
          <BookOpen size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No challenges matched your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((prob) => {
            const isSolved = prob.status === 'Solved';
            const isAttempted = prob.status === 'Attempted';

            return (
              <div
                key={prob._id}
                onClick={() => navigate('/coding-lab/' + prob.slug)}
                className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-400 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {prob.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prob.difficulty === 'Beginner'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : prob.difficulty === 'Intermediate'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-snug">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {prob.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold text-slate-500">
                      {prob.points || 100} pts
                    </span>
                    {isSolved && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 size={13} />
                        <span>Solved</span>
                      </span>
                    )}
                    {isAttempted && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-amber-600 font-bold">
                        <Clock size={13} />
                        <span>Attempted</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                    <span>Solve</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CodingLab;
