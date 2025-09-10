import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import ComponentShowcase from './pages/ComponentShowcase';
import DebugPanel from './pages/DebugPanel';
import Reports from './pages/Reports';
import TrackSessionPage from './pages/TrackSessionPage';
import StudentsPage from './pages/StudentsPage';
import StudentProfile from './pages/StudentProfile';
import ToastContainer from './components/Toast';
import { readHash } from './utils/hashParams';
import InsightsPage from './pages/InsightsPage';
import CoachPage from './pages/CoachPage';
import PrintReport from './pages/PrintReport';
import GoalsPage from './pages/GoalsPage';

const routes: Record<string, React.ComponentType> = {
  '/': TrackSessionPage,
  '/reports': Reports,
  '/students': StudentsPage,
  '/student': StudentProfile, // Assumes an ID, e.g., #/student?id=123
  '/insights': InsightsPage,
  '/coach': CoachPage,
  '/goals': GoalsPage,
  '/print': PrintReport,
  '/showcase': ComponentShowcase,
  '/debug': DebugPanel,
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(readHash());

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(readHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  const pathName = currentPath.split('?')[0] || '/';
  const Page = routes[pathName] || TrackSessionPage; // Default to tracker

  return (
    <>
      <AppShell>
        <Page />
      </AppShell>
      <ToastContainer />
    </>
  );
};

export default App;