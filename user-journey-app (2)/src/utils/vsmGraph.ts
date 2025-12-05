import type { Edge, Node } from "@xyflow/react";

import type { Journey } from "../../types";

export const PROCESS_Y = 0;
export const TIMELINE_Y = 180;
export const HORIZONTAL_GAP = 260;

export const VSM_EXPORT_WIDTH = 1600;
export const VSM_EXPORT_HEIGHT = 600;

export function buildVsmGraph(journey: Journey): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  journey.steps.forEach((step, index) => {
    const x = index * HORIZONTAL_GAP;
    const processId = step.id;
    const timelineId = `${step.id}-timeline`;

    // Main VSM process node
    nodes.push({
      id: processId,
      type: "vsmProcess",
      position: { x, y: PROCESS_Y },
      data: {
        title: step.title,
        metrics: step.metrics,
        stepIndex: index,
      },
    });

    // Simple timeline node showing Avg Duration
    const avgDuration = step.metrics?.durations?.avgDuration;
    const avgDurationFormatted = avgDuration
      ? avgDuration >= 60000
        ? `${(avgDuration / 60000).toFixed(1)}m`
        : avgDuration >= 1000
          ? `${(avgDuration / 1000).toFixed(1)}s`
          : `${avgDuration.toFixed(0)}ms`
      : null;

    nodes.push({
      id: timelineId,
      type: "default",
      position: { x, y: TIMELINE_Y },
      data: {
        label: avgDurationFormatted ? `Avg Duration: ${avgDurationFormatted}` : "No duration data",
      },
    });

    if (index > 0) {
      const prevId = journey.steps[index - 1].id;
      const prevTimelineId = `${journey.steps[index - 1].id}-timeline`;

      // Process-to-process arrow
      edges.push({
        id: `e-${prevId}-${processId}`,
        source: prevId,
        target: processId,
        animated: true,
      });

      // Timeline connector
      edges.push({
        id: `e-${prevTimelineId}-${timelineId}`,
        source: prevTimelineId,
        target: timelineId,
        type: "smoothstep",
      });
    }
  });

  return { nodes, edges };
}
