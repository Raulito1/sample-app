import React from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { ReactFlow, ReactFlowProvider, type DefaultEdgeOptions } from '@xyflow/react';
import { createRoot } from 'react-dom/client';
import { FileText } from 'lucide-react';

import VsmProcessNode from './VsmProcessNode';
import { SAMPLE_JOURNEYS } from '../../constants';
import type { Journey } from '../../types';
import { buildVsmGraph, VSM_EXPORT_HEIGHT, VSM_EXPORT_WIDTH } from '../../utils/vsmGraph';

interface VsmExportButtonProps {
  journeyId: string;
  /** Optional journey data to render; falls back to SAMPLE_JOURNEYS by id */
  journey?: Journey;
  /** Optional DOM selector to capture if you really want the on-screen canvas */
  targetSelector?: string;
  /** Override button styling to align with other toolbar controls */
  buttonClassName?: string;
  /** Optional icon override */
  icon?: React.ReactNode;
}

const OFFSCREEN_STYLE: React.CSSProperties = {
  position: 'fixed',
  left: '-99999px',
  top: '0',
  width: `${VSM_EXPORT_WIDTH}px`,
  height: `${VSM_EXPORT_HEIGHT}px`,
  background: '#fff',
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  pointerEvents: 'none',
  overflow: 'hidden',
};

export const VsmExportButton: React.FC<VsmExportButtonProps> = ({
  journeyId,
  journey,
  targetSelector,
  buttonClassName,
  icon,
}) => {
  // Use a higher pixel ratio when rasterizing to keep PDF zoom crisp
  const pngPixelRatio = React.useMemo(
    () => Math.max(2.5, (window.devicePixelRatio || 1) * 2),
    []
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const nodeTypes = React.useMemo(
    () => ({
      vsmProcess: VsmProcessNode,
    }),
    []
  );

  const defaultEdgeOptions = React.useMemo<DefaultEdgeOptions>(
    () => ({
      style: { stroke: '#0f172a', strokeWidth: 1.5 },
    }),
    []
  );

  const renderOffscreenFlow = async (journeyData: Journey) => {
    const container = document.createElement('div');
    Object.assign(container.style, OFFSCREEN_STYLE);
    document.body.appendChild(container);

    const { nodes, edges } = buildVsmGraph(journeyData);

    const root = createRoot(container);
    root.render(
      <ReactFlowProvider>
        <div
          id="offscreen-flow"
          style={{
            width: OFFSCREEN_STYLE.width,
            height: OFFSCREEN_STYLE.height,
            background: '#fff',
            color: '#0f172a',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </ReactFlowProvider>
    );

    // Wait a little to ensure layout + CSS apply
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await new Promise((resolve) => setTimeout(resolve, 50));

    const flowEl = container.querySelector('#offscreen-flow') as HTMLElement | null;
    const dataUrl = await toPng(flowEl ?? container, {
      cacheBust: true,
      skipFonts: true, // avoid cross-origin font cssRules errors (e.g., Google Fonts)
      backgroundColor: '#fff',
      pixelRatio: pngPixelRatio,
    });

    root.unmount();
    container.remove();

    return { dataUrl, width: VSM_EXPORT_WIDTH, height: VSM_EXPORT_HEIGHT };
  };

  const handleExportClick = async () => {
    if (!journeyId) {
      setError('Missing journey id');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const journeyData =
        journey ?? SAMPLE_JOURNEYS.find((j) => j.id === journeyId);

      if (!journeyData) {
        setError('Unable to load journey data for export.');
        return;
      }

      let dataUrl: string;
      let width: number;
      let height: number;

      if (targetSelector) {
        const target = document.querySelector<HTMLElement>(targetSelector);
        if (!target) {
          setError('Unable to find the canvas to export.');
          return;
        }
        dataUrl = await toPng(target, {
          cacheBust: true,
          skipFonts: true,
          backgroundColor: '#fff',
          pixelRatio: pngPixelRatio,
        });
        const rect = target.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      } else {
        try {
          const offscreenResult = await renderOffscreenFlow(journeyData);
          dataUrl = offscreenResult.dataUrl;
          width = offscreenResult.width;
          height = offscreenResult.height;
        } catch (offscreenErr) {
          console.warn('[VsmExportButton] Offscreen render failed, falling back to on-screen canvas', offscreenErr);
          const target = document.querySelector<HTMLElement>('#vsm-canvas');
          if (!target) {
            throw offscreenErr;
          }
          dataUrl = await toPng(target, {
            cacheBust: true,
            skipFonts: true,
            backgroundColor: '#fff',
            pixelRatio: pngPixelRatio,
          });
          const rect = target.getBoundingClientRect();
          width = rect.width;
          height = rect.height;
        }
      }

      const pdf = new jsPDF({
        orientation: width > height ? 'l' : 'p',
        unit: 'px',
        format: [width, height],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, width, height);
      pdf.save(`journey-${journeyId}.pdf`);
    } catch (err) {
      console.error('[VsmExportButton] Error exporting VSM PDF', err);
      setError('Unexpected error while generating PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportClick}
        disabled={isLoading}
        className={
          buttonClassName ??
          'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60'
        }
      >
        {icon ?? <FileText size={16} />}
        <span className="hidden sm:inline">
          {isLoading ? 'Generating PDF…' : 'Export PDF'}
        </span>
        <span className="sm:hidden">{isLoading ? 'PDF…' : 'PDF'}</span>
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default VsmExportButton;
