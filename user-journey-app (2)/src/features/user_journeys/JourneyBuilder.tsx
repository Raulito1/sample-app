import React, { useEffect, useRef, useState } from "react";
import { Journey, JourneyStep } from "../../../types";
import {
  ArrowLeft,
  Code,
  FileJson,
  Layers,
  Play,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Icon, { ICON_NAMES } from "../../components/Icon";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface JourneyBuilderProps {
  onComplete: (journey: Journey) => void;
  onCancel: () => void;
}

const JourneyBuilder: React.FC<JourneyBuilderProps> = ({
  onComplete,
  onCancel,
}) => {
  const [title, setTitle] = useState("My Custom Journey");
  const [description, setDescription] = useState("");
  const [valueStream, setValueStream] = useState("");
  const [startDate, setStartDate] = useState("");
  const [steps, setSteps] = useState<JourneyStep[]>([]);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Step Form State
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");
  const [newStepPhase, setNewStepPhase] = useState("Action");

  // Icon Picker State
  const [newStepIcon, setNewStepIcon] = useState("Activity");
  const [iconSearch, setIconSearch] = useState("");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const iconPickerRef = useRef<HTMLDivElement>(null);

  // Close icon picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        iconPickerRef.current &&
        !iconPickerRef.current.contains(event.target as Node)
      ) {
        setShowIconPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIcons = ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(iconSearch.toLowerCase()),
  );

  const handleAddStep = () => {
    if (!newStepTitle.trim()) return;

    const newStep: JourneyStep = {
      id: `step-${Date.now()}`,
      title: newStepTitle,
      description: newStepDesc || "No description provided.",
      phase: newStepPhase,
      iconName: newStepIcon,
      metrics: [],
      signatures: {},
    };

    setSteps([...steps, newStep]);

    // Reset form
    setNewStepTitle("");
    setNewStepDesc("");
    setNewStepPhase("Action");
    setNewStepIcon("Activity"); // Reset to default
    setIconSearch("");
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
    reader.onload = (event) => {
      // Reset input immediately to allow re-selection
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      try {
        const json = JSON.parse(event.target?.result as string);
        const errors: string[] = [];

        // 1. Root Level Validation
        if (!json.title || typeof json.title !== "string") {
          errors.push(
            "Missing or invalid top-level field: 'title' (string required)",
          );
        }

        // 2. Steps Array Validation
        if (!json.steps) {
          errors.push("Missing top-level field: 'steps'");
        } else if (!Array.isArray(json.steps)) {
          errors.push("Field 'steps' must be an array");
        } else {
          // 3. Individual Step Validation
          json.steps.forEach((step: any, index: number) => {
            if (!step.title) {
              errors.push(
                `Step at index ${index} is missing required field 'title'`,
              );
            }
            // We permit missing 'description', 'phase', etc. as we can set defaults
          });
        }

        // If validation failed, show specific errors
        if (errors.length > 0) {
          alert(
            `Import Failed. Please fix the following errors:\n\n- ${errors.join("\n- ")}`,
          );
          return;
        }

        // Populate State with Validation Passed
        setTitle(json.title || "Imported Journey");
        setDescription(json.description || "");
        setValueStream(json.valueStreamName || "");
        setStartDate(json.metricsStartDate || "");

        // Ensure steps have IDs and valid defaults
        const importedSteps = json.steps.map((s: any, idx: number) => ({
          ...s,
          id: s.id || `imported-step-${idx}-${Date.now()}`,
          title: s.title || `Step ${idx + 1}`, // Fallback though validation catches empty title
          description: s.description || "No description provided",
          iconName: s.iconName || "Activity",
          phase: s.phase || "Action",
          signatures: s.signatures || {},
          metrics: s.metrics || [],
        }));

        setSteps(importedSteps);

        // Notify user
        alert(
          `Successfully imported "${json.title}" with ${importedSteps.length} steps.`,
        );
      } catch (err) {
        console.error("JSON Import Error", err);
        if (err instanceof SyntaxError) {
          alert(
            "Failed to parse JSON: Syntax Error.\nPlease check for missing commas, brackets, or quotes.",
          );
        } else {
          alert("An unexpected error occurred during file import.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto custom-scrollbar p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8 animate-fade-in-down pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">{/* Placeholder */}</div>

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
              className="bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 hover:border-cyan-500/50"
            >
              <Upload size={16} />
              <span>Import JSON</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                  <Layers size={18} />
                  Journey Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Title
                  </Label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    onChange={(e) => setValueStream(e.target.value)}
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
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="e.g. 20241001"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Description
                  </Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none h-24 resize-none placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="Describe the goal of this journey..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border border-slate-200 dark:border-slate-700 border-t-4 border-t-cyan-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus size={18} />
                  Add Step
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Step Title
                  </Label>
                  <Input
                    type="text"
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="e.g. Click Register"
                  />
                </div>

                <div ref={iconPickerRef} className="relative">
                  <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Icon
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="w-full justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-cyan-500/50"
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        name={newStepIcon}
                        size={18}
                        className="text-cyan-600 dark:text-cyan-400"
                      />
                      <span className="text-sm">{newStepIcon}</span>
                    </div>
                    <div className="text-slate-500">
                      {showIconPicker ? <X size={14} /> : <Search size={14} />}
                    </div>
                  </Button>

                  {showIconPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 p-3 animate-fade-in-down">
                      <div className="relative mb-2">
                        <Search
                          size={12}
                          className="absolute left-2.5 top-2 text-slate-500"
                        />
                        <Input
                          type="text"
                          placeholder="Search icons..."
                          value={iconSearch}
                          onChange={(e) => setIconSearch(e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                        {filteredIcons.map((name) => (
                          <Button
                            key={name}
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setNewStepIcon(name);
                              setShowIconPicker(false);
                              setIconSearch("");
                            }}
                            className={`aspect-square h-auto w-full group flex flex-col items-center justify-center gap-1 rounded-lg text-xs transition-all duration-200 ${newStepIcon === name ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50 ring-1 ring-cyan-500/30" : "text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                            title={name}
                          >
                            <Icon
                              name={name}
                              size={20}
                              className="transition-transform group-hover:scale-110"
                            />
                            <span className="text-[10px]">{name}</span>
                          </Button>
                        ))}
                        {filteredIcons.length === 0 && (
                          <div className="col-span-5 text-center py-4 text-xs text-slate-500">
                            No icons found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Phase
                  </Label>
                  <select
                    value={newStepPhase}
                    onChange={(e) => setNewStepPhase(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="Discovery">Discovery</option>
                    <option value="Action">Action</option>
                    <option value="Wait">Wait</option>
                    <option value="Validation">Validation</option>
                    <option value="Processing">Processing</option>
                    <option value="Completion">Completion</option>
                    <option value="Termination">Termination</option>
                  </select>
                </div>
                <div>
                  <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Description
                  </Label>
                  <textarea
                    value={newStepDesc}
                    onChange={(e) => setNewStepDesc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none placeholder-slate-400 dark:placeholder-slate-600"
                    placeholder="What happens here?"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleAddStep}
                  disabled={!newStepTitle}
                  className="w-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg"
                >
                  <Plus size={16} /> Add to Flow
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="flex-1 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <CardHeader className="flex-row items-center justify-between pb-0">
                <CardTitle className="text-lg font-bold text-slate-700 dark:text-slate-300">
                  Journey Preview ({steps.length} Steps)
                </CardTitle>
                {steps.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleFinish}
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
                      <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                        No steps yet
                      </p>
                      <p className="text-sm">
                        Import a JSON file or add steps manually.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 relative">
                    <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="relative pl-14 group animate-fade-in-up"
                      >
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
                                {step.signatures &&
                                  Object.keys(step.signatures).length > 0 && (
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
                              onClick={() => handleDeleteStep(step.id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyBuilder;
