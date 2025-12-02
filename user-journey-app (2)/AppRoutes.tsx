import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Journey } from './types';
import Hero, { HeroView } from './src/components/Hero';
import JourneyBuilder from './src/features/user_journeys/JourneyBuilder';
import JourneyVisualizer from './src/features/user_journeys/JourneyVisualizer';
import UsersJourney from './src/features/user_journeys/UsersJourney';
import InsightsDashboard from './src/features/insights/InsightsDashboard';
import Dashboards from './src/features/dashboards/Dashboards';
import SessionReplay from './src/features/replay_session/SessionReplay';

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
    <Route path="/journey/new" element={<JourneyBuilder onComplete={onManualComplete} onCancel={onBackToHome} />} />
    <Route
      path="/users-journey"
      element={<UsersJourney onBack={onBackToHome} onCreateNew={onBuildManually} onPresentJourney={onPresentJourney} />}
    />
    <Route path="/insights" element={<InsightsDashboard onBack={onBackToHome} />} />
    <Route path="/dashboards" element={<Dashboards onBack={onBackToHome} />} />
    <Route path="/session-replay" element={<SessionReplay onBack={onBackToHome} isDarkMode={isDarkMode} />} />
    <Route
      path="/visualize"
      element={
        currentJourney ? <JourneyVisualizer journey={currentJourney} onReset={onReset} /> : <Navigate to="/" replace />
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
