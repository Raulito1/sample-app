import { AuthType, init } from "@thoughtspot/visual-embed-sdk";
import { LiveboardEmbed } from "@thoughtspot/visual-embed-sdk/react";
import { LayoutGrid } from "lucide-react";
import React, { useEffect } from "react";

type DashboardsProps = Record<string, never>;

let thoughtSpotInitialized = false;

const Dashboards: React.FC<DashboardsProps> = () => {
  // Initialize ThoughtSpot embedding once (placeholder config for now)
  useEffect(() => {
    if (!thoughtSpotInitialized) {
      init({
        thoughtSpotHost: "https://your-thoughtspot-host", // TODO: replace with your ThoughtSpot host
        authType: AuthType.None, // TODO: update auth once wired to real environment
      });
      thoughtSpotInitialized = true;
    }
  }, []);

  return (
    <div className="w-full max-w-7xl lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto p-4 lg:p-6 xl:p-8 2xl:p-10 space-y-6 lg:space-y-8 2xl:space-y-10 animate-fade-in-up">
      {/* ThoughtSpot Liveboard embed */}
      <section className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl lg:rounded-2xl p-4 lg:p-6 xl:p-8 2xl:p-10 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-3 lg:mb-4 2xl:mb-6">
          <h2 className="text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 lg:gap-3">
            <LayoutGrid
              size={18}
              className="text-cyan-500 dark:text-cyan-400 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7"
            />
            Customer Journey Performance Liveboard
          </h2>
          <span className="text-[10px] lg:text-[11px] 2xl:text-xs px-2 py-1 lg:px-3 lg:py-1.5 2xl:px-4 2xl:py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 font-mono">
            Placeholder config
          </span>
        </div>

        <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg text-slate-600 dark:text-slate-400 mb-3 lg:mb-4 2xl:mb-6 max-w-2xl lg:max-w-3xl 2xl:max-w-4xl leading-relaxed">
          This panel embeds your ThoughtSpot Liveboard using the React{" "}
          <code className="font-mono">LiveboardEmbed</code> component. Replace the{" "}
          <span className="font-mono">thoughtSpotHost</span> and{" "}
          <span className="font-mono">liveboardId</span> placeholders with your real values to
          connect it to your environment.
        </p>

        <div className="bg-white/70 dark:bg-slate-950/70 rounded-lg lg:rounded-xl 2xl:rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="relative w-full h-[calc(100vh-280px)] lg:h-[calc(100vh-260px)] xl:h-[calc(100vh-240px)] 2xl:h-[calc(100vh-220px)] min-h-[400px] lg:min-h-[480px] xl:min-h-[560px] 2xl:min-h-[640px]">
            <LiveboardEmbed
              // TODO: replace with your real Liveboard ID
              liveboardId="REPLACE_WITH_LIVEBOARD_ID"
              frameParams={{
                height: "100%",
                width: "100%",
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboards;
