import { Layers } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface JourneyDetailsFormProps {
  title: string;
  description: string;
  valueStream: string;
  startDate: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onValueStreamChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
}

const JourneyDetailsForm: React.FC<JourneyDetailsFormProps> = ({
  title,
  description,
  valueStream,
  startDate,
  onTitleChange,
  onDescriptionChange,
  onValueStreamChange,
  onStartDateChange,
}) => {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2 lg:pb-3 2xl:pb-6 px-4 lg:px-6 2xl:px-10 pt-4 lg:pt-5 2xl:pt-8">
        <CardTitle className="text-base lg:text-lg 2xl:text-2xl font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2 lg:gap-3 2xl:gap-4">
          <Layers size={18} className="lg:w-5 lg:h-5 2xl:w-7 2xl:h-7" />
          Journey Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 lg:space-y-4 2xl:space-y-6 px-4 lg:px-6 2xl:px-10 pb-4 lg:pb-6 2xl:pb-10">
        <div>
          <Label className="block text-xs lg:text-sm 2xl:text-base font-semibold text-slate-500 uppercase mb-1 lg:mb-1.5 2xl:mb-3">
            Title
          </Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 2xl:px-6 2xl:py-4 text-sm lg:text-base 2xl:text-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. Sign Up Flow"
          />
        </div>
        <div>
          <Label className="block text-xs lg:text-sm 2xl:text-base font-semibold text-slate-500 uppercase mb-1 lg:mb-1.5 2xl:mb-3">
            Value Stream
          </Label>
          <Input
            type="text"
            value={valueStream}
            onChange={(e) => onValueStreamChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 2xl:px-6 2xl:py-4 text-sm lg:text-base 2xl:text-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. Customer Acquisition"
          />
        </div>
        <div>
          <Label className="block text-xs lg:text-sm 2xl:text-base font-semibold text-slate-500 uppercase mb-1 lg:mb-1.5 2xl:mb-3">
            Metrics Start Date
          </Label>
          <Input
            type="text"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 2xl:px-6 2xl:py-4 text-sm lg:text-base 2xl:text-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. 20241001"
          />
        </div>
        <div>
          <Label className="block text-xs lg:text-sm 2xl:text-base font-semibold text-slate-500 uppercase mb-1 lg:mb-1.5 2xl:mb-3">
            Description
          </Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 2xl:px-6 2xl:py-4 text-sm lg:text-base 2xl:text-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none h-24 lg:h-28 2xl:h-40 resize-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="Describe the goal of this journey..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyDetailsForm;
