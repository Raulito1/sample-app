import React, { useState, useRef, useEffect } from 'react';
import { SAMPLE_JOURNEYS } from '../constants';
import { ArrowRight, Loader2, Globe, ChevronRight, Cpu, GitBranch, Layers, Shield, Zap, Settings, Sun, Moon, LayoutGrid, Lightbulb, Activity, Network, Search } from 'lucide-react';

interface HeroProps {
	  onGenerate: (topic: string) => void;
  onViewDashboards: () => void;
  onViewUsersJourney: () => void;
  onViewInsights: () => void;
	  onViewSessionReplay: () => void;
	  isGenerating: boolean;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

	const Hero: React.FC<HeroProps> = ({ 
	  onGenerate, 
	  onViewDashboards, 
	  onViewUsersJourney,
	  onViewInsights,
	  onViewSessionReplay,
	  isGenerating,
	  isDarkMode,
	  toggleTheme
	}) => {
	  const [input, setInput] = useState('');
	  const [showSettings, setShowSettings] = useState(false);
	  const [activeFeatureTab, setActiveFeatureTab] = useState<'journey' | 'insights' | 'dashboards' | 'replay'>('journey');
	  
	  const settingsRef = useRef<HTMLDivElement>(null);
	  const formRef = useRef<HTMLFormElement>(null);
	  const inputRef = useRef<HTMLInputElement>(null);

	  const handleSubmit = (e: React.FormEvent) => {
	    e.preventDefault();
	    if (input.trim()) {
	      onGenerate(input);
	    }
	  };

	  const featureTabs = [
	    { id: 'journey' as const, label: 'Users Journey' },
	    { id: 'insights' as const, label: 'Insights' },
	    { id: 'dashboards' as const, label: 'Dashboards' },
	    { id: 'replay' as const, label: 'Session Replay' },
	  ];

	  const renderFeatureCards = () => {
	    if (activeFeatureTab === 'journey') {
	      const journey = SAMPLE_JOURNEYS[0];
	      if (!journey) return null;
	      return (
	        <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
	          <div className="mb-4">
	            <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">Journey Template</p>
	            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{journey.title}</h3>
	            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{journey.description}</p>
	          </div>
	          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
	            <span>
	              Steps:{' '}
	              <span className="text-slate-900 dark:text-white font-bold">{journey.steps.length}</span>
	            </span>
	            <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
	              Ready to generate
	            </span>
	          </div>
	        </div>
	      );
	    }

	    if (activeFeatureTab === 'insights') {
	      const insight = {
	        title: 'Unused Trending Feature',
	        metric: 'High Relevance',
	        tag: 'Tech cohort',
	      };
	      return (
	        <div className="w-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
	          <div className="mb-4">
	            <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">Agent Insight</p>
	            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{insight.title}</h3>
	            <p className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
	              <span>{insight.metric}</span>
	            </p>
	          </div>
	          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
	            <span>{insight.tag}</span>
	            <span className="text-cyan-600 dark:text-cyan-400">View in Insights →</span>
	          </div>
	        </div>
	      );
	    }

	    if (activeFeatureTab === 'dashboards') {
	      const card = {
	        label: 'API Latency (p99)',
	        value: '42ms',
	        status: 'Stable performance across regions',
	      };
	      return (
	        <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
	          <div className="mb-4">
	            <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">System Metric</p>
	            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{card.label}</h3>
	            <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
	          </div>
	          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
	            <span>{card.status}</span>
	            <span className="text-cyan-600 dark:text-cyan-400">Open dashboard →</span>
	          </div>
	        </div>
	      );
	    }

	    const replayCard = {
	      label: 'Graph Session Flows',
	      value: '4 active replays',
	      status: 'Visualize every click & API call in real time.',
	    };
	    return (
	      <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
	        <div className="mb-4">
	          <p className="text-[10px] font-mono uppercase text-slate-500 mb-1">Session Graphistry</p>
	          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{replayCard.label}</h3>
	          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{replayCard.status}</p>
	        </div>
	        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
	          <span className="text-slate-900 dark:text-white font-bold">{replayCard.value}</span>
	          <span className="text-cyan-600 dark:text-cyan-400">Open replay →</span>
	        </div>
	      </div>
	    );
	  };

	  useEffect(() => {
	    const order: ('journey' | 'insights' | 'dashboards' | 'replay')[] = [
	      'journey',
	      'insights',
	      'dashboards',
	      'replay',
	    ];

	    const interval = setInterval(() => {
	      setActiveFeatureTab(prev => {
	        const currentIndex = order.indexOf(prev);
	        const nextIndex = (currentIndex + 1) % order.length;
	        return order[nextIndex];
	      });
	    }, 5000);

	    return () => clearInterval(interval);
	  }, []);

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
            {/* Users Journey Nav Button */}
            <button 
                onClick={onViewUsersJourney}
                className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                title="View Users Journey"
            >
                <Search size={14} />
                <span className="hidden sm:inline">USERS JOURNEY</span>
            </button>

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
                       <span>Customer Experience Intelligence</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                        CUSTOMER <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500">EXPERIENCE METRICS</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed border-l-2 border-slate-300 dark:border-slate-800 pl-4">
                        Measure, visualize, and optimize customer journeys with real-time signals and AI-assisted insights.
                    </p>
                </div>

                {/* Command Input with Typeahead */}

                {/* Loading State Visualization */}
                {isGenerating && (
                    <div className="border border-cyan-200 dark:border-cyan-900/50 bg-cyan-50 dark:bg-cyan-950/10 p-4 rounded-lg font-mono text-xs text-cyan-700 dark:text-cyan-300 space-y-2 max-w-md">
                        <div className="flex justify-between">
                            <span>{'>'} INITIALIZING_AI_CORE...</span>
                            <span className="text-emerald-500 dark:text-emerald-400">OK</span>
                        </div>
                        <div className="flex justify-between">
                            <span>{'>'}  PARSING_INTENT...</span>
                            <span className="text-emerald-500 dark:text-emerald-400">OK</span>
                        </div>
                        <div className="flex justify-between animate-pulse">
                            <span>{'>'}  CONSTRUCTING_NODES...</span>
                            <span>PROCESSING</span>
                        </div>
                    </div>
                )}
            </div>

	            {/* Right Column: Feature Highlights (per tab) */}
	            <div className="relative group animate-fade-in-down delay-100 hidden lg:block">
	                {/* Decorative Elements behind card */}
	                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none"></div>

	                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(15,23,42,0.35)] w-[420px] xl:w-[480px] min-h-[320px] mx-auto">
	                    {/* Header with tabs */}
	                    <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
	                        <div className="flex items-center gap-2">
	                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
	                            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
	                                Feature Highlights
	                            </span>
	                        </div>
	                        <div className="flex gap-1">
	                            {featureTabs.map(tab => (
	                              <button
	                                key={tab.id}
	                                onClick={() => setActiveFeatureTab(tab.id)}
	                                className={`px-2 py-1 rounded-full text-[10px] font-mono border transition-colors ${
	                                  activeFeatureTab === tab.id
	                                    ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
	                                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
	                                }`}
	                              >
	                                {tab.label}
	                              </button>
	                            ))}
	                        </div>
	                    </div>

						{/* Carousel content */}
						<div className="p-4">
							{renderFeatureCards()}
						</div>
	                </div>
	            </div>
        </div>

      </main>

      {/* Footer / Data Ticker */}
      <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur text-[10px] font-mono text-slate-500 dark:text-slate-600 py-2 px-4 overflow-hidden whitespace-nowrap">
         <div className="flex justify-center gap-12 opacity-60"></div>
      </footer>
    </div>
  );
};

export default Hero;