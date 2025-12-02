import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import Icon, { ICON_NAMES } from "../../components/Icon";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

const DEFAULT_PHASE = "Action";
const DEFAULT_ICON = "Activity";

export interface StepFormValues {
  title: string;
  description: string;
  phase: string;
  iconName: string;
}

interface StepFormProps {
  onAddStep: (values: StepFormValues) => void;
  phaseOptions: string[];
}

const StepForm: React.FC<StepFormProps> = ({ onAddStep, phaseOptions }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phase, setPhase] = useState(DEFAULT_PHASE);
  const [iconName, setIconName] = useState(DEFAULT_ICON);

  const handleSubmit = () => {
    if (!title.trim()) return;

    onAddStep({
      title,
      description,
      phase,
      iconName,
    });

    setTitle("");
    setDescription("");
    setPhase(DEFAULT_PHASE);
    setIconName(DEFAULT_ICON);
  };

  return (
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="e.g. Click Register"
          />
        </div>

        <IconPicker value={iconName} onChange={setIconName} />

        <div>
          <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phase</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-cyan-500/50"
              >
                <span className="text-sm">{phase}</span>
                <ChevronDown size={16} className="text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[240px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
            >
              {phaseOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onSelect={() => setPhase(option)}
                  className="flex items-center justify-between"
                >
                  <span>{option}</span>
                  {phase === option && <Check size={14} className="text-cyan-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
            Description
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none h-20 resize-none placeholder-slate-400 dark:placeholder-slate-600"
            placeholder="What happens here?"
          />
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!title}
          className="w-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg"
        >
          <Plus size={16} /> Add to Flow
        </Button>
      </CardContent>
    </Card>
  );
};

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredIcons = ICON_NAMES.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Icon</Label>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(!open)}
        className="w-full justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-cyan-500/50"
      >
        <div className="flex items-center gap-2">
          <Icon name={value} size={18} className="text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm">{value}</span>
        </div>
        <div className="text-slate-500">{open ? <X size={14} /> : <Search size={14} />}</div>
      </Button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 p-3 animate-fade-in-down">
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-2 text-slate-500" />
            <Input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  onChange(name);
                  setOpen(false);
                  setSearch("");
                }}
                className={`aspect-square h-auto w-full group flex flex-col items-center justify-center gap-1 rounded-lg text-xs transition-all duration-200 ${value === name ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50 ring-1 ring-cyan-500/30" : "text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"}`}
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
  );
};

export default StepForm;
