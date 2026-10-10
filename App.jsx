import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import ErrorBoundary from './components/ErrorBoundary';
import AuthModal from './components/AuthModal';

import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import DashboardHome from './pages/DashboardHome';
import NewAnalysis from './pages/NewAnalysis';
import AgentResearch from './pages/AgentResearch';
import MarketDeepDive from './pages/MarketDeepDive';
import PreviousAnalyses from './pages/PreviousAnalyses';
import ExportReport from './pages/ExportReport';
import ApiSettings from './pages/ApiSettings';

import {
  fetchHealth,
  fetchAnalysesHistory,
  runAnalysis,
  getLocalFallbackAnalysis,
  getLocalFallbackHistory,
  verifyCurrentUser,
  clearStoredAuth,
  getStoredUser
} from './services/api';

export default function App() {
  // Default to landing page as shown in Stitch design
  const [currentPath, setCurrentPath] = useState('landing-page');
  const [activeAnalysis, setActiveAnalysis] = useState(() => getLocalFallbackAnalysis());
  const [historyList, setHistoryList] = useState(() => getLocalFallbackHistory());
  const [serpApiConnected, setSerpApiConnected] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pendingAnalysisPayload, setPendingAnalysisPayload] = useState(null);
  const [pendingPromise, setPendingPromise] = useState(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => getStoredUser() || {
    id: "usr_arjun_01",
    name: "Arjun Mehta",
    email: "arjun@marketpilot.ai",
    company: "Mehta Ventures",
    role: "Founding Partner",
    tier: "PRO TIER"
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [resetTokenParam, setResetTokenParam] = useState('');

  useEffect(() => {
    // Check URL parameters for password reset token
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if (token) {
        setResetTokenParam(token);
        setCurrentPath('reset-password');
      }
    } catch (e) {
      // Ignore URL parsing errors
    }

    // Listen for custom navigation events
    const handleCustomNav = (e) => {
      if (e.detail) {
        setCurrentPath(e.detail);
      }
    };
    window.addEventListener('marketpilot:navigate', handleCustomNav);

    checkHealth();
    loadHistory();
    // Validate session token in background
    verifyCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    return () => {
      window.removeEventListener('marketpilot:navigate', handleCustomNav);
    };
  }, []);

  const checkHealth = async () => {
    const health = await fetchHealth();
    setSerpApiConnected(health.serpapi_connected);
  };

  const loadHistory = async () => {
    const list = await fetchAnalysesHistory();
    if (list && list.length > 0) {
      setHistoryList(list);
    }
  };

  const handleStartAnalysis = (payload) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setPendingAnalysisPayload(payload);
    // Start running analysis immediately in parallel with animation
    const promise = runAnalysis(payload);
    setPendingPromise(promise);
    promise
      .then((res) => {
        if (res && res.category) {
          setActiveAnalysis(res);
        }
      })
      .catch((err) => {
        console.warn("Analysis resolution notice:", err);
      });
    setCurrentPath('agent-research');
  };

  const handleResearchCompleted = async () => {
    try {
      let result = null;
      if (pendingPromise) {
        result = await pendingPromise;
      } else if (pendingAnalysisPayload) {
        result = await runAnalysis(pendingAnalysisPayload);
      }
      
      if (result && result.category) {
        setActiveAnalysis(result);
      } else if (pendingAnalysisPayload) {
        setActiveAnalysis(getLocalFallbackAnalysis(pendingAnalysisPayload));
      } else {
        setActiveAnalysis(getLocalFallbackAnalysis());
      }
      loadHistory();
    } catch (err) {
      console.error("Error finalizing analysis:", err);
      setActiveAnalysis(getLocalFallbackAnalysis(pendingAnalysisPayload || {}));
    }
    setCurrentPath('market-deep-dive');
  };

  const handleOpenAnalysisFromHistory = async (item) => {
    if (!item) return;

    if (item.full_data && item.full_data.scores) {
      setActiveAnalysis(item.full_data);
      setCurrentPath('market-deep-dive');
      return;
    }

    // Try fetching full dossier from backend by ID
    if (item.id) {
      try {
        const res = await fetch(`/api/analyses/${item.id}`);
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && remoteData.scores) {
            setActiveAnalysis(remoteData);
            setCurrentPath('market-deep-dive');
            return;
          }
        }
      } catch (err) {
        console.warn("Backend analysis resolution notice:", err);
      }
    }

    // Dynamic fallback keeping the exact overall_score, recommendation, and inputs
    const fallback = getLocalFallbackAnalysis(item);
    setActiveAnalysis(fallback);
    setCurrentPath('market-deep-dive');
  };

  const handleQuickLoadBenchmark = (cat, loc) => {
    const benchmarkPayload = {
      category: cat,
      location: loc,
      sub_location: "Central Commercial District",
      radius_km: 4.0,
      demographic: "Urban professionals & students",
      budget: "₹5,00,000 - ₹15,00,000",
      goal: "Start a Brand-New Business",
      use_live_serpapi: true
    };
    handleStartAnalysis(benchmarkPayload);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
    setCurrentPath('login');
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setCurrentPath('dashboard-home');
  };

  // Full-Page Authentication Routes (Login, Sign-Up, Forgot Password, Reset Password)
  if (['login', 'sign-up', 'register', 'forgot-password', 'reset-password'].includes(currentPath)) {
    const viewMapping = {
      'login': 'login',
      'sign-up': 'register',
      'register': 'register',
      'forgot-password': 'forgot-password',
      'reset-password': 'reset-password'
    };

    return (
      <AuthPage
        initialView={viewMapping[currentPath] || 'login'}
        initialResetToken={resetTokenParam}
        onAuthSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentPath('landing-page')}
      />
    );
  }

  // If on Landing Page, render the full-width Web Standard layout exactly from Stitch
  if (currentPath === 'landing-page') {
    return (
      <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={(path) => setCurrentPath(path)}
          onQuickLoadBenchmark={handleQuickLoadBenchmark}
        />
        <LandingPage
          onStartAnalysis={() => {
            if (currentUser) {
              setCurrentPath('new-analysis');
            } else {
              setCurrentPath('login');
            }
          }}
          onSeeDemo={() => {
            setActiveAnalysis(getLocalFallbackAnalysis());
            setCurrentPath('market-deep-dive');
          }}
          currentUser={currentUser}
          onOpenAuth={() => setCurrentPath('login')}
        />
      </div>
    );
  }

  // Protected Dashboard Workspace Route Guard: If not authenticated, prompt login screen
  if (!currentUser) {
    return (
      <AuthPage
        initialView="login"
        onAuthSuccess={handleAuthSuccess}
        onNavigateHome={() => setCurrentPath('landing-page')}
      />
    );
  }

  // Dashboard Workspace Layout (Web Dashboard shell from Stitch)
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* Auth Modal for Quick Session Switching */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(path) => setCurrentPath(path)}
        onQuickLoadBenchmark={handleQuickLoadBenchmark}
      />

      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        activeMarketName={activeAnalysis?.category || "Bangalore Coffee Retailing"}
        serpApiConnected={serpApiConnected}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('login')}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          onNavigate={(path) => setCurrentPath(path)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          currentCategory={activeAnalysis?.category || "Bangalore Specialty Coffee"}
          currentLocation={activeAnalysis?.location || "Bangalore, Karnataka, India"}
          serpApiConnected={serpApiConnected}
          currentUser={currentUser}
          onOpenAuth={() => handleOpenAuth('login')}
          onLogout={handleLogout}
        />


        {/* Dynamic Route Pages with ErrorBoundary protection */}
        <main className="relative pt-20 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto flex-1">
          <ErrorBoundary onReset={() => setCurrentPath('new-analysis')}>
            {currentPath === 'dashboard-home' && (
              <DashboardHome
                onNavigateNewAnalysis={() => setCurrentPath('new-analysis')}
                onOpenAnalysis={handleOpenAnalysisFromHistory}
                analyses={historyList}
              />
            )}

            {currentPath === 'new-analysis' && (
              <NewAnalysis
                initialCategory="Specialty Coffee Shop"
                initialLocation="Bangalore, Karnataka, India"
                onStartAnalysis={handleStartAnalysis}
              />
            )}

            {currentPath === 'agent-research' && (
              <AgentResearch
                category={pendingAnalysisPayload?.category || "Specialty Coffee Shop"}
                location={pendingAnalysisPayload?.location || "Bangalore, Karnataka, India"}
                onComplete={handleResearchCompleted}
              />
            )}

            {currentPath === 'market-deep-dive' && (
              <MarketDeepDive
                data={activeAnalysis}
                onNavigateNewAnalysis={() => setCurrentPath('new-analysis')}
                onExportReport={() => setCurrentPath('export-reports')}
              />
            )}

            {currentPath === 'previous-analyses' && (
              <PreviousAnalyses
                analyses={historyList}
                onOpenAnalysis={handleOpenAnalysisFromHistory}
                onNavigateNewAnalysis={() => setCurrentPath('new-analysis')}
              />
            )}

            {currentPath === 'export-reports' && (
              <ExportReport data={activeAnalysis} />
            )}

            {currentPath === 'api-keys' && (
              <ApiSettings onConfigUpdated={checkHealth} />
            )}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
