import React from 'react';
import { ArrowLeft, LayoutGrid, Server, LineChart, Activity, Database, Cloud } from 'lucide-react';

interface DashboardsProps {
  onSelect?: (dashboardId: string) => void; // Optional now as it's a view itself
  onBack: () => void;
}

const Dashboards: React.FC<DashboardsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-cyan-600 dark:text-cyan-400" size={20} />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">System Dashboards</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/50 rounded text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                SYSTEM_OPTIMAL
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in-up">
        
        {/* System Health Section */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Server size={18} className="text-emerald-500 dark:text-emerald-400" />
                    System Health & Infrastructure
                </h2>
                <span className="text-xs text-slate-500 font-mono">LAST UPDATED: 2s AGO</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Latency Card */}
                <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-slate-500 font-mono uppercase">API Latency (p99)</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">42ms</h3>
                        </div>
                        <Activity size={20} className="text-emerald-500" />
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[25%]"></div>
                    </div>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                        <span>●</span> Stable performance
                    </p>
                </div>

                {/* Database Card */}
                <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-slate-500 font-mono uppercase">DB Throughput</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">1,240 <span className="text-sm font-normal text-slate-500">ops/sec</span></h3>
                        </div>
                        <Database size={20} className="text-blue-500" />
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[65%]"></div>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                        <span>↑</span> +12% vs last hour
                    </p>
                </div>

                {/* Errors Card */}
                <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 backdrop-blur-sm shadow-sm dark:shadow-none">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-slate-500 font-mono uppercase">Error Rate</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">0.04%</h3>
                        </div>
                        <Cloud size={20} className="text-cyan-500" />
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full w-[4%]"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Within defined SLA limits
                    </p>
                </div>
            </div>
        </section>

        {/* Global Metrics Section */}
        <section className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <LineChart size={18} className="text-purple-500 dark:text-purple-400" />
                    Global Funnel Metrics
                </h2>
                <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-900 dark:text-white rounded border border-slate-200 dark:border-slate-700">Daily</button>
                    <button className="px-3 py-1 bg-slate-100 dark:bg-slate-900 text-xs text-slate-500 rounded border border-slate-200 dark:border-slate-800">Weekly</button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Journey Initialization</span>
                        <span className="text-slate-900 dark:text-white font-mono font-bold">14,205</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-4 rounded overflow-hidden">
                        <div className="bg-purple-600 h-full rounded" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Validation Passed</span>
                        <span className="text-slate-900 dark:text-white font-mono font-bold">12,180 <span className="text-slate-500 text-xs">(85.7%)</span></span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-4 rounded overflow-hidden">
                        <div className="bg-purple-500 h-full rounded" style={{ width: '85.7%' }}></div>
                    </div>
                </div>

                <div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Completed Successfully</span>
                        <span className="text-slate-900 dark:text-white font-mono font-bold">11,042 <span className="text-slate-500 text-xs">(77.8%)</span></span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-4 rounded overflow-hidden">
                        <div className="bg-purple-400 h-full rounded" style={{ width: '77.8%' }}></div>
                    </div>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboards;