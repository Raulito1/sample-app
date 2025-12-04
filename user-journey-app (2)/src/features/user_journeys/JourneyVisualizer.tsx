import { ArrowUp, Pause, Play, Square } from "lucide-react";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { ANIMATION_DELAY_MS } from "../../../constants";
import { Journey, JourneyStep } from "../../../types";
import SidePanel from "./SidePanel";

interface JourneyVisualizerProps {
  journey: Journey;
  onActionButtonChange?: (action: ReactNode | null) => void;
}

const JourneyVisualizer: React.FC<JourneyVisualizerProps> = ({ journey, onActionButtonChange }) => {
  const [visibleStepsCount, setVisibleStepsCount] = useState(0);
  const [selectedStep, setSelectedStep] = useState<JourneyStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollStepIntoView = useCallback((index: number) => {
    const target = stepRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  // Initial fly-in animation
  useEffect(() => {
    // Reset when journey changes
    setVisibleStepsCount(0);
    setSelectedStep(null);
    setIsPlaying(false);
    stepRefs.current = [];

    // Start the sequential reveal
    const interval = setInterval(() => {
      setVisibleStepsCount((prev) => {
        if (prev < journey.steps.length) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, ANIMATION_DELAY_MS);

    return () => clearInterval(interval);
  }, [journey]);

  // Auto-scroll logic for fly-in
  useEffect(() => {
    if (selectedStep || isPlaying) return;

    const currentStepIndex = visibleStepsCount - 1;
    if (currentStepIndex >= 0 && stepRefs.current[currentStepIndex]) {
      scrollStepIntoView(currentStepIndex);
    }
  }, [isPlaying, scrollStepIntoView, selectedStep, visibleStepsCount]);

  const handleStepSelection = useCallback(
    (step: JourneyStep) => {
      setSelectedStep(step);
      // Find index to scroll to it
      const index = journey.steps.findIndex((s) => s.id === step.id);
      if (index !== -1 && stepRefs.current[index]) {
        scrollStepIntoView(index);
      }
    },
    [journey.steps, scrollStepIntoView]
  );

  // Presentation Mode Logic
  useEffect(() => {
    if (isPlaying) {
      // If nothing is selected, start at 0
      if (!selectedStep) {
        handleStepSelection(journey.steps[0]);
      }

      playIntervalRef.current = setInterval(() => {
        setSelectedStep((prevStep) => {
          if (!prevStep) return journey.steps[0];

          const currentIndex = journey.steps.findIndex((s) => s.id === prevStep.id);
          const nextIndex = currentIndex + 1;

          if (nextIndex < journey.steps.length) {
            const nextStep = journey.steps[nextIndex];
            // Manually trigger scroll for the next step
            scrollStepIntoView(nextIndex);
            return nextStep;
          } else {
            // End of playlist
            setIsPlaying(false);
            return prevStep;
          }
        });
      }, 4000); // 4 seconds per slide
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [handleStepSelection, isPlaying, journey.steps, scrollStepIntoView, selectedStep]);

  // Keep the currently detailed step centered when navigating with the side panel open
  useEffect(() => {
    if (!selectedStep) return;

    const selectedIndex = journey.steps.findIndex((s) => s.id === selectedStep.id);
    if (selectedIndex !== -1) {
      scrollStepIntoView(selectedIndex);
    }
  }, [journey.steps, scrollStepIntoView, selectedStep]);

  const handleClosePanel = () => {
    setIsPlaying(false); // Stop playing if user manually closes panel
    if (selectedStep) {
      const index = journey.steps.findIndex((s) => s.id === selectedStep.id);
      setSelectedStep(null);
      if (index !== -1 && stepRefs.current[index]) {
        setTimeout(() => {
          scrollStepIntoView(index);
        }, 100);
      }
    } else {
      setSelectedStep(null);
    }
  };

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    // If we are at the end, restart. Otherwise continue.
    if (selectedStep && selectedStep.id === journey.steps[journey.steps.length - 1].id) {
      setSelectedStep(null);
      setTimeout(() => setIsPlaying(true), 300);
    } else {
      setIsPlaying(true);
    }
  }, [isPlaying, journey.steps, selectedStep]);

  const handleBackToTop = () => {
    setSelectedStep(null);
    const scrollTarget =
      scrollRef.current && scrollRef.current.scrollHeight > scrollRef.current.clientHeight
        ? scrollRef.current
        : document.scrollingElement || document.documentElement;

    scrollTarget?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateStep = useCallback(
    (direction: "prev" | "next") => {
      if (!journey.steps.length) return;

      // Default to the first step if none is selected
      if (!selectedStep) {
        handleStepSelection(journey.steps[0]);
        return;
      }

      const currentIndex = journey.steps.findIndex((s) => s.id === selectedStep.id);
      const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

      if (targetIndex >= 0 && targetIndex < journey.steps.length) {
        handleStepSelection(journey.steps[targetIndex]);
      }
    },
    [handleStepSelection, journey.steps, selectedStep]
  );

  const currentIndex = selectedStep ? journey.steps.findIndex((s) => s.id === selectedStep.id) : -1;
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < journey.steps.length - 1;

  useEffect(() => {
    if (!onActionButtonChange) return;

    const action = (
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            isPlaying
              ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400"
              : "text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          <span>{isPlaying ? "Presenting..." : "Presentation Mode"}</span>
        </button>
        {isPlaying && (
          <button
            onClick={() => {
              setIsPlaying(false);
              setSelectedStep(null);
            }}
            className="p-1.5 ml-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
            title="Stop"
          >
            <Square size={14} fill="currentColor" />
          </button>
        )}
      </div>
    );

    onActionButtonChange(action);

    return () => {
      onActionButtonChange(null);
    };
  }, [isPlaying, onActionButtonChange, togglePlay]);

  return (
    <div className="flex min-h-[calc(100vh-128px)] gap-4 md:gap-6 px-4 md:px-8 overflow-hidden items-stretch">
      <div
        id="journey-visualizer-canvas"
        ref={scrollRef}
        className="relative h-[calc(100vh-128px)] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 basis-1/2 min-w-0 shrink-0"
      >
        {/* Decorative background line (Spine) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />

        <div className="h-full overflow-y-auto overflow-x-hidden p-8 md:p-12 custom-scrollbar">
          <div className="pb-32 max-w-5xl mx-auto">
            {journey.steps.map((step, index) => {
              const isActive = selectedStep?.id === step.id;
              const isFirst = index === 0;
              const isLast = index === journey.steps.length - 1;
              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  className="relative"
                >
                  {/* Connecting line from previous step */}
                  {!isFirst && isActive && (
                    <div className="absolute left-1/2 bottom-full w-1 h-6 -translate-x-1/2 bg-gradient-to-b from-purple-500 to-cyan-500 z-0" />
                  )}
                  {/* Connecting line to next step */}
                  {!isLast && (
                    <div className="absolute left-1/2 top-full w-1 h-6 -translate-x-1/2 bg-gradient-to-b from-cyan-500 to-purple-500 z-0" />
                  )}
                  <div
                    onClick={() => handleStepSelection(step)}
                    className={`
                      relative z-10 w-full rounded-2xl border p-6 cursor-pointer transition-all mb-6
                      ${isActive ? "border-cyan-400 bg-white shadow-lg shadow-cyan-900/10 dark:bg-slate-800/80" : "border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 hover:border-cyan-400"}
                    `}
                  >
                    {/* Pulsating Background for Active State */}
                    {isActive && (
                      <div className="absolute -inset-3 bg-cyan-500/20 rounded-3xl blur-xl animate-pulse -z-10" />
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-cyan-600">
                          {step.phase}
                        </span>
                        <span className="text-[11px] text-slate-500">Step {index + 1}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
                  </div>
                </div>
              );
            })}

            {/* Completion State */}
            {visibleStepsCount === journey.steps.length && (
              <div
                className="flex flex-col items-center mt-12 animate-fade-in-up opacity-0 fill-mode-forwards"
                style={{ animationDelay: "1s" }}
              >
                <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-cyan-500/30 rounded-xl p-8 text-center max-w-md backdrop-blur-sm shadow-xl">
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 dark:from-cyan-400 dark:to-purple-400 mb-2">
                    Journey Complete
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    The user has successfully navigated the entire flow.
                  </p>
                </div>
                <Button
                  onClick={handleBackToTop}
                  variant="secondary"
                  className="mt-6 shadow-lg hover:-translate-y-0.5 transition-transform"
                >
                  <ArrowUp size={16} />
                  Back to Top
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-128px)] basis-1/2 min-w-0 shrink-0">
        {selectedStep ? (
          <SidePanel
            step={selectedStep}
            journey={journey}
            isOpen={!!selectedStep}
            onClose={handleClosePanel}
            hasBackdrop={false}
            layout="inline"
            isPresenting={isPlaying}
            onNextStep={() => handleNavigateStep("next")}
            onPrevStep={() => handleNavigateStep("prev")}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
          />
        ) : (
          <div className="h-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-700/80 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Select a step to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneyVisualizer;
