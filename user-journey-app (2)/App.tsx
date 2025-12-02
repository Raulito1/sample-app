import React, { useState, useEffect } from 'react';
import { Journey } from './types';
import { generateJourney } from './services/geminiService';
import Hero from './components/Hero';
import JourneyVisualizer from './features/user_journeys/JourneyVisualizer';
import JourneyBuilder from './features/user_journeys/JourneyBuilder';
import InsightsDashboard from './features/insights/InsightsDashboard';
import Dashboards from './features/dashboards/Dashboards';
import SessionReplay from './features/replay_session/SessionReplay';
import UsersJourney from './features/user_journeys/UsersJourney';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

const App: React.FC = () => {
	  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
	  const [error, setError] = useState<string | null>(null);
	  const [isDarkMode, setIsDarkMode] = useState(true);
	  const [isGenerating, setIsGenerating] = useState(false);

	  const navigate = useNavigate();

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
	    setIsGenerating(true);
	    setError(null);
	    try {
	      const journey = await generateJourney(topic);
	      setCurrentJourney(journey);
	      navigate('/visualize');
	    } catch (err) {
	      console.error(err);
	      setError("Failed to generate journey. Please check your API key or try again.");
	    } finally {
	      setIsGenerating(false);
	    }
	  };

	  const handleBuildManually = () => {
	    setError(null);
	    navigate('/journey/new');
	  };

	  const handleManualComplete = (journey: Journey) => {
	    setCurrentJourney(journey);
	    navigate('/visualize');
	  };

	  const handlePresentJourney = (journey: Journey) => {
	    setCurrentJourney(journey);
	    setError(null);
	    navigate('/visualize');
	  };

	  const handleBackToHome = () => {
	    setCurrentJourney(null);
	    setError(null);
	    navigate('/');
	  };

	  const handleReset = () => {
	    setCurrentJourney(null);
	    setError(null);
	    navigate('/');
	  };

	  const handleViewDashboards = () => {
	    setError(null);
	    navigate('/dashboards');
	  };

	  const handleViewUsersJourney = () => {
	    setError(null);
	    navigate('/users-journey');
	  };

	  const handleViewInsights = () => {
	    setError(null);
	    navigate('/insights');
	  };

	  const handleViewSessionReplay = () => {
	    setError(null);
	    navigate('/session-replay');
	  };

	  return (
	    <div className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
	      <Routes>
	        <Route
	          path="/"
	          element={
	            <Hero
	              onGenerate={handleGenerate}
	              onViewDashboards={handleViewDashboards}
	              onViewUsersJourney={handleViewUsersJourney}
	              onViewInsights={handleViewInsights}
	              onViewSessionReplay={handleViewSessionReplay}
	              isGenerating={isGenerating}
	              isDarkMode={isDarkMode}
	              toggleTheme={toggleTheme}
	            />
	          }
	        />
	        <Route
	          path="/journey/new"
	          element={
	            <JourneyBuilder
	              onComplete={handleManualComplete}
	              onCancel={handleBackToHome}
	            />
	          }
	        />
	        <Route
	          path="/users-journey"
	          element={
	            <UsersJourney
	              onBack={handleBackToHome}
	              onCreateNew={handleBuildManually}
	              onPresentJourney={handlePresentJourney}
	            />
	          }
	        />
	        <Route
	          path="/insights"
	          element={<InsightsDashboard onBack={handleBackToHome} />}
	        />
	        <Route
	          path="/dashboards"
	          element={<Dashboards onBack={handleBackToHome} />}
	        />
	        <Route
	          path="/session-replay"
	          element={
	            <SessionReplay
	              onBack={handleBackToHome}
	              isDarkMode={isDarkMode}
	            />
	          }
	        />
	        <Route
	          path="/visualize"
	          element={
	            currentJourney ? (
	              <JourneyVisualizer journey={currentJourney} onReset={handleReset} />
	            ) : (
	              <Navigate to="/" replace />
	            )
	          }
	        />
	        <Route path="*" element={<Navigate to="/" replace />} />
	      </Routes>

	      {/* Error Toast */}
	      {error && (
	        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-200 px-6 py-4 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-4 animate-bounce-short">
	          <span>{error}</span>
	          <button
	            onClick={() => setError(null)}
	            className="text-current font-bold hover:opacity-75"
	          >
	            &times;
	          </button>
	        </div>
	      )}
	    </div>
	  );
};

export default App;
