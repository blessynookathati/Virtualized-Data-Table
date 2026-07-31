import { useDataTableStore } from '../src/store/dataTableStore';
import { DataRow } from '../src/utils/generateMockData';

// Small mock dataset for testing
const mockTestData: DataRow[] = [
  { id: '1', name: 'Alice Smith', category: 'Electronics', value: 150.50, status: 'active', date: '2026-01-15' },
  { id: '2', name: 'Bob Jones', category: 'Apparel', value: 45.00, status: 'pending', date: '2026-03-22' },
  { id: '3', name: 'Charlie Smith', category: 'Electronics', value: 850.00, status: 'inactive', date: '2025-11-05' },
  { id: '4', name: 'Diana Prince', category: 'Books', value: 12.99, status: 'active', date: '2026-02-10' }
];

describe('dataTableStore State Logic', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Reset Zustand store state before each test
    const { resetFilters, initializeData } = useDataTableStore.getState();
    initializeData([]);
    resetFilters();
    jest.advanceTimersByTime(100);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should initialize data correctly', () => {
    const store = useDataTableStore.getState();
    store.initializeData(mockTestData);
    
    // Should enter loading state immediately
    expect(useDataTableStore.getState().isLoading).toBe(true);

    // Fast-forward timers to run the processing
    jest.advanceTimersByTime(100);

    const state = useDataTableStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.originalData).toHaveLength(4);
    expect(state.displayData).toHaveLength(4);
  });

  test('should filter by name (case-insensitive substring)', () => {
    useDataTableStore.getState().initializeData(mockTestData);
    jest.advanceTimersByTime(100);

    useDataTableStore.getState().setFilter('name', 'smith');
    expect(useDataTableStore.getState().isLoading).toBe(true);
    
    jest.advanceTimersByTime(100);
    
    const state = useDataTableStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.displayData).toHaveLength(2); // Alice Smith, Charlie Smith
    expect(state.displayData.map(r => r.id)).toEqual(['1', '3']);
  });

  test('should filter by category (exact match)', () => {
    useDataTableStore.getState().initializeData(mockTestData);
    jest.advanceTimersByTime(100);

    useDataTableStore.getState().setFilter('category', 'Electronics');
    jest.advanceTimersByTime(100);

    const state = useDataTableStore.getState();
    expect(state.displayData).toHaveLength(2); // Alice and Charlie
    expect(state.displayData.every(r => r.category === 'Electronics')).toBe(true);
  });

  test('should sort columns in ascending, descending, and cycle back to unsorted', () => {
    useDataTableStore.getState().initializeData(mockTestData);
    jest.advanceTimersByTime(100);

    // 1st click: Ascending (by value: 12.99 -> 45.00 -> 150.50 -> 850.00)
    useDataTableStore.getState().setSort('value');
    jest.advanceTimersByTime(100);
    let state = useDataTableStore.getState();
    expect(state.sortConfig.column).toBe('value');
    expect(state.sortConfig.direction).toBe('asc');
    expect(state.displayData.map(r => r.id)).toEqual(['4', '2', '1', '3']);

    // 2nd click: Descending (by value: 850.00 -> 150.50 -> 45.00 -> 12.99)
    useDataTableStore.getState().setSort('value');
    jest.advanceTimersByTime(100);
    state = useDataTableStore.getState();
    expect(state.sortConfig.column).toBe('value');
    expect(state.sortConfig.direction).toBe('desc');
    expect(state.displayData.map(r => r.id)).toEqual(['3', '1', '2', '4']);

    // 3rd click: Reset to unsorted (should return to original sequence)
    useDataTableStore.getState().setSort('value');
    jest.advanceTimersByTime(100);
    state = useDataTableStore.getState();
    expect(state.sortConfig.column).toBeNull();
    expect(state.displayData.map(r => r.id)).toEqual(['1', '2', '3', '4']);
  });

  test('should reset filters properly', () => {
    useDataTableStore.getState().initializeData(mockTestData);
    jest.advanceTimersByTime(100);

    useDataTableStore.getState().setFilter('name', 'Alice');
    useDataTableStore.getState().setSort('value');
    jest.advanceTimersByTime(100);

    expect(useDataTableStore.getState().displayData).toHaveLength(1);

    useDataTableStore.getState().resetFilters();
    jest.advanceTimersByTime(100);

    const state = useDataTableStore.getState();
    expect(state.filters.name).toBe('');
    expect(state.sortConfig.column).toBeNull();
    expect(state.displayData).toHaveLength(4);
  });
});
