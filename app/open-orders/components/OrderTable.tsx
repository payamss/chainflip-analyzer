/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_POOL_ORDERS } from '../graphql/queries';

const ITEMS_PER_PAGE = 15;

const OrderTable = () => {
  const { data, loading, error } = useQuery(ALL_POOL_ORDERS);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('');

  if (loading) return <div className="text-center p-4 text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error.message}</div>;

  let filteredData = [...data.allPoolOrders.nodes];

  // Apply filters
  if (orderTypeFilter) {
    filteredData = filteredData.filter((order: any) => order.orderType === orderTypeFilter);
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

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">

      {/* Filter */}
      <div className="flex justify-center mb-6">
        <select
          value={orderTypeFilter}
          onChange={(e) => setOrderTypeFilter(e.target.value)}
          className="border border-blue-600 bg-gray-800 text-white p-2 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-950"
        >
          <option value="">All Order Types</option>
          <option value="LIMIT">LIMIT</option>
          <option value="RANGE">RANGE</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-950 text-white uppercase">
            <tr>
              <th
                className="border border-gray-700 p-4 text-left cursor-pointer"
                onClick={() => handleSort('orderId')}
              >
                Order ID {sortConfig?.key === 'orderId' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th
                className="border border-gray-700 p-4 text-left cursor-pointer"
                onClick={() => handleSort('quoteAsset')}
              >
                Quote Asset {sortConfig?.key === 'quoteAsset' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th
                className="border border-gray-700 p-4 text-left cursor-pointer"
                onClick={() => handleSort('baseAsset')}
              >
                Base Asset {sortConfig?.key === 'baseAsset' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th
                className="border border-gray-700 p-4 text-left cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Status {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order: any, index: number) => (
              <tr
                key={order.id}
                className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'
                  } hover:bg-blue-800 transition-colors duration-200`}
              >
                <td className="border border-gray-700 p-4">{order.orderId}</td>
                <td className="border border-gray-700 p-4">{order.quoteAsset}</td>
                <td className="border border-gray-700 p-4">{order.baseAsset}</td>
                <td className="border border-gray-700 p-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-blue-900 text-white hover:bg-blue-950'
            }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-4 py-2 rounded ${currentPage === totalPages - 1 ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-blue-900 text-white hover:bg-blue-950'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderTable;
