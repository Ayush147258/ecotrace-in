import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import QuizPage from './components/Quiz';
import ChallengesPage from './pages/ChallengesPage';
import ProgressPage from './pages/ProgressPage';
import LearnPage from './pages/LearnPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import Nav from './components/Nav';
import ErrorBoundary from './components/ErrorBoundary';
import { getCurrentUser } from './utils/auth';

/**
 * ProtectedRoute Wrapper
 * Enforces two invariants for core app features:
 * 1. User must be authenticated (in localStorage)
 * 2. User must have completed the onboarding quiz
 */
function ProtectedRoute({ children }) {
  const user = getCurrentUser();
  
  // 1. Check if user is authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // 2. Check if this specific user has completed the quiz
  const quizCompleted = localStorage.getItem(`ecotrace_quiz_completed_${user.id}`);
  if (!quizCompleted) {
    return <Navigate to="/quiz" replace />;
  }
  
  // 3. User is valid and onboarding is complete
  return children;
}

/**
 * QuizRoute Wrapper
 * Ensures only authenticated users can access the quiz.
 * Also prevents returning users from being trapped in the quiz 
 * if they navigate directly to /quiz.
 */
function QuizRoute({ children }) {
  const user = getCurrentUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const quizCompleted = localStorage.getItem(`ecotrace_quiz_completed_${user.id}`);
  if (quizCompleted) {
    // Prevent auto re-entry; quiz should only be retaken explicitly via dashboard settings
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Global CSS Texture Overlay */}
        <div className="grain"></div>
        
        {/* Universal Navigation */}
        <Nav />
        
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
      </BrowserRouter>
    </ErrorBoundary>
  );
}
