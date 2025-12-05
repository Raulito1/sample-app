import { Zap } from "lucide-react";
import React, { useEffect, useState } from "react";

import { SAMPLE_JOURNEYS } from "../../constants";
import NavBar from "./NavBar";

export type HeroView = "journey" | "insights" | "dashboards" | "replay";

interface HeroProps {
  onNavigate: (view: HeroView) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate, isDarkMode, toggleTheme }) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<HeroView>("journey");

  const featureTabs: { id: HeroView; label: string }[] = [
    { id: "journey", label: "Users Journey" },
    { id: "insights", label: "Insights" },
    { id: "dashboards", label: "Dashboards" },
    { id: "replay", label: "Session Replay" },
  ];

  const handleFeatureNavigation = (feature: HeroView) => {
    onNavigate(feature);
  };

  const renderFeatureCards = () => {
    if (activeFeatureTab === "journey") {
      const journey = SAMPLE_JOURNEYS[0];
      if (!journey) return null;

      return (
        <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 lg:p-6 2xl:p-8 flex flex-col justify-between min-h-[220px] lg:min-h-[260px] 2xl:min-h-[300px]">
          <div className="mb-4 lg:mb-5 2xl:mb-6">
            <p className="text-[10px] lg:text-[11px] 2xl:text-xs font-mono uppercase text-slate-500 mb-1 lg:mb-2">Journey Template</p>
            <h3 className="text-base lg:text-lg 2xl:text-xl font-bold text-slate-900 dark:text-white mb-2 lg:mb-3 line-clamp-2">
              {journey.title}
            </h3>
            <p className="text-xs lg:text-sm 2xl:text-base text-slate-600 dark:text-slate-400 line-clamp-3">
              {journey.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] lg:text-xs 2xl:text-sm font-mono text-slate-500 dark:text-slate-400">
            <span>
              Steps:{" "}
              <span className="text-slate-900 dark:text-white font-bold">
                {journey.steps.length}
              </span>
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleFeatureNavigation("journey")}
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
              >
                Open journey →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeFeatureTab === "insights") {
      const insight = {
        title: "Unused Trending Feature",
        metric: "High Relevance",
        tag: "Tech cohort",
      };

      return (
        <div className="w-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-5 lg:p-6 2xl:p-8 flex flex-col justify-between min-h-[220px] lg:min-h-[260px] 2xl:min-h-[300px]">
          <div className="mb-4 lg:mb-5 2xl:mb-6">
            <p className="text-[10px] lg:text-[11px] 2xl:text-xs font-mono uppercase text-slate-500 mb-1 lg:mb-2">Insight</p>
            <h3 className="text-base lg:text-lg 2xl:text-xl font-bold text-slate-900 dark:text-white mb-2 lg:mb-3 line-clamp-2">
              {insight.title}
            </h3>
            <p className="inline-flex items-center gap-1 text-[11px] lg:text-xs 2xl:text-sm font-mono px-2 lg:px-3 py-0.5 lg:py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              <span>{insight.metric}</span>
            </p>
          </div>
          <div className="flex items-center justify-between text-[11px] lg:text-xs 2xl:text-sm font-mono text-slate-500 dark:text-slate-400">
            <span>{insight.tag}</span>
            <button
              type="button"
              onClick={() => handleFeatureNavigation("insights")}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
            >
              View in Insights →
            </button>
          </div>
        </div>
      );
    }

    if (activeFeatureTab === "dashboards") {
      const card = {
        label: "API Latency (p99)",
        value: "42ms",
        status: "Stable performance across regions",
      };

      return (
        <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 lg:p-6 2xl:p-8 flex flex-col justify-between min-h-[220px] lg:min-h-[260px] 2xl:min-h-[300px]">
          <div className="mb-4 lg:mb-5 2xl:mb-6">
            <p className="text-[10px] lg:text-[11px] 2xl:text-xs font-mono uppercase text-slate-500 mb-1 lg:mb-2">System Metric</p>
            <h3 className="text-base lg:text-lg 2xl:text-xl font-bold text-slate-900 dark:text-white mb-2 lg:mb-3 line-clamp-2">
              {card.label}
            </h3>
            <p className="text-3xl lg:text-4xl 2xl:text-5xl font-bold text-slate-900 dark:text-white">{card.value}</p>
          </div>
          <div className="flex items-center justify-between text-[11px] lg:text-xs 2xl:text-sm font-mono text-slate-500 dark:text-slate-400">
            <span>{card.status}</span>
            <button
              type="button"
              onClick={() => handleFeatureNavigation("dashboards")}
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
            >
              Open dashboard →
            </button>
          </div>
        </div>
      );
    }

    const replayCard = {
      label: "Graph Session Flows",
      value: "4 active replays",
      status: "Visualize every click & API call in real time.",
    };

    return (
      <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 lg:p-6 2xl:p-8 flex flex-col justify-between min-h-[220px] lg:min-h-[260px] 2xl:min-h-[300px]">
        <div className="mb-4 lg:mb-5 2xl:mb-6">
          <p className="text-[10px] lg:text-[11px] 2xl:text-xs font-mono uppercase text-slate-500 mb-1 lg:mb-2">Session Graphistry</p>
          <h3 className="text-base lg:text-lg 2xl:text-xl font-bold text-slate-900 dark:text-white mb-2 lg:mb-3 line-clamp-2">
            {replayCard.label}
          </h3>
          <p className="text-xs lg:text-sm 2xl:text-base text-slate-600 dark:text-slate-400 line-clamp-3">
            {replayCard.status}
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] lg:text-xs 2xl:text-sm font-mono text-slate-500 dark:text-slate-400">
          <span className="text-slate-900 dark:text-white font-bold">{replayCard.value}</span>
          <button
            type="button"
            onClick={() => handleFeatureNavigation("replay")}
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
          >
            Open replay →
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const order: HeroView[] = ["journey", "insights", "dashboards", "replay"];

    const interval = setInterval(() => {
      setActiveFeatureTab((prev) => {
        const currentIndex = order.indexOf(prev);
        const nextIndex = (currentIndex + 1) % order.length;
        return order[nextIndex];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      <NavBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      {/* 3D Moving Floor Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-grid-perspective opacity-30 dark:opacity-40" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 via-slate-50/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent" />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-16 2xl:p-24">
        <div className="w-full max-w-6xl lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 2xl:gap-32 items-center">
          {/* Left Column: Command Center */}
          <div className="space-y-8 lg:space-y-10 2xl:space-y-14 animate-fade-in-up">
            <div className="space-y-4 lg:space-y-5 2xl:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-1.5 2xl:px-5 2xl:py-2 bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/50 rounded text-cyan-700 dark:text-cyan-400 text-[10px] lg:text-[11px] 2xl:text-xs font-mono uppercase tracking-widest">
                <Zap size={12} className="lg:w-3.5 lg:h-3.5 2xl:w-4 2xl:h-4" />
                <span>Customer Experience Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
                CUSTOMER
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-400 dark:to-indigo-500">
                  EXPERIENCE METRICS
                </span>
              </h1>
              <p className="text-lg lg:text-xl 2xl:text-2xl text-slate-600 dark:text-slate-400 max-w-md lg:max-w-lg 2xl:max-w-2xl leading-relaxed border-l-2 border-slate-300 dark:border-slate-800 pl-4 lg:pl-5 2xl:pl-6">
                Measure, visualize, and optimize customer journeys with real-time signals and
                AI-assisted insights.
              </p>
            </div>
          </div>

          {/* Right Column: Feature Highlights (per tab) */}
          <div className="relative group animate-fade-in-down delay-100 hidden lg:block">
            {/* Decorative Elements behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl lg:rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(15,23,42,0.35)] w-full max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] 2xl:max-w-[640px] min-h-[320px] lg:min-h-[360px] 2xl:min-h-[420px] mx-auto">
              {/* Header with tabs */}
              <div className="px-5 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 2xl:w-3 2xl:h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  <span className="text-[10px] lg:text-[11px] 2xl:text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Feature Highlights
                  </span>
                </div>
                <div className="flex gap-1 lg:gap-1.5 2xl:gap-2">
                  {featureTabs.map((tab) => (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveFeatureTab(tab.id)}
                      className={`px-2 py-1 lg:px-2.5 lg:py-1.5 2xl:px-3 2xl:py-2 rounded-full text-[10px] lg:text-[11px] 2xl:text-xs font-mono border transition-colors ${
                        activeFeatureTab === tab.id
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/40"
                          : "bg-transparent text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carousel content */}
              <div className="p-4 lg:p-5 2xl:p-6">{renderFeatureCards()}</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Data Ticker */}
      <footer className="relative z-20 border-t border-slate-200 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur text-[10px] font-mono text-slate-500 dark:text-slate-600 py-2 px-4 overflow-hidden whitespace-nowrap">
        <div className="flex justify-center gap-12 opacity-60" />
      </footer>
    </div>
  );
};

export default Hero;
