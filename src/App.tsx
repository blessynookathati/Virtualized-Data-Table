import { useEffect } from 'react';
import { useDataTableStore } from './store/dataTableStore';
import { generateMockData } from './utils/generateMockData';
import { TableControls } from './components/TableControls';
import { DataTable } from './components/DataTable';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { initializeData, originalData } = useDataTableStore();

  useEffect(() => {
    // Generate 12,000 rows of mock data (exceeds the 10,000+ requirement)
    const mockData = generateMockData(12000);
    initializeData(mockData);
  }, [initializeData]);

  // Initial loading state (before the mock data is initialized in store)
  const isInitiallyLoading = originalData.length === 0;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Virtualized Reporting Dashboard</h1>
        <p className="app-subtitle">
          A high-performance enterprise data table rendering 12,000+ records at 60 FPS using TanStack Virtual and Zustand.
        </p>
      </header>

      <ErrorBoundary>
        {isInitiallyLoading ? (
          <div className="skeleton-container" role="status" aria-label="Loading workspace data...">
            <div className="skeleton-item" style={{ height: '80px', marginBottom: '1.5rem' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
            <div className="skeleton-item" style={{ height: '48px' }}></div>
          </div>
        ) : (
          <>
            <TableControls />
            <DataTable />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
