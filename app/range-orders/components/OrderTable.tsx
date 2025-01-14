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
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Fetch data
  const {
    loading: ordersLoading,
    error: ordersError,
    data: ordersData,
  } = useQuery(ALL_POOL_ORDERS, { client });
  const {
    loading: accountsLoading,
    error: accountsError,
    data: accountsData,
  } = useQuery(ALL_ACCOUNTS, { client });
  const { data: allTokenPrices, loading, error } = useTokenPrices();

  if (loading) return <div className='text-center text-textLight'>Loading...</div>;
  if (error) return <div className='text-danger text-center'>Error: {error.message}</div>;

  if (ordersLoading || accountsLoading)
    return <div className='text-center text-textLight'>Loading...</div>;
  if (ordersError || accountsError)
    return (
      <div className='text-danger text-center'>
        Error: {ordersError?.message || accountsError?.message}
      </div>
    );

  const rawOrders = ordersData?.allPoolOrders?.nodes || [];
  const rawAccounts = accountsData?.allAccounts?.nodes || [];
  const processedData = processOrdersData(
    rawOrders,
    rawAccounts,
    statusFilter,
    sortConfig,
    allTokenPrices
  );

  // Pagination
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const currentItems = processedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className='min-h-screen p-2 text-textLight'>
      {/* FilterBar */}
      <div className='mb-4'>
        <FilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>

      {/* Table */}
      <div className='overflow-x-auto rounded-lg border border-neutral-800 bg-secondary shadow-2xl'>
        <table className='min-w-full text-xs sm:text-sm md:text-base'>
          <TableHeader sortConfig={sortConfig} setSortConfig={setSortConfig} />
          <TableBody currentItems={currentItems} />
        </table>
      </div>

      {/* Pagination */}
      <div className='mt-4 flex flex-col items-center gap-2 sm:gap-4'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OrderTable;
