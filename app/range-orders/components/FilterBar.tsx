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
        className={`rounded-l-3xl px-8 py-2 ${statusFilter === null ? 'bg-neutral-900' : 'bg-secondary hover:bg-neutral-900'}`}
      >
        All
      </button>
      <button
        onClick={() => setStatusFilter('OPEN')}
        className={`px-8 py-2 ${statusFilter === 'OPEN' ? 'bg-neutral-800' : 'bg-secondary hover:bg-neutral-900'}`}
      >
        Open
      </button>
      <button
        onClick={() => setStatusFilter('CLOSED')}
        className={`rounded-r-3xl px-8 py-2 ${statusFilter === 'CLOSED' ? 'bg-neutral-800' : 'bg-secondary hover:bg-neutral-900'}`}
      >
        Closed
      </button>
    </div>
  );
};

export default FilterBar;
