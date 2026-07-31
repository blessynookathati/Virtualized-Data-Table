import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DataTable } from '../src/components/DataTable';
import { TableControls } from '../src/components/TableControls';
import { useDataTableStore } from '../src/store/dataTableStore';
import { DataRow } from '../src/utils/generateMockData';

// Mock TanStack Virtual so it returns virtual items instead of 0 elements due to JSDOM 0-height container limits.
jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: jest.fn().mockImplementation(({ count }) => {
    const items = Array.from({ length: count }, (_, i) => ({
      index: i,
      start: i * 48,
      size: 48,
      key: i
    }));
    return {
      getVirtualItems: () => items,
      getTotalSize: () => count * 48
    };
  })
}));

const testData: DataRow[] = [
  { id: '1', name: 'Alice Smith', category: 'Electronics', value: 150.50, status: 'active', date: '2026-01-15' },
  { id: '2', name: 'Bob Jones', category: 'Apparel', value: 45.00, status: 'pending', date: '2026-03-22' },
  { id: '3', name: 'Charlie Smith', category: 'Electronics', value: 850.00, status: 'inactive', date: '2025-11-05' }
];

describe('DataTable & TableControls Component Integrations', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    act(() => {
      useDataTableStore.getState().initializeData(testData);
      jest.advanceTimersByTime(100);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render table columns and correct ARIA role attributes', () => {
    render(
      <>
        <TableControls />
        <DataTable />
      </>
    );

    // Verify grid table container and headers mount with proper roles
    expect(screen.getByRole('table', { name: /virtualized data table/i })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(5);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /category/i })).toBeInTheDocument();
  });

  test('should support keyboard navigation (Enter/Space) and update aria-sort attribute on column header', () => {
    render(<DataTable />);
    
    const valueHeader = screen.getByRole('columnheader', { name: /value/i });
    expect(valueHeader).toHaveAttribute('aria-sort', 'none');

    // Focus and press Space
    valueHeader.focus();
    fireEvent.keyDown(valueHeader, { key: ' ', code: 'Space' });
    
    // Process async store updates inside act()
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(valueHeader).toHaveAttribute('aria-sort', 'ascending');

    // Press Enter to cycle to descending
    fireEvent.keyDown(valueHeader, { key: 'Enter', code: 'Enter' });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(valueHeader).toHaveAttribute('aria-sort', 'descending');
  });

  test('should debounce filter search inputs and update shown items count', () => {
    render(
      <>
        <TableControls />
        <DataTable />
      </>
    );

    // Initial count is 3
    expect(screen.getByTestId('visible-count')).toHaveTextContent('3');

    const nameInput = screen.getByLabelText(/filter by name/i);
    fireEvent.change(nameInput, { target: { value: 'Smith' } });

    // Typing is debounced, so count shouldn't change immediately
    expect(screen.getByTestId('visible-count')).toHaveTextContent('3');

    // Advance timer past debounce threshold (350ms) + store processing (50ms)
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Now it should filter down to 2 rows containing "Smith"
    expect(screen.getByTestId('visible-count')).toHaveTextContent('2');
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Charlie Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
  });

  test('should display empty message if filter returns no matches', () => {
    render(
      <>
        <TableControls />
        <DataTable />
      </>
    );

    const nameInput = screen.getByLabelText(/filter by name/i);
    fireEvent.change(nameInput, { target: { value: 'NonExistentProduct' } });
    
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(screen.getByTestId('visible-count')).toHaveTextContent('0');
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });
});
