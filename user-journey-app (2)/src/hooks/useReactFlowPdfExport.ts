import { useCallback } from "react";
import type { RefObject } from "react";
import {
  exportElementToPdf,
  type ExportPdfOptions,
} from "../utils/exportPdfFromElement";

/**
 * Hook that wires a DOM ref to a simple `exportToPdf` function.
 *
 * Example:
 *   const containerRef = useRef<HTMLDivElement | null>(null);
 *   const { exportToPdf, isExporting } = useReactFlowPdfExport(containerRef, { filename: 'vsm.pdf' });
 */
export function useReactFlowPdfExport<T extends HTMLElement>(
  containerRef: RefObject<T>,
  options?: ExportPdfOptions,
) {
  const exportToPdf = useCallback(async () => {
    if (!containerRef.current) {
      console.warn(
        "[useReactFlowPdfExport] No container element found to export",
      );
      return;
    }

    try {
      await exportElementToPdf(containerRef.current, options);
    } catch (err) {
      console.error("[useReactFlowPdfExport] Failed to export PDF", err);
    }
  }, [containerRef, options]);

  return { exportToPdf };
}
