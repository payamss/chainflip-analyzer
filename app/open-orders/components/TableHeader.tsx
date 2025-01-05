import React from 'react';

const TableHeader = ({
  sortConfig,
  setSortConfig,
}: {
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: string; direction: 'asc' | 'desc' } | null>>;
}) => {
  const handleSort = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({ key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const columns = [
    { key: 'status', label: 'Status' },
    { key: 'accountId', label: 'Id' },
    { key: 'orderType', label: 'Type' },
    { key: 'baseAmount', label: 'Assets / Amount' },
    { key: 'orderValue', label: 'Value' },
    { key: 'range', label: 'Range' },
    { key: 'earnedFees', label: 'Earned Fees' },
    { key: 'duration', label: 'Duration (Days)' },
    { key: 'dpr', label: 'DPR' },
    { key: 'mpr', label: 'MPR' },
    { key: 'apr', label: 'APR' },
  ];

  return (
    <thead className="bg-blue-950 text-white uppercase">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className="border border-gray-700 p-4 text-left cursor-pointer"
            onClick={() => handleSort(col.key)}
          >
            {col.label} {sortConfig?.key === col.key ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
          </th>
        ))}
        <th className="border border-gray-700 p-4 text-left">Account Link</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
