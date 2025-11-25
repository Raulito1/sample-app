import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_JOURNEYS } from '../constants';
import { ArrowRight, Loader2, Globe, ChevronRight, PenTool, Command, Cpu, GitBranch, Layers, Shield, Zap, Settings, Sun, Moon, LayoutGrid, Lightbulb, Activity, Network, Search, FileJson } from 'lucide-react';
import { Journey } from '../types';

interface HeroProps {
  onGenerate: (topic: string) => void;
  onSelectSample: (journey: Journey) => void;
  onBuildManually: () => void;
  onViewDashboards: () => void;
  onViewInsights: () => void;
  onViewSessionReplay: () => void;
  isGenerating: boolean;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const Hero: React.FC<HeroProps> = ({ 
  onGenerate, 
  onSelectSample, 
  onBuildManually, 
  onViewDashboards, 
  onViewInsights,
  onViewSessionReplay,
  isGenerating,
  isDarkMode,
  toggleTheme
}) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [suggestions, setSuggestions] = useState<Journey[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  
  const settingsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (input.trim().length > 0) {
      const matches = SAMPLE_JOURNEYS.filter(j => 
        j.title.toLowerCase().includes(input.toLowerCase()) || 
        j.valueStreamName?.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveSuggestionIndex(-1);
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we have an active suggestion selected via keyboard
    if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        handleSelectSuggestion(suggestions[activeSuggestionIndex]);
        return;
    }

    // Check for exact match in samples first to avoid AI call if possible
    const exactMatch = SAMPLE_JOURNEYS.find(j => j.title.toLowerCase() === input.toLowerCase());
    if (exactMatch) {
        onSelectSample(exactMatch);
    } else if (input.trim()) {
        onGenerate(input);
    }
  };

  const handleSelectSuggestion = (journey: Journey) => {
      setInput(journey.title);
      setShowSuggestions(false);
      onSelectSample(journey);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
        setShowSuggestions(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuredJourney = SAMPLE_JOURNEYS[0];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      
      {/* 3D Moving Floor Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-grid-perspective opacity-10 dark:opacity-40"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent"></div>
      </div>

      {/* Top System Status Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
         <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <Cpu size={18} />
            <span className="font-mono text-xs font-bold tracking-widest uppercase">Journey_OS v2.4.0</span>
         </div>
         <div className="flex items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-500">
            {/* Insights Nav Button */}
            <button 
                onClick={onViewInsights}
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="View Agent Intelligence"
            >
                <Lightbulb size={14} />
                <span className="hidden sm:inline">INSIGHTS</span>
            </button>

            {/* Dashboards Nav Button */}
            <button 
                onClick={onViewDashboards}
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="View System Dashboards"
            >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">DASHBOARDS</span>
            </button>
            
            {/* Session Replay Nav Button */}
             <button 
                onClick={onViewSessionReplay}
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="View Session Replay"
            >
                <Network size={14} />
                <span className="hidden sm:inline">REPLAY</span>
            </button>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-800"></div>

            {/* Settings Cog Dropdown */}
            <div className="relative" ref={settingsRef}>
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                    <Settings size={16} className={`transition-transform duration-500 ${showSettings ? 'rotate-90' : ''}`} />
                </button>
                
                {showSettings && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-fade-in-down overflow-hidden">
                        <div className="p-2 space-y-1">
                            {toggleTheme && (
                                <button 
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-px h-4 bg-slate-300 dark:bg-slate-800"></div>

            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <span className="hidden sm:inline text-slate-600 dark:text-slate-400">SYSTEM ONLINE</span>
            </div>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Command Center */}
            <div className="space-y-10 animate-fade-in-up">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 rounded text-cyan-700 dark:text-cyan-400 text-[10px] font-mono uppercase tracking-widest">
                       <Zap size={12} />
                       <span>Workflow Orchestration Protocol</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                        JOURNEY <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500">VISUALIZER</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed border-l-2 border-slate-300 dark:border-slate-800 pl-4">
                        Construct, analyze, and optimize user flows with real-time signature tracking and AI-assisted mapping.
                    </p>
                </div>

                {/* Command Input with Typeahead */}
                <div className="relative max-w-lg z-50">
                    <form ref={formRef} onSubmit={handleSubmit} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-indigo-500/30 dark:from-cyan-500/50 dark:to-indigo-500/50 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl">
                            <div className="px-3 text-slate-400 dark:text-slate-500">
                                <Command size={18} />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => input.trim() && setSuggestions(SAMPLE_JOURNEYS.filter(j => j.title.toLowerCase().includes(input.toLowerCase())))}
                                placeholder="Initialize protocol..."
                                className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white px-2 py-3 placeholder-slate-400 dark:placeholder-slate-600 font-mono text-sm"
                                disabled={isGenerating}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={isGenerating || !input.trim()}
                                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                            >
                                {isGenerating ? (
                                <Loader2 className="animate-spin" size={16} />
                                ) : (
                                <ChevronRight size={16} />
                                )}
                            </button>
                        </div>
                        
                        {/* Typeahead Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-fade-in-down">
                                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                                    Available Protocols
                                </div>
                                <ul>
                                    {suggestions.map((suggestion, index) => (
                                        <li key={suggestion.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectSuggestion(suggestion)}
                                                className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm font-mono border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors ${
                                                    index === activeSuggestionIndex 
                                                        ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300' 
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FileJson size={14} className={index === activeSuggestionIndex ? 'text-cyan-500' : 'text-slate-400'} />
                                                    <span>{suggestion.title}</span>
                                                </div>
                                                {suggestion.valueStreamName && (
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase">{suggestion.valueStreamName}</span>
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </form>
                    
                    {/* Manual Override Link */}
                    <div className="mt-3 flex justify-between items-center px-1">
                        <button 
                            onClick={onBuildManually}
                            className="text-xs font-mono text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
                        >
                            <PenTool size={10} />
                            <span>[MANUAL_OVERRIDE_MODE]</span>
                        </button>
                    </div>
                </div>

                {/* Loading State Visualization */}
                {isGenerating && (
                    <div className="border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/10 p-4 rounded-lg font-mono text-xs text-cyan-700 dark:text-cyan-300 space-y-2 max-w-md">
                        <div className="flex justify-between">
                            <span>> INITIALIZING_AI_CORE...</span>
                            <span className="text-emerald-500 dark:text-emerald-400">OK</span>
                        </div>
                        <div className="flex justify-between">
                            <span>> PARSING_INTENT...</span>
                            <span className="text-emerald-500 dark:text-emerald-400">OK</span>
                        </div>
                        <div className="flex justify-between animate-pulse">
                            <span>> CONSTRUCTING_NODES...</span>
                            <span>PROCESSING</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: The "Blueprint" (Featured Template) */}
            <div className="relative group animate-fade-in-down delay-100 hidden lg:block">
                {/* Decorative Elements behind card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div 
                    onClick={() => onSelectSample(featuredJourney)}
                    className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_50px_rgba(34,211,238,0.15)] group-hover:-translate-y-2"
                >
                    {/* Card Header (Technical) */}
                    <div className="bg-slate-50/50 dark:bg-slate-950/50 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                             <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">TEMPLATE_ID: KYC_V3</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-500 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                             READ_ONLY
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">Global Markets Onboarding</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">Stream: {featuredJourney.valueStreamName}</p>
                            </div>
                            <Globe className="text-slate-400 dark:text-slate-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" size={32} />
                        </div>

                        {/* Mini Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                             <div className="bg-slate-50 dark:bg-slate-950/50 p-2 rounded border border-slate-200 dark:border-slate-800/50">
                                 <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Total Steps</div>
                                 <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                     <Layers size={14} className="text-purple-500 dark:text-purple-400" />
                                     {featuredJourney.steps.length}
                                 </div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-800/50">
                                 <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Complexity</div>
                                 <div className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                     <GitBranch size={14} className="text-emerald-500 dark:text-emerald-400" />
                                     High
                                 </div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-800/50">
                                 <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Region</div>
                                 <div className="text-lg font-bold text-slate-800 dark:text-white">EMEA</div>
                             </div>
                             <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-800/50">
                                 <div className="text-[10px] text-slate-500 uppercase font-mono mb-1">Data Points</div>
                                 <div className="text-lg font-bold text-slate-800 dark:text-white">24</div>
                             </div>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500 font-mono">Last Updated: 2h ago</span>
                            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                                <span>LOAD TEMPLATE</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                    
                    {/* Scanning Line Animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-progress-bar opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Floating Elements / Decor */}
                <div className="absolute -right-8 -bottom-8 bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-600 rounded-lg p-3 shadow-xl backdrop-blur-md animate-bounce-short hidden xl:block">
                     <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center border border-purple-200 dark:border-purple-500/30">
                             <Shield size={16} className="text-purple-600 dark:text-purple-300" />
                         </div>
                         <div>
                             <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Validation Layer</div>
                             <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">ACTIVE</div>
                         </div>
                     </div>
                </div>

            </div>
        </div>

      </main>

      {/* Footer / Data Ticker */}
      <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur text-[10px] font-mono text-slate-500 dark:text-slate-600 py-2 px-4 overflow-hidden whitespace-nowrap">
         <div className="flex justify-center gap-12 opacity-60">
             <span>CPU_USAGE: 12%</span>
             <span>MEMORY: 4.2GB / 16GB</span>
             <span>NETWORK_LATENCY: 24ms</span>
             <span>API_STATUS: CONNECTED</span>
             <span>JOURNEY_DB: SYNCED</span>
         </div>
      </footer>
    </div>
  );
};

export default Hero;