import React from "react";

import Icon from "../../components/Icon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export type InsightType =
  | "critical"
  | "warning"
  | "success"
  | "opportunity"
  | "info"
  | "neutral";

export type Insight = {
  id: number;
  category: string;
  cohort: string;
  title: string;
  description: string;
  metric: string;
  type: InsightType;
  icon: string;
};

type InsightCardsProps = {
  insights: Insight[];
};

const TYPE_STYLES: Record<InsightType | "default", string> = {
  critical:
    "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/20 border-rose-200 dark:border-rose-500/30",
  warning:
    "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-500/30",
  success:
    "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-500/30",
  opportunity:
    "text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-500/30",
  info: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30",
  neutral:
    "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
  default:
    "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
};

const COHORT_STYLES: Record<string, string> = {
  Technology:
    "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30",
  Product:
    "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/30",
  Design:
    "bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800/30",
};

const InsightCards: React.FC<InsightCardsProps> = ({ insights }) => {
  const getIconColor = (type: InsightType) =>
    TYPE_STYLES[type] ?? TYPE_STYLES.default;

  const getCohortBadge = (cohort: string) =>
    COHORT_STYLES[cohort] ??
    "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {insights.map((insight) => (
        <Card
          key={insight.id}
          className="group relative overflow-hidden bg-white p-6 dark:bg-slate-900 border-slate-200 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-800/80"
        >
          <div className="absolute right-0 top-0 h-32 w-32 -mr-8 -mt-8 rounded-bl-full bg-gradient-to-br from-slate-100/50 to-transparent opacity-0 transition-opacity dark:from-white/5 group-hover:opacity-100" />

          <CardHeader className="mb-2 flex flex-row items-start justify-between gap-2 p-0">
            <div
              className={`rounded-lg border p-2 ${getIconColor(insight.type)}`}
            >
              <Icon name={insight.icon} size={20} />
            </div>
            <span
              className={`text-[10px] font-mono uppercase tracking-wider border px-2 py-1 rounded ${getCohortBadge(
                insight.cohort,
              )}`}
            >
              {insight.cohort} Cohort
            </span>
          </CardHeader>

          <CardContent className="space-y-4 p-0">
            <div>
              <CardTitle className="mb-2 text-lg font-bold text-slate-900 transition-colors dark:text-slate-100">
                {insight.title}
              </CardTitle>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {insight.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800/50">
              <span className="text-xs font-mono uppercase text-slate-500">
                {insight.category}
              </span>
              <span
                className={`text-sm font-bold font-mono ${
                  insight.type === "critical" || insight.type === "warning"
                    ? "text-rose-600 dark:text-rose-400"
                    : insight.type === "success"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : insight.type === "opportunity"
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {insight.metric}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InsightCards;
