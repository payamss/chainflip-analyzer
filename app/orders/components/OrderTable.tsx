/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery } from '@apollo/client';
import { ALL_POOL_ORDERS } from '../graphql/queries';

const OrderTable = () => {
  const { data, loading, error } = useQuery(ALL_POOL_ORDERS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <table className="w-full border-collapse border border-gray-200">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2">Order ID</th>
          <th className="border border-gray-300 p-2">Quote Asset</th>
          <th className="border border-gray-300 p-2">Base Asset</th>
          <th className="border border-gray-300 p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.allPoolOrders.nodes.map((order: any) => (
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
