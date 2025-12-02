import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Journey } from './types';
import { useGenerateJourneyMutation } from './src/services/api';
import type { HeroView } from './src/components/Hero';

const viewRoutes: Record<HeroView, string> = {
  journey: '/users-journey',
  insights: '/insights',
  dashboards: '/dashboards',
  replay: '/session-replay',
};

const App: React.FC = () => {
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [triggerGenerateJourney, { isLoading: isGenerating }] = useGenerateJourneyMutation();
  const navigate = useNavigate();

  // Apply Theme Class
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const navigateWithCleanState = (path: string) => {
    setError(null);
    navigate(path);
  };

  const showJourney = (journey: Journey) => {
    setCurrentJourney(journey);
    navigateWithCleanState('/visualize');
  };

  const resetToHome = () => {
    setCurrentJourney(null);
    navigateWithCleanState('/');
  };

  const handleGenerate = async (topic: string) => {
    setError(null);
    try {
      const journey = await triggerGenerateJourney(topic).unwrap();
      showJourney(journey);
    } catch (err) {
      console.error(err);
      const message = typeof err === 'object' && err && 'message' in err ? String((err as any).message) : null;
      setError(message || 'Failed to generate journey. Please check your API key or try again.');
    }
  };

  const handleBuildManually = () => navigateWithCleanState('/journey/new');

  const handleNavigate = (view: HeroView) => {
    const path = viewRoutes[view];
    if (path) {
      navigateWithCleanState(path);
    }
  };

  return (
    <div className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <AppRoutes
        currentJourney={currentJourney}
        isDarkMode={isDarkMode}
        isGenerating={isGenerating}
        toggleTheme={toggleTheme}
        onGenerate={handleGenerate}
        onNavigate={handleNavigate}
        onManualComplete={showJourney}
        onBackToHome={resetToHome}
        onBuildManually={handleBuildManually}
        onPresentJourney={showJourney}
        onReset={resetToHome}
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-200 px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-4 animate-bounce-short">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-current font-bold hover:opacity-75">
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
