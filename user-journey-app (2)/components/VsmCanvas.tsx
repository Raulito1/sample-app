import React, { useMemo } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  type DefaultEdgeOptions,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import type { Journey } from '../types';
import VsmProcessNode from './VsmProcessNode';
import VsmExportButton from './VsmExportButton';
import { buildVsmGraph } from '../utils/vsmGraph';

interface VsmCanvasProps {
  journey: Journey;
  showExportButton?: boolean;
}

const VsmCanvas: React.FC<VsmCanvasProps> = ({ journey, showExportButton = true }) => {
  const { nodes, edges } = useMemo(() => buildVsmGraph(journey), [journey]);

  const nodeTypes = useMemo(
    () => ({
      vsmProcess: VsmProcessNode,
    }),
    []
  );

  const defaultEdgeOptions = useMemo<DefaultEdgeOptions>(
    () => ({
      style: { stroke: '#0f172a', strokeWidth: 1.5 },
    }),
    []
  );

  return (
    <div className="relative">
      {showExportButton && (
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <VsmExportButton journeyId={journey.id} journey={journey} />
        </div>
      )}

      {/* React Flow canvas that the user interacts with */}
      <div
        id="vsm-canvas"
        className="w-full h-[360px] rounded-xl overflow-hidden bg-white border border-slate-300 shadow-sm"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          panOnScroll
          zoomOnScroll
        >
          <Background color="#cbd5e1" gap={32} />
          <Controls position="bottom-right" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default VsmCanvas;
