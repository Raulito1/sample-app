import React from 'react';
import { TrendingUp, Users, Activity, AlertTriangle, CheckCircle, Clock, Target, Zap, ShieldAlert, Lightbulb, MousePointerClick, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import Icon from './Icon';
import AppHeader from './AppHeader';
import PageShell from './PageShell';
import StatusPill from './StatusPill';

interface InsightsDashboardProps {
  onBack: () => void;
}

// Mock Data based on specific "Agent" requirements
const AGENT_INSIGHTS = [
  // --- Cohort Trends & Friction ---
  {
    id: 1,
    category: 'Cohort Opportunity',
    cohort: 'Technology',
    title: 'Unused Trending Feature',
    description: "The 'GraphQL Explorer' component is trending within the Technology cohort (+45% MoM), but you have not initialized it yet.",
    metric: 'High Relevance',
    type: 'opportunity',
    icon: 'Zap'
  },
  {
    id: 2,
    category: 'Cohort Friction',
    cohort: 'Product',
    title: 'High Error Rate detected',
    description: "Product Managers are experiencing a 12% timeout rate on the 'Bulk CSV Export' feature during peak hours (14:00-16:00).",
    metric: '12% Failure',
    type: 'critical',
    icon: 'AlertTriangle'
  },
  {
    id: 3,
    category: 'Cohort Behavior',
    cohort: 'Design',
    title: 'Spike in Friction',
    description: "Abnormal spike in 'Rage Clicks' detected on the 'Asset Library' upload modal within the Design cohort.",
    metric: '+200% Rage Clicks',
    type: 'warning',
    icon: 'MousePointerClick'
  },

  // --- Engagement & Anomalies ---
  {
    id: 4,
    category: 'Engagement Alert',
    cohort: 'All Users',
    title: 'Low Feature Engagement',
    description: "The 'Legacy Reporting' module has not seen more than 5 unique users per day since Oct 1st.",
    metric: '< 5 DAU',
    type: 'neutral',
    icon: 'Activity'
  },
  {
    id: 5,
    category: 'Usage Anomaly',
    cohort: 'Product',
    title: 'Spike in Feature Usage',
    description: "Unexpected +150% increase in 'Roadmap Visualizer' usage by Product cohort following the v2.4 release.",
    metric: '+150% Usage',
    type: 'success',
    icon: 'TrendingUp'
  },
  {
    id: 6,
    category: 'User Pattern',
    cohort: 'Technology',
    title: 'Common Interaction',
    description: "Users in your cohort often open the 'API Logs' immediately after login (09:00 AM). Suggested Action: Bookmark or Deep Link.",
    metric: '85% Probability',
    type: 'info',
    icon: 'Clock'
  },

  // --- Behavioral Patterns ---
  {
    id: 7,
    category: 'Anti-Pattern',
    cohort: 'Global',
    title: 'Adopting Anti-Pattern',
    description: "Detected 'Rapid Refreshing' (spamming F5) on the Dashboard widget. Indicates potential data latency perception issues.",
    metric: 'High Frequency',
    type: 'warning',
    icon: 'ShieldAlert'
  },
  {
    id: 8,
    category: 'Best Practice',
    cohort: 'Security',
    title: 'Adherence to Best Practice',
    description: "98% of users are now following the 'Secure Session Logout' flow, up from 75% last month.",
    metric: '98% Adherence',
    type: 'success',
    icon: 'CheckCircle'
  },

  // --- User Journey Specifics ---
  {
    id: 9,
    category: 'Journey Intelligence',
    cohort: 'Global',
    title: 'Conversion Driver',
    description: "The 'Document Auto-Scan' feature appeared in 82% of successful 'KYC Approval' conversion events.",
    metric: '82% Attribution',
    type: 'success',
    icon: 'Target'
  },
  {
    id: 10,
    category: 'Journey Optimization',
    cohort: 'Global',
    title: 'Efficiency Gain',
    description: "Average time to complete 'New Client Onboarding' has decreased by 18% after the 'Quick-Fill' update.",
    metric: '-18% Duration',
    type: 'success',
    icon: 'TrendingDown'
  }
];

const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onBack }) => {
  
  const getIconColor = (type: string) => {
    switch(type) {
        case 'critical': return 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/20 border-rose-200 dark:border-rose-500/30';
        case 'warning': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30';
        case 'success': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30';
        case 'opportunity': return 'text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-500/30';
        case 'info': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30';
        default: return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };
	  
	  return (
	    <PageShell withTexture className="h-screen overflow-y-auto custom-scrollbar">
		      <AppHeader
		        title="Agent Intelligence"
		        icon={<Lightbulb className="text-cyan-600 dark:text-cyan-400" size={20} />}
		        onBack={onBack}
		        rightContent={<StatusPill label="AI_ANALYSIS_ACTIVE" tone="purple" />}
		      />
	
	      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in-up">
        
        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 backdrop-blur-sm">
                 <div className="text-slate-500 text-xs font-mono uppercase mb-1">New Users (Tech)</div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     +124 <span className="text-emerald-600 dark:text-emerald-400 text-xs flex items-center bg-emerald-100 dark:bg-emerald-900/20 px-1 rounded">+12%</span>
                 </div>
             </div>
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 backdrop-blur-sm">
                 <div className="text-slate-500 text-xs font-mono uppercase mb-1">Avg Friction Score</div>
                 <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                     Low <span className="text-emerald-600 dark:text-emerald-400 text-xs flex items-center bg-emerald-100 dark:bg-emerald-900/20 px-1 rounded">-5%</span>
                 </div>
             </div>
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 backdrop-blur-sm">
                 <div className="text-slate-500 text-xs font-mono uppercase mb-1">Top Journey Vol</div>
                 <div className="text-xl font-bold text-slate-900 dark:text-white truncate">Global Markets</div>
             </div>
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 backdrop-blur-sm">
                 <div className="text-slate-500 text-xs font-mono uppercase mb-1">Active Anomalies</div>
                 <div className="text-2xl font-bold text-amber-500 dark:text-amber-400 flex items-center gap-2">
                     3 <AlertTriangle size={16} />
                 </div>
             </div>
        </div>

        {/* Insight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {AGENT_INSIGHTS.map((insight) => (
                <div 
                    key={insight.id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl p-6 backdrop-blur-sm transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group relative overflow-hidden shadow-sm dark:shadow-none"
                >
                    {/* Decorative Background Gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/50 dark:from-white/5 to-transparent rounded-bl-full -mr-8 -mt-8 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none`}></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`p-2 rounded-lg border ${getIconColor(insight.type)}`}>
                            <Icon name={insight.icon} size={20} />
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border ${
                            insight.cohort === 'Technology' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30' : 
                            insight.cohort === 'Product' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/30' :
                            insight.cohort === 'Design' ? 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/30' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                            {insight.cohort} Cohort
                        </span>
                    </div>

                    <div className="mb-4 relative z-10">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors">
                            {insight.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {insight.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/50 relative z-10">
                        <span className="text-xs text-slate-500 font-mono uppercase">{insight.category}</span>
                        <span className={`text-sm font-bold font-mono ${
                            insight.type === 'critical' || insight.type === 'warning' ? 'text-rose-600 dark:text-rose-400' : 
                            insight.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 
                            insight.type === 'opportunity' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                            {insight.metric}
                        </span>
                    </div>
                </div>
            ))}
        </div>

        {/* Bottom Section: Journey Impact Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={18} className="text-cyan-600 dark:text-cyan-400" />
                    User Journey Performance
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">
                        <tr>
                            <th className="px-6 py-3 font-medium">Journey Name</th>
                            <th className="px-6 py-3 font-medium">Top Cohort</th>
                            <th className="px-6 py-3 font-medium">Completion Time</th>
                            <th className="px-6 py-3 font-medium">Friction Change</th>
                            <th className="px-6 py-3 font-medium">Conversion Impact</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-200 dark:divide-slate-800/50">
                        <tr className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Global Markets Onboarding</td>
                            <td className="px-6 py-4 text-blue-600 dark:text-blue-400">Technology</td>
                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><ArrowDownRight size={14}/> -15%</td>
                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">-8%</td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">High</td>
                        </tr>
                        <tr className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Retail KYC Review</td>
                            <td className="px-6 py-4 text-purple-600 dark:text-purple-400">Product</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 flex items-center gap-1"><ArrowUpRight size={14}/> +2%</td>
                            <td className="px-6 py-4 text-rose-600 dark:text-rose-400">+5%</td>
                            <td className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Med</td>
                        </tr>
                         <tr className="hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Document Verification</td>
                            <td className="px-6 py-4 text-pink-600 dark:text-pink-400">Design</td>
                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><ArrowDownRight size={14}/> -22%</td>
                            <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400">-12%</td>
                            <td className="px-6 py-4 font-bold text-cyan-600 dark:text-cyan-400">Very High</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

	      </div>
	    </PageShell>
  );
};

export default InsightsDashboard;