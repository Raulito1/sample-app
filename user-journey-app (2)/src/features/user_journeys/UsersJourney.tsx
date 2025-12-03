import { CalendarIcon, Check, ChevronDown, Plus } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { SAMPLE_JOURNEYS } from "../../../constants";
import { Journey, JourneyStep } from "../../../types";
import SidePanel from "./SidePanel";
import StepCard from "./StepCard";

const formatDate = (date?: Date) => {
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const isValidDate = (date?: Date) => !!date && !isNaN(date.getTime());

interface UsersJourneyProps {
  onCreateNew: () => void;
  onSelectedJourneyChange?: (journey: Journey | null) => void;
}

const UsersJourney: React.FC<UsersJourneyProps> = ({ onCreateNew, onSelectedJourneyChange }) => {
  const [valueStreamFilter, setValueStreamFilter] = useState("");
  const [journeyFilter, setJourneyFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<Date | undefined>(undefined);
  const [endMonth, setEndMonth] = useState<Date | undefined>(undefined);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [selectedStep, setSelectedStep] = useState<JourneyStep | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const primaryButtonClass =
    "rounded-lg px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 transition-colors";
  const ghostButtonClass =
    "rounded-lg px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  const valueStreamOptions = Array.from(
    new Set(SAMPLE_JOURNEYS.map((j) => j.valueStreamName).filter(Boolean))
  );

  const handleApplyFilters = () => {
    const matches = SAMPLE_JOURNEYS.filter((j) => {
      let ok = true;
      if (valueStreamFilter) ok = ok && j.valueStreamName === valueStreamFilter;
      if (journeyFilter) ok = ok && j.id === journeyFilter;
      // Date filters would typically be applied server-side; here they are decorative.
      return ok;
    });
    const journey = matches[0] || null;
    stepRefs.current = [];
    setSelectedJourney(journey);
    setSelectedStep(journey?.steps[0] ?? null);
  };

  const handleClearFilters = () => {
    setValueStreamFilter("");
    setJourneyFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
    setStartMonth(undefined);
    setEndMonth(undefined);
    setStartDateOpen(false);
    setEndDateOpen(false);
    setSelectedJourney(null);
    setSelectedStep(null);
    stepRefs.current = [];
  };

  const handleClosePanel = () => {
    // Closing the panel should return the UI to a fresh search state
    handleClearFilters();
  };

  const scrollStepIntoView = useCallback((index: number) => {
    const target = stepRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  const handleSelectStep = (step: JourneyStep) => {
    setSelectedStep(step);
    if (!selectedJourney) return;
    const index = selectedJourney.steps.findIndex((s) => s.id === step.id);
    if (index !== -1) {
      scrollStepIntoView(index);
    }
  };

  const handleNavigateStep = (direction: "prev" | "next") => {
    if (!selectedJourney || !selectedJourney.steps.length) return;

    // If nothing is selected yet, open the first step
    if (!selectedStep) {
      setSelectedStep(selectedJourney.steps[0]);
      return;
    }

    const currentIndex = selectedJourney.steps.findIndex((s) => s.id === selectedStep.id);
    const targetIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= 0 && targetIndex < selectedJourney.steps.length) {
      const targetStep = selectedJourney.steps[targetIndex];
      setSelectedStep(targetStep);
      scrollStepIntoView(targetIndex);
    }
  };

  useEffect(() => {
    onSelectedJourneyChange?.(selectedJourney);
  }, [onSelectedJourneyChange, selectedJourney]);

  // Keep the selected card centered when the selection changes (e.g., via filters or side panel)
  useEffect(() => {
    if (!selectedJourney || !selectedStep) return;

    const selectedIndex = selectedJourney.steps.findIndex((s) => s.id === selectedStep.id);
    if (selectedIndex !== -1) {
      scrollStepIntoView(selectedIndex);
    }
  }, [scrollStepIntoView, selectedJourney, selectedStep]);

  const currentIndex = selectedStep
    ? (selectedJourney?.steps.findIndex((s) => s.id === selectedStep.id) ?? -1)
    : -1;
  const canGoPrev = currentIndex > 0;
  const canGoNext =
    selectedJourney && currentIndex >= 0 ? currentIndex < selectedJourney.steps.length - 1 : false;

  return (
    <div className="min-h-[calc(100vh-128px)] text-slate-900 dark:text-slate-200 overflow-y-auto custom-scrollbar">
      {/* Content */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Filters + Create New (hidden while a step is selected to focus on details) */}
        {!selectedStep && (
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-1">
                  Journey Catalog
                </p>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Search existing journeys
                </h2>
              </div>
              <Button onClick={onCreateNew} className={primaryButtonClass}>
                <Plus size={16} />
                <span>Create new journey</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Value stream
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm font-normal text-slate-900 dark:text-white hover:border-cyan-500/50"
                    >
                      <span className="truncate">{valueStreamFilter || "All value streams"}</span>
                      <ChevronDown className="size-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[240px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <DropdownMenuItem
                      onSelect={() => setValueStreamFilter("")}
                      className="flex items-center justify-between"
                    >
                      <span>All value streams</span>
                      {!valueStreamFilter && <Check size={14} className="text-cyan-600" />}
                    </DropdownMenuItem>
                    {valueStreamOptions.map((stream) => (
                      <DropdownMenuItem
                        key={stream}
                        onSelect={() => setValueStreamFilter(stream)}
                        className="flex items-center justify-between"
                      >
                        <span>{stream}</span>
                        {valueStreamFilter === stream && (
                          <Check size={14} className="text-cyan-600" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  User journey
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm font-normal text-slate-900 dark:text-white hover:border-cyan-500/50"
                    >
                      <span className="truncate">
                        {journeyFilter
                          ? SAMPLE_JOURNEYS.find((j) => j.id === journeyFilter)?.title ||
                            "Select journey"
                          : "All journeys"}
                      </span>
                      <ChevronDown className="size-4 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[240px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  >
                    <DropdownMenuItem
                      onSelect={() => setJourneyFilter("")}
                      className="flex items-center justify-between"
                    >
                      <span>All journeys</span>
                      {!journeyFilter && <Check size={14} className="text-cyan-600" />}
                    </DropdownMenuItem>
                    {SAMPLE_JOURNEYS.map((j) => (
                      <DropdownMenuItem
                        key={j.id}
                        onSelect={() => setJourneyFilter(j.id)}
                        className="flex items-center justify-between"
                      >
                        <span>{j.title}</span>
                        {journeyFilter === j.id && <Check size={14} className="text-cyan-600" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Start date
                </Label>
                <div className="relative flex items-center">
                  <Input
                    value={startDateFilter}
                    placeholder="June 01, 2025"
                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 pr-12 text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      setStartDateFilter(value);
                      if (!value.trim()) {
                        setStartDate(undefined);
                        setStartMonth(undefined);
                        return;
                      }
                      const parsed = new Date(value);
                      if (isValidDate(parsed)) {
                        setStartDate(parsed);
                        setStartMonth(parsed);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setStartDateOpen(true);
                      }
                    }}
                  />
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-4" />
                        <span className="sr-only">Select start date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={startDate}
                        captionLayout="dropdown"
                        month={startMonth}
                        onMonthChange={setStartMonth}
                        onSelect={(date) => {
                          setStartDate(date);
                          setStartDateFilter(formatDate(date));
                          if (date) {
                            setStartMonth(date);
                            setStartDateOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  End date
                </Label>
                <div className="relative flex items-center">
                  <Input
                    value={endDateFilter}
                    placeholder="June 15, 2025"
                    className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 pr-12 text-sm"
                    onChange={(e) => {
                      const value = e.target.value;
                      setEndDateFilter(value);
                      if (!value.trim()) {
                        setEndDate(undefined);
                        setEndMonth(undefined);
                        return;
                      }
                      const parsed = new Date(value);
                      if (isValidDate(parsed)) {
                        setEndDate(parsed);
                        setEndMonth(parsed);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setEndDateOpen(true);
                      }
                    }}
                  />
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-1/2 right-2 size-8 -translate-y-1/2"
                      >
                        <CalendarIcon className="size-4" />
                        <span className="sr-only">Select end date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="end"
                      alignOffset={-8}
                      sideOffset={10}
                    >
                      <Calendar
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        month={endMonth}
                        onMonthChange={setEndMonth}
                        onSelect={(date) => {
                          setEndDate(date);
                          setEndDateFilter(formatDate(date));
                          if (date) {
                            setEndMonth(date);
                            setEndDateOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 justify-end">
              <Button onClick={handleClearFilters} variant="ghost" className={ghostButtonClass}>
                Clear
              </Button>
              <Button onClick={handleApplyFilters} className={primaryButtonClass}>
                Apply filters
              </Button>
            </div>
          </div>
        )}

        {/* Steps + Fly-in panel */}
        {selectedJourney ? (
          <div className="relative">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {selectedJourney.title}
                </span>
                <span className="hidden sm:inline"> • {selectedJourney.steps.length} steps</span>
              </div>
            </div>

            <div className="flex flex-col h-[calc(100vh-260px)]">
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative p-4 md:p-10 custom-scrollbar">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2" />
                <div
                  className={`pb-24 ${
                    selectedStep ? "w-full lg:mr-[520px] lg:ml-0" : "max-w-5xl mx-auto"
                  }`}
                >
                  {selectedJourney.steps.map((step, index) => (
                    <div
                      key={step.id}
                      ref={(el) => {
                        stepRefs.current[index] = el;
                      }}
                    >
                      <StepCard
                        step={step}
                        index={index}
                        totalSteps={selectedJourney.steps.length}
                        isVisible={true}
                        isLast={index === selectedJourney.steps.length - 1}
                        isSelected={selectedStep?.id === step.id}
                        onClick={handleSelectStep}
                        forceLeftAlign={!!selectedStep}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SidePanel
              step={selectedStep}
              journey={selectedJourney}
              isOpen={!!selectedStep}
              onClose={handleClosePanel}
              hasBackdrop={false}
              onNextStep={() => handleNavigateStep("next")}
              onPrevStep={() => handleNavigateStep("prev")}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-sm text-slate-500/90 dark:text-slate-400/90 bg-white/60 dark:bg-slate-900/50">
            No journeys match these filters yet.
          </div>
        )}
      </main>
    </div>
  );
};

export default UsersJourney;
