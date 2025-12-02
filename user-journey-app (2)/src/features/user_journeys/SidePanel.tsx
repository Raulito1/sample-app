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
  Monitor,
  Smartphone,
  Terminal,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Journey, JourneyStep, SignatureData, StepMetric, StepSignatures } from "../../../types";
import Icon from "../../components/Icon";

interface SidePanelProps {
  step: JourneyStep | null;
  journey?: Journey;
  isOpen: boolean;
  onClose: () => void;
  hasBackdrop?: boolean;
}

const SidePanel: React.FC<SidePanelProps> = ({
  step,
  journey,
  isOpen,
  onClose,
  hasBackdrop = true,
}) => {
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

  const signatureEntries = step.signatures
    ? (Object.entries(step.signatures).filter(
        ([, signatures]) => Array.isArray(signatures) && signatures.length > 0
      ) as [keyof StepSignatures, SignatureData[]][])
    : [];

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

  const renderSignatureComparison = (
    currentSigs: StepSignatures | undefined = {},
    targetSigs: StepSignatures | undefined = {}
  ) => {
    const safeCurrentSigs = currentSigs ?? {};
    const safeTargetSigs = targetSigs ?? {};

    const allTypes = Array.from(
      new Set([...Object.keys(safeCurrentSigs), ...Object.keys(safeTargetSigs)])
    ) as (keyof StepSignatures)[];

    return (
      <div className="space-y-6">
        {allTypes.map((type) => {
          const currList = safeCurrentSigs[type];
          const targList = safeTargetSigs[type];

          return (
            <div key={type} className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400/80 uppercase bg-cyan-100 dark:bg-cyan-900/10 px-2 py-1 rounded inline-block border border-cyan-200 dark:border-cyan-500/10">
                {type}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {/* Current */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800 p-2 text-[10px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto custom-scrollbar">
                  {currList ? (
                    <pre>{JSON.stringify(currList, null, 2)}</pre>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 italic">Not present</span>
                  )}
                </div>
                {/* Target */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-800 p-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 overflow-x-auto custom-scrollbar">
                  {targList ? (
                    <pre>{JSON.stringify(targList, null, 2)}</pre>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 italic">Not present</span>
                  )}
                </div>
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
      {hasBackdrop && (
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
	          fixed top-0 right-0 bottom-0 w-full ${hasBackdrop ? "md:w-[600px]" : "md:w-[420px] lg:w-[480px]"} bg-white dark:bg-slate-900/95 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50
	          transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
	          flex flex-col
	          ${isOpen ? "translate-x-0" : "translate-x-full"}
	        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
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

        {/* Comparison Controls */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
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

              {/* Signature Comparison */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                  <Terminal size={16} />
                  <span>Signature Differences</span>
                </h3>
                {renderSignatureComparison(step.signatures, targetStep.signatures)}
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

              {/* Drill Down Stats Section */}
              <div
                className={`space-y-8 transition-all duration-500 ${showDrillDown ? "opacity-100" : "hidden opacity-0"}`}
              >
                {/* TECHNICAL SIGNATURES */}
                {signatureEntries.length > 0 && (
                  <div className="space-y-4 animate-fade-in-up">
                    <h3 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide flex items-center gap-2">
                      <Terminal size={16} />
                      <span>Event Signatures</span>
                    </h3>
                    <div className="space-y-4">
                      {signatureEntries.map(([type, signatures]) => (
                        <div
                          key={type}
                          className="bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                          <div className="bg-slate-100 dark:bg-slate-900/80 px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-300/80">
                              {type}
                            </span>
                          </div>
                          <div className="divide-y divide-slate-200 dark:divide-slate-800/50">
                            {signatures.map((sig, idx) => (
                              <div key={idx} className="p-4 text-xs font-mono space-y-2">
                                <div className="flex items-center gap-2 mb-2">
                                  {sig.env && (
                                    <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded border border-cyan-200 dark:border-cyan-800/50">
                                      {sig.env}
                                    </span>
                                  )}
                                  {sig.action && (
                                    <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/50">
                                      {sig.action.toUpperCase()}
                                    </span>
                                  )}
                                </div>

                                {Object.entries(sig).map(([k, v]) => {
                                  if (k === "env" || k === "action") return null; // Already shown above
                                  return (
                                    <div key={k} className="grid grid-cols-[80px_1fr] gap-2">
                                      <span className="text-slate-500">{k}:</span>
                                      <span className="text-slate-700 dark:text-slate-300 break-all">
                                        {typeof v === "object" ? JSON.stringify(v) : String(v)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Device Breakdown */}
                <div className="space-y-3 animate-fade-in-up">
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                    <Monitor size={16} />
                    <span>Device Breakdown</span>
                  </h3>
                  <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center justify-between text-sm mb-2 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Smartphone size={14} /> Mobile
                      </div>
                      <span className="font-bold">12%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Monitor size={14} /> Desktop
                      </div>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

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
