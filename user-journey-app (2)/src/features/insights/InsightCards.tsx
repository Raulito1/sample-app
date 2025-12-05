import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export type InsightType =
  | "Engagement"
  | "Friction"
  | "Anomaly"
  | "Opportunity"
  | "Pattern"
  | "Journey";
export type InsightSubType = "Spike" | "Drop" | "Error" | "Trend" | "Alert" | "Optimization";

export type Insight = {
  insightTitle: string;
  insightType: InsightType[];
  insightSubType: InsightSubType[];
  appName: string;
  liveboardLink: string;
  insightDescription: string;
};

type InsightCardsProps = {
  insights: Insight[];
};

const TYPE_STYLES: Record<InsightType | "default", string> = {
  Engagement:
    "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-500/30",
  Friction:
    "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/20 border-rose-200 dark:border-rose-500/30",
  Anomaly:
    "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30",
  Opportunity:
    "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30",
  Pattern:
    "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/30",
  Journey:
    "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30",
  default:
    "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
};

const SUBTYPE_STYLES: Record<InsightSubType | "default", string> = {
  Spike: "text-cyan-600 dark:text-cyan-400",
  Drop: "text-rose-600 dark:text-rose-400",
  Error: "text-rose-600 dark:text-rose-400",
  Trend: "text-blue-600 dark:text-blue-400",
  Alert: "text-amber-600 dark:text-amber-400",
  Optimization: "text-emerald-600 dark:text-emerald-400",
  default: "text-slate-500 dark:text-slate-400",
};

const InsightCards: React.FC<InsightCardsProps> = ({ insights }) => {
  const getTypeStyle = (type: InsightType) => TYPE_STYLES[type] ?? TYPE_STYLES.default;
  const getSubTypeStyle = (subType: InsightSubType) =>
    SUBTYPE_STYLES[subType] ?? SUBTYPE_STYLES.default;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 lg:gap-5 xl:gap-6 2xl:gap-8">
      {insights.map((insight, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden bg-white p-5 lg:p-6 2xl:p-8 dark:bg-slate-900 border-slate-200 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-800/80 flex flex-col h-full"
        >
          <div className="absolute right-0 top-0 h-32 w-32 lg:h-40 lg:w-40 2xl:h-48 2xl:w-48 -mr-8 -mt-8 rounded-bl-full bg-gradient-to-br from-slate-100/50 to-transparent opacity-0 transition-opacity dark:from-white/5 group-hover:opacity-100" />

          <CardHeader className="mb-2 lg:mb-3 2xl:mb-4 flex flex-row items-start justify-between gap-2 lg:gap-3 p-0">
            {/* Type badges */}
            <div className="flex flex-wrap gap-1">
              {insight.insightType.map((type) => (
                <span
                  key={type}
                  className={`text-[9px] lg:text-[10px] 2xl:text-xs font-mono uppercase tracking-wider border px-1.5 py-0.5 lg:px-2 lg:py-1 rounded ${getTypeStyle(type)}`}
                >
                  {type}
                </span>
              ))}
            </div>
            {/* App name badge */}
            <span className="text-[10px] lg:text-[11px] 2xl:text-xs font-mono uppercase tracking-wider border px-2 py-1 lg:px-2.5 lg:py-1.5 2xl:px-3 2xl:py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700">
              {insight.appName}
            </span>
          </CardHeader>

          <CardContent className="flex flex-col flex-grow p-0">
            <div className="flex-grow">
              <CardTitle className="mb-2 lg:mb-3 text-lg lg:text-xl 2xl:text-2xl font-bold text-slate-900 transition-colors dark:text-slate-100">
                {insight.insightTitle}
              </CardTitle>
              <p className="text-sm lg:text-base 2xl:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {insight.insightDescription}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3 lg:pt-4 2xl:pt-5 mt-3 lg:mt-4 2xl:mt-5 dark:border-slate-800/50">
              {/* SubType badges */}
              <div className="flex flex-wrap gap-1">
                {insight.insightSubType.map((subType) => (
                  <span
                    key={subType}
                    className={`text-xs lg:text-sm 2xl:text-base font-mono uppercase ${getSubTypeStyle(subType)}`}
                  >
                    {subType}
                  </span>
                ))}
              </div>
              {/* Liveboard link */}
              <a
                href={insight.liveboardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs lg:text-sm text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                View Liveboard →
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InsightCards;
