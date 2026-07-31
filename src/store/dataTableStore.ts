import { create } from 'zustand';
import type { DataRow } from '../utils/generateMockData';

interface DataTableState {
  originalData: DataRow[];
  displayData: DataRow[];
  filters: { name: string; category: string };
  sortConfig: { column: keyof DataRow | null; direction: 'asc' | 'desc' };
  isLoading: boolean;
  
  initializeData: (data: DataRow[]) => void;
  setFilter: (column: 'name' | 'category', value: string) => void;
  setSort: (column: keyof DataRow) => void;
  resetFilters: () => void;
}

// Helper to filter and sort data efficiently
const applyFiltersAndSort = (
  data: DataRow[],
  filters: { name: string; category: string },
  sortConfig: { column: keyof DataRow | null; direction: 'asc' | 'desc' }
): DataRow[] => {
  let result = [...data];

  // 1. Filtering
  const filterName = filters.name.trim().toLowerCase();
  const filterCategory = filters.category;

  if (filterName || filterCategory) {
    result = result.filter((row) => {
      const matchesName = filterName ? row.name.toLowerCase().includes(filterName) : true;
      const matchesCategory = filterCategory ? row.category === filterCategory : true;
      return matchesName && matchesCategory;
    });
  }

  // 2. Sorting
  const { column, direction } = sortConfig;
  if (column) {
    const isAsc = direction === 'asc';
    result.sort((a, b) => {
      const valA = a[column];
      const valB = b[column];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return isAsc ? valA - valB : valB - valA;
      }

      // Fallback to string comparison for other fields (including date)
      const strA = String(valA);
      const strB = String(valB);

      return isAsc
        ? strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' })
        : strB.localeCompare(strA, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  return result;
};

export const useDataTableStore = create<DataTableState>((set, get) => ({
  originalData: [],
  displayData: [],
  filters: { name: '', category: '' },
  sortConfig: { column: null, direction: 'asc' },
  isLoading: false,

  initializeData: (data) => {
    set({ isLoading: true, originalData: data });
    // Defer processing to allow loading spinner to render
    setTimeout(() => {
      const { filters, sortConfig } = get();
      const displayData = applyFiltersAndSort(data, filters, sortConfig);
      set({ displayData, isLoading: false });
    }, 50);
  },

  setFilter: (column, value) => {
    set((state) => ({
      filters: { ...state.filters, [column]: value },
      isLoading: true
    }));
    // Defer processing
    setTimeout(() => {
      const { originalData, filters, sortConfig } = get();
      const displayData = applyFiltersAndSort(originalData, filters, sortConfig);
      set({ displayData, isLoading: false });
    }, 50);
  },

  setSort: (column) => {
    set((state) => {
      let nextColumn: keyof DataRow | null = column;
      let nextDirection: 'asc' | 'desc' = 'asc';

      const current = state.sortConfig;
      if (current.column === column) {
        if (current.direction === 'asc') {
          nextDirection = 'desc';
        } else {
          // Cycle to default/unsorted
          nextColumn = null;
          nextDirection = 'asc';
        }
      }

      return {
        sortConfig: { column: nextColumn, direction: nextDirection },
        isLoading: true
      };
    });

    // Defer processing
    setTimeout(() => {
      const { originalData, filters, sortConfig } = get();
      const displayData = applyFiltersAndSort(originalData, filters, sortConfig);
      set({ displayData, isLoading: false });
    }, 50);
  },

  resetFilters: () => {
    set({
      filters: { name: '', category: '' },
      sortConfig: { column: null, direction: 'asc' },
      isLoading: true
    });
    setTimeout(() => {
      const { originalData } = get();
      set({ displayData: [...originalData], isLoading: false });
    }, 50);
  }
}));
