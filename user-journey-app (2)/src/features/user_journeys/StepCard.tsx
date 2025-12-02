import React, { useEffect, useState } from 'react';
import { JourneyStep } from '../../../types';
import Icon from '../../components/Icon';

interface StepCardProps {
  step: JourneyStep;
  index: number;
  isVisible: boolean;
  totalSteps: number;
  isLast: boolean;
  isSelected?: boolean;
  onClick: (step: JourneyStep) => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isVisible, totalSteps, isLast, isSelected, onClick }) => {
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
  // Even: Fly in from left. Odd: Fly in from right.
  const isEven = index % 2 === 0;
  
  // Initial state styles (hidden)
  const initialTransform = isEven ? '-translate-x-full -rotate-12' : 'translate-x-full rotate-12';
  const initialOpacity = 'opacity-0 scale-50';

  // Final state styles (visible)
  const finalTransform = 'translate-x-0 rotate-0';
  const finalOpacity = 'opacity-100 scale-100';

  return (
    <div className={`relative flex items-center mb-16 ${isEven ? 'flex-row' : 'flex-row-reverse'} w-full max-w-4xl mx-auto group perspective-1000`}>
      
      {/* Central Connector Line Segment (Vertical) */}
      {/* This draws the line connecting this step to the NEXT one */}
      {!isLast && (
        <div 
          className={`absolute left-1/2 top-12 bottom-[-4rem] w-1 bg-gradient-to-b from-cyan-500 to-purple-500 -translate-x-1/2 transition-all duration-1000 delay-500 ease-in-out origin-top ${hasAnimated ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}
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
          ${isSelected 
            ? 'border-cyan-400 bg-white dark:bg-slate-700/90 scale-105 shadow-[0_0_40px_rgba(34,211,238,0.2)]' 
            : 'border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/60 hover:scale-105 hover:bg-white dark:hover:bg-slate-700/80 hover:border-cyan-400 dark:hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]'
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
          <span className={`text-xs font-bold tracking-wider uppercase ${isSelected ? 'text-cyan-600 dark:text-cyan-300' : 'text-cyan-600 dark:text-cyan-400'}`}>{step.phase}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">Step {index + 1}</span>
        </div>
        <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-slate-900 dark:text-cyan-50' : 'text-slate-800 dark:text-white'}`}>{step.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{step.description}</p>
        
        {/* Technical Signatures Section (Visible when Selected) */}
        {isSelected && step.signatures && Object.keys(step.signatures).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600/50">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Icon name="Terminal" size={12} className="text-cyan-600 dark:text-cyan-400" />
                    Technical Signatures
                </div>
                <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                    {Object.entries(step.signatures).map(([type, signatures]) => (
                        <div key={type} className="space-y-1">
                            <h5 className="text-[10px] font-mono font-bold text-cyan-700 dark:text-cyan-300/90 bg-cyan-100 dark:bg-cyan-900/20 px-2 py-1 rounded inline-block border border-cyan-200 dark:border-cyan-500/20">
                                {type}
                            </h5>
                            <div className="space-y-2 pl-2 border-l border-slate-300 dark:border-slate-700/50 ml-1">
                                {(signatures as any[]).map((sig, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-900/60 rounded p-2 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-sm">
                                        <div className="grid grid-cols-1 gap-1">
                                            {Object.entries(sig).map(([k, v]) => (
                                                <div key={k} className="flex gap-2 border-b border-slate-200 dark:border-slate-800/50 last:border-0 pb-0.5 last:pb-0">
                                                    <span className="text-slate-500 min-w-[60px] font-semibold">{k}:</span>
                                                    <span className="text-slate-700 dark:text-slate-300 break-all">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Hint for interactivity */}
        <div className={`mt-4 pt-3 border-t flex items-center text-xs transition-colors ${isSelected ? 'border-slate-300 dark:border-slate-600 text-cyan-600 dark:text-cyan-300' : 'border-slate-200 dark:border-slate-700/50 text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'}`}>
            <span className={`${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                {isSelected ? 'Viewing details...' : 'View analytics & details →'}
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
             ${hasAnimated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
             ${isSelected ? 'bg-white dark:bg-slate-800 border-4 border-cyan-400 ring-4 ring-cyan-500/20' : 'bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-800'}
           `}
        >
          {/* Only animate ring if selected */}
          <div className={`
             absolute inset-0 rounded-full border-2 border-cyan-500/50 opacity-0 
             ${isSelected ? 'animate-ping opacity-75' : ''}
          `} />
          <Icon name={step.iconName} className={isSelected ? "text-cyan-500 dark:text-cyan-300" : "text-cyan-600 dark:text-cyan-400"} size={28} />
        </div>
      </div>

      {/* Empty spacer to balance the flex container */}
      <div className="w-5/12"></div>

    </div>
  );
};

export default StepCard;
