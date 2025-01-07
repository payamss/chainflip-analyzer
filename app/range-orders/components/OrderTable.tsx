'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_POOL_ORDERS, ALL_ACCOUNTS } from '@/app/range-orders/graphql/queries';
import client from '@/app/range-orders/graphql/client';
import FilterBar from './FilterBar';
import Pagination from './Pagination';
import TableBody from './TableBody';
import TableHeader from './TableHeader';
import { processOrdersData } from '@/utils/dataProcessing';
import { useTokenPrices } from '@/app/hooks/useTokenPrices';

const ITEMS_PER_PAGE = 15;

const OrderTable = () => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch data
  const { loading: ordersLoading, error: ordersError, data: ordersData } = useQuery(ALL_POOL_ORDERS, { client });
  const { loading: accountsLoading, error: accountsError, data: accountsData } = useQuery(ALL_ACCOUNTS, { client });
  const { data: allTokenPrices, loading, error } = useTokenPrices();

  if (loading) return <div className="text-textLight">Loading...</div>;
  if (error) return <div className="text-danger">Error: {error.message}</div>;

  if (ordersLoading || accountsLoading) return <div className="text-textLight">Loading...</div>;
  if (ordersError || accountsError)
    return <div className="text-danger">Error: {ordersError?.message || accountsError?.message}</div>;

  const rawOrders = ordersData?.allPoolOrders?.nodes || [];
  const rawAccounts = accountsData?.allAccounts?.nodes || [];
  const processedData = processOrdersData(rawOrders, rawAccounts, statusFilter, sortConfig, allTokenPrices);

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = processedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-2 min-h-screen text-textLight">
      <FilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <div className="overflow-x-auto bg-secondary shadow-lg rounded-lg border border-accent">
        <table className="min-w-full text-sm">
          <TableHeader sortConfig={sortConfig} setSortConfig={setSortConfig} />
          <TableBody currentItems={currentItems} />
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default OrderTable;
