import React, { ReactNode, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Journey } from "./types";
import Hero, { HeroView } from "./src/components/Hero";
import FeatureLayout from "./src/components/FeatureLayout";
import StatusPill from "./src/components/StatusPill";
import JourneyBuilder from "./src/features/user_journeys/JourneyBuilder";
import JourneyVisualizer from "./src/features/user_journeys/JourneyVisualizer";
import UsersJourney from "./src/features/user_journeys/UsersJourney";
import VsmExportButton from "./src/features/user_journeys/VsmExportButton";
import InsightsDashboard from "./src/features/insights/InsightsDashboard";
import Dashboards from "./src/features/dashboards/Dashboards";
import SessionReplay from "./src/features/replay_session/SessionReplay";
import { Activity, Gauge, LayoutGrid, Lightbulb, Play, Route as RouteIcon } from "lucide-react";
import { Button } from "./src/components/ui/button";

type AppRoutesProps = {
  currentJourney: Journey | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onNavigate: (view: HeroView) => void;
  onManualComplete: (journey: Journey) => void;
  onBackToHome: () => void;
  onBuildManually: () => void;
  onPresentJourney: (journey: Journey) => void;
};

const neutralButtonClass =
  "rounded-lg px-4 py-2 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors";

const AppRoutes: React.FC<AppRoutesProps> = ({
  currentJourney,
  isDarkMode,
  toggleTheme,
  onNavigate,
  onManualComplete,
  onBackToHome,
  onBuildManually,
  onPresentJourney,
}) => {
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [visualizerHeaderAction, setVisualizerHeaderAction] = useState<ReactNode | null>(null);
  const [showJourneyMetrics, setShowJourneyMetrics] = useState(false);

  useEffect(() => {
    if (!activeJourney && showJourneyMetrics) {
      setShowJourneyMetrics(false);
    }
  }, [activeJourney, showJourneyMetrics]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Hero onNavigate={onNavigate} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}
      />
      <Route
        path="/journey/new"
        element={
          <FeatureLayout
            title="Journey Builder"
            icon={<RouteIcon className="text-cyan-600 dark:text-cyan-400" size={20} />}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            contentClassName="max-w-6xl mx-auto p-6"
          >
            <JourneyBuilder onComplete={onManualComplete} onCancel={onBackToHome} />
          </FeatureLayout>
        }
      />
      <Route
        path="/users-journey"
        element={
          <FeatureLayout
            title="Users Journey"
            icon={<RouteIcon className="text-cyan-600 dark:text-cyan-400" size={20} />}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            contentClassName="pb-10"
            actionButton={
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowJourneyMetrics(true)}
                  variant="outline"
                  className={neutralButtonClass}
                  disabled={!activeJourney}
                >
                  <Gauge size={14} />
                  <span className="hidden sm:inline">Journey metrics</span>
                  <span className="sm:hidden">Metrics</span>
                </Button>
                <Button
                  onClick={() => activeJourney && onPresentJourney(activeJourney)}
                  variant="outline"
                  className={neutralButtonClass}
                  disabled={!activeJourney}
                >
                  <Play size={14} />
                  <span className="hidden sm:inline">Open presentation view</span>
                  <span className="sm:hidden">Present</span>
                </Button>
                {activeJourney && (
                  <VsmExportButton
                    journeyId={activeJourney.id}
                    journey={activeJourney}
                    buttonClassName={neutralButtonClass}
                  />
                )}
              </div>
            }
            >
              <UsersJourney
                onCreateNew={onBuildManually}
                onSelectedJourneyChange={setActiveJourney}
                showMetrics={showJourneyMetrics}
                onCloseMetrics={() => setShowJourneyMetrics(false)}
              />
            </FeatureLayout>
        }
      />
      <Route
        path="/insights"
        element={
          <FeatureLayout
            title="Insights"
            icon={<Lightbulb className="text-cyan-600 dark:text-cyan-400" size={20} />}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            rightContent={<StatusPill label="INSIGHTS_ACTIVE" tone="purple" />}
            contentClassName="pb-10"
          >
            <InsightsDashboard />
          </FeatureLayout>
        }
      />
      <Route
        path="/dashboards"
        element={
          <FeatureLayout
            title="System Dashboards"
            icon={<LayoutGrid className="text-cyan-600 dark:text-cyan-400" size={20} />}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            rightContent={<StatusPill label="SYSTEM_OPTIMAL" tone="emerald" />}
            contentClassName="pb-10"
          >
            <Dashboards />
          </FeatureLayout>
        }
      />
      <Route
        path="/session-replay"
        element={
          <FeatureLayout
            title="Session Replay"
            icon={<Activity className="text-cyan-600 dark:text-cyan-400" size={20} />}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            rightContent={<StatusPill label="LIVE_GRAPHISTRY" className="hidden sm:flex" />}
            contentClassName="pb-10"
          >
            <SessionReplay isDarkMode={isDarkMode} />
          </FeatureLayout>
        }
      />
      <Route
        path="/visualize"
        element={
          currentJourney ? (
            <FeatureLayout
              title={currentJourney.title}
              subtitle={currentJourney.description}
              icon={<RouteIcon className="text-cyan-600 dark:text-cyan-400" size={20} />}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
              contentClassName="flex-1"
              actionButton={visualizerHeaderAction}
            >
              <JourneyVisualizer
                journey={currentJourney}
                onActionButtonChange={setVisualizerHeaderAction}
              />
            </FeatureLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
