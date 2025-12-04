import { Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

import { JourneyStep } from "../../../types";
import Icon from "../../components/Icon";

interface StepCardProps {
  step: JourneyStep;
  index: number;
  isVisible: boolean;
  totalSteps?: number;
  isLast: boolean;
  isSelected?: boolean;
  onClick: (step: JourneyStep) => void;
  forceLeftAlign?: boolean;
  focused?: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  index,
  isVisible,
  totalSteps,
  isLast,
  isSelected,
  onClick,
  forceLeftAlign = false,
  focused = false,
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small timeout to ensure the render phase has happened before applying the active class for transition
      const timer = setTimeout(() => setHasAnimated(true), 50);
      return () => clearTimeout(timer);
    } else {
      setHasAnimated(false);
    }
  }, [isVisible]);

  // Determine fly-in direction based on index (Zig-zag pattern)
  // Even: Fly in from left. Odd: Fly in from right. (Unless we force everything left)
  const isEven = index % 2 === 0;
  const alignLeft = forceLeftAlign || isEven;

  // Initial state styles (hidden)
  const initialTransform = alignLeft
    ? "-translate-x-full -rotate-12"
    : "translate-x-full rotate-12";
  const initialOpacity = "opacity-0 scale-50";

  // Final state styles (visible)
  const finalTransform = "translate-x-0 rotate-0";
  const finalOpacity = "opacity-100 scale-100";

  // Get Average Duration metric if available
  const avgDurationMetric = step.metrics?.find(
    (m) => m.label.toLowerCase().includes("duration") || m.label.toLowerCase().includes("time")
  );

  // Focused mode: show only the card, centered, with connecting lines to prev/next
  // Responsive for: 1440x900, 1920x1080, 2560x1440
  if (focused) {
    const hasPrev = index > 0;
    const hasNext = totalSteps ? index < totalSteps - 1 : false;

    return (
      <div className="w-full flex flex-col items-center group perspective-1000">
        {/* Connecting line from previous step */}
        {hasPrev && (
          <div className="flex flex-col items-center mb-4">
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-500" />
            <div className="w-1 h-8 lg:h-10 2xl:h-12 bg-gradient-to-b from-slate-300 to-cyan-500 dark:from-slate-600 dark:to-cyan-400" />
          </div>
        )}

        <div
          onClick={() => onClick(step)}
          className={`
            relative w-full p-4 sm:p-6 lg:p-8 2xl:p-10 rounded-2xl border backdrop-blur-md shadow-2xl
            transform transition-all duration-500
            cursor-pointer
            border-cyan-400 bg-white dark:bg-slate-700/90 scale-100 shadow-[0_0_40px_rgba(34,211,238,0.2)]
          `}
        >
          {/* Pulsating Background */}
          <div className="absolute -inset-3 bg-cyan-500/20 rounded-3xl blur-xl animate-pulse -z-10 transition-all duration-500"></div>

          <div className="flex items-start justify-between mb-2 lg:mb-3 2xl:mb-4">
            <span className="text-xs lg:text-sm 2xl:text-base font-bold tracking-wider uppercase text-cyan-600 dark:text-cyan-300">
              {step.phase}
            </span>
            <span className="text-xs lg:text-sm 2xl:text-base text-slate-400 dark:text-slate-500">
              Step {index + 1} of {totalSteps}
            </span>
          </div>
          <h3 className="text-xl lg:text-2xl 2xl:text-3xl font-bold mb-2 lg:mb-3 2xl:mb-4 text-slate-900 dark:text-cyan-50">
            {step.title}
          </h3>
          <p className="text-sm lg:text-base 2xl:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {/* Average Duration Metric */}
          {avgDurationMetric && (
            <div className="mt-4 lg:mt-6 2xl:mt-8 pt-4 lg:pt-5 2xl:pt-6 border-t border-slate-200 dark:border-slate-600/50">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 lg:p-4 2xl:p-5 border border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                    <Clock className="w-4 h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="text-xs lg:text-sm 2xl:text-base text-slate-500 dark:text-slate-400 font-medium">
                    {avgDurationMetric.label}
                  </span>
                </div>
                <span className="text-lg lg:text-xl 2xl:text-2xl font-bold text-slate-900 dark:text-white">
                  {avgDurationMetric.value}
                </span>
              </div>
            </div>
          )}

          {/* Icon */}
          <div className="mt-6 lg:mt-8 2xl:mt-10 flex justify-center">
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 2xl:w-24 2xl:h-24 rounded-full flex items-center justify-center bg-white dark:bg-slate-800 border-4 border-cyan-400 ring-4 ring-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/50 animate-ping opacity-75" />
              <Icon
                name={step.iconName}
                className="text-cyan-500 dark:text-cyan-300 w-7 h-7 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10"
                size={32}
              />
            </div>
          </div>
        </div>

        {/* Connecting line to next step */}
        {hasNext && (
          <div className="flex flex-col items-center mt-4">
            <div className="w-1 h-8 lg:h-10 2xl:h-12 bg-gradient-to-b from-cyan-500 to-slate-300 dark:from-cyan-400 dark:to-slate-600" />
            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-slate-400 dark:border-slate-500" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center mb-16 ${alignLeft ? "flex-row" : "flex-row-reverse"} w-full max-w-4xl mx-auto group perspective-1000`}
    >
      {/* Central Connector Line Segment (Vertical) */}
      {/* This draws the line connecting this step to the NEXT one */}
      {!isLast && (
        <div
          className={`absolute left-1/2 top-12 bottom-[-4rem] w-1 bg-gradient-to-b from-cyan-500 to-purple-500 -translate-x-1/2 transition-all duration-1000 delay-500 ease-in-out origin-top ${hasAnimated ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}
          style={{ zIndex: 0 }}
        ></div>
      )}

      {/* The Content Card */}
      <div
        onClick={() => onClick(step)}
        className={`
          relative w-5/12 p-6 rounded-2xl border backdrop-blur-md shadow-2xl
          transform transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${hasAnimated ? finalTransform : initialTransform}
          ${hasAnimated ? finalOpacity : initialOpacity}
          cursor-pointer
          ${
            isSelected
              ? "border-cyan-400 bg-white dark:bg-slate-700/90 scale-105 shadow-[0_0_40px_rgba(34,211,238,0.2)]"
              : "border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 hover:scale-105 hover:bg-white dark:hover:bg-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]"
          }
          active:scale-95
        `}
        style={{ zIndex: 10 }}
      >
        {/* Pulsating Background for Selected State ONLY */}
        {isSelected && (
          <div className="absolute -inset-3 bg-cyan-500/20 rounded-3xl blur-xl animate-pulse -z-10 transition-all duration-500"></div>
        )}

        <div className="flex items-start justify-between mb-2">
          <span
            className={`text-xs font-bold tracking-wider uppercase ${isSelected ? "text-cyan-600 dark:text-cyan-300" : "text-cyan-600 dark:text-cyan-400"}`}
          >
            {step.phase}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Step {index + 1}
            {totalSteps ? ` of ${totalSteps}` : ""}
          </span>
        </div>
        <h3
          className={`text-xl font-bold mb-2 ${isSelected ? "text-slate-900 dark:text-cyan-50" : "text-slate-800 dark:text-white"}`}
        >
          {step.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {step.description}
        </p>

        {/* Average Duration Metric (Visible when Selected) */}
        {isSelected && avgDurationMetric && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600/50">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {avgDurationMetric.label}
                </span>
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {avgDurationMetric.value}
              </span>
            </div>
          </div>
        )}

        {/* Hint for interactivity */}
        <div
          className={`mt-4 pt-3 border-t flex items-center text-xs transition-colors ${isSelected ? "border-slate-300 dark:border-slate-600 text-cyan-600 dark:text-cyan-300" : "border-slate-200 dark:border-slate-700/50 text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-300"}`}
        >
          <span
            className={`${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity duration-300`}
          >
            {isSelected ? "Viewing details..." : "View analytics & details →"}
          </span>
        </div>
      </div>

      {/* The Central Node/Icon */}
      <div className="w-2/12 flex justify-center relative z-20 pointer-events-none">
        <div
          className={`
             w-16 h-16 rounded-full flex items-center justify-center 
             shadow-[0_0_30px_rgba(34,211,238,0.2)]
             transform transition-all duration-700 delay-300
             ${hasAnimated ? "scale-100 opacity-100" : "scale-0 opacity-0"}
             ${isSelected ? "bg-white dark:bg-slate-800 border-4 border-cyan-400 ring-4 ring-cyan-500/20" : "bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800"}
           `}
        >
          {/* Only animate ring if selected */}
          <div
            className={`
             absolute inset-0 rounded-full border-2 border-cyan-500/50 opacity-0 
             ${isSelected ? "animate-ping opacity-75" : ""}
          `}
          />
          <Icon
            name={step.iconName}
            className={
              isSelected ? "text-cyan-500 dark:text-cyan-300" : "text-cyan-600 dark:text-cyan-400"
            }
            size={28}
          />
        </div>
      </div>

      {/* Empty spacer to balance the flex container */}
      <div className="w-5/12"></div>
    </div>
  );
};

export default StepCard;
