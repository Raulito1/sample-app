import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface ExportPdfOptions {
  filename?: string;
  /** 'auto' chooses based on content aspect ratio */
  orientation?: "portrait" | "landscape" | "auto";
  /** Render scale for html2canvas. 2–3 is usually crisp. */
  scale?: number;
  /** Page margin in PDF units (points). */
  margin?: number;
  /** Optional explicit background color (e.g. '#020617'). */
  backgroundColor?: string | null;
}

/**
 * Renders a DOM element to a single-page PDF using html2canvas + jsPDF.
 *
 * Tailwind styles, SVG content, and React Flow nodes are captured as rendered.
 */
export async function exportElementToPdf(
  element: HTMLElement,
  options: ExportPdfOptions = {},
): Promise<void> {
  const {
    filename = "diagram.pdf",
    orientation = "auto",
    scale = 3, // slightly higher for crisper lines
    margin = 24,
    // keep transparent; we force a white background only inside the clone
    backgroundColor = null,
  } = options;

  // Use the *visual* size of the canvas element
  const rect = element.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  const canvas = await html2canvas(element, {
    backgroundColor,
    width,
    height,
    scale,
    useCORS: true,
    onclone: (clonedDoc) => {
      try {
        const sanitizeOklch = (value: string) =>
          value
            .replace(/oklch\([^)]*\)/g, "#0f172a") // fallback text color
            .replace(/oklab\([^)]*\)/g, "#0f172a");

        // 1) Sanitize <style> blocks (Tailwind, shadcn, etc.)
        const styleNodes = Array.from(
          clonedDoc.querySelectorAll<HTMLStyleElement>("style"),
        );
        for (const styleNode of styleNodes) {
          if (!styleNode.textContent) continue;
          let text = styleNode.textContent;
          if (text.includes("oklch(") || text.includes("oklab(")) {
            text = sanitizeOklch(text);
            styleNode.textContent = text;
          }
        }

        // 1b) Sanitize linked stylesheets by cloning accessible CSSRules.
        const linkNodes = Array.from(
          clonedDoc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
        );
        for (const linkEl of linkNodes) {
          try {
            const sheet = linkEl.sheet as CSSStyleSheet | null;
            if (!sheet || !sheet.cssRules) continue;
            const sanitizedRules: string[] = [];
            for (const rule of Array.from(sheet.cssRules)) {
              sanitizedRules.push(sanitizeOklch(rule.cssText));
            }
            const styleEl = clonedDoc.createElement("style");
            styleEl.textContent = sanitizedRules.join("\n");
            linkEl.replaceWith(styleEl);
          } catch (_err) {
            // Cross-origin or inaccessible stylesheet: remove to prevent parse errors.
            linkEl.remove();
          }
        }

        // 2) Sanitize inline style="" attributes just in case
        const allElements = Array.from(
          clonedDoc.querySelectorAll<HTMLElement>("*"),
        );
        for (const el of allElements) {
          const inline = el.getAttribute("style");
          if (!inline) continue;
          if (inline.includes("oklch(") || inline.includes("oklab(")) {
            el.setAttribute("style", sanitizeOklch(inline));
          }
        }

        // 3) Add focused overrides (NO global "everything" reset now)
        const styleEl = clonedDoc.createElement("style");
        styleEl.textContent = `
          /* Keep a plain white background for the captured area only */
          body {
            background: #ffffff !important;
          }

          /* Ensure the React Flow canvas does not clip edges */
          .react-flow,
          .react-flow__renderer,
          .react-flow__viewport,
          .react-flow__edges,
          .react-flow__edges svg {
            overflow: visible !important;
          }

          /* Make edges clearly visible and a bit thicker in the export */
          .react-flow__edge-path,
          .react-flow__connection-path {
            stroke: #94a3b8 !important;
            stroke-width: 4 !important;
            fill: none !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .react-flow__edge .react-flow__arrowhead-path {
            stroke: #94a3b8 !important;
            fill: #94a3b8 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          .react-flow__edgeupdater {
            display: none !important;
          }
        `;
        clonedDoc.head.appendChild(styleEl);

        // Do NOT forcibly resize <html>/<body>; let html2canvas use real layout.
        clonedDoc.body.style.overflow = "visible";
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[exportElementToPdf] Failed in onclone()", err);
      }
    },
  });

  // ---------------- PDF LAYOUT ----------------

  // Size of the rendered image (in canvas pixels)
  const imgWidthPx = canvas.width;
  const imgHeightPx = canvas.height;
  const imgAspect = imgWidthPx / imgHeightPx || 1;

  const resolvedOrientation: "portrait" | "landscape" =
    orientation === "auto"
      ? imgAspect >= 1
        ? "landscape"
        : "portrait"
      : orientation;

  // Convert from CSS pixels (96dpi) to PDF points (72dpi)
  const PX_TO_PT = 72 / 96;
  const imgWidthPt = imgWidthPx * PX_TO_PT;
  const imgHeightPt = imgHeightPx * PX_TO_PT;

  // Use a custom page size based on the image size so nothing is cut off.
  // We still respect the requested margins.
  const pageWidth = imgWidthPt + margin * 2;
  const pageHeight = imgHeightPt + margin * 2;

  const pdf = new jsPDF({
    orientation: resolvedOrientation,
    unit: "pt",
    format:
      resolvedOrientation === "landscape"
        ? [pageWidth, pageHeight]
        : [pageWidth, pageHeight],
  });

  const safeWidth = pageWidth - margin * 2;
  const safeHeight = pageHeight - margin * 2;

  // Scale image to fit exactly within safe area, preserving aspect ratio
  const scaleFactor = Math.min(
    safeWidth / imgWidthPt,
    safeHeight / imgHeightPt,
  );
  const renderWidth = imgWidthPt * scaleFactor;
  const renderHeight = imgHeightPt * scaleFactor;

  // Center the image on the page
  const x = (pageWidth - renderWidth) / 2;
  const y = (pageHeight - renderHeight) / 2;

  const imgData = canvas.toDataURL("image/png");

  pdf.addImage(imgData, "PNG", x, y, renderWidth, renderHeight);
  pdf.save(filename);
}
