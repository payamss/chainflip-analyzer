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
    <div className="flex justify-between items-center mt-6">
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-950'}`}
      >
        Previous
      </button>
      <span className="text-sm">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 rounded ${currentPage === totalPages - 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-950'
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
