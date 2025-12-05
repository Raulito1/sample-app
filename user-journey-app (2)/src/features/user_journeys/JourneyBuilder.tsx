import { Upload } from "lucide-react";
import React, { useRef, useState } from "react";

import { Journey, JourneyStep } from "../../../types";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import JourneyDetailsForm from "./JourneyDetailsForm";
import JourneyPreview from "./JourneyPreview";
import StepForm, { StepFormValues } from "./StepForm";

const PHASE_OPTIONS = [
  "Discovery",
  "Action",
  "Wait",
  "Validation",
  "Processing",
  "Completion",
  "Termination",
];

interface JourneyBuilderProps {
  onComplete: (journey: Journey) => void;
  onCancel: () => void;
}

type ImportedJourneyStep = Partial<JourneyStep>;

interface ImportedJourney {
  title?: string;
  description?: string;
  valueStreamName?: string;
  metricsStartDate?: string;
  steps?: ImportedJourneyStep[];
}

const JourneyBuilder: React.FC<JourneyBuilderProps> = ({ onComplete, onCancel }) => {
  const [title, setTitle] = useState("My Custom Journey");
  const [description, setDescription] = useState("");
  const [valueStream, setValueStream] = useState("");
  const [startDate, setStartDate] = useState("");
  const [steps, setSteps] = useState<JourneyStep[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStep = (values: StepFormValues) => {
    const newStep: JourneyStep = {
      id: `step-${Date.now()}`,
      title: values.title,
      description: values.description || "No description provided.",
      phase: values.phase,
      iconName: values.iconName,
    };

    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleFinish = () => {
    if (steps.length === 0) return;

    const journey: Journey = {
      id: `journey-${Date.now()}`,
      title,
      description: description || "A manually created user journey.",
      valueStreamName: valueStream,
      metricsStartDate: startDate,
      steps,
    };

    onComplete(journey);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      try {
        const parsed = JSON.parse(event.target?.result as string) as ImportedJourney;
        const errors: string[] = [];

        if (!parsed.title || typeof parsed.title !== "string") {
          errors.push("Missing or invalid top-level field: 'title' (string required)");
        }

        if (!parsed.steps) {
          errors.push("Missing top-level field: 'steps'");
        } else if (!Array.isArray(parsed.steps)) {
          errors.push("Field 'steps' must be an array");
        } else {
          parsed.steps.forEach((step, index) => {
            if (!step || typeof step.title !== "string") {
              errors.push(`Step at index ${index} is missing required field 'title'`);
            }
          });
        }

        if (errors.length > 0) {
          alert(`Import Failed. Please fix the following errors:\n\n- ${errors.join("\n- ")}`);
          return;
        }

        setTitle(parsed.title || "Imported Journey");
        setDescription(parsed.description || "");
        setValueStream(parsed.valueStreamName || "");
        setStartDate(parsed.metricsStartDate || "");

        const importedSteps: JourneyStep[] =
          parsed.steps?.map((s, idx) => ({
            id: s?.id || `imported-step-${idx}-${Date.now()}`,
            title: s?.title || `Step ${idx + 1}`,
            description: s?.description || "No description provided",
            details: s?.details,
            iconName: s?.iconName || "Activity",
            phase: s?.phase || "Action",
            metrics: s?.metrics,
          })) || [];

        setSteps(importedSteps);

        alert(`Successfully imported "${parsed.title}" with ${importedSteps.length} steps.`);
      } catch (err) {
        console.error("JSON Import Error", err);
        if (err instanceof SyntaxError) {
          alert(
            "Failed to parse JSON: Syntax Error.\nPlease check for missing commas, brackets, or quotes."
          );
        } else {
          alert("An unexpected error occurred during file import.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-10 xl:p-12 2xl:p-14 flex flex-col items-center">
      <div className="w-full max-w-5xl lg:max-w-[1100px] xl:max-w-[1300px] 2xl:max-w-none space-y-6 lg:space-y-8 2xl:space-y-12 animate-fade-in-down pb-16 lg:pb-20 2xl:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-5 gap-6 lg:gap-8 2xl:gap-12">
          <div className="lg:col-span-1 2xl:col-span-2 space-y-4 lg:space-y-6 2xl:space-y-10">
            <JourneyDetailsForm
              title={title}
              description={description}
              valueStream={valueStream}
              startDate={startDate}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onValueStreamChange={setValueStream}
              onStartDateChange={setStartDate}
            />

            <StepForm onAddStep={handleAddStep} phaseOptions={PHASE_OPTIONS} />
          </div>

          <div className="lg:col-span-2 2xl:col-span-3 flex flex-col h-full">
            <Card className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mb-3 lg:mb-4 2xl:mb-6">
              <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-3 lg:gap-4 2xl:gap-6 py-3 lg:py-4 2xl:py-5 px-4 lg:px-6 2xl:px-8">
                <div className="flex items-center gap-3 lg:gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="text-slate-600 dark:text-slate-300 text-sm lg:text-base 2xl:text-lg"
                  >
                    Cancel
                  </Button>
                </div>
                <div>
                  <Input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 hover:border-cyan-500/50 text-sm lg:text-base 2xl:text-lg px-3 lg:px-4 2xl:px-6 py-2 lg:py-2.5 2xl:py-3"
                  >
                    <Upload size={16} className="lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
                    <span>Import JSON</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <JourneyPreview steps={steps} onDeleteStep={handleDeleteStep} onFinish={handleFinish} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyBuilder;
