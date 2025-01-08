import React from 'react';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const TableHeader = ({
  sortConfig,
  setSortConfig,
}: {
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  setSortConfig: React.Dispatch<
    React.SetStateAction<{ key: string; direction: 'asc' | 'desc' } | null>
  >;
}) => {
  const handleSort = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'desc' });
    }
  };

  const columns = [
    { key: 'status', label: 'Status' },
    { key: 'accountId', label: 'Account ID' },
    { key: 'baseAmount', label: 'Assets / Amount' },
    { key: 'orderValue', label: 'Value' },
    { key: 'range', label: 'Range' },
    { key: 'earnedFees', label: 'Earned Fees' },
    { key: 'duration', label: 'Duration' },
    { key: 'dpr', label: 'DPR' },
    { key: 'mpr', label: 'MPR' },
    { key: 'apr', label: 'APR' },
  ];

  return (
    <thead className='bg-neutral-900 uppercase text-white'>
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className='cursor-pointer border border-accent text-center'
            onClick={() => handleSort(col.key)}
          >
            <div className='flex items-center justify-center'>
              {col.label}
              {sortConfig?.key === col.key &&
                (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </div>
          </th>
        ))}
        <th className='border border-accent p-2 text-center'>Account Link</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
