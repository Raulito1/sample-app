import { Activity, AlertTriangle, BarChart3, Clock4, Gauge, X } from "lucide-react";
import React from "react";

import { Journey } from "../../../types";

interface JourneyMetricsViewProps {
  open: boolean;
  journey?: Journey | null;
  onClose: () => void;
}

const JourneyMetricsView: React.FC<JourneyMetricsViewProps> = ({ open, journey, onClose }) => {
  const metrics = journey?.metrics;

  if (!open) return null;

  const formatNumber = (value?: number, digits = 0) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const formatPercent = (value?: number, digits = 0) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—";
    return `${(value * 100).toFixed(digits)}%`;
  };

  const formatMs = (value?: number) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "—";
    const digits = value < 10 ? 2 : value < 100 ? 1 : 0;
    return `${formatNumber(value, digits)} ms`;
  };

  const completionRate =
    metrics?.totals.totalSequences && metrics?.totals.totalSequences > 0
      ? metrics.totals.completedSequences / metrics.totals.totalSequences
      : undefined;

  const frictionRate =
    metrics?.totals.totalSequences && metrics?.totals.totalSequences > 0
      ? metrics.friction.sequencesExperiencingFriction / metrics.totals.totalSequences
      : undefined;

  const contextSwitchRate =
    metrics?.totals.totalSequences && metrics?.totals.totalSequences > 0
      ? metrics.contextSwitching.sequencesWithContextSwitches / metrics.totals.totalSequences
      : undefined;

  const reasonsTotal = metrics
    ? Object.values(metrics.reasons).reduce((sum, value) => sum + value, 0)
    : 0;

  const reasonLabelMap: Record<string, string> = {
    userAbandoned: "User abandoned",
    userSaved: "User saved",
    incomplete: "Incomplete",
    newStart: "New start",
  };

  const reasonsWithPercents = metrics
    ? (Object.entries(metrics.reasons) as [string, number][]).map(([key, count]) => {
        const percent = reasonsTotal ? Math.round((count / reasonsTotal) * 100) : 0;
        return {
          key,
          count,
          percent,
          label: reasonLabelMap[key] ?? key,
        };
      })
    : [];

  const summaryCards = metrics
    ? [
        {
          label: "Total sequences",
          value: formatNumber(metrics.totals.totalSequences),
        },
        {
          label: "Completed",
          value: formatNumber(metrics.totals.completedSequences),
          helper: formatPercent(completionRate),
        },
        {
          label: "Abandoned",
          value: formatNumber(metrics.totals.abandonedSequences),
          helper: formatPercent(metrics.totals.abandonRate),
        },
        {
          label: "Abandon rate",
          value: formatPercent(metrics.totals.abandonRate),
          helper: `${formatNumber(metrics.totals.completedSequences, 0)} completed`,
        },
        {
          label: "Unique users",
          value: formatNumber(metrics.totals.uniqueUsers),
          helper: `${formatNumber(metrics.totals.avgSequencesPerUser, 1)} avg sequences/user`,
        },
      ]
    : [];

  const topPages = metrics?.pageDurations
    ? [...metrics.pageDurations].sort((a, b) => b.avgMs - a.avgMs).slice(0, 8)
    : [];

  const StatLine = ({
    label,
    value,
    helper,
  }: {
    label: string;
    value: string;
    helper?: string;
  }) => (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <div className="text-right">
        <div className="font-semibold text-slate-900 dark:text-white">{value}</div>
        {helper && <div className="text-[11px] text-slate-500 dark:text-slate-400">{helper}</div>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="absolute inset-x-4 md:inset-x-12 lg:inset-x-24 top-8 bottom-8">
        <div
          className="h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 flex flex-col"
          style={{ opacity: open ? 1 : 0, transform: open ? "translateY(0)" : "translateY(24px)" }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
            <div>
              <p className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
                Journey Metrics
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {journey?.title ?? "No journey selected"}
              </h3>
              {journey?.valueStreamName && (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {journey.valueStreamName} • {journey.metricsStartDate ?? "—"}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {!metrics ? (
              <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                No metrics available for this journey.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {summaryCards.map((card) => (
                    <div
                      key={card.label}
                      className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm"
                    >
                      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        {card.label}
                      </div>
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {card.value}
                      </div>
                      {card.helper && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {card.helper}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Activity size={16} />
                        <span>Completion reasons</span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {formatNumber(metrics.totals.totalSequences)} sequences
                      </span>
                    </div>
                    <div className="space-y-3">
                      {reasonsWithPercents.map((reason) => (
                        <div key={reason.key} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 dark:text-slate-300">
                              {reason.label}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatNumber(reason.count)} ({reason.percent}%)
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                              style={{ width: `${reason.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <AlertTriangle size={16} className="text-rose-500 dark:text-rose-300" />
                      <span>Friction & errors</span>
                    </div>
                    <div className="space-y-2">
                      <StatLine
                        label="Sequences with friction"
                        value={`${formatNumber(metrics.friction.sequencesExperiencingFriction)} (${formatPercent(frictionRate)})`}
                        helper={`${formatNumber(metrics.friction.uniqueUsersExperiencingFriction)} users touched`}
                      />
                      <StatLine
                        label="Avg friction events/sequence"
                        value={formatNumber(metrics.friction.avgFrictionEventsPerSequence)}
                        helper={`Median ${formatNumber(metrics.friction.medianFrictionEventsPerSequence)}`}
                      />
                      <StatLine
                        label="Common error"
                        value={metrics.friction.mostCommonError}
                        helper={`Step: ${metrics.friction.mostCommonStepForError}`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <Clock4 size={16} />
                      <span>Timing</span>
                    </div>
                    <StatLine
                      label="Avg journey duration"
                      value={formatMs(metrics.durations.avgDuration)}
                      helper={`Median ${formatMs(metrics.durations.medianDuration)}`}
                    />
                    <StatLine
                      label="Max journey duration"
                      value={formatMs(metrics.durations.maxDuration)}
                      helper={`Outliers removed: ${formatMs(metrics.durations.maxDurationOutliersRemoved)}`}
                    />
                    <StatLine
                      label="Avg step duration"
                      value={formatMs(metrics.durations.avgStepDuration)}
                      helper={`Sequence length mode: ${formatNumber(metrics.durations.mostCommonSequenceLength)}`}
                    />
                  </div>

                  <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <Gauge size={16} />
                      <span>Context switching</span>
                    </div>
                    <StatLine
                      label="Sequences with context switches"
                      value={`${formatNumber(metrics.contextSwitching.sequencesWithContextSwitches)} (${formatPercent(contextSwitchRate)})`}
                      helper={`${formatNumber(metrics.contextSwitching.uniqueUsersContextSwitching)} users`}
                    />
                    <StatLine
                      label="Avg context switches/sequence"
                      value={formatNumber(metrics.contextSwitching.avgContextSwitchesPerSequence)}
                      helper={`Median ${formatNumber(metrics.contextSwitching.medianContextSwitchesPerSequence)}`}
                    />
                    <StatLine
                      label="Most common switch"
                      value={metrics.contextSwitching.mostCommonContextSwitch}
                      helper={`Step: ${metrics.contextSwitching.mostCommonStepForContextSwitch}`}
                    />
                  </div>
                </div>

                {topPages.length > 0 && (
                  <div className="bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <BarChart3 size={16} />
                      <span>Slowest pages</span>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      {topPages.map((page) => (
                        <div
                          key={page.page}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <span className="text-slate-600 dark:text-slate-300">{page.page}</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {formatMs(page.avgMs)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {metrics.highRiskPattern && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-5 flex gap-3 items-start shadow-sm">
                    <AlertTriangle
                      size={20}
                      className="text-amber-700 dark:text-amber-300 shrink-0 mt-0.5"
                    />
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                        High risk pattern detected
                      </div>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        {metrics.highRiskPattern.pattern.join(" \u2192 ")}
                      </div>
                      <div className="text-xs text-amber-800/80 dark:text-amber-200/80">
                        Abandon rate {formatPercent(metrics.highRiskPattern.abandonRate)} •{" "}
                        {formatNumber(metrics.highRiskPattern.totalOccurrences)} occurrences •{" "}
                        {formatNumber(metrics.highRiskPattern.rateByOccurrences)} impacted users
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyMetricsView;
