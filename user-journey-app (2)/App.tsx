import React, { useState, useEffect } from 'react';
import { AppState, Journey } from './types';
import { generateJourney } from './services/geminiService';
import Hero from './components/Hero';
import JourneyVisualizer from './components/JourneyVisualizer';
import JourneyBuilder from './components/JourneyBuilder';
import InsightsDashboard from './components/InsightsDashboard';
import Dashboards from './components/Dashboards';
import SessionReplay from './components/SessionReplay';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize Theme
  useEffect(() => {
    // Check system preference or default to dark
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
       // Optional: Start light if system is light, but keeping dark default for this app style
       // setIsDarkMode(false);
    }
  }, []);

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
    setIsDarkMode(!isDarkMode);
  };

  const handleGenerate = async (topic: string) => {
    setAppState(AppState.GENERATING);
    setError(null);
    try {
      const journey = await generateJourney(topic);
      setCurrentJourney(journey);
      setAppState(AppState.VISUALIZING);
    } catch (err) {
      console.error(err);
      setError("Failed to generate journey. Please check your API key or try again.");
      setAppState(AppState.IDLE);
    }
  };

  const handleSelectSample = (journey: Journey) => {
    setCurrentJourney(journey);
    setAppState(AppState.VISUALIZING);
  };

  const handleBuildManually = () => {
    setAppState(AppState.CREATING);
    setError(null);
  };

  const handleViewDashboards = () => {
    setAppState(AppState.DASHBOARDS);
    setError(null);
  };

  const handleViewInsights = () => {
    setAppState(AppState.INSIGHTS);
    setError(null);
  };

  const handleViewSessionReplay = () => {
    setAppState(AppState.SESSION_REPLAY);
    setError(null);
  };

  // Deprecated usage kept for compatibility if needed, but primarily state driven now
  const handleSelectDashboard = (dashboardId: string) => {
    if (dashboardId === 'insights') {
      setAppState(AppState.INSIGHTS);
    } else if (dashboardId === 'session_replay') {
      setAppState(AppState.SESSION_REPLAY);
    }
  };

  const handleBackToHome = () => {
    setAppState(AppState.IDLE);
  };

  const handleManualComplete = (journey: Journey) => {
    setCurrentJourney(journey);
    setAppState(AppState.VISUALIZING);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setCurrentJourney(null);
    setError(null);
  };

  return (
    <div className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      {appState === AppState.IDLE || appState === AppState.GENERATING ? (
        <Hero 
          onGenerate={handleGenerate} 
          onSelectSample={handleSelectSample}
          onBuildManually={handleBuildManually}
          onViewDashboards={handleViewDashboards}
          onViewInsights={handleViewInsights}
          onViewSessionReplay={handleViewSessionReplay}
          isGenerating={appState === AppState.GENERATING}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
      ) : appState === AppState.CREATING ? (
        <JourneyBuilder 
            onComplete={handleManualComplete} 
            onCancel={handleReset} 
        />
      ) : appState === AppState.DASHBOARDS ? (
        <Dashboards 
            onBack={handleBackToHome}
        />
      ) : appState === AppState.INSIGHTS ? (
        <InsightsDashboard 
            onBack={handleBackToHome}
        />
      ) : appState === AppState.SESSION_REPLAY ? (
        <SessionReplay 
            onBack={handleBackToHome}
            isDarkMode={isDarkMode}
        />
      ) : (
        currentJourney && (
          <JourneyVisualizer 
            journey={currentJourney} 
            onReset={handleReset} 
          />
        )
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-200 px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-4 animate-bounce-short">
           <span>{error}</span>
           <button onClick={() => setError(null)} className="text-current font-bold hover:opacity-75">&times;</button>
        </div>
      )}
    </div>
  );
};

export default App;