import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { StepMetric } from '../../../types';

export interface VsmProcessNodeData {
  title: string;
  metrics?: StepMetric[];
  stepIndex: number;
}

	const VsmProcessNode: React.FC<NodeProps<VsmProcessNodeData>> = ({ data }) => {
	  const metrics = data.metrics ?? [];

	  return (
    <div className="relative bg-white border border-slate-500 rounded-md shadow-sm text-[10px] min-w-[160px] text-slate-900">
	      {/* Invisible handles so React Flow can attach edges without UI clutter */}
	      <Handle
	        type="target"
	        position={Position.Left}
	        className="w-2 h-2 !bg-transparent !border-none"
	        style={{ pointerEvents: 'none' }}
	      />
	      <Handle
	        type="source"
	        position={Position.Right}
	        className="w-2 h-2 !bg-transparent !border-none"
	        style={{ pointerEvents: 'none' }}
	      />

	      {/* Header with small inventory triangle and title */}
	      <div className="flex items-center justify-between px-2 pt-1 pb-1 border-b border-slate-400">
	        <div className="flex items-center gap-1 min-w-0">
	          <svg
	            width="14"
	            height="10"
	            viewBox="0 0 14 10"
	            className="shrink-0 text-slate-700"
	          >
	            <path
	              d="M1 9L7 1L13 9H1Z"
	              fill="none"
	              stroke="currentColor"
	              strokeWidth="0.8"
	            />
	          </svg>
	          <span className="font-semibold text-[11px] truncate text-slate-900">{data.title}</span>
	        </div>
	        <span className="text-[9px] text-slate-800">#{data.stepIndex + 1}</span>
	      </div>

	      {/* Metrics block */}
	      <div className="px-2 py-1 space-y-0.5">
	        {metrics.length === 0 ? (
	          <div className="text-[9px] text-slate-800">No metrics</div>
	        ) : (
	          metrics.slice(0, 4).map((m, idx) => (
	            <div key={idx} className="flex items-center justify-between gap-1">
	              <span className="truncate text-[9px] text-slate-900">
	                {m.label}
	              </span>
	              <span className="text-[9px] font-mono text-slate-900 ml-1">
	                {m.value}
	              </span>
	            </div>
	          ))
	        )}
	      </div>
	    </div>
	  );
	};

export default VsmProcessNode;
