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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
          <Layers size={18} />
          Journey Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. Sign Up Flow"
          />
        </div>
        <div>
          <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            Value Stream
          </Label>
          <Input
            type="text"
            value={valueStream}
            onChange={(e) => onValueStreamChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. Customer Acquisition"
          />
        </div>
        <div>
          <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            Metrics Start Date
          </Label>
          <Input
            type="text"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. 20241001"
          />
        </div>
        <div>
          <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            Description
          </Label>
          <Textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none h-24 resize-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="Describe the goal of this journey..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyDetailsForm;
