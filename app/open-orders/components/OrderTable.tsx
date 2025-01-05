'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_POOL_ORDERS, ALL_ACCOUNTS } from '@/app/open-orders/graphql/queries';
import client from '@/app/open-orders/graphql/client';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import TableBody from './TableBody';
import TableHeader from './TableHeader';
import { processOrdersData } from '@/utils/dataProcessing';


const ITEMS_PER_PAGE = 50;

const OrderTable = () => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch data
  const { loading: ordersLoading, error: ordersError, data: ordersData } = useQuery(ALL_POOL_ORDERS, { client });
  const { loading: accountsLoading, error: accountsError, data: accountsData } = useQuery(ALL_ACCOUNTS, { client });

  if (ordersLoading || accountsLoading) return <div className="text-white">Loading...</div>;
  if (ordersError || accountsError)
    return <div className="text-red-500">Error: {ordersError?.message || accountsError?.message}</div>;

  const rawOrders = ordersData?.allPoolOrders?.nodes || [];
  const rawAccounts = accountsData?.allAccounts?.nodes || [];
  const processedData = processOrdersData(rawOrders, rawAccounts, statusFilter, sortConfig);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = processedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <FilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg border border-gray-700">
        <table className="min-w-full text-sm overflow-auto">
          <TableHeader sortConfig={sortConfig} setSortConfig={setSortConfig} />
          <TableBody currentItems={currentItems} />
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default OrderTable;
