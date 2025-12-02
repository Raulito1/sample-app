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
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in-up">
      {/* ThoughtSpot Liveboard embed */}
      <section className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutGrid size={18} className="text-cyan-500 dark:text-cyan-400" />
            Customer Journey Performance Liveboard
          </h2>
          <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 font-mono">
            Placeholder config
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-2xl">
          This panel embeds your ThoughtSpot Liveboard using the React{" "}
          <code className="font-mono">LiveboardEmbed</code> component. Replace the{" "}
          <span className="font-mono">thoughtSpotHost</span> and{" "}
          <span className="font-mono">liveboardId</span> placeholders with your real values to
          connect it to your environment.
        </p>

        <div className="bg-white/70 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="relative w-full h-[calc(100vh-220px)] min-h-[420px]">
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
