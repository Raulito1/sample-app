import jsPDF from 'jspdf';
import type { Journey } from '../types';

export function exportJourneyToPdf(journey: Journey): Blob {
	const doc = new jsPDF();

	if (!journey.steps.length) {
		doc.text('No steps available for this journey.', 14, 20);
		return doc.output('blob') as Blob;
	}

	journey.steps.forEach((step, index) => {
		if (index > 0) {
			doc.addPage();
		}

		let y = 20;

		doc.setFontSize(14);
		doc.text(journey.title, 14, y);
		y += 8;

		doc.setFontSize(12);
		doc.text(`Step ${index + 1}: ${step.title}`, 14, y);
		y += 6;

		if (step.phase) {
			doc.setFontSize(10);
			doc.text(`Phase: ${step.phase}`, 14, y);
			y += 6;
		}

		if (step.description) {
			doc.setFontSize(10);
			const descLines = doc.splitTextToSize(step.description, 180);
			doc.text(descLines, 14, y);
			y += descLines.length * 5 + 4;
		}

		if (step.details) {
			doc.setFontSize(10);
			const detailLines = doc.splitTextToSize(step.details, 180);
			doc.text(detailLines, 14, y);
			y += detailLines.length * 5 + 4;
		}

		if (step.metrics && step.metrics.length) {
			doc.setFontSize(11);
			doc.text('Metrics', 14, y);
			y += 6;

			doc.setFontSize(10);
			step.metrics.forEach((metric) => {
				if (y > 270) {
					doc.addPage();
					y = 20;
				}
				const line = `${metric.label}: ${metric.value} (${metric.trend})`;
				doc.text(line, 18, y);
				y += 5;
			});
		}
	});

	return doc.output('blob') as Blob;
}
