import { FileJson, Play, Trash2 } from "lucide-react";
import React from "react";

import { JourneyStep } from "../../../types";
import Icon from "../../components/Icon";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface JourneyPreviewProps {
  steps: JourneyStep[];
  onDeleteStep: (id: string) => void;
  onFinish: () => void;
}

const JourneyPreview: React.FC<JourneyPreviewProps> = ({ steps, onDeleteStep, onFinish }) => {
  return (
    <Card className="flex-1 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
      <CardHeader className="flex-row items-center justify-between pb-0 px-4 lg:px-6 2xl:px-10 pt-4 lg:pt-5 2xl:pt-8">
        <CardTitle className="text-base lg:text-lg 2xl:text-2xl font-bold text-slate-700 dark:text-slate-300">
          Journey Preview ({steps.length} Steps)
        </CardTitle>
        {steps.length > 0 && (
          <Button
            type="button"
            onClick={onFinish}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 lg:px-6 2xl:px-10 py-2 lg:py-2.5 2xl:py-4 text-sm lg:text-base 2xl:text-xl shadow-lg shadow-cyan-900/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Play size={18} fill="currentColor" className="lg:w-5 lg:h-5 2xl:w-7 2xl:h-7" />{" "}
            Visualize Journey
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-4 lg:pt-5 2xl:pt-8 px-4 lg:px-6 2xl:px-10 pb-4 lg:pb-6 2xl:pb-10 min-h-[400px] lg:min-h-[480px] 2xl:min-h-[640px] overflow-y-auto custom-scrollbar">
        {steps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-600 space-y-4 lg:space-y-5 2xl:space-y-8">
            <div className="p-5 lg:p-6 2xl:p-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FileJson size={48} className="opacity-40 lg:w-14 lg:h-14 2xl:w-20 2xl:h-20" />
            </div>
            <div className="text-center">
              <p className="text-base lg:text-lg 2xl:text-2xl font-medium text-slate-600 dark:text-slate-400">
                No steps yet
              </p>
              <p className="text-sm lg:text-base 2xl:text-xl">
                Import a JSON file or add steps manually.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4 2xl:space-y-6 relative">
            <div className="absolute left-5 lg:left-6 2xl:left-8 top-4 bottom-4 w-0.5 2xl:w-1 bg-slate-200 dark:bg-slate-800"></div>

            {steps.map((step, index) => (
              <div
                key={step.id}
                className="relative pl-12 lg:pl-14 2xl:pl-20 group animate-fade-in-up"
              >
                <div className="absolute left-0 top-0 w-10 h-10 lg:w-12 lg:h-12 2xl:w-16 2xl:h-16 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm lg:text-base 2xl:text-xl text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:border-cyan-500 transition-colors z-10 shadow-lg shadow-black/5 dark:shadow-black/20">
                  {index + 1}
                </div>

                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm p-0 gap-0 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors">
                  <CardContent className="flex justify-between items-start p-3 lg:p-4 2xl:p-6">
                    <div className="flex-1 mr-3 lg:mr-4 2xl:mr-6">
                      <div className="flex items-center gap-1.5 lg:gap-2 2xl:gap-3 mb-1 lg:mb-1.5 2xl:mb-3">
                        <span className="text-[9px] lg:text-[10px] 2xl:text-sm uppercase font-bold text-cyan-600 dark:text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20 px-1.5 py-0.5 lg:px-2 lg:py-1 2xl:px-3 2xl:py-1.5 rounded">
                          {step.phase}
                        </span>
                        <div className="flex items-center gap-1 2xl:gap-2 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 lg:px-2 lg:py-1 2xl:px-3 2xl:py-1.5 rounded border border-slate-200 dark:border-slate-700 text-[9px] lg:text-[10px] 2xl:text-sm text-slate-500 dark:text-slate-400">
                          <Icon
                            name={step.iconName}
                            size={10}
                            className="lg:w-3 lg:h-3 2xl:w-4 2xl:h-4"
                          />
                          <span>{step.iconName}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base lg:text-lg 2xl:text-2xl">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs lg:text-sm 2xl:text-lg mt-1 lg:mt-1.5 2xl:mt-2 line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteStep(step.id)}
                      className="text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 w-8 h-8 lg:w-10 lg:h-10 2xl:w-14 2xl:h-14"
                      title="Remove Step"
                    >
                      <Trash2 size={18} className="lg:w-5 lg:h-5 2xl:w-7 2xl:h-7" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JourneyPreview;
