/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { ALL_POOL_ORDERS } from '../graphql/queries';

const OrderTable = () => {
  const { data, loading, error } = useQuery(ALL_POOL_ORDERS);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const sortedData = [...data.allPoolOrders.nodes];

  if (sortConfig !== null) {
    sortedData.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

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

  return (
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
        {sortedData.map((order: any) => (
          <tr key={order.id}>
            <td className="border border-gray-300 p-2">{order.orderId}</td>
            <td className="border border-gray-300 p-2">{order.quoteAsset}</td>
            <td className="border border-gray-300 p-2">{order.baseAsset}</td>
            <td className="border border-gray-300 p-2">{order.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
