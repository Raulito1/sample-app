import { ArrowUp, FileJson, FileText, Pause, Play, RefreshCw, Square } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { ANIMATION_DELAY_MS } from "../../../constants";
import { Journey, JourneyStep } from "../../../types";
import SidePanel from "./SidePanel";
import StepCard from "./StepCard";
import VsmExportButton from "./VsmExportButton";

interface JourneyVisualizerProps {
  journey: Journey;
  onReset: () => void;
}

const JourneyVisualizer: React.FC<JourneyVisualizerProps> = ({ journey, onReset }) => {
  const [visibleStepsCount, setVisibleStepsCount] = useState(0);
  const [selectedStep, setSelectedStep] = useState<JourneyStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toolbarButtonClass =
    "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60";

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
      stepRefs.current[currentStepIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isPlaying, selectedStep, visibleStepsCount]);

  const handleStepSelection = useCallback(
    (step: JourneyStep) => {
      setSelectedStep(step);
      // Find index to scroll to it
      const index = journey.steps.findIndex((s) => s.id === step.id);
      if (index !== -1 && stepRefs.current[index]) {
        stepRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    },
    [journey.steps]
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
            if (stepRefs.current[nextIndex]) {
              stepRefs.current[nextIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
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
  }, [handleStepSelection, isPlaying, journey.steps, selectedStep]);

  const handleClosePanel = () => {
    setIsPlaying(false); // Stop playing if user manually closes panel
    if (selectedStep) {
      const index = journey.steps.findIndex((s) => s.id === selectedStep.id);
      setSelectedStep(null);
      if (index !== -1 && stepRefs.current[index]) {
        setTimeout(() => {
          stepRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    } else {
      setSelectedStep(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journey, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `${journey.title.replace(/\s+/g, "_").toLowerCase()}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // If we are at the end, restart. Otherwise continue.
      if (selectedStep && selectedStep.id === journey.steps[journey.steps.length - 1].id) {
        setSelectedStep(null);
        setTimeout(() => setIsPlaying(true), 300);
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleBackToTop = () => {
    setSelectedStep(null);
    const scrollTarget =
      scrollRef.current && scrollRef.current.scrollHeight > scrollRef.current.clientHeight
        ? scrollRef.current
        : document.scrollingElement || document.documentElement;

    scrollTarget?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-128px)]">
      <div className="px-6 pt-4 flex justify-end">
        <div className="flex items-center gap-3">
          {journey.id && (
            <VsmExportButton
              journeyId={journey.id}
              journey={journey}
              buttonClassName={toolbarButtonClass}
              icon={<FileText size={16} />}
            />
          )}

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 mr-2">
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

          <button
            onClick={handleExportJSON}
            className={toolbarButtonClass}
            title="Export Journey JSON"
          >
            <FileJson size={16} />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-900/20"
          >
            <RefreshCw size={16} />
            <span className="hidden sm:inline">New Journey</span>
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div
        id="journey-visualizer-canvas"
        ref={scrollRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative p-8 md:p-16 custom-scrollbar"
      >
        {/* Decorative background line (Spine) */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />

        <div className="max-w-5xl mx-auto pb-32">
          {journey.steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
            >
              <StepCard
                step={step}
                index={index}
                totalSteps={journey.steps.length}
                isVisible={index < visibleStepsCount}
                isLast={index === journey.steps.length - 1}
                isSelected={selectedStep?.id === step.id}
                onClick={handleStepSelection}
              />
            </div>
          ))}

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

      {/* Detail Panel */}
      <SidePanel
        step={selectedStep}
        journey={journey}
        isOpen={!!selectedStep}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default JourneyVisualizer;
