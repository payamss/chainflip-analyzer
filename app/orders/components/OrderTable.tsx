/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_POOL_ORDERS } from '../graphql/queries';

const ITEMS_PER_PAGE = 10;

const OrderTable = () => {
  const { data, loading, error } = useQuery(ALL_POOL_ORDERS);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState<{ status: string; orderType: string }>({ status: '', orderType: '' });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  let filteredData = [...data.allPoolOrders.nodes];

  // Apply filters
  if (filters.status) {
    filteredData = filteredData.filter((order: any) => order.status === filters.status);
  }
  if (filters.orderType) {
    filteredData = filteredData.filter((order: any) => order.orderType === filters.orderType);
  }

  // Apply sorting
  if (sortConfig !== null) {
    filteredData.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (key: string) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    } else {
      setSortConfig({ key, direction: 'asc' });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(0); // Reset to the first page
  };

  return (
    <div className="overflow-x-auto">
      {/* Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="CLOSED">CLOSED</option>
        </select>
        <select
          value={filters.orderType}
          onChange={(e) => handleFilterChange('orderType', e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Order Types</option>
          <option value="LIMIT">LIMIT</option>
          <option value="RANGE">RANGE</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              onClick={() => handleSort('orderId')}
            >
              Order ID {sortConfig?.key === 'orderId' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              onClick={() => handleSort('quoteAsset')}
            >
              Quote Asset {sortConfig?.key === 'quoteAsset' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              onClick={() => handleSort('baseAsset')}
            >
              Base Asset {sortConfig?.key === 'baseAsset' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order: any) => (
            <tr key={order.id}>
              <td className="border border-gray-300 p-2">{order.orderId}</td>
              <td className="border border-gray-300 p-2">{order.quoteAsset}</td>
              <td className="border border-gray-300 p-2">{order.baseAsset}</td>
              <td className="border border-gray-300 p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-4 py-2 border rounded ${currentPage === 0 ? 'cursor-not-allowed text-gray-400' : 'text-blue-600'}`}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-4 py-2 border rounded ${currentPage === totalPages - 1 ? 'cursor-not-allowed text-gray-400' : 'text-blue-600'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderTable;
