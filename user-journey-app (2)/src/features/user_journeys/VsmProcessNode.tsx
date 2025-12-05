import { Handle, type NodeProps, Position } from "@xyflow/react";
import React from "react";

import type { JourneyMetrics } from "../../../types";

export interface VsmProcessNodeData {
  title: string;
  metrics?: JourneyMetrics;
  stepIndex: number;
}

const VsmProcessNode: React.FC<NodeProps<VsmProcessNodeData>> = ({ data }) => {
  const metrics = data.metrics;

  const formatNumber = (value?: number) => {
    if (value === undefined || value === null) return "—";
    return value.toLocaleString("en-US");
  };

  const displayMetrics = metrics
    ? [{ label: "Avg Duration", value: `${formatNumber(metrics.durations?.avgDuration)}ms` }]
    : [];

  return (
    <div className="relative bg-white border border-slate-500 rounded-md shadow-sm text-[10px] min-w-[160px] text-slate-900">
      {/* Invisible handles so React Flow can attach edges without UI clutter */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-transparent !border-none"
        style={{ pointerEvents: "none" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-transparent !border-none"
        style={{ pointerEvents: "none" }}
      />

      {/* Header with small inventory triangle and title */}
      <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-slate-400">
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-semibold text-[11px] text-slate-900">{data.title}</span>
        </div>
        <span className="text-[9px] text-slate-800">#{data.stepIndex + 1}</span>
      </div>

      {/* Metrics block */}
      <div className="px-2 py-1 space-y-0.5">
        {displayMetrics.length === 0 ? (
          <div className="text-[9px] text-slate-800">No metrics</div>
        ) : (
          displayMetrics.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between gap-1 whitespace-nowrap">
              <span className="text-[9px] text-slate-900">{m.label}</span>
              <span className="text-[9px] font-mono text-slate-900 ml-1">{m.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VsmProcessNode;
