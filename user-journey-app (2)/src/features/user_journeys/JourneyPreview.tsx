import { Code, FileJson, Play, Trash2 } from "lucide-react";
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
      <CardHeader className="flex-row items-center justify-between pb-0">
        <CardTitle className="text-lg font-bold text-slate-700 dark:text-slate-300">
          Journey Preview ({steps.length} Steps)
        </CardTitle>
        {steps.length > 0 && (
          <Button
            type="button"
            onClick={onFinish}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 shadow-lg shadow-cyan-900/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Play size={18} fill="currentColor" /> Visualize Journey
          </Button>
        )}
      </CardHeader>

      <CardContent className="pt-4 min-h-[400px] overflow-y-auto custom-scrollbar">
        {steps.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-600 space-y-4">
            <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <FileJson size={48} className="opacity-40" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-600 dark:text-slate-400">No steps yet</p>
              <p className="text-sm">Import a JSON file or add steps manually.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 relative">
            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

            {steps.map((step, index) => (
              <div key={step.id} className="relative pl-14 group animate-fade-in-up">
                <div className="absolute left-0 top-0 w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:border-cyan-500 transition-colors z-10 shadow-lg shadow-black/5 dark:shadow-black/20">
                  {index + 1}
                </div>

                <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 shadow-sm p-0 gap-0 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors">
                  <CardContent className="flex justify-between items-start p-4">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-cyan-600 dark:text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20 px-1.5 py-0.5 rounded">
                          {step.phase}
                        </span>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                          <Icon name={step.iconName} size={10} />
                          <span>{step.iconName}</span>
                        </div>
                        {step.signatures && Object.keys(step.signatures).length > 0 && (
                          <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Code size={10} /> Data
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteStep(step.id)}
                      className="text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      title="Remove Step"
                    >
                      <Trash2 size={18} />
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
