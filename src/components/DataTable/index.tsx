import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDataTableStore } from '../../store/dataTableStore';
import type { DataRow } from '../../utils/generateMockData';

// Memoized Table Row Component to optimize rendering
interface TableRowProps {
  row: DataRow;
  style: React.CSSProperties;
}

const TableRowComponent = ({ row, style }: TableRowProps) => {
  return (
    <div
      className="table-row virtual-row"
      style={style}
      role="row"
    >
      <div className="table-cell col-name" role="cell">
        {row.name}
      </div>
      <div className="table-cell col-category" role="cell">
        {row.category}
      </div>
      <div className="table-cell col-value value-display" role="cell">
        ${row.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div className="table-cell col-status" role="cell">
        <span className={`status-pill status-${row.status}`}>
          {row.status}
        </span>
      </div>
      <div className="table-cell col-date" role="cell">
        {row.date}
      </div>
    </div>
  );
};

export const TableRow = React.memo(TableRowComponent);

// Main Table Component
export const DataTable = () => {
  const { displayData, sortConfig, setSort, isLoading } = useDataTableStore();
  const parentRef = useRef<HTMLDivElement>(null);

  // Initialize TanStack Virtual hook
  const rowVirtualizer = useVirtualizer({
    count: displayData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Expected average height of a row in pixels
    overscan: 8 // Buffer size for pre-rendering rows outside viewport
  });

  const handleSortClick = (column: keyof DataRow) => {
    setSort(column);
  };

  const handleKeyDown = (e: React.KeyboardEvent, column: keyof DataRow) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSort(column);
    }
  };

  // Helper to render sort indicator icons
  const renderSortIndicator = (column: keyof DataRow) => {
    if (sortConfig.column !== column) {
      return <span className="sort-indicator">↕</span>;
    }
    return (
      <span className="sort-indicator sort-active">
        {sortConfig.direction === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  // Helper to get aria-sort attribute value
  const getAriaSort = (column: keyof DataRow) => {
    if (sortConfig.column !== column) return 'none';
    return sortConfig.direction === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="relative-wrapper">
      {/* Loading Overlay */}
      <div className={`loading-overlay ${isLoading ? 'active' : ''}`} role="status" aria-live="polite">
        <div className="spinner"></div>
        <div className="loading-text">Processing dataset...</div>
      </div>

      <div className="table-container">
        {/* Scrollable Container */}
        <div
          ref={parentRef}
          className="table-scroll-container"
          style={{ height: '500px' }}
        >
          <div className="table-grid" role="table" aria-label="Virtualized Data Table">
            {/* Table Header */}
            <div className="table-header-group" role="rowgroup">
              <div className="table-header-row" role="row">
                <div
                  className="table-cell table-header-cell col-name"
                  role="columnheader"
                  tabIndex={0}
                  onClick={() => handleSortClick('name')}
                  onKeyDown={(e) => handleKeyDown(e, 'name')}
                  aria-sort={getAriaSort('name')}
                  aria-label="Name. Activate to sort."
                >
                  Name {renderSortIndicator('name')}
                </div>
                <div
                  className="table-cell table-header-cell col-category"
                  role="columnheader"
                  tabIndex={0}
                  onClick={() => handleSortClick('category')}
                  onKeyDown={(e) => handleKeyDown(e, 'category')}
                  aria-sort={getAriaSort('category')}
                  aria-label="Category. Activate to sort."
                >
                  Category {renderSortIndicator('category')}
                </div>
                <div
                  className="table-cell table-header-cell col-value"
                  role="columnheader"
                  tabIndex={0}
                  style={{ justifyContent: 'flex-end', textAlign: 'right' }}
                  onClick={() => handleSortClick('value')}
                  onKeyDown={(e) => handleKeyDown(e, 'value')}
                  aria-sort={getAriaSort('value')}
                  aria-label="Value. Activate to sort."
                >
                  Value {renderSortIndicator('value')}
                </div>
                <div
                  className="table-cell table-header-cell col-status"
                  role="columnheader"
                  tabIndex={0}
                  style={{ justifyContent: 'center' }}
                  onClick={() => handleSortClick('status')}
                  onKeyDown={(e) => handleKeyDown(e, 'status')}
                  aria-sort={getAriaSort('status')}
                  aria-label="Status. Activate to sort."
                >
                  Status {renderSortIndicator('status')}
                </div>
                <div
                  className="table-cell table-header-cell col-date"
                  role="columnheader"
                  tabIndex={0}
                  onClick={() => handleSortClick('date')}
                  onKeyDown={(e) => handleKeyDown(e, 'date')}
                  aria-sort={getAriaSort('date')}
                  aria-label="Date. Activate to sort."
                >
                  Date {renderSortIndicator('date')}
                </div>
              </div>
            </div>

            {/* Table Body */}
            {displayData.length > 0 ? (
              <div
                className="table-row-group"
                role="rowgroup"
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                  const row = displayData[virtualItem.index];
                  if (!row) return null;
                  return (
                    <TableRow
                      key={row.id}
                      row={row}
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`
                      }}
                    />
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Empty State */}
          {!isLoading && displayData.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">No results found</div>
              <div className="empty-desc">
                We couldn't find any records matching your search filters. Try resetting them or adjusting your terms.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
