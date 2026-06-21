import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Nav from './components/Nav';
import SkipLink from './components/SkipLink';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const QuizPage = React.lazy(() => import('./components/Quiz'));
const ChallengesPage = React.lazy(() => import('./pages/ChallengesPage'));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'));
const LearnPage = React.lazy(() => import('./pages/LearnPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// A simple loading spinner fallback for lazy loaded routes
const RouteLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--color-banyan)' }}>
    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--color-line)', borderTopColor: 'var(--color-banyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function ProtectedRoute({ children }) {
  const { currentUser, quizCompleted, loading } = useAuth();
  
  if (loading) return <RouteLoader />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!quizCompleted) return <Navigate to="/quiz" replace />;
  
  return children;
}

function QuizRoute({ children }) {
  const { currentUser, quizCompleted, loading } = useAuth();
  
  if (loading) return <RouteLoader />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (quizCompleted) return <Navigate to="/dashboard" replace />;
  
  return children;
  return children;
}
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          {/* Global CSS Texture Overlay */}
          <div className="grain" aria-hidden="true" />

        <SkipLink />
        <Nav />

        <main id="main-content" className="main-content">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Semi-Protected Onboarding Route */}
              <Route path="/quiz" element={
                <QuizRoute>
                  <QuizPage />
                </QuizRoute>
              } />
              
              {/* Fully Protected Application Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="/challenges" element={
                <ProtectedRoute>
                  <ChallengesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/progress" element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              } />

              <Route path="/learn" element={
                <ProtectedRoute>
                  <LearnPage />
                </ProtectedRoute>
              } />
              
              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
