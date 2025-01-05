/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  calculateTotalFees,
  calculateDaysPassed,
  calculateDPR,
  calculateMPR,
  calculateAPR,
  calculatePriceFromTick,
} from '@/utils/calculateMetrics';
import { mockOrders } from './mockData';

const ITEMS_PER_PAGE = 15;

const OrderTable = () => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Extend the data with dynamically computed fields for sorting
  const extendedData = mockOrders.map((order: any) => {
    const earnedFees = calculateTotalFees(order);
    const orderValue = parseFloat(order.quoteAmount) / 1e6; // Convert to proper units
    const daysPassed = calculateDaysPassed(order.eventByOrderCreatedEventId.blockByBlockId.timestamp);
    const dpr = calculateDPR(earnedFees, orderValue, daysPassed);
    const mpr = calculateMPR(dpr);
    const apr = calculateAPR(dpr);

    return {
      ...order,
      earnedFees,
      orderValue,
      daysPassed,
      dpr,
      mpr,
      apr,
    };
  });

  // Sorting logic
  const sortedData = [...extendedData];
  if (sortConfig !== null) {
    sortedData.sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Sorting handler
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

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Table */}
      <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-950 text-white uppercase">
            <tr>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('nodeId')}>
                id {sortConfig?.key === 'nodeId' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('orderType')}>
                Type {sortConfig?.key === 'orderType' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('baseAmount')}>
                Assets / Amount {sortConfig?.key === 'baseAmount' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('orderValue')}>
                Value {sortConfig?.key === 'orderValue' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left">Price / Range</th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('earnedFees')}>
                Earned Fees {sortConfig?.key === 'earnedFees' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('daysPassed')}>
                Duration (Days) {sortConfig?.key === 'daysPassed' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('dpr')}>
                DPR {sortConfig?.key === 'dpr' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('mpr')}>
                MPR {sortConfig?.key === 'mpr' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="border border-gray-700 p-4 text-left cursor-pointer" onClick={() => handleSort('apr')}>
                APR {sortConfig?.key === 'apr' ? (sortConfig.direction === 'asc' ? '🔼' : '🔽') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((order: any, index: number) => {
              const baseAmount = (parseFloat(order.baseAmount || 0) / 1e18).toFixed(6);
              const quoteAmount = (parseFloat(order.quoteAmount || 0) / 1e6).toFixed(6);
              const lowerPrice = calculatePriceFromTick(order.lowerTick);
              const upperPrice = calculatePriceFromTick(order.upperTick);
              return (
                <tr
                  key={order.nodeId}
                  className={`${index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'} hover:bg-blue-800 transition-colors duration-200`}
                >
                  <td className="border border-gray-700 p-4">{order.nodeId} </td>
                  <td className="border border-gray-700 p-4">{order.orderType || 'N/A'}</td>
                  <td className="border border-gray-700 p-4">
                    <div>{`${baseAmount} ${order.baseAsset || 'N/A'}`}</div>
                    <div>{`${quoteAmount} ${order.quoteAsset || 'N/A'}`}</div>
                  </td>
                  <td className="border border-gray-700 p-4">${order.orderValue.toFixed(2)}</td>
                  <td className="border border-gray-700 p-4">
                    <div>{`Lower: ${lowerPrice.toFixed(6)}`}</div>
                    <div>{`Upper: ${upperPrice.toFixed(6)}`}</div>
                  </td>
                  <td className="border border-gray-700 p-4">${order.earnedFees.toFixed(6)}</td>
                  <td className="border border-gray-700 p-4">{order.daysPassed} days</td>
                  <td className="border border-gray-700 p-4">{order.dpr}%</td>
                  <td className="border border-gray-700 p-4">{order.mpr}%</td>
                  <td className="border border-gray-700 p-4">{order.apr}%</td>
                </tr>
              );
            })}
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
