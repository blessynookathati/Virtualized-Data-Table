import React, { useState, useEffect } from 'react';
import { useDataTableStore } from '../../store/dataTableStore';
import { CATEGORIES } from '../../utils/generateMockData';

export const TableControls = () => {
  const { filters, setFilter, resetFilters, displayData, originalData } = useDataTableStore();
  
  // Local state for debouncing name input
  const [localName, setLocalName] = useState(filters.name);

  // Sync local name with global store if filters are reset externally
  useEffect(() => {
    setLocalName(filters.name);
  }, [filters.name]);

  // Debounce effect for name input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localName !== filters.name) {
        setFilter('name', localName);
      }
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [localName, setFilter, filters.name]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('category', e.target.value);
  };

  const handleReset = () => {
    setLocalName('');
    resetFilters();
  };

  return (
    <div className="glass-panel">
      <div className="controls-bar">
        {/* Name Filter Input */}
        <div className="input-group">
          <label htmlFor="filter-name" className="input-label">
            Filter by Name
          </label>
          <input
            id="filter-name"
            type="text"
            className="text-input"
            placeholder="Search names..."
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            aria-label="Filter by Name"
          />
        </div>

        {/* Category Filter Input */}
        <div className="input-group">
          <label htmlFor="filter-category" className="input-label">
            Filter by Category
          </label>
          <select
            id="filter-category"
            className="select-input"
            value={filters.category}
            onChange={handleCategoryChange}
            aria-label="Filter by Category"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Action */}
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          aria-label="Reset all filters and sort order"
        >
          Reset Filters
        </button>
      </div>

      {/* Row Stats Info */}
      <div className="stats-container">
        <div>
          Showing <span className="stats-count" data-testid="visible-count">{displayData.length.toLocaleString()}</span> of{' '}
          <span className="stats-count">{originalData.length.toLocaleString()}</span> rows
        </div>
        {displayData.length === 0 && (
          <div style={{ color: 'var(--status-inactive-text)', fontWeight: 500 }}>
            No matching records found
          </div>
        )}
      </div>
    </div>
  );
};
