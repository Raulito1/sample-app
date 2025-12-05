import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  GitCompare,
  Minus,
  Play,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Journey, JourneyStep, StepMetric } from "../../../types";
import Icon from "../../components/Icon";

interface SidePanelProps {
  step: JourneyStep | null;
  journey?: Journey;
  isOpen: boolean;
  onClose: () => void;
  hasBackdrop?: boolean;
  onNextStep?: () => void;
  onPrevStep?: () => void;
  isPresenting?: boolean;
  canGoNext?: boolean;
  canGoPrev?: boolean;
  layout?: "overlay" | "inline";
}

const SidePanel: React.FC<SidePanelProps> = ({
  step,
  journey,
  isOpen,
  onClose,
  hasBackdrop = true,
  onNextStep,
  onPrevStep,
  isPresenting = false,
  canGoNext = false,
  canGoPrev = false,
  layout = "overlay",
}) => {
  // Matches the combined NavBar + AppHeader height so the panel stays below them
  const headerOffset = 128;
  const isInline = layout === "inline";
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [compareTarget, setCompareTarget] = useState<"prev" | "next" | null>(null);

  // Reset internal state when step changes or panel closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setShowDrillDown(false);
        setCompareTarget(null);
      }, 300);
      return () => clearTimeout(timer);
    }
    setCompareTarget(null);
  }, [isOpen, step?.id]);

  if (!step) return null;

  // Determine Neighbors
  const steps = journey?.steps || [];
  const currentIndex = steps.findIndex((s) => s.id === step.id);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;

  const targetStep =
    compareTarget === "prev" ? prevStep : compareTarget === "next" ? nextStep : null;

  const renderMetricComparison = (
    currentMetrics: StepMetric[] | undefined = [],
    targetMetrics: StepMetric[] | undefined = []
  ) => {
    const safeCurrentMetrics = currentMetrics ?? [];
    const safeTargetMetrics = targetMetrics ?? [];

    // Create a map of all metric labels found in both
    const allLabels = Array.from(
      new Set([...safeCurrentMetrics.map((m) => m.label), ...safeTargetMetrics.map((m) => m.label)])
    );

    return (
      <div className="space-y-2">
        {allLabels.map((label) => {
          const curr = safeCurrentMetrics.find((m) => m.label === label);
          const targ = safeTargetMetrics.find((m) => m.label === label);
          return (
            <div
              key={label}
              className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center bg-white dark:bg-slate-800/40 p-3 rounded border border-slate-200 dark:border-slate-700/50"
            >
              {/* Current */}
              <div className="text-right">
                {curr ? (
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {curr.value}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase">{curr.trend}</div>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600">-</span>
                )}
              </div>

              {/* Label */}
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 text-center px-2 min-w-[100px] border-x border-slate-200 dark:border-slate-700/50">
                {label}
              </div>

              {/* Target */}
              <div className="text-left">
                {targ ? (
                  <div>
                    <div className="text-lg font-bold text-slate-600 dark:text-slate-300">
                      {targ.value}
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-600 uppercase">
                      {targ.trend}
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-600">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop (optional, e.g. disabled in embedded/"3/4 + 1/4" layouts) */}
      {hasBackdrop && !isInline && (
        <div
          className={`fixed left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          style={{ top: headerOffset }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          ${isInline ? "relative w-full h-full" : "fixed right-0 bottom-0 w-full"}
          ${
            isInline
              ? "bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 shadow-xl z-10 rounded-2xl overflow-hidden"
              : `bg-white dark:bg-slate-900/95 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 ${
                  hasBackdrop
                    ? "md:w-[600px] lg:w-[640px] xl:w-[720px] 2xl:w-[800px]"
                    : "md:w-[420px] lg:w-[480px] xl:w-[520px] 2xl:w-[560px]"
                }`
          }
          ${isInline ? "" : "transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"}
          flex flex-col
          ${isInline ? "translate-x-0" : isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={
          isInline
            ? { height: "100%" }
            : { top: headerOffset, height: `calc(100vh - ${headerOffset}px)` }
        }
      >
        {/* Header */}
        <div className="px-6 py-4 lg:px-8 lg:py-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 shrink-0">
              <Icon name={step.iconName} size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-cyan-600 dark:text-cyan-500 uppercase tracking-widest mb-1">
                {step.phase}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {step.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Step Navigation */}
        <div
          className={`px-6 lg:px-8 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between ${
            isPresenting ? "bg-cyan-50/70 dark:bg-slate-900/60" : "bg-slate-50 dark:bg-slate-900/50"
          }`}
        >
          <span
            className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${
              isPresenting
                ? "text-cyan-700 dark:text-cyan-300"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            <Play size={14} />
            {isPresenting ? "Presenting" : "Navigate Steps"}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevStep}
              disabled={!canGoPrev}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:border-cyan-400 hover:text-cyan-700 dark:hover:border-cyan-500 dark:hover:text-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-1">
                <ArrowLeft size={14} />
                <span>Previous</span>
              </div>
            </button>
            <button
              onClick={onNextStep}
              disabled={!canGoNext}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm shadow-cyan-900/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-1">
                <span>Next</span>
                <ArrowRight size={14} />
              </div>
            </button>
          </div>
        </div>

        {/* Comparison Controls */}
        <div className="px-6 lg:px-8 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <GitCompare size={14} />
            Mode
          </span>
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCompareTarget(compareTarget === "prev" ? null : "prev")}
              disabled={!prevStep}
              className={`p-1.5 rounded transition-colors ${compareTarget === "prev" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"}`}
              title="Compare with Previous Step"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={() => setCompareTarget(null)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${!compareTarget ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
            >
              Standard
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={() => setCompareTarget(compareTarget === "next" ? null : "next")}
              disabled={!nextStep}
              className={`p-1.5 rounded transition-colors ${compareTarget === "next" ? "bg-cyan-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"}`}
              title="Compare with Next Step"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:px-8 xl:px-10 2xl:px-12 space-y-8 custom-scrollbar">
          {compareTarget && targetStep ? (
            // COMPARISON VIEW
            <div className="space-y-8 animate-fade-in-up">
              {/* Headers Side-by-Side */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase mb-1 block">
                    Current
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 font-bold uppercase mb-1 block">
                    {compareTarget === "prev" ? "Previous" : "Next"}
                  </span>
                  <h3 className="font-bold text-slate-500 dark:text-slate-300 text-sm">
                    {targetStep.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-600 mt-1">
                    {targetStep.description}
                  </p>
                </div>
              </div>

              {/* Metrics Comparison */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                  <Activity size={16} />
                  <span>Metric Comparison</span>
                </h3>
                {renderMetricComparison(step.metrics, targetStep.metrics)}
              </div>
            </div>
          ) : (
            // STANDARD VIEW (Existing Content)
            <>
              {/* Journey Context */}
              {journey && (journey.valueStreamName || journey.metricsStartDate) && (
                <div className="flex flex-wrap gap-4 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-800">
                  {journey.valueStreamName && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Briefcase size={14} className="text-slate-400 dark:text-slate-500" />
                      <span>
                        Stream:{" "}
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {journey.valueStreamName}
                        </span>
                      </span>
                    </div>
                  )}
                  {journey.metricsStartDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
                      <span>
                        Start Date:{" "}
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {journey.metricsStartDate}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                  <Activity size={16} />
                  <span>Overview</span>
                </h3>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                  {step.details || step.description}
                </p>
              </div>

              {/* Metrics Grid */}
              {step.metrics && step.metrics.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                    Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {step.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 hover:border-cyan-500/30 transition-colors shadow-sm dark:shadow-none"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-slate-500 dark:text-slate-400 text-sm">
                            {metric.label}
                          </span>
                          {metric.trend === "up" && (
                            <TrendingUp
                              size={16}
                              className="text-emerald-500 dark:text-emerald-400"
                            />
                          )}
                          {metric.trend === "down" && (
                            <TrendingDown size={16} className="text-rose-500 dark:text-rose-400" />
                          )}
                          {metric.trend === "neutral" && (
                            <Minus size={16} className="text-slate-400 dark:text-slate-500" />
                          )}
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                          {metric.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Actions (Only show in Standard View) */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowDrillDown(!showDrillDown)}
                  className={`
                            w-full py-3 rounded-lg font-medium transition-all duration-300 shadow-lg flex items-center justify-center gap-2
                            ${
                              showDrillDown
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 shadow-none"
                                : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/20"
                            }
                        `}
                >
                  {showDrillDown ? (
                    <>
                      <span>Hide Analytics</span>
                      <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      <span>Drill Down into Analytics</span>
                      <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
