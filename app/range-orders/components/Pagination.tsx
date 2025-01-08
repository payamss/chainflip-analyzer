import React from 'react';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className='mt-6 flex items-center justify-between gap-2'>
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={`rounded-lg px-4 py-2 ${
          currentPage === 0
            ? 'cursor-not-allowed bg-accent text-gray-500'
            : 'bg-secondary text-white hover:bg-neutral-800'
        }`}
      >
        Previous
      </button>
      <span className='text-sm text-textGray'>
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={`rounded-lg px-4 py-2 ${
          currentPage === totalPages - 1
            ? 'cursor-not-allowed bg-accent text-gray-500'
            : 'bg-secondary text-white hover:bg-neutral-800'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
