import React from 'react';

const FilterBar = ({
  statusFilter,
  setStatusFilter,
}: {
  statusFilter: string | null;
  setStatusFilter: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="mb-4 flex items-center gap-4 justify-center text-center">
      <button
        onClick={() => setStatusFilter(null)}
        className={`px-4 py-2 rounded ${statusFilter === null ? 'bg-blue-600' : 'bg-gray-700 hover:bg-blue-900'}`}
      >
        All
      </button>
      <button
        onClick={() => setStatusFilter('OPEN')}
        className={`px-4 py-2 rounded ${statusFilter === 'OPEN' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-blue-900'}`}
      >
        Open
      </button>
      <button
        onClick={() => setStatusFilter('CLOSED')}
        className={`px-4 py-2 rounded ${statusFilter === 'CLOSED' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-blue-900'}`}
      >
        Closed
      </button>
    </div>
  );
};

export default FilterBar;
