import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	ReactFlow,
	Background,
	Controls,
	MarkerType,
	Handle,
	Position,
	type Node,
	type Edge,
	type NodeProps,
	type ReactFlowInstance,
} from '@xyflow/react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Icon from './Icon';
import type { Journey, StepMetric } from '../types';

interface JourneyFlowInlineProps {
	journey: Journey;
	selectedStepId: string | null;
	onSelectStep: (stepId: string) => void;
}

interface JourneyNodeData {
	title: string;
	phase: string;
	metrics?: StepMetric[];
	iconName?: string;
	isActive: boolean;
		footer?: React.ReactNode;
}

const JourneyNode: React.FC<NodeProps<JourneyNodeData>> = ({ data }) => {
	const [firstMetric, secondMetric] = data.metrics ?? [];
	const metricLines = [
		firstMetric ? `${firstMetric.label}: ${firstMetric.value}` : null,
		secondMetric ? `${secondMetric.label}: ${secondMetric.value}` : null,
	].filter(Boolean) as string[];

	return (
			<div
				className={`rounded-xl border px-3 py-2 text-xs shadow-md bg-slate-900 text-slate-50 max-w-[260px] transition-all duration-200 ${
					data.isActive
						? 'border-cyan-400 ring-2 ring-cyan-500/60 shadow-cyan-500/40 opacity-100 scale-100'
						: 'border-slate-700 shadow-slate-900/40 opacity-40 scale-95'
					}`}
			>
				{/* Header = icon + title */}
				<div className="mb-1 flex items-center gap-2">
					{data.iconName && (
						<div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
							<Icon name={data.iconName} className="w-3 h-3 text-cyan-400" />
						</div>
					)}
					<div className="font-semibold text-[11px] truncate flex-1">{data.title}</div>
				</div>

				{/* Body = phase + metrics */}
				<div className="space-y-1 pt-1 border-t border-slate-800">
					<div className="flex items-center justify-between gap-2">
						<span className="text-[9px] uppercase tracking-[0.16em] text-slate-400 truncate">
							{data.phase || 'Unmapped phase'}
						</span>
					</div>
					<div className="space-y-[1px] mt-0.5">
						{metricLines.length === 0 ? (
							<div className="text-[9px] text-slate-500">No metrics yet</div>
						) : (
							metricLines.map((line, idx) => (
								<div
									key={idx}
									className="text-[9px] text-slate-300 truncate"
									title={line}
								>
									{line}
								</div>
							))
						)}
					</div>
				</div>

				{/* Footer (optional) = signatures/owner */}
				{data.footer && (
					<div className="mt-1 pt-1 border-t border-slate-800 text-[9px] text-slate-400 truncate">
						{data.footer}
					</div>
				)}
			</div>
	);
};

const JourneyNodeWithHandles: React.FC<NodeProps<JourneyNodeData>> = (props) => {
	return (
		<div className="relative">
				<Handle type="target" position={Position.Left} className="!bg-cyan-500" />
				<Handle type="source" position={Position.Right} className="!bg-cyan-500" />
			<JourneyNode {...props} />
		</div>
	);
};

