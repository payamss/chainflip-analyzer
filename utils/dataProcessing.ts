/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  calculateTotalFees,
  calculateDuration,
  calculateDPR,
  calculateMPR,
  calculateAPR,
  calculateOrderValue,
} from '@/utils/calculateMetrics';

/**
 * Processes raw order data and maps it to extended data.
 * @param rawOrders The raw order data fetched from the API.
 * @param rawAccounts The raw account data fetched from the API.
 * @param statusFilter The status filter applied by the user.
 * @param sortConfig The sorting configuration.
 * @returns Processed and sorted order data.
 */
export const processOrdersData = (
  rawOrders: any[],
  rawAccounts: any[],
  statusFilter: string | null,
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null,
  allTokenPrices: { [key: string]: number }
) => {
  // Map liquidityProviderId to idSs58
  const accountMap = rawAccounts.reduce((acc: any, account: any) => {
    if (account.id) {
      acc[account.id] = account.idSs58;
    }
    return acc;
  }, {});

  // Extend orders with calculated fields
  const extendedData = rawOrders.map((order: any) => {
    const earnedFees = calculateTotalFees(order);
    const orderValue = calculateOrderValue(order, allTokenPrices);
    const duration = calculateDuration(
      order.eventByOrderCreatedEventId.timestamp,
      order.eventByOrderLastUpdatedEventId?.timestamp || new Date().toISOString()
    );
    const dpr = calculateDPR(earnedFees, orderValue, duration);
    const mpr = calculateMPR(dpr);
    const apr = calculateAPR(dpr);
    const accountId = accountMap[order.liquidityProviderId] || null;

    return {
      ...order,
      earnedFees,
      orderValue,
      duration,
      dpr,
      mpr,
      apr,
      accountId,
    };
  });

  // Apply status filter
  let filteredData = extendedData;
  if (statusFilter) {
    filteredData = extendedData.filter(
      (order: any) => order.status.toLowerCase() === statusFilter.toLowerCase()
    );
  }

  // Apply sorting
  if (sortConfig) {
    filteredData.sort((a: any, b: any) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return filteredData;
};
