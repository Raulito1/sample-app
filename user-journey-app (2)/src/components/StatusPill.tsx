import React from "react";

interface StatusPillProps {
  label: string;
  tone?: "emerald" | "purple";
  className?: string;
}

const toneClasses = {
  emerald: {
    container:
      "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  purple: {
    container:
      "bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
  },
} as const;

const StatusPill: React.FC<StatusPillProps> = ({ label, tone = "emerald", className }) => {
  const toneClass = toneClasses[tone];
  const wrapperClasses = `flex items-center gap-4 text-xs font-mono${
    className ? ` ${className}` : ""
  }`;

  return (
    <div className={wrapperClasses}>
      <div className={`px-2 py-1 border rounded flex items-center gap-2 ${toneClass.container}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${toneClass.dot} animate-pulse`} />
        {label}
      </div>
    </div>
  );
};

export default StatusPill;
