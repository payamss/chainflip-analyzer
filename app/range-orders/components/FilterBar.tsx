import React from 'react';

const FilterBar = ({
  statusFilter,
  setStatusFilter,
}: {
  statusFilter: string | null;
  setStatusFilter: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className='mb-4 flex items-center justify-center text-center'>
      <button
        onClick={() => setStatusFilter(null)}
        className={`rounded-l-3xl px-8 py-2 ${statusFilter === null ? 'bg-gray-900' : 'bg-gray-700 hover:bg-gray-900'}`}
      >
        All
      </button>
      <button
        onClick={() => setStatusFilter('OPEN')}
        className={`px-8 py-2 ${statusFilter === 'OPEN' ? 'bg-gray-900' : 'bg-gray-700 hover:bg-gray-900'}`}
      >
        Open
      </button>
      <button
        onClick={() => setStatusFilter('CLOSED')}
        className={`rounded-r-3xl px-8 py-2 ${statusFilter === 'CLOSED' ? 'bg-gray-900' : 'bg-gray-700 hover:bg-gray-900'}`}
      >
        Closed
      </button>
    </div>
  );
};

export default FilterBar;
