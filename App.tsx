import React from 'react';
import { Layout } from './components/layout/Layout';
import { useUIStore } from './store/uiStore';
import { StrategistView } from './features/strategist/StrategistView';
import { AssessmentView } from './features/assessment/AssessmentView';
import { DashboardView } from './features/dashboard/DashboardView';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { SystemRestoredNotification } from './components/ui/SystemRestoredNotification';

const App: React.FC = () => {
  const { currentView } = useUIStore();

  const renderView = () => {
    switch (currentView) {
      case 'strategist':
        return <StrategistView />;
      case 'assessment':
        return <AssessmentView />;
      case 'dashboard':
        return <DashboardView />;
      default:
        return <StrategistView />;
    }
  };

  return (
    <ErrorBoundary>
      <SystemRestoredNotification />
      <Layout>
        {renderView()}
      </Layout>
    </ErrorBoundary>
  );
};

export default App;