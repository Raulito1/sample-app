import React, { useState } from 'react';
import { Route, Plus, FileText, MonitorPlay } from 'lucide-react';
import { Journey, JourneyStep } from '../types';
import { SAMPLE_JOURNEYS } from '../constants';
	import StepCard from './StepCard';
	import SidePanel from './SidePanel';
	import AppHeader from './AppHeader';
	import { exportJourneyToPdf } from '../utils/journeyPdf';
	import JourneyFlowInline from './JourneyFlowInline';

interface UsersJourneyProps {
	onBack: () => void;
	onCreateNew: () => void;
	onPresentJourney: (journey: Journey) => void;
}

	const UsersJourney: React.FC<UsersJourneyProps> = ({ onBack, onCreateNew, onPresentJourney }) => {
	const [valueStreamFilter, setValueStreamFilter] = useState('');
	const [journeyFilter, setJourneyFilter] = useState('');
	const [startDateFilter, setStartDateFilter] = useState('');
	const [endDateFilter, setEndDateFilter] = useState('');
	const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
	const [selectedStep, setSelectedStep] = useState<JourneyStep | null>(null);
		const [presentationPdfUrl, setPresentationPdfUrl] = useState<string | null>(null);

	const valueStreamOptions = Array.from(
		new Set(SAMPLE_JOURNEYS.map((j) => j.valueStreamName).filter(Boolean))
	);

	const getFirstMatchingJourney = (): Journey | null => {
		const matches = SAMPLE_JOURNEYS.filter((j) => {
			let ok = true;
			if (valueStreamFilter) ok = ok && j.valueStreamName === valueStreamFilter;
			if (journeyFilter) ok = ok && j.id === journeyFilter;
			// Date filters are currently decorative.
			return ok;
		});
		return matches[0] || null;
	};

	const handleApplyFilters = () => {
		const journey = getFirstMatchingJourney();
		setSelectedJourney(journey);
			// In presentation mode, start with no specific step selected so
			// all nodes appear highlighted. The user can then focus nodes one by one.
			setSelectedStep(null);
	};

	const handleClearFilters = () => {
		setValueStreamFilter('');
		setJourneyFilter('');
		setStartDateFilter('');
		setEndDateFilter('');
		setSelectedJourney(null);
		setSelectedStep(null);
			if (presentationPdfUrl) {
				URL.revokeObjectURL(presentationPdfUrl);
				setPresentationPdfUrl(null);
			}
	};

	const handleExportPresentationPdf = () => {
		const journey = selectedJourney || getFirstMatchingJourney();
		if (!journey) {
			alert('No journeys match these filters yet.');
			return;
		}
			if (presentationPdfUrl) {
				URL.revokeObjectURL(presentationPdfUrl);
			}
			const blob = exportJourneyToPdf(journey);
			const url = URL.createObjectURL(blob);
			setPresentationPdfUrl(url);

			// Also trigger a download of the PDF
			const link = document.createElement('a');
			link.href = url;
				link.download = `journey-${journey.id}.pdf`;
			link.click();
	};

		const handleSelectStep = (stepId: string) => {
			if (!selectedJourney) return;
			const step = selectedJourney.steps.find((s) => s.id === stepId) || null;
			setSelectedStep(step);
		};

	return (
		<div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 overflow-y-auto custom-scrollbar">
				<AppHeader
				  title="Users Journey"
				  icon={<Route className="text-cyan-600 dark:text-cyan-400" size={20} />}
				  onBack={onBack}
				/>

		{/* Content */}
			<main className="max-w-6xl mx-auto p-6 space-y-6">
				{/* Filters + Create New (hidden while a step is selected to focus on details) */}
				{!selectedStep && (
				<div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-sm p-5">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
						<div>
							<p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-1">
								Journey Catalog
							</p>
							<h2 className="text-lg font-semibold text-slate-900 dark:text-white">
								Search existing journeys
							</h2>
						</div>
						<button
							onClick={onCreateNew}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium shadow-lg shadow-cyan-900/20 transition-colors"
						>
							<Plus size={16} />
							<span>Create new journey</span>
						</button>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
								Value stream
							</label>
							<select
								value={valueStreamFilter}
								onChange={(e) => setValueStreamFilter(e.target.value)}
								className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white"
							>
								<option value="">All value streams</option>
								{valueStreamOptions.map((stream) => (
									<option key={stream} value={stream}>
										{stream}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
								User journey
							</label>
							<select
								value={journeyFilter}
								onChange={(e) => setJourneyFilter(e.target.value)}
								className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white"
							>
								<option value="">All journeys</option>
								{SAMPLE_JOURNEYS.map((j) => (
									<option key={j.id} value={j.id}>
										{j.title}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
								Start date
							</label>
							<input
								type="date"
								value={startDateFilter}
								onChange={(e) => setStartDateFilter(e.target.value)}
								className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
								End date
							</label>
							<input
								type="date"
								value={endDateFilter}
								onChange={(e) => setEndDateFilter(e.target.value)}
								className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-slate-900 dark:text-white"
							/>
						</div>
					</div>

				<div className="mt-4 flex flex-wrap gap-3 justify-end">
					<button
						onClick={handleClearFilters}
						className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
					>
						Clear
					</button>
					<button
						onClick={handleApplyFilters}
						className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/20 transition-colors"
					>
						Apply filters
					</button>
					<button
						onClick={handleExportPresentationPdf}
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/20 border border-cyan-500/60 dark:border-cyan-500/50 transition-colors"
					>
							<FileText size={14} />
							<span>Presentation PDF</span>
					</button>
				</div>

				{presentationPdfUrl && (
					<div className="mt-6">
						<p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-2">
							Presentation preview
						</p>
						<div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 h-[420px]">
							<iframe
								src={presentationPdfUrl}
								className="w-full h-full"
								title="Journey presentation PDF"
							/>
						</div>
					</div>
				)}
					</div>
					)}

					{/* React Flow presentation + details */}
						{selectedJourney ? (
							<div className="relative flex flex-col lg:flex-row gap-4 mt-2">
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between mb-3 px-1">
										<div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
											<span className="font-semibold text-slate-700 dark:text-slate-200">{selectedJourney.title}</span>
											<span className="hidden sm:inline"> • {selectedJourney.steps.length} steps</span>
										</div>
										<button
											onClick={() => onPresentJourney(selectedJourney)}
												className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/20 border border-cyan-500/60 dark:border-cyan-500/50 transition-colors"
										>
												<MonitorPlay size={14} />
												<span>Open presentation view</span>
										</button>
									</div>

									<div className="mb-2">
						<p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500 mb-2">
							Journey flow (React Flow)
						</p>
						<div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-950/80 min-h-[20rem]">
											<JourneyFlowInline
												journey={selectedJourney}
												selectedStepId={selectedStep?.id ?? null}
												onSelectStep={handleSelectStep}
											/>
										</div>
									</div>
								</div>

								<SidePanel
									step={selectedStep}
									journey={selectedJourney}
									isOpen={!!selectedStep}
										onClose={() => setSelectedStep(null)}
										onSelectStep={handleSelectStep}
									hasBackdrop={false}
								/>
							</div>
						) : (
							<div className="flex items-center justify-center py-16 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-sm text-slate-500 dark:text-slate-400">
								No journeys match these filters yet.
							</div>
						)}
			</main>
		</div>
	);
};

export default UsersJourney;
