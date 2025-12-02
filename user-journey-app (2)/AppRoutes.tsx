import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Journey } from './types';
import Hero, { HeroView } from './src/components/Hero';
import FeatureLayout from './src/components/FeatureLayout';
import StatusPill from './src/components/StatusPill';
import JourneyBuilder from './src/features/user_journeys/JourneyBuilder';
import JourneyVisualizer from './src/features/user_journeys/JourneyVisualizer';
import UsersJourney from './src/features/user_journeys/UsersJourney';
import InsightsDashboard from './src/features/insights/InsightsDashboard';
import Dashboards from './src/features/dashboards/Dashboards';
import SessionReplay from './src/features/replay_session/SessionReplay';
import { Activity, LayoutGrid, Lightbulb, Route as RouteIcon } from 'lucide-react';

type AppRoutesProps = {
  currentJourney: Journey | null;
  isDarkMode: boolean;
  isGenerating: boolean;
  toggleTheme: () => void;
  onGenerate: (topic: string) => Promise<void>;
  onNavigate: (view: HeroView) => void;
  onManualComplete: (journey: Journey) => void;
  onBackToHome: () => void;
  onBuildManually: () => void;
  onPresentJourney: (journey: Journey) => void;
  onReset: () => void;
};

const AppRoutes: React.FC<AppRoutesProps> = ({
  currentJourney,
  isDarkMode,
  isGenerating,
  toggleTheme,
  onGenerate,
  onNavigate,
  onManualComplete,
  onBackToHome,
  onBuildManually,
  onPresentJourney,
  onReset,
}) => (
  <Routes>
    <Route
      path="/"
      element={
        <Hero
          onGenerate={onGenerate}
          onNavigate={onNavigate}
          isGenerating={isGenerating}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      }
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
        >
          <UsersJourney onCreateNew={onBuildManually} onPresentJourney={onPresentJourney} />
        </FeatureLayout>
      }
    />
    <Route
      path="/insights"
      element={
        <FeatureLayout
          title="Agent Intelligence"
          icon={<Lightbulb className="text-cyan-600 dark:text-cyan-400" size={20} />}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          rightContent={<StatusPill label="AI_ANALYSIS_ACTIVE" tone="purple" />}
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
          >
            <JourneyVisualizer journey={currentJourney} onReset={onReset} />
          </FeatureLayout>
        ) : (
          <Navigate to="/" replace />
        )
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