const JourneyFlowInline: React.FC<JourneyFlowInlineProps> = ({ journey, selectedStepId, onSelectStep }) => {
	const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);

	const flowHeight = 320;

	const { nodes, edges } = useMemo(() => {
			// Simple horizontal layout; connections/labels carry the phase information
			const nodes: Node<JourneyNodeData>[] = journey.steps.map((step, index) => {
				const isActive = !selectedStepId || step.id === selectedStepId;

				// Build a compact footer summary from signatures if available
				const sig = step.signatures;
				const footerParts: string[] = [];
				if (sig?.startSignature?.length) footerParts.push('Start');
				if (sig?.saveSignature?.length) footerParts.push('Save');
				if (sig?.uniqueSignature?.length) footerParts.push('Unique');
				if (sig?.stageSignatures?.length) footerParts.push('Stage');
				if (sig?.reworkSignature?.length) footerParts.push('Rework');
				if (sig?.endSignature?.length) footerParts.push('End');
				if (sig?.abandonSignature?.length) footerParts.push('Abandon');
				if (sig?.groupingSignature?.length) footerParts.push('Grouping');
				const footerText = footerParts.length ? `Signatures: ${footerParts.join(' • ')}` : undefined;

				return {
					id: step.id,
					position: { x: index * 260, y: 0 },
					data: {
						title: step.title,
						phase: step.phase,
						metrics: step.metrics,
						iconName: step.iconName,
						isActive,
						footer: footerText,
					},
					type: 'journeyNode',
				};
			});

		const edges: Edge[] = journey.steps.slice(1).map((step, index) => ({
			id: `e-${journey.steps[index].id}-${step.id}`,
			source: journey.steps[index].id,
			target: step.id,
			type: 'smoothstep',
			label: step.phase || '',
			labelStyle: { fill: '#e5e7eb', fontSize: 10 },
			labelBgStyle: { fill: '#020617', fillOpacity: 0.9 },
			labelBgPadding: [6, 2],
			labelBgBorderRadius: 4,
		}));

		return { nodes, edges };
	}, [journey, selectedStepId]);

	const handleNodeClick = (_: React.MouseEvent, node: any) => {
		onSelectStep(node.id);
		if (rfInstance) {
			rfInstance.fitView({ nodes: [node], padding: 0.5, duration: 500 });
		}
	};

		// When the selected step changes externally (e.g. via Next/Prev in the side panel),
		// center/zoom the React Flow view on that node as well.
		useEffect(() => {
			if (!rfInstance) return;

			// If no specific step is selected, fit the entire flow into view.
			if (!selectedStepId) {
				rfInstance.fitView({ padding: 0.3, duration: 400 });
				return;
			}

			const node = nodes.find((n) => n.id === selectedStepId);
			if (!node) return;

			rfInstance.fitView({ nodes: [node], padding: 0.5, duration: 500 });
		}, [selectedStepId, rfInstance, nodes]);

	const handleExportFlowPdf = async () => {
		if (!wrapperRef.current) return;
		try {
			const target = (wrapperRef.current.querySelector('.react-flow') as HTMLElement) || wrapperRef.current;
			const dataUrl = await toPng(target, {
				backgroundColor: '#020617',
				pixelRatio: 2,
			});

			const pdf = new jsPDF('landscape', 'pt', 'a4');
			const imgProps = pdf.getImageProperties(dataUrl);
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();
			const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
			const width = imgProps.width * ratio;
			const height = imgProps.height * ratio;
			const x = (pageWidth - width) / 2;
			const y = (pageHeight - height) / 2;

			pdf.addImage(dataUrl, 'PNG', x, y, width, height);
			pdf.save(`journey-flow-${journey.id}.pdf`);
		} catch (err) {
			console.error('Failed to export flow PDF', err);
		}
	};

		return (
			<div
				className="w-full bg-slate-950 relative"
				style={{ height: flowHeight }}
				ref={wrapperRef}
			>
			<button
				type="button"
				onClick={handleExportFlowPdf}
				className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[10px] font-medium text-slate-200 hover:bg-slate-800/90 hover:border-cyan-500/70 transition-colors"
			>
				Export flow PDF
			</button>
					<ReactFlow
						nodes={nodes}
						edges={edges}
						fitView
						onInit={setRfInstance}
						onNodeClick={handleNodeClick}
						defaultEdgeOptions={{
							type: 'smoothstep',
							animated: true,
							markerEnd: {
								type: MarkerType.ArrowClosed,
								width: 18,
								height: 18,
								color: '#22d3ee',
							},
							style: { stroke: '#22d3ee', strokeWidth: 2, opacity: 0.9 },
						}}
						nodeTypes={{ journeyNode: JourneyNodeWithHandles }}
					>
				<Background variant="dots" color="#1e293b" gap={24} size={1} />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default JourneyFlowInline;
