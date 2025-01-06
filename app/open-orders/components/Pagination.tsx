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
        className={`px-4 py-2 rounded-lg ${currentPage === 0 ? 'bg-accent text-gray-500 cursor-not-allowed' : 'bg-secondary text-white hover:bg-gray-800'
          }`}
      >
        Previous
      </button>
      <span className="text-sm text-textGray">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className={`px-4 py-2 rounded-lg ${currentPage === totalPages - 1 ? 'bg-accent text-gray-500 cursor-not-allowed' : 'bg-secondary text-white hover:bg-gray-800'
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
